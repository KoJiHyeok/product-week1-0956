import {
  buildRoomState,
  clampRoundSeconds,
  clampTotalRounds,
  generatePlayerToken,
  generateRoomCode,
  getDb,
  getRoomByCode,
  json,
  normalizeNickname,
  readJson,
} from "./_shared.js";

const CODE_GENERATION_ATTEMPTS = 8;

export async function onRequestPost(context) {
  try {
    const db = getDb(context);
    const body = await readJson(context.request);
    const nickname = normalizeNickname(body?.nickname);

    if (!nickname) {
      return json({ message: "닉네임을 1~12자로 입력해주세요." }, 400);
    }

    const totalRounds = clampTotalRounds(body?.totalRounds);
    const roundSeconds = clampRoundSeconds(body?.roundSeconds);

    let code = "";
    for (let attempt = 0; attempt < CODE_GENERATION_ATTEMPTS; attempt += 1) {
      const candidate = generateRoomCode();
      const existing = await getRoomByCode(db, candidate);
      if (!existing) {
        code = candidate;
        break;
      }
    }

    if (!code) {
      return json({ message: "파티 방을 만들지 못했습니다. 다시 시도해주세요." }, 500);
    }

    const hostToken = generatePlayerToken();
    const now = Date.now();

    const insertResult = await db
      .prepare(
        `INSERT INTO party_rooms (code, status, host_token, round_number, total_rounds, round_seconds, created_at, updated_at)
         VALUES (?, 'lobby', ?, 0, ?, ?, ?, ?)`
      )
      .bind(code, hostToken, totalRounds, roundSeconds, now, now)
      .run();

    const roomId = insertResult.meta.last_row_id;

    await db
      .prepare(
        `INSERT INTO party_players (room_id, token, nickname, is_host, joined_at, last_seen_at)
         VALUES (?, ?, ?, 1, ?, ?)`
      )
      .bind(roomId, hostToken, nickname, now, now)
      .run();

    const room = await getRoomByCode(db, code);
    const state = await buildRoomState(db, room, hostToken);

    return json({ code, playerToken: hostToken, state });
  } catch (error) {
    console.error("party/create error", error);
    return json({ message: "파티 방을 만들지 못했습니다." }, 500);
  }
}
