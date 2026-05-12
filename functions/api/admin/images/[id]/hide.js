import { getDb, json, readJson } from "../../../auth/_shared.js";
import { requireAdmin } from "../../_shared.js";
import { sanitizeLongText } from "../../../images/_shared.js";

export async function onRequestPost(context) {
  try {
    const admin = await requireAdmin(context);

    if (admin.response) {
      return admin.response;
    }

    const body = await readJson(context.request);
    const reason = sanitizeLongText(body?.reason, 1000);
    const db = getDb(context);
    const id = String(context.params.id || "");
    const result = await db
      .prepare(
        `UPDATE uploaded_images
         SET status = 'rejected', moderation_reason = COALESCE(?, moderation_reason),
             reviewed_at = CURRENT_TIMESTAMP, reviewed_by = ?
         WHERE id = ? AND status != 'deleted'`
      )
      .bind(reason || null, admin.user.id, id)
      .run();

    if (!result.meta.changes) {
      return json({ message: "거절 처리할 이미지를 찾을 수 없습니다." }, 404);
    }

    return json({ rejected: true });
  } catch {
    return json({ message: "이미지를 숨김 처리하지 못했습니다." }, 500);
  }
}
