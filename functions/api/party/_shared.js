import { getDb, json, readJson } from "../auth/_shared.js";
import { galleryImages } from "../images/gallery-data.js";

export { getDb, json, readJson };

// 혼동되기 쉬운 문자(I, O, 0, 1)는 초대 코드에서 제외한다.
const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const CODE_LENGTH = 6;
const TOKEN_BYTES = 16;
const SEED_BYTES = 9;

export const PARTY_ACTIVE_WINDOW_MS = 15000;
export const PARTY_MAX_PLAYERS = 12;

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
      `SELECT id, token, nickname, is_host, last_seen_at
       FROM party_players
       WHERE room_id = ?
       ORDER BY joined_at ASC`
    )
    .bind(room.id)
    .all();
  const players = playersResult.results || [];

  let submittedPlayerIds = new Set();
  if (room.round_number > 0) {
    const titlesResult = await db
      .prepare(`SELECT player_id FROM party_titles WHERE room_id = ? AND round_number = ?`)
      .bind(room.id, room.round_number)
      .all();
    submittedPlayerIds = new Set((titlesResult.results || []).map((row) => row.player_id));
  }

  const playersOut = players.map((player) => ({
    id: player.id,
    nickname: player.nickname,
    isHost: Boolean(player.is_host),
    isActive: now - Number(player.last_seen_at || 0) <= PARTY_ACTIVE_WINDOW_MS,
    hasSubmitted: submittedPlayerIds.has(player.id),
    isMe: player.token === viewerToken,
  }));

  let titlesOut = [];
  if ((room.status === "reveal" || room.status === "ended") && room.round_number > 0) {
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
    }));
  }

  const fallback =
    resolveFallbackImage(room.fallback_image_key) || pickFallbackImage(room.photo_seed || room.code);

  return {
    room: {
      code: room.code,
      status: room.status,
      roundNumber: room.round_number,
      totalRounds: room.total_rounds,
      roundSeconds: room.round_seconds,
      photoSeed: room.photo_seed || "",
      fallbackImage: { src: fallback.src, alt: fallback.alt },
      roundDeadlineAt: room.round_deadline_at || null,
      serverNow: now,
    },
    players: playersOut,
    titles: titlesOut,
  };
}
