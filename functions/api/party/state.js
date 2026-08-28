import {
  buildRoomState,
  getDb,
  getPlayerByToken,
  getRoomByCode,
  json,
  normalizeRoomCode,
  PARTY_ACTIVE_WINDOW_MS,
} from "./_shared.js";

export async function onRequestGet(context) {
  try {
    const db = getDb(context);
    const url = new URL(context.request.url);
    const code = normalizeRoomCode(url.searchParams.get("code"));
    const token = url.searchParams.get("token") || "";

    if (!code || !token) {
      return json({ message: "잘못된 요청입니다." }, 400);
    }

    let room = await getRoomByCode(db, code);
    if (!room) {
      return json({ message: "방을 찾을 수 없습니다." }, 404);
    }

    const player = await getPlayerByToken(db, room.id, token);
    if (!player) {
      return json({ message: "참가 정보를 찾을 수 없습니다." }, 404);
    }

    const now = Date.now();
    await db.prepare("UPDATE party_players SET last_seen_at = ? WHERE id = ?").bind(now, player.id).run();

    if (room.status === "round") {
      const deadlinePassed = room.round_deadline_at != null && now >= room.round_deadline_at;
      let allActiveSubmitted = false;

      if (!deadlinePassed) {
        const activeResult = await db
          .prepare(`SELECT id FROM party_players WHERE room_id = ? AND last_seen_at >= ?`)
          .bind(room.id, now - PARTY_ACTIVE_WINDOW_MS)
          .all();
        const activeIds = (activeResult.results || []).map((row) => row.id);

        if (activeIds.length > 0) {
          const placeholders = activeIds.map(() => "?").join(",");
          const submittedRow = await db
            .prepare(
              `SELECT COUNT(DISTINCT player_id) AS count
               FROM party_titles
               WHERE room_id = ? AND round_number = ? AND player_id IN (${placeholders})`
            )
            .bind(room.id, room.round_number, ...activeIds)
            .first();
          allActiveSubmitted = Number(submittedRow?.count || 0) >= activeIds.length;
        }
      }

      if (deadlinePassed || allActiveSubmitted) {
        await db
          .prepare("UPDATE party_rooms SET status = 'reveal', updated_at = ? WHERE id = ? AND status = 'round'")
          .bind(now, room.id)
          .run();
        room = await getRoomByCode(db, code);
      }
    }

    const state = await buildRoomState(db, room, token);
    return json(state);
  } catch (error) {
    console.error("party/state error", error);
    return json({ message: "파티 상태를 불러오지 못했습니다." }, 500);
  }
}
