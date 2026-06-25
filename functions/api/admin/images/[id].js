import { getDb, json } from "../../auth/_shared.js";
import { logAdminAction, requireAdmin } from "../_shared.js";
import { getImageBucket } from "../../images/_shared.js";

export async function onRequestDelete(context) {
  try {
    const admin = await requireAdmin(context);

    if (admin.response) {
      return admin.response;
    }

    const db = getDb(context);
    const id = String(context.params.id || "");
    const image = await db
      .prepare("SELECT id, storage_key FROM uploaded_images WHERE id = ? LIMIT 1")
      .bind(id)
      .first();

    if (!image) {
      return json({ message: "이미지를 찾을 수 없습니다." }, 404);
    }

    const bucket = getImageBucket(context);

    if (bucket) {
      await bucket.delete(image.storage_key).catch(() => {});
    }

    await db
      .prepare(
        `UPDATE uploaded_images
         SET status = 'deleted', reviewed_at = CURRENT_TIMESTAMP, reviewed_by = ?
         WHERE id = ?`
      )
      .bind(admin.user.id, id)
      .run();

    // 사진이 사라지면 그에 달린 제목/댓글/하트도 함께 사라진다.
    // (관리자 대시보드에 "이동"이 안 되는 고아 항목이 남지 않도록 영구 삭제)
    const imageKey = `uploaded:${id}`;
    const subIdSubquery = "SELECT id FROM submissions WHERE image_key = ?";
    await db.prepare(`DELETE FROM comments WHERE submission_id IN (${subIdSubquery})`).bind(imageKey).run();
    await db.prepare(`DELETE FROM likes WHERE submission_id IN (${subIdSubquery})`).bind(imageKey).run();
    await db.prepare("DELETE FROM submissions WHERE image_key = ?").bind(imageKey).run();

    await logAdminAction(context, admin.user, "delete", "image", id, "이미지와 그에 달린 제목/댓글을 삭제했습니다.");

    return json({ deleted: true });
  } catch {
    return json({ message: "이미지를 삭제하지 못했습니다." }, 500);
  }
}
