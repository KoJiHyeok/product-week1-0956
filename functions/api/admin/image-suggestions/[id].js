import { getDb, json, readJson } from "../../auth/_shared.js";
import { buildGalleryFields, serializeSuggestion } from "../../images/_suggestions.js";
import { logAdminAction, requireAdmin } from "../_shared.js";
import { findSuggestion } from "./_shared.js";

export async function onRequestGet(context) {
  try {
    const admin = await requireAdmin(context);

    if (admin.response) {
      return admin.response;
    }

    const suggestion = await findSuggestion(context, String(context.params.id || ""));

    if (!suggestion) {
      return json({ message: "이미지 제안을 찾을 수 없습니다." }, 404);
    }

    return json({ suggestion: serializeSuggestion(suggestion) });
  } catch (error) {
    console.error("image suggestion detail error", error);
    return json({ message: "이미지 제안을 불러오지 못했습니다." }, 500);
  }
}

// 갤러리 문구 저장(승인 없이) 또는 게시 취소(status: "pending").
export async function onRequestPatch(context) {
  try {
    const admin = await requireAdmin(context);

    if (admin.response) {
      return admin.response;
    }

    const id = String(context.params.id || "");
    const suggestion = await findSuggestion(context, id);

    if (!suggestion) {
      return json({ message: "이미지 제안을 찾을 수 없습니다." }, 404);
    }

    const body = (await readJson(context.request)) || {};
    const unpublish = body.status === "pending";

    if (body.status && !unpublish) {
      return json({ message: "이 요청으로 바꿀 수 없는 상태입니다." }, 400);
    }

    const gallery = buildGalleryFields(body, suggestion);
    const db = getDb(context);
    await db
      .prepare(
        `UPDATE image_suggestions
         SET gallery_title = ?,
             gallery_description = ?,
             gallery_alt = ?,
             gallery_prompt = ?,
             gallery_observation_points = ?,
             gallery_example_titles = ?,
             status = CASE WHEN ? = 1 THEN 'pending' ELSE status END,
             published_at = CASE WHEN ? = 1 THEN NULL ELSE published_at END
         WHERE id = ?`
      )
      .bind(
        gallery.title,
        gallery.description,
        gallery.alt,
        gallery.prompt,
        JSON.stringify(gallery.observationPoints),
        JSON.stringify(gallery.exampleTitles),
        unpublish ? 1 : 0,
        unpublish ? 1 : 0,
        id
      )
      .run();

    await logAdminAction(
      context,
      admin.user,
      unpublish ? "unpublish" : "update",
      "image_suggestion",
      id,
      unpublish ? "이미지 제안을 갤러리에서 내렸습니다." : "이미지 제안 문구를 저장했습니다."
    );

    return json({ updated: true, unpublished: unpublish });
  } catch (error) {
    console.error("image suggestion update error", error);
    return json({ message: "이미지 제안을 저장하지 못했습니다." }, 500);
  }
}

// 삭제는 접수 기록만 남기고 이미지 데이터를 지운다.
export async function onRequestDelete(context) {
  try {
    const admin = await requireAdmin(context);

    if (admin.response) {
      return admin.response;
    }

    const id = String(context.params.id || "");
    const db = getDb(context);
    const result = await db
      .prepare(
        `UPDATE image_suggestions
         SET status = 'deleted',
             image_data = NULL,
             published_at = NULL,
             reviewed_at = CURRENT_TIMESTAMP,
             reviewed_by = ?
         WHERE id = ?`
      )
      .bind(admin.user.id, id)
      .run();

    if (!result.meta.changes) {
      return json({ message: "삭제할 이미지 제안을 찾을 수 없습니다." }, 404);
    }

    await logAdminAction(context, admin.user, "delete", "image_suggestion", id, "이미지 제안을 삭제했습니다.");

    return json({ deleted: true });
  } catch (error) {
    console.error("image suggestion delete error", error);
    return json({ message: "이미지 제안을 삭제하지 못했습니다." }, 500);
  }
}
