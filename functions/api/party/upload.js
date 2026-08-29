import {
  PARTY_ALLOWED_PHOTO_MIME_TYPES,
  PARTY_PHOTO_MAX_BASE64_LENGTH,
  PARTY_PHOTO_MAX_PER_PLAYER,
  PARTY_PHOTO_MAX_PER_ROOM,
  buildRoomState,
  getDb,
  getPlayerByToken,
  getRoomByCode,
  json,
  normalizeRoomCode,
  readJson,
} from "./_shared.js";

export async function onRequestPost(context) {
  try {
    const db = getDb(context);
    const body = await readJson(context.request);
    const code = normalizeRoomCode(body?.code);
    const token = body?.token || "";
    const mimeType = typeof body?.mimeType === "string" ? body.mimeType : "";
    const dataBase64 = typeof body?.dataBase64 === "string" ? body.dataBase64 : "";

    if (!code || !token) {
      return json({ message: "잘못된 요청입니다." }, 400);
    }
    if (!PARTY_ALLOWED_PHOTO_MIME_TYPES.has(mimeType)) {
      return json({ message: "jpg, png, webp 이미지만 올릴 수 있습니다." }, 400);
    }
    if (!dataBase64 || dataBase64.length > PARTY_PHOTO_MAX_BASE64_LENGTH) {
      return json({ message: "사진 용량이 너무 큽니다. 더 작은 사진으로 다시 시도해주세요." }, 400);
    }

    const room = await getRoomByCode(db, code);
    if (!room) {
      return json({ message: "방을 찾을 수 없습니다." }, 404);
    }
    if (room.is_public) {
      return json({ message: "공개 방에서는 사진을 올릴 수 없습니다." }, 403);
    }

    const player = await getPlayerByToken(db, room.id, token);
    if (!player) {
      return json({ message: "참가 정보를 찾을 수 없습니다." }, 404);
    }
    if (room.status !== "lobby" && room.status !== "reveal") {
      return json({ message: "지금은 사진을 올릴 수 없습니다. 대기실이나 라운드 사이에 올려주세요." }, 409);
    }

    const countRow = await db
      .prepare("SELECT COUNT(*) AS count FROM party_photos WHERE room_id = ?")
      .bind(room.id)
      .first();
    if (Number(countRow?.count || 0) >= PARTY_PHOTO_MAX_PER_ROOM) {
      return json({ message: "이 방에 올릴 수 있는 사진 개수를 다 채웠습니다." }, 409);
    }

    const myCountRow = await db
      .prepare("SELECT COUNT(*) AS count FROM party_photos WHERE room_id = ? AND uploader_player_id = ?")
      .bind(room.id, player.id)
      .first();
    if (Number(myCountRow?.count || 0) >= PARTY_PHOTO_MAX_PER_PLAYER) {
      return json({ message: "1인당 올릴 수 있는 사진은 5장까지예요." }, 409);
    }

    const now = Date.now();
    await db
      .prepare(
        `INSERT INTO party_photos (room_id, uploader_player_id, mime_type, data_base64, created_at, used_in_round)
         VALUES (?, ?, ?, ?, ?, NULL)`
      )
      .bind(room.id, player.id, mimeType, dataBase64, now)
      .run();

    await db.prepare("UPDATE party_players SET last_seen_at = ? WHERE id = ?").bind(now, player.id).run();

    const state = await buildRoomState(db, room, token);
    return json({ ok: true, state });
  } catch (error) {
    console.error("party/upload error", error);
    return json({ message: "사진 업로드에 실패했습니다." }, 500);
  }
}
