import { getCurrentUser, getDb, json, normalizeLoginId, normalizeUsername, readJson } from "../auth/_shared.js";
import { galleryImages } from "../images/gallery-data.js";

export { getDb, json, readJson };

// 회원 표시 이름 상한. 게스트 닉네임(normalizeNickname)의 12자 제한과 별개로,
// 기존에 등록된 회원 username이 더 길 수 있어 넉넉히 24자에서만 자른다.
const MEMBER_NICKNAME_MAX_LENGTH = 24;

// 혼동되기 쉬운 문자(I, O, 0, 1)는 초대 코드에서 제외한다.
const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const CODE_LENGTH = 6;
const TOKEN_BYTES = 16;
const SEED_BYTES = 9;

export const PARTY_ACTIVE_WINDOW_MS = 15000;
export const PARTY_MAX_PLAYERS = 12;

// 방 안 사진 업로드(파티 전용, 초대 코드 프라이빗 방만 허용).
export const PARTY_ALLOWED_PHOTO_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
export const PARTY_PHOTO_MAX_BASE64_LENGTH = 950000; // 원본 약 700KB에 해당하는 base64 문자열 상한
export const PARTY_PHOTO_MAX_PER_PLAYER = 5;
export const PARTY_PHOTO_MAX_PER_ROOM = 20;
// 공개 방 목록에서 "최근 활동"으로 간주하는 창.
export const PARTY_PUBLIC_ROOM_ACTIVE_WINDOW_MS = 10 * 60 * 1000;

export function generateRoomCode() {
  const bytes = crypto.getRandomValues(new Uint8Array(CODE_LENGTH));
  let code = "";
  for (let index = 0; index < CODE_LENGTH; index += 1) {
    code += CODE_CHARS[bytes[index] % CODE_CHARS.length];
  }
  return code;
}

export function generatePlayerToken() {
  return bytesToHex(crypto.getRandomValues(new Uint8Array(TOKEN_BYTES)));
}

export function generatePhotoSeed() {
  return bytesToHex(crypto.getRandomValues(new Uint8Array(SEED_BYTES)));
}

function bytesToHex(bytes) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function normalizeNickname(nickname) {
  const trimmed = typeof nickname === "string" ? nickname.trim() : "";
  if (trimmed.length < 1 || trimmed.length > 12) {
    return "";
  }
  return trimmed;
}

export function normalizeRoomCode(code) {
  return typeof code === "string" ? code.trim().toUpperCase() : "";
}

// 같은 방 안에서 닉네임이 겹치면 " (2)", " (3)" ... 접미사를 붙여 유일하게 만든다.
// 회원·게스트 공통. roomId가 없으면(방 생성 이전) 호출하지 않는다.
async function ensureUniqueRoomNickname(db, roomId, nickname) {
  const existingResult = await db
    .prepare(`SELECT nickname FROM party_players WHERE room_id = ?`)
    .bind(roomId)
    .all();
  const existingNames = new Set((existingResult.results || []).map((row) => row.nickname));

  if (!existingNames.has(nickname)) {
    return nickname;
  }

  let suffix = 2;
  let candidate = `${nickname} (${suffix})`;
  while (existingNames.has(candidate)) {
    suffix += 1;
    candidate = `${nickname} (${suffix})`;
  }
  return candidate;
}

// 파티 참가자의 이름·회원 여부를 결정한다.
// 로그인 회원이면 body의 nickname은 무시하고 세션의 username(사칭 방지)을 쓴다.
// 비로그인이면 rawNickname을 normalizeNickname으로 검증한다(실패 시 ok:false, 호출부가 400 처리).
export async function resolvePartyIdentity(context, db, roomId, rawNickname) {
  const user = await getCurrentUser(context);

  if (user) {
    let nickname = normalizeUsername(user.username) || normalizeLoginId(user.login_id) || "회원";
    nickname = nickname.slice(0, MEMBER_NICKNAME_MAX_LENGTH);
    if (roomId) {
      nickname = await ensureUniqueRoomNickname(db, roomId, nickname);
    }
    return { ok: true, nickname, userId: user.id };
  }

  const nickname = normalizeNickname(rawNickname);
  if (!nickname) {
    return { ok: false, nickname: "", userId: null };
  }

  const finalNickname = roomId ? await ensureUniqueRoomNickname(db, roomId, nickname) : nickname;
  return { ok: true, nickname: finalNickname, userId: null };
}

export function clampTotalRounds(value) {
  const num = Number(value);
  if (!Number.isFinite(num)) {
    return 5;
  }
  return Math.min(10, Math.max(1, Math.round(num)));
}

export function clampRoundSeconds(value) {
  const num = Number(value);
  if (!Number.isFinite(num)) {
    return 60;
  }
  return Math.min(120, Math.max(30, Math.round(num)));
}

export async function getRoomByCode(db, code) {
  if (!code) {
    return null;
  }
  return db.prepare("SELECT * FROM party_rooms WHERE code = ?").bind(code).first();
}

export async function getPlayerByToken(db, roomId, token) {
  if (!token) {
    return null;
  }
  return db
    .prepare("SELECT * FROM party_players WHERE room_id = ? AND token = ?")
    .bind(roomId, token)
    .first();
}

// party_photos.data_base64 <-> 바이트. 업로드는 클라이언트가 base64 문자열로 보내고,
// 서빙(photo.js)·갤러리 제안 승인 시 복사(admin approve.js)에서 디코드가 필요하다.
export function base64ToBytes(base64) {
  const clean = String(base64 || "").replace(/^data:[^,]*,/, "");
  const binary = atob(clean);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

function hashSeed(seed) {
  let hash = 0;
  const text = String(seed || "");
  for (let index = 0; index < text.length; index += 1) {
    hash = (hash * 31 + text.charCodeAt(index)) >>> 0;
  }
  return hash;
}

// seed 문자열의 간단한 해시로 갤러리에서 결정적으로 fallback 이미지 1장을 고른다.
export function pickFallbackImage(seed) {
  if (!galleryImages.length) {
    return { key: "", src: "", alt: "" };
  }
  const index = hashSeed(seed) % galleryImages.length;
  const image = galleryImages[index];
  return { key: String(image.imageKey), src: image.src, alt: image.alt || image.title || "" };
}

// 방 코드를 시드로 갤러리 전체를 섞은 순서에서 라운드별 이미지를 고른다.
// 같은 방에서는 갤러리 크기만큼 라운드가 지나기 전까지 사진이 겹치지 않고, 방마다 순서가 다르다.
export function pickRoundImage(roomCode, roundNumber) {
  if (!galleryImages.length) {
    return { key: "", src: "", alt: "" };
  }

  const order = galleryImages.map((_, index) => index);
  let state = hashSeed(roomCode) || 1;
  for (let i = order.length - 1; i > 0; i -= 1) {
    // xorshift32 — 방 코드마다 결정적인 셔플
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    state >>>= 0;
    const j = state % (i + 1);
    [order[i], order[j]] = [order[j], order[i]];
  }

  const image = galleryImages[order[(roundNumber - 1) % order.length]];
  return { key: String(image.imageKey), src: image.src, alt: image.alt || image.title || "" };
}

export function resolveFallbackImage(imageKey) {
  if (!imageKey) {
    return null;
  }
  const image = galleryImages.find((entry) => String(entry.imageKey) === String(imageKey));
  if (!image) {
    return null;
  }
  return { key: String(image.imageKey), src: image.src, alt: image.alt || image.title || "" };
}

export async function buildRoomState(db, room, viewerToken) {
  const now = Date.now();

  const playersResult = await db
    .prepare(
      `SELECT id, token, nickname, is_host, last_seen_at, user_id
       FROM party_players
       WHERE room_id = ?
       ORDER BY joined_at ASC`
    )
    .bind(room.id)
    .all();
  const players = playersResult.results || [];
  const viewerPlayer = players.find((player) => player.token === viewerToken) || null;

  let submittedPlayerIds = new Set();
  if (room.round_number > 0) {
    const titlesResult = await db
      .prepare(`SELECT player_id FROM party_titles WHERE room_id = ? AND round_number = ?`)
      .bind(room.id, room.round_number)
      .all();
    submittedPlayerIds = new Set((titlesResult.results || []).map((row) => row.player_id));
  }

  // 전체 라운드 누적 득표 — 종료 화면 스코어보드용. 득표 0인 플레이어도 항상 보여야 하므로
  // 여기서는 맵만 만들고 아래 playersOut에서 전원에 대해 조회한다.
  const scoreResult = await db
    .prepare(`SELECT target_player_id AS playerId, COUNT(*) AS voteCount FROM party_votes WHERE room_id = ? GROUP BY target_player_id`)
    .bind(room.id)
    .all();
  const scoreByPlayerId = new Map((scoreResult.results || []).map((row) => [row.playerId, Number(row.voteCount) || 0]));

  let myVoteTargetPlayerId = null;
  if (viewerPlayer && room.round_number > 0) {
    const myVoteRow = await db
      .prepare(`SELECT target_player_id FROM party_votes WHERE room_id = ? AND round_number = ? AND voter_player_id = ?`)
      .bind(room.id, room.round_number, viewerPlayer.id)
      .first();
    myVoteTargetPlayerId = myVoteRow ? myVoteRow.target_player_id : null;
  }

  const playersOut = players.map((player) => ({
    id: player.id,
    nickname: player.nickname,
    isHost: Boolean(player.is_host),
    isActive: now - Number(player.last_seen_at || 0) <= PARTY_ACTIVE_WINDOW_MS,
    hasSubmitted: submittedPlayerIds.has(player.id),
    isMe: player.token === viewerToken,
    score: scoreByPlayerId.get(player.id) || 0,
    isMember: player.user_id != null,
  }));

  let titlesOut = [];
  if ((room.status === "reveal" || room.status === "ended") && room.round_number > 0) {
    const roundVotesResult = await db
      .prepare(`SELECT target_player_id AS playerId, COUNT(*) AS voteCount FROM party_votes WHERE room_id = ? AND round_number = ? GROUP BY target_player_id`)
      .bind(room.id, room.round_number)
      .all();
    const voteCountByPlayerId = new Map(
      (roundVotesResult.results || []).map((row) => [row.playerId, Number(row.voteCount) || 0])
    );

    const revealResult = await db
      .prepare(
        `SELECT party_titles.player_id AS player_id, party_titles.title AS title, party_players.nickname AS nickname
         FROM party_titles
         JOIN party_players ON party_players.id = party_titles.player_id
         WHERE party_titles.room_id = ? AND party_titles.round_number = ?
         ORDER BY party_titles.created_at ASC`
      )
      .bind(room.id, room.round_number)
      .all();
    titlesOut = (revealResult.results || []).map((row) => ({
      playerId: row.player_id,
      nickname: row.nickname,
      title: row.title,
      voteCount: voteCountByPlayerId.get(row.player_id) || 0,
    }));
  }

  const fallback =
    resolveFallbackImage(room.fallback_image_key) || pickFallbackImage(room.photo_seed || room.code);

  // 방 안 업로드 사진 목록 — 공개 방은 업로드가 막혀 있으니 조회할 필요가 없다.
  let photosOut = [];
  if (!room.is_public) {
    const photosResult = await db
      .prepare(
        `SELECT party_photos.id AS id, party_photos.uploader_player_id AS uploaderPlayerId,
                party_photos.used_in_round AS usedInRound, party_photos.created_at AS createdAt,
                party_players.nickname AS uploaderNickname
         FROM party_photos
         JOIN party_players ON party_players.id = party_photos.uploader_player_id
         WHERE party_photos.room_id = ?
         ORDER BY party_photos.created_at ASC`
      )
      .bind(room.id)
      .all();
    photosOut = (photosResult.results || []).map((row) => ({
      id: row.id,
      uploaderNickname: row.uploaderNickname,
      isMine: Boolean(viewerPlayer) && row.uploaderPlayerId === viewerPlayer.id,
      usedInRound: row.usedInRound == null ? null : row.usedInRound,
      createdAt: row.createdAt,
    }));
  }

  // 이번(또는 마지막) 라운드가 업로드 사진 라운드였다면 이미 갤러리에 제안됐는지 확인한다.
  let roundPhotoSuggested = false;
  if (room.round_photo_id) {
    const suggestionRow = await db
      .prepare(`SELECT id FROM image_suggestions WHERE party_photo_id = ? AND source = 'party' LIMIT 1`)
      .bind(room.round_photo_id)
      .first();
    roundPhotoSuggested = Boolean(suggestionRow);
  }

  return {
    room: {
      code: room.code,
      status: room.status,
      roundNumber: room.round_number,
      totalRounds: room.total_rounds,
      roundSeconds: room.round_seconds,
      photoSeed: room.photo_seed || "",
      fallbackImage: { src: fallback.src, alt: fallback.alt },
      roundPhotoId: room.round_photo_id || null,
      roundPhotoSuggested,
      roundDeadlineAt: room.round_deadline_at || null,
      serverNow: now,
      isPublic: Boolean(room.is_public),
      myVoteTargetPlayerId,
    },
    players: playersOut,
    titles: titlesOut,
    photos: photosOut,
  };
}
