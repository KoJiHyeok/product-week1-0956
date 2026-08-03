import { getDb, json, readJson } from "../../../auth/_shared.js";
import { buildGalleryFields, getSuggestionImageKey } from "../../../images/_suggestions.js";
import { logAdminAction, requireAdmin } from "../../_shared.js";
import { closeLinkedInquiry, findSuggestion } from "../_shared.js";

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

    if (!suggestion.has_image) {
      return json({ message: "이미지 파일이 없는 제안은 게시할 수 없습니다. 제안자에게 재제출을 요청하세요." }, 400);
    }

    const body = (await readJson(context.request)) || {};
    const gallery = buildGalleryFields(body, suggestion);
    const db = getDb(context);
    const result = await db
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
    await logAdminAction(context, admin.user, "approve", "image_suggestion", id, `이미지 제안을 승인해 갤러리에 게시했습니다: ${gallery.title}`);

    return json({ approved: true, imageKey: getSuggestionImageKey(id), title: gallery.title });
  } catch (error) {
    console.error("image suggestion approve error", error);
    return json({ message: "이미지 제안을 승인하지 못했습니다." }, 500);
  }
}
