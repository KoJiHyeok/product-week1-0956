import {
  buildRoomState,
  generatePlayerToken,
  getDb,
  getRoomByCode,
  json,
  normalizeRoomCode,
  PARTY_MAX_PLAYERS,
  readJson,
  resolvePartyIdentity,
} from "./_shared.js";

export async function onRequestPost(context) {
  try {
    const db = getDb(context);
    const body = await readJson(context.request);
    const code = normalizeRoomCode(body?.code);

    if (!code) {
      return json({ message: "초대 코드를 입력해주세요." }, 400);
    }

    const room = await getRoomByCode(db, code);
    if (!room) {
      return json({ message: "방을 찾을 수 없습니다." }, 404);
    }
    if (room.status === "ended") {
      return json({ message: "이미 종료된 파티예요. 새 방을 만들어보세요." }, 409);
    }

    const identity = await resolvePartyIdentity(context, db, room.id, body?.nickname);
    if (!identity.ok) {
      return json({ message: "닉네임을 1~12자로 입력해주세요." }, 400);
    }
    const { nickname, userId } = identity;

    const countRow = await db
      .prepare("SELECT COUNT(*) AS count FROM party_players WHERE room_id = ?")
      .bind(room.id)
      .first();
    if (Number(countRow?.count || 0) >= PARTY_MAX_PLAYERS) {
      return json({ message: "참가 인원이 가득 찼습니다." }, 409);
    }

    const token = generatePlayerToken();
    const now = Date.now();

    await db
      .prepare(
        `INSERT INTO party_players (room_id, token, nickname, is_host, joined_at, last_seen_at, user_id)
         VALUES (?, ?, ?, 0, ?, ?, ?)`
      )
      .bind(room.id, token, nickname, now, now, userId)
      .run();

    const state = await buildRoomState(db, room, token);

    return json({ code: room.code, playerToken: token, state });
  } catch (error) {
    console.error("party/join error", error);
    return json({ message: "파티 참가에 실패했습니다." }, 500);
  }
}
