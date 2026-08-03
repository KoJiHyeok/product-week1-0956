import { getDb, json, readJson } from "../../../auth/_shared.js";
import { logAdminAction, normalizeReason, requireAdmin } from "../../_shared.js";
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
      return json({ message: "거절할 이미지 제안을 찾을 수 없습니다." }, 404);
    }

    const body = (await readJson(context.request)) || {};
    const reason = normalizeReason(body.reason, 1000);
    const db = getDb(context);
    await db
      .prepare(
        `UPDATE image_suggestions
         SET status = 'rejected',
             moderation_reason = ?,
             published_at = NULL,
             reviewed_at = CURRENT_TIMESTAMP,
             reviewed_by = ?
         WHERE id = ?`
      )
      .bind(reason || null, admin.user.id, id)
      .run();

    await closeLinkedInquiry(context, suggestion.inquiry_id, "resolved");
    await logAdminAction(context, admin.user, "reject", "image_suggestion", id, reason || "이미지 제안을 거절했습니다.");

    return json({ rejected: true });
  } catch (error) {
    console.error("image suggestion reject error", error);
    return json({ message: "이미지 제안을 거절하지 못했습니다." }, 500);
  }
}
