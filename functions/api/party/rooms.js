import { PARTY_MAX_PLAYERS, PARTY_PUBLIC_ROOM_ACTIVE_WINDOW_MS, getDb, json } from "./_shared.js";

// 공개 방 목록: 초대 코드 없이 참가할 수 있는 방을 최대 20개까지 보여준다.
// 코드가 곧 참가 수단이므로 목록에 코드를 노출하는 것은 의도된 동작이다.
export async function onRequestGet(context) {
  try {
    const db = getDb(context);
    const now = Date.now();
    const activeSince = now - PARTY_PUBLIC_ROOM_ACTIVE_WINDOW_MS;

    const result = await db
      .prepare(
        `SELECT * FROM (
           SELECT
             party_rooms.id AS id,
             party_rooms.code AS code,
             party_rooms.status AS status,
             party_rooms.round_number AS roundNumber,
             party_rooms.total_rounds AS totalRounds,
             party_rooms.round_seconds AS roundSeconds,
             party_rooms.updated_at AS updatedAt,
             (SELECT nickname FROM party_players WHERE room_id = party_rooms.id AND is_host = 1 LIMIT 1) AS hostNickname,
             (SELECT COUNT(*) FROM party_players WHERE room_id = party_rooms.id) AS playerCount,
             (SELECT MAX(last_seen_at) FROM party_players WHERE room_id = party_rooms.id) AS lastActive
           FROM party_rooms
           WHERE party_rooms.is_public = 1 AND party_rooms.status != 'ended'
         ) rooms
         WHERE playerCount < ? AND (COALESCE(lastActive, 0) >= ? OR updatedAt >= ?)
         ORDER BY COALESCE(lastActive, updatedAt) DESC
         LIMIT 20`
      )
      .bind(PARTY_MAX_PLAYERS, activeSince, activeSince)
      .all();

    const rooms = (result.results || []).map((row) => ({
      code: row.code,
      hostNickname: row.hostNickname || "호스트",
      playerCount: Number(row.playerCount) || 0,
      maxPlayers: PARTY_MAX_PLAYERS,
      totalRounds: row.totalRounds,
      roundSeconds: row.roundSeconds,
      status: row.status,
      roundNumber: row.roundNumber,
    }));

    return json({ rooms });
  } catch (error) {
    console.error("party/rooms error", error);
    return json({ message: "공개 방 목록을 불러오지 못했습니다." }, 500);
  }
}
