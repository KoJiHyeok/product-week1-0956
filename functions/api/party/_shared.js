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
    return 30;
  }
  return Math.min(120, Math.max(30, Math.round(num)));
}

export function clampVoteSeconds(value) {
  const num = Number(value);
  if (!Number.isFinite(num)) {
    return 15;
  }
  return Math.min(60, Math.max(5, Math.round(num)));
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

// 현재(또는 마지막) 라운드에 제출된 제목 수. reveal_index와 비교해 공개·투표·결과 단계를 가른다.
export async function countRoundTitles(db, roomId, roundNumber) {
  if (!roundNumber || roundNumber < 1) {
    return 0;
  }
  const row = await db
    .prepare(`SELECT COUNT(*) AS count FROM party_titles WHERE room_id = ? AND round_number = ?`)
    .bind(roomId, roundNumber)
    .first();
  return Number(row?.count || 0);
}

// status='reveal' 안의 3단계(방장이 넘기는 방식)를 하나로 판정한다.
// - revealing: 아직 전원 공개가 끝나지 않음
// - voting: 전원 공개 후 15초 투표 창
// - results: 투표 마감(또는 status='ended') — 득표 공개 가능
export function computeVotePhase(room, titlesTotal, now) {
  if (room.status === "ended") {
    return "results";
  }
  if (room.status !== "reveal") {
    return null;
  }
  const revealIndex = Math.min(room.reveal_index || 0, titlesTotal);
  if (revealIndex < titlesTotal) {
    return "revealing";
  }
  if (room.vote_deadline_at && now < room.vote_deadline_at) {
    return "voting";
  }
  return "results";
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

  const titlesTotal = await countRoundTitles(db, room.id, room.round_number);
  const votePhase = computeVotePhase(room, titlesTotal, now);
  const revealIndex = Math.min(room.reveal_index || 0, titlesTotal);

  // 누적 득표 — 결과 단계가 아니면 이번 라운드 표는 빼고 계산한다(스코어보드로 스포일러 유출 방지).
  // 득표 0인 플레이어도 항상 보여야 하므로 여기서는 맵만 만들고 아래 playersOut에서 전원에 대해 조회한다.
  const scoreResult =
    votePhase === "results"
      ? await db
          .prepare(`SELECT target_player_id AS playerId, COUNT(*) AS voteCount FROM party_votes WHERE room_id = ? GROUP BY target_player_id`)
          .bind(room.id)
          .all()
      : await db
          .prepare(
            `SELECT target_player_id AS playerId, COUNT(*) AS voteCount FROM party_votes WHERE room_id = ? AND round_number < ? GROUP BY target_player_id`
          )
          .bind(room.id, room.round_number)
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

  // 스포일러 차단: 아직 공개되지 않은 제목은 절대 응답에 넣지 않는다(개발자도구로 훔쳐보기 방지).
  // revealIndex개만큼만 created_at ASC 순으로 담고, 득표수는 결과 단계일 때만 붙인다.
  let titlesOut = [];
  if ((room.status === "reveal" || room.status === "ended") && room.round_number > 0 && revealIndex > 0) {
    const revealResult = await db
      .prepare(
        `SELECT party_titles.player_id AS player_id, party_titles.title AS title, party_players.nickname AS nickname
         FROM party_titles
         JOIN party_players ON party_players.id = party_titles.player_id
         WHERE party_titles.room_id = ? AND party_titles.round_number = ?
         ORDER BY party_titles.created_at ASC
         LIMIT ?`
      )
      .bind(room.id, room.round_number, revealIndex)
      .all();

    let voteCountByPlayerId = new Map();
    if (votePhase === "results") {
      const roundVotesResult = await db
        .prepare(`SELECT target_player_id AS playerId, COUNT(*) AS voteCount FROM party_votes WHERE room_id = ? AND round_number = ? GROUP BY target_player_id`)
        .bind(room.id, room.round_number)
        .all();
      voteCountByPlayerId = new Map(
        (roundVotesResult.results || []).map((row) => [row.playerId, Number(row.voteCount) || 0])
      );
    }

    titlesOut = (revealResult.results || []).map((row) => {
      const entry = { playerId: row.player_id, nickname: row.nickname, title: row.title };
      if (votePhase === "results") {
        entry.voteCount = voteCountByPlayerId.get(row.player_id) || 0;
      }
      return entry;
    });
  }

  // 게임 종료 화면 전용 집계. 게임 중엔 스포일러 여지를 없애기 위해 계산하지 않는다.
  let finalStats = null;
  if (room.status === "ended") {
    finalStats = await buildPartyFinalStats(db, room, players, scoreByPlayerId, viewerToken);
  }

  const fallback =
    resolveFallbackImage(room.fallback_image_key) || pickFallbackImage(room.photo_seed || room.code);

  // 방 안 업로드 사진 목록 — 공개 방은 업로드가 막혀 있으니 조회할 필요가 없다.
  // 프라이버시: 남이 올린 사진은 목록에 노출하지 않는다(누가 무엇을 올렸는지 비공개).
  // 대신 photoCountTotal로 방 전체 업로드 장수만 알려준다.
  let photosOut = [];
  let photoCountTotal = 0;
  if (!room.is_public) {
    const totalCountRow = await db
      .prepare(`SELECT COUNT(*) AS count FROM party_photos WHERE room_id = ?`)
      .bind(room.id)
      .first();
    photoCountTotal = Number(totalCountRow?.count || 0);

    if (viewerPlayer) {
      const photosResult = await db
        .prepare(
          `SELECT id, used_in_round AS usedInRound, created_at AS createdAt
           FROM party_photos
           WHERE room_id = ? AND uploader_player_id = ?
           ORDER BY created_at ASC`
        )
        .bind(room.id, viewerPlayer.id)
        .all();
      photosOut = (photosResult.results || []).map((row) => ({
        id: row.id,
        isMine: true,
        usedInRound: row.usedInRound == null ? null : row.usedInRound,
        createdAt: row.createdAt,
      }));
    }
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

  const state = {
    room: {
      code: room.code,
      status: room.status,
      roundNumber: room.round_number,
      totalRounds: room.total_rounds,
      roundSeconds: room.round_seconds,
      voteSeconds: room.vote_seconds,
      photoSeed: room.photo_seed || "",
      fallbackImage: { src: fallback.src, alt: fallback.alt },
      roundPhotoId: room.round_photo_id || null,
      roundPhotoSuggested,
      roundDeadlineAt: room.round_deadline_at || null,
      revealIndex,
      titlesTotal,
      voteDeadlineAt: room.vote_deadline_at || null,
      votePhase,
      serverNow: now,
      isPublic: Boolean(room.is_public),
      myVoteTargetPlayerId,
      photoCountTotal,
    },
    players: playersOut,
    titles: titlesOut,
    photos: photosOut,
  };

  if (finalStats) {
    state.finalStats = finalStats;
  }

  return state;
}

// 게임 종료(status='ended') 시에만 호출. 라운드별 득표 집계로 순위·라운드 우승·베스트 제목을 계산한다.
// scoreByPlayerId는 buildRoomState가 이미 계산한 "전체 라운드 누적 득표"(status='ended'이면 votePhase는
// 항상 'results'이므로 라운드 제한 없이 전체 집계돼 있다) 맵을 그대로 재사용한다.
async function buildPartyFinalStats(db, room, players, scoreByPlayerId, viewerToken) {
  const roundVotesResult = await db
    .prepare(
      `SELECT round_number AS roundNumber, target_player_id AS playerId, COUNT(*) AS voteCount
       FROM party_votes WHERE room_id = ? GROUP BY round_number, target_player_id`
    )
    .bind(room.id)
    .all();
  const roundVoteRows = roundVotesResult.results || [];

  const titlesResult = await db
    .prepare(
      `SELECT party_titles.round_number AS roundNumber, party_titles.player_id AS playerId,
              party_titles.title AS title, party_players.nickname AS nickname
       FROM party_titles
       JOIN party_players ON party_players.id = party_titles.player_id
       WHERE party_titles.room_id = ?
       ORDER BY party_titles.round_number ASC, party_titles.created_at ASC, party_titles.id ASC`
    )
    .bind(room.id)
    .all();
  const titleRows = titlesResult.results || [];

  // 라운드별 득표 맵과 게임 전체 투표 수.
  const votesByRound = new Map(); // roundNumber -> Map(playerId -> voteCount)
  let totalVotes = 0;
  for (const row of roundVoteRows) {
    const voteCount = Number(row.voteCount) || 0;
    totalVotes += voteCount;
    if (!votesByRound.has(row.roundNumber)) {
      votesByRound.set(row.roundNumber, new Map());
    }
    votesByRound.get(row.roundNumber).set(row.playerId, voteCount);
  }

  // 라운드 우승 — 그 라운드 최다 득표(1표 이상)를 받은 전원에게 1승. 표가 없는 라운드는 우승자 없음.
  const roundWinsByPlayerId = new Map();
  for (const playerVotes of votesByRound.values()) {
    let maxVotes = 0;
    for (const count of playerVotes.values()) {
      maxVotes = Math.max(maxVotes, count);
    }
    if (maxVotes <= 0) {
      continue;
    }
    for (const [playerId, count] of playerVotes) {
      if (count === maxVotes) {
        roundWinsByPlayerId.set(playerId, (roundWinsByPlayerId.get(playerId) || 0) + 1);
      }
    }
  }

  const rankingUnsorted = players.map((player) => ({
    playerId: player.id,
    nickname: player.nickname,
    isMe: player.token === viewerToken,
    isMember: player.user_id != null,
    totalVotes: scoreByPlayerId.get(player.id) || 0,
    roundWins: roundWinsByPlayerId.get(player.id) || 0,
  }));
  rankingUnsorted.sort((a, b) => b.totalVotes - a.totalVotes);

  // 경쟁 순위(1,1,3 방식) — 동점이면 같은 순위, 다음 순위는 인원 수만큼 건너뛴다.
  let rank = 0;
  let previousVotes = null;
  const ranking = rankingUnsorted.map((entry, index) => {
    if (previousVotes === null || entry.totalVotes !== previousVotes) {
      rank = index + 1;
      previousVotes = entry.totalVotes;
    }
    return { ...entry, rank };
  });

  // 베스트 제목 — 게임 전체에서 한 라운드 최다 득표를 받은 제목. 동점이면 더 이른 라운드 우선.
  let bestTitle = null;
  for (const row of titleRows) {
    const voteCount = votesByRound.get(row.roundNumber)?.get(row.playerId) || 0;
    if (voteCount <= 0) {
      continue;
    }
    if (
      !bestTitle ||
      voteCount > bestTitle.voteCount ||
      (voteCount === bestTitle.voteCount && row.roundNumber < bestTitle.roundNumber)
    ) {
      bestTitle = { title: row.title, nickname: row.nickname, voteCount, roundNumber: row.roundNumber };
    }
  }

  const distinctRounds = new Set(titleRows.map((row) => row.roundNumber));
  const roundsPlayed = distinctRounds.size > 0 ? distinctRounds.size : Number(room.round_number) || 0;

  return { ranking, bestTitle, roundsPlayed, totalVotes };
}
