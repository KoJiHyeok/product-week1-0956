import { getDb, json } from "../../auth/_shared.js";
import { requireAdmin } from "../_shared.js";
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

    return json({ deleted: true });
  } catch {
    return json({ message: "이미지를 삭제하지 못했습니다." }, 500);
  }
}
