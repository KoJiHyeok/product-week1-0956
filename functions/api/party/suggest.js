import {
  buildRoomState,
  getDb,
  getPlayerByToken,
  getRoomByCode,
  json,
  normalizeRoomCode,
  readJson,
} from "./_shared.js";

// 파티 방에서 업로드한 사진을, 그 라운드에 실제로 제출된 제목 하나와 함께
// 기존 이미지 제안 큐(image_suggestions)로 보낸다. 자동 게시는 되지 않고 관리자 검토 대기 상태로 쌓인다.
export async function onRequestPost(context) {
  try {
    const db = getDb(context);
    const body = await readJson(context.request);
    const code = normalizeRoomCode(body?.code);
    const token = body?.token || "";
    const roundNumber = Number(body?.roundNumber);
    const titleText = typeof body?.titleText === "string" ? body.titleText.trim() : "";

    if (!code || !token || !Number.isInteger(roundNumber) || roundNumber < 1) {
      return json({ message: "잘못된 요청입니다." }, 400);
    }
    if (!titleText) {
      return json({ message: "제안할 제목을 선택해주세요." }, 400);
    }

    const room = await getRoomByCode(db, code);
    if (!room) {
      return json({ message: "방을 찾을 수 없습니다." }, 404);
    }

    const player = await getPlayerByToken(db, room.id, token);
    if (!player) {
      return json({ message: "참가 정보를 찾을 수 없습니다." }, 404);
    }

    const photo = await db
      .prepare("SELECT id, mime_type, data_base64 FROM party_photos WHERE room_id = ? AND used_in_round = ?")
      .bind(room.id, roundNumber)
      .first();
    if (!photo) {
      return json({ message: "이 라운드는 업로드한 사진이 아니라 갤러리에 제안할 수 없습니다." }, 400);
    }

    const submittedTitle = await db
      .prepare("SELECT id FROM party_titles WHERE room_id = ? AND round_number = ? AND title = ?")
      .bind(room.id, roundNumber, titleText)
      .first();
    if (!submittedTitle) {
      return json({ message: "이 라운드에 제출된 제목이 아닙니다." }, 400);
    }

    const existing = await db
      .prepare("SELECT id FROM image_suggestions WHERE party_photo_id = ? AND source = 'party' LIMIT 1")
      .bind(photo.id)
      .first();
    if (existing) {
      const state = await buildRoomState(db, room, token);
      return json({ ok: true, alreadySuggested: true, state });
    }

    const id = crypto.randomUUID();
    // 관리자 카드에 표시할 참고용 메타데이터(실제 이미지 바이트는 승인 시점에만 복사한다).
    const extension = photo.mime_type === "image/png" ? "png" : photo.mime_type === "image/webp" ? "webp" : "jpg";
    const approxByteSize = Math.round(((photo.data_base64 || "").length * 3) / 4);

    await db
      .prepare(
        `INSERT INTO image_suggestions (
           id, user_id, submitter_name, inquiry_title, inquiry_body,
           file_name, content_type, byte_size,
           status, gallery_title, suggested_title, source, party_photo_id
         )
         VALUES (?, NULL, ?, ?, ?, ?, ?, ?, 'pending', ?, ?, 'party', ?)`
      )
      .bind(
        id,
        player.nickname,
        `파티 모드 사진 제안 (방 ${room.code} · 라운드 ${roundNumber})`,
        `파티 모드에서 라운드 ${roundNumber}에 제출된 제목 중 "${titleText}"을(를) 골라 제안합니다.`,
        `party-${room.code}-round${roundNumber}.${extension}`,
        photo.mime_type,
        approxByteSize,
        titleText,
        titleText,
        photo.id
      )
      .run();

    const state = await buildRoomState(db, room, token);

    return json({ ok: true, suggestionId: id, state });
  } catch (error) {
    console.error("party/suggest error", error);
    return json({ message: "갤러리 제안에 실패했습니다." }, 500);
  }
}
