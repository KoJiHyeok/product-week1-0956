import { getCurrentUser, getDb, json } from "../../auth/_shared.js";
import { getImageBucket, isAdminUser } from "../_shared.js";

export async function onRequestGet(context) {
  try {
    const bucket = getImageBucket(context);

    if (!bucket) {
      return json({ message: "이미지 직접 업로드 기능은 현재 비활성화되어 있습니다." }, 503);
    }

    const db = getDb(context);
    const id = String(context.params.id || "");
    const image = await db
      .prepare("SELECT id, uploader_user_id, storage_key, status FROM uploaded_images WHERE id = ? LIMIT 1")
      .bind(id)
      .first();

    if (!image) {
      return json({ message: "이미지를 찾을 수 없습니다." }, 404);
    }

    const user = await getCurrentUser(context);
    const canPreview = image.status === "approved" || image.uploader_user_id === user?.id || (await isAdminUser(context, user));

    if (!canPreview) {
      return json({ message: "이미지를 볼 권한이 없습니다." }, 403);
    }

    const object = await bucket.get(image.storage_key);

    if (!object) {
      return json({ message: "이미지를 찾을 수 없습니다." }, 404);
    }

    return new Response(object.body, {
      headers: {
        "content-type": object.httpMetadata?.contentType || "application/octet-stream",
        "cache-control": image.status === "approved" ? "public, max-age=3600" : "no-store",
      },
    });
  } catch {
    return json({ message: "이미지를 불러오지 못했습니다." }, 500);
  }
}
