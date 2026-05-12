import { getDb, json } from "../../../auth/_shared.js";
import { requireAdmin } from "../../_shared.js";

export async function onRequestPost(context) {
  try {
    const admin = await requireAdmin(context);

    if (admin.response) {
      return admin.response;
    }

    const db = getDb(context);
    const id = String(context.params.id || "");
    const result = await db
      .prepare(
        `UPDATE uploaded_images
         SET status = 'approved', moderation_reason = NULL, reviewed_at = CURRENT_TIMESTAMP, reviewed_by = ?
         WHERE id = ? AND status IN ('pending', 'rejected')`
      )
      .bind(admin.user.id, id)
      .run();

    if (!result.meta.changes) {
      return json({ message: "승인할 이미지를 찾을 수 없습니다." }, 404);
    }

    return json({ approved: true });
  } catch {
    return json({ message: "이미지를 승인하지 못했습니다." }, 500);
  }
}
