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
    const title = typeof body?.title === "string" ? body.title.trim() : "";

    if (!code || !token) {
      return json({ message: "잘못된 요청입니다." }, 400);
    }
    if (title.length < 1 || title.length > 40) {
      return json({ message: "제목은 1~40자로 입력해주세요." }, 400);
    }

    const room = await getRoomByCode(db, code);
    if (!room) {
      return json({ message: "방을 찾을 수 없습니다." }, 404);
    }

    const player = await getPlayerByToken(db, room.id, token);
    if (!player) {
      return json({ message: "참가 정보를 찾을 수 없습니다." }, 404);
    }

    const now = Date.now();
    if (room.status !== "round") {
      return json({ message: "지금은 제출할 수 있는 시간이 아닙니다." }, 409);
    }
    if (room.round_deadline_at != null && now >= room.round_deadline_at) {
      return json({ message: "제한시간이 지났습니다." }, 409);
    }

    await db
      .prepare(
        `INSERT INTO party_titles (room_id, round_number, player_id, title, created_at)
         VALUES (?, ?, ?, ?, ?)
         ON CONFLICT(room_id, round_number, player_id) DO UPDATE SET title = excluded.title`
      )
      .bind(room.id, room.round_number, player.id, title, now)
      .run();

    await db.prepare("UPDATE party_players SET last_seen_at = ? WHERE id = ?").bind(now, player.id).run();

    const state = await buildRoomState(db, room, token);
    return json({ ok: true, state });
  } catch (error) {
    console.error("party/submit error", error);
    return json({ message: "제목 제출에 실패했습니다." }, 500);
  }
}
