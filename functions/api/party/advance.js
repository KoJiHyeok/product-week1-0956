import {
  buildRoomState,
  computeVotePhase,
  countRoundTitles,
  generatePhotoSeed,
  getDb,
  getRoomByCode,
  json,
  normalizeRoomCode,
  pickRoundImage,
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

    if (room.status === "reveal") {
      const titlesTotal = await countRoundTitles(db, room.id, room.round_number);
      const phase = computeVotePhase(room, titlesTotal, now);
      if (phase !== "results") {
        return json({ message: "아직 공개·투표가 끝나지 않았어요." }, 409);
      }
    }

    const nextRoundNumber = room.round_number + 1;

    if (nextRoundNumber > room.total_rounds) {
      await db
        .prepare("UPDATE party_rooms SET status = 'ended', updated_at = ? WHERE id = ?")
        .bind(now, room.id)
        .run();
    } else {
      // 사진은 우리 갤러리에서 방 코드 기반 셔플 순서로 출제한다(외부 API 미사용).
      // 단, 이 방에 아직 쓰이지 않은 업로드 사진이 있으면 무작위 순서로 먼저 출제한다.
      // (누가 무엇을 올렸는지 비공개이므로 출제 순서로 업로더를 유추할 수 없게 랜덤화)
      const seed = generatePhotoSeed();
      const fallback = pickRoundImage(room.code, nextRoundNumber);
      const deadline = now + room.round_seconds * 1000;

      let roundPhotoId = null;
      if (!room.is_public) {
        const nextPhoto = await db
          .prepare(
            `SELECT id FROM party_photos WHERE room_id = ? AND used_in_round IS NULL ORDER BY RANDOM() LIMIT 1`
          )
          .bind(room.id)
          .first();
        if (nextPhoto) {
          roundPhotoId = nextPhoto.id;
          await db
            .prepare("UPDATE party_photos SET used_in_round = ? WHERE id = ?")
            .bind(nextRoundNumber, roundPhotoId)
            .run();
        }
      }

      await db
        .prepare(
          `UPDATE party_rooms
           SET status = 'round', round_number = ?, photo_seed = ?, fallback_image_key = ?, round_photo_id = ?, round_deadline_at = ?, reveal_index = 0, vote_deadline_at = NULL, updated_at = ?
           WHERE id = ?`
        )
        .bind(nextRoundNumber, seed, fallback.key, roundPhotoId, deadline, now, room.id)
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
