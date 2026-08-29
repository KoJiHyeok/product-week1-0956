import { getCurrentUser, getDb, json } from "../../auth/_shared.js";
import { base64ToBytes } from "../../party/_shared.js";
import { isAdminUser } from "../_shared.js";
import { toImageBytes } from "../_suggestions.js";

const ALLOWED_CONTENT_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function onRequestGet(context) {
  try {
    const db = getDb(context);
    const id = String(context.params.id || "");
    const row = await db
      .prepare(
        "SELECT id, user_id, status, content_type, image_data, source, party_photo_id FROM image_suggestions WHERE id = ? LIMIT 1"
      )
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

    let bytes = toImageBytes(row.image_data);
    let contentType = row.content_type;

    // 파티 모드에서 올라와 아직 승인 전인 제안은 image_data가 비어 있고 party_photos만 참조한다.
    if ((!bytes || bytes.byteLength === 0) && row.source === "party" && row.party_photo_id) {
      const photo = await db
        .prepare("SELECT mime_type, data_base64 FROM party_photos WHERE id = ?")
        .bind(row.party_photo_id)
        .first();

      if (photo) {
        bytes = base64ToBytes(photo.data_base64);
        contentType = photo.mime_type;
      }
    }

    if (!bytes || bytes.byteLength === 0) {
      return json({ message: "이미지를 찾을 수 없습니다." }, 404);
    }

    contentType = ALLOWED_CONTENT_TYPES.has(contentType) ? contentType : "application/octet-stream";

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
