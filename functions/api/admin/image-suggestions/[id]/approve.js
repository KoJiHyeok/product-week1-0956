import { getDb, json, readJson } from "../../../auth/_shared.js";
import { buildGalleryFields, getSuggestionImageKey } from "../../../images/_suggestions.js";
import { base64ToBytes } from "../../../party/_shared.js";
import { logAdminAction, requireAdmin } from "../../_shared.js";
import { closeLinkedInquiry, findSuggestion, notifySuggesterApproved } from "../_shared.js";

// 파티 모드 업로드 사진은 대기 상태에서는 party_photos만 참조하고 image_data를 복사하지 않는다.
// 승인 시점에만 갤러리 목록 쿼리(image_data IS NOT NULL)와 기존 서빙 경로가 그대로 동작하도록 여기서 복사해 넣는다.
async function materializePartyPhotoIfNeeded(context, suggestion) {
  if (suggestion.has_image || suggestion.source !== "party" || !suggestion.party_photo_id) {
    return null;
  }

  const db = getDb(context);
  const photo = await db
    .prepare("SELECT mime_type, data_base64 FROM party_photos WHERE id = ?")
    .bind(suggestion.party_photo_id)
    .first();

  if (!photo) {
    return null;
  }

  const bytes = base64ToBytes(photo.data_base64);
  return { bytes, contentType: photo.mime_type || "image/jpeg" };
}

export async function onRequestPost(context) {
  try {
    const admin = await requireAdmin(context);

    if (admin.response) {
      return admin.response;
    }

    const id = String(context.params.id || "");
    const suggestion = await findSuggestion(context, id);

    if (!suggestion) {
      return json({ message: "승인할 이미지 제안을 찾을 수 없습니다." }, 404);
    }

    const partyPhoto = await materializePartyPhotoIfNeeded(context, suggestion);

    if (!suggestion.has_image && !partyPhoto) {
      return json({ message: "이미지 파일이 없는 제안은 게시할 수 없습니다. 제안자에게 재제출을 요청하세요." }, 400);
    }

    const body = (await readJson(context.request)) || {};
    const gallery = buildGalleryFields(body, suggestion);
    const db = getDb(context);
    const result = partyPhoto
      ? await db
          .prepare(
            `UPDATE image_suggestions
             SET status = 'approved',
                 gallery_title = ?,
                 gallery_description = ?,
                 gallery_alt = ?,
                 gallery_prompt = ?,
                 gallery_observation_points = ?,
                 gallery_example_titles = ?,
                 moderation_reason = NULL,
                 reviewed_at = CURRENT_TIMESTAMP,
                 reviewed_by = ?,
                 published_at = COALESCE(published_at, CURRENT_TIMESTAMP),
                 image_data = ?,
                 content_type = ?,
                 byte_size = ?
             WHERE id = ?`
          )
          .bind(
            gallery.title,
            gallery.description,
            gallery.alt,
            gallery.prompt,
            JSON.stringify(gallery.observationPoints),
            JSON.stringify(gallery.exampleTitles),
            admin.user.id,
            partyPhoto.bytes,
            partyPhoto.contentType,
            partyPhoto.bytes.byteLength,
            id
          )
          .run()
      : await db
          .prepare(
            `UPDATE image_suggestions
             SET status = 'approved',
                 gallery_title = ?,
                 gallery_description = ?,
                 gallery_alt = ?,
                 gallery_prompt = ?,
                 gallery_observation_points = ?,
                 gallery_example_titles = ?,
                 moderation_reason = NULL,
                 reviewed_at = CURRENT_TIMESTAMP,
                 reviewed_by = ?,
                 published_at = COALESCE(published_at, CURRENT_TIMESTAMP)
             WHERE id = ?`
          )
          .bind(
            gallery.title,
            gallery.description,
            gallery.alt,
            gallery.prompt,
            JSON.stringify(gallery.observationPoints),
            JSON.stringify(gallery.exampleTitles),
            admin.user.id,
            id
          )
          .run();

    if (!result.meta.changes) {
      return json({ message: "승인할 이미지 제안을 찾을 수 없습니다." }, 404);
    }

    await closeLinkedInquiry(context, suggestion.inquiry_id, "resolved");

    // 문구만 다시 반영하는 재게시에서는 쪽지를 또 보내지 않는다.
    const notified =
      suggestion.status === "approved"
        ? false
        : await notifySuggesterApproved(context, suggestion, admin.user, gallery.title);

    await logAdminAction(context, admin.user, "approve", "image_suggestion", id, `이미지 제안을 승인해 갤러리에 게시했습니다: ${gallery.title}`);

    return json({ approved: true, imageKey: getSuggestionImageKey(id), title: gallery.title, notified });
  } catch (error) {
    console.error("image suggestion approve error", error);
    return json({ message: "이미지 제안을 승인하지 못했습니다." }, 500);
  }
}
