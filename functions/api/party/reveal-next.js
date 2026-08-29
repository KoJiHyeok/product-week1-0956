import {
  buildRoomState,
  countRoundTitles,
  getDb,
  getRoomByCode,
  json,
  normalizeRoomCode,
  readJson,
} from "./_shared.js";

// 호스트가 "다음 제목" 버튼을 누를 때마다 제목을 하나씩 공개한다(자동 진행 아님).
// 마지막 제목이 공개되는 순간 투표 창(vote_deadline_at)을 함께 연다.
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
      return json({ message: "호스트만 제목을 공개할 수 있습니다." }, 403);
    }
    if (room.status !== "reveal") {
      return json({ message: "지금은 제목을 공개할 수 있는 시간이 아닙니다." }, 409);
    }

    const titlesTotal = await countRoundTitles(db, room.id, room.round_number);
    if (room.reveal_index >= titlesTotal) {
      return json({ message: "더 이상 공개할 제목이 없습니다." }, 409);
    }

    const now = Date.now();
    const nextIndex = room.reveal_index + 1;
    const isLastTitle = nextIndex >= titlesTotal;

    if (isLastTitle) {
      const voteWindowMs = (room.vote_seconds || 15) * 1000;
      await db
        .prepare("UPDATE party_rooms SET reveal_index = ?, vote_deadline_at = ?, updated_at = ? WHERE id = ?")
        .bind(nextIndex, now + voteWindowMs, now, room.id)
        .run();
    } else {
      await db
        .prepare("UPDATE party_rooms SET reveal_index = ?, updated_at = ? WHERE id = ?")
        .bind(nextIndex, now, room.id)
        .run();
    }

    const updatedRoom = await getRoomByCode(db, code);
    const state = await buildRoomState(db, updatedRoom, token);

    return json({ ok: true, state });
  } catch (error) {
    console.error("party/reveal-next error", error);
    return json({ message: "제목 공개에 실패했습니다." }, 500);
  }
}
