import {
  buildRoomState,
  clampRoundSeconds,
  clampTotalRounds,
  clampVoteSeconds,
  getDb,
  getRoomByCode,
  json,
  normalizeRoomCode,
  readJson,
} from "./_shared.js";

// 방장이 대기실(lobby)에서만 게임 설정(라운드 수·제한시간·투표 시간)을 바꿀 수 있다.
// 전달된 필드만 갱신하고, 전달되지 않은 필드는 기존 값을 그대로 유지한다.
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
      return json({ message: "호스트만 설정을 바꿀 수 있습니다." }, 403);
    }
    if (room.status !== "lobby") {
      return json({ message: "게임이 시작된 뒤에는 설정을 바꿀 수 없어요." }, 409);
    }

    const totalRounds = body?.totalRounds != null ? clampTotalRounds(body.totalRounds) : room.total_rounds;
    const roundSeconds = body?.roundSeconds != null ? clampRoundSeconds(body.roundSeconds) : room.round_seconds;
    const voteSeconds = body?.voteSeconds != null ? clampVoteSeconds(body.voteSeconds) : room.vote_seconds;

    const now = Date.now();
    await db
      .prepare(
        `UPDATE party_rooms SET total_rounds = ?, round_seconds = ?, vote_seconds = ?, updated_at = ? WHERE id = ?`
      )
      .bind(totalRounds, roundSeconds, voteSeconds, now, room.id)
      .run();

    const updatedRoom = await getRoomByCode(db, code);
    const state = await buildRoomState(db, updatedRoom, token);

    return json({ ok: true, state });
  } catch (error) {
    console.error("party/settings error", error);
    return json({ message: "설정을 바꾸지 못했습니다." }, 500);
  }
}
