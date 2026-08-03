import { getCurrentUser, getDb, json } from "../../auth/_shared.js";
import { isAdminUser } from "../_shared.js";
import { toImageBytes } from "../_suggestions.js";

const ALLOWED_CONTENT_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function onRequestGet(context) {
  try {
    const db = getDb(context);
    const id = String(context.params.id || "");
    const row = await db
      .prepare("SELECT id, user_id, status, content_type, image_data FROM image_suggestions WHERE id = ? LIMIT 1")
      .bind(id)
      .first();

    if (!row) {
      return json({ message: "이미지를 찾을 수 없습니다." }, 404);
    }

    const isPublished = row.status === "approved";

    if (!isPublished) {
      const user = await getCurrentUser(context);
      const canPreview = (user && row.user_id === user.id) || (await isAdminUser(context, user));

      if (!canPreview) {
        return json({ message: "이미지를 볼 권한이 없습니다." }, 403);
      }
    }

    const bytes = toImageBytes(row.image_data);

    if (!bytes || bytes.byteLength === 0) {
      return json({ message: "이미지를 찾을 수 없습니다." }, 404);
    }

    const contentType = ALLOWED_CONTENT_TYPES.has(row.content_type) ? row.content_type : "application/octet-stream";

    return new Response(bytes, {
      headers: {
        "content-type": contentType,
        "content-length": String(bytes.byteLength),
        "cache-control": isPublished ? "public, max-age=3600" : "no-store",
        "x-content-type-options": "nosniff",
      },
    });
  } catch (error) {
    console.error("image suggestion file error", error);
    return json({ message: "이미지를 불러오지 못했습니다." }, 500);
  }
}
