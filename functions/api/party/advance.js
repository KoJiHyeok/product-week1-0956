import {
  buildRoomState,
  generatePhotoSeed,
  getDb,
  getRoomByCode,
  json,
  normalizeRoomCode,
  pickFallbackImage,
  readJson,
} from "./_shared.js";

export async function onRequestPost(context) {
  try {
    const db = getDb(context);
    const body = await readJson(context.request);
    const code = normalizeRoomCode(body?.code);
    const token = body?.token || "";

    if (!code || !token) {
      return json({ message: "잘못된 요청입니다." }, 400);
    }

    const room = await getRoomByCode(db, code);
    if (!room) {
      return json({ message: "방을 찾을 수 없습니다." }, 404);
    }
    if (room.host_token !== token) {
      return json({ message: "호스트만 라운드를 진행할 수 있습니다." }, 403);
    }
    if (room.status !== "lobby" && room.status !== "reveal") {
      return json({ message: "지금은 라운드를 진행할 수 없습니다." }, 409);
    }

    const now = Date.now();
    const nextRoundNumber = room.round_number + 1;

    if (nextRoundNumber > room.total_rounds) {
      await db
        .prepare("UPDATE party_rooms SET status = 'ended', updated_at = ? WHERE id = ?")
        .bind(now, room.id)
        .run();
    } else {
      const seed = generatePhotoSeed();
      const fallback = pickFallbackImage(seed);
      const deadline = now + room.round_seconds * 1000;

      await db
        .prepare(
          `UPDATE party_rooms
           SET status = 'round', round_number = ?, photo_seed = ?, fallback_image_key = ?, round_deadline_at = ?, updated_at = ?
           WHERE id = ?`
        )
        .bind(nextRoundNumber, seed, fallback.key, deadline, now, room.id)
        .run();
    }

    const updatedRoom = await getRoomByCode(db, code);
    const state = await buildRoomState(db, updatedRoom, token);

    return json({ ok: true, state });
  } catch (error) {
    console.error("party/advance error", error);
    return json({ message: "라운드 진행에 실패했습니다." }, 500);
  }
}
