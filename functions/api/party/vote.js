import {
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
    const targetPlayerId = Number(body?.targetPlayerId);

    if (!code || !token || !Number.isInteger(targetPlayerId)) {
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

    if (room.status !== "reveal") {
      return json({ message: "지금은 투표할 수 있는 시간이 아닙니다." }, 409);
    }
    if (targetPlayerId === player.id) {
      return json({ message: "본인 제목에는 투표할 수 없습니다." }, 400);
    }

    const target = await db
      .prepare("SELECT id FROM party_players WHERE id = ? AND room_id = ?")
      .bind(targetPlayerId, room.id)
      .first();
    if (!target) {
      return json({ message: "투표 대상을 찾을 수 없습니다." }, 404);
    }

    const now = Date.now();
    await db
      .prepare(
        `INSERT INTO party_votes (room_id, round_number, voter_player_id, target_player_id, created_at)
         VALUES (?, ?, ?, ?, ?)
         ON CONFLICT(room_id, round_number, voter_player_id)
         DO UPDATE SET target_player_id = excluded.target_player_id, created_at = excluded.created_at`
      )
      .bind(room.id, room.round_number, player.id, targetPlayerId, now)
      .run();

    await db.prepare("UPDATE party_players SET last_seen_at = ? WHERE id = ?").bind(now, player.id).run();

    const state = await buildRoomState(db, room, token);
    return json({ ok: true, state });
  } catch (error) {
    console.error("party/vote error", error);
    return json({ message: "투표에 실패했습니다." }, 500);
  }
}
