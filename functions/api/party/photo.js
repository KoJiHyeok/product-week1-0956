import {
  PARTY_ALLOWED_PHOTO_MIME_TYPES,
  base64ToBytes,
  getDb,
  getPlayerByToken,
  getRoomByCode,
  json,
  normalizeRoomCode,
} from "./_shared.js";

// 방 멤버(토큰 보유자)만 방 안 업로드 사진을 볼 수 있다. 토큰 없이는 접근 불가.
export async function onRequestGet(context) {
  try {
    const db = getDb(context);
    const url = new URL(context.request.url);
    const code = normalizeRoomCode(url.searchParams.get("code"));
    const token = url.searchParams.get("token") || "";
    const id = Number(url.searchParams.get("id"));

    if (!code || !token || !Number.isInteger(id)) {
      return json({ message: "잘못된 요청입니다." }, 400);
    }

    const room = await getRoomByCode(db, code);
    if (!room) {
      return json({ message: "방을 찾을 수 없습니다." }, 404);
    }

    const player = await getPlayerByToken(db, room.id, token);
    if (!player) {
      return json({ message: "참가 정보를 찾을 수 없습니다." }, 404);
    }

    const photo = await db
      .prepare("SELECT mime_type, data_base64 FROM party_photos WHERE id = ? AND room_id = ?")
      .bind(id, room.id)
      .first();
    if (!photo) {
      return json({ message: "사진을 찾을 수 없습니다." }, 404);
    }

    const contentType = PARTY_ALLOWED_PHOTO_MIME_TYPES.has(photo.mime_type)
      ? photo.mime_type
      : "application/octet-stream";
    const bytes = base64ToBytes(photo.data_base64);

    return new Response(bytes, {
      headers: {
        "content-type": contentType,
        "content-length": String(bytes.byteLength),
        "cache-control": "private, max-age=3600",
        "x-content-type-options": "nosniff",
      },
    });
  } catch (error) {
    console.error("party/photo error", error);
    return json({ message: "사진을 불러오지 못했습니다." }, 500);
  }
}
