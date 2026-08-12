import { getOrCreateGuestVoteIdentifier } from "./_vote.js";

// 비회원 표시 이름 규칙:
// - 회원(users.username)과 같은 이름은 사칭이므로 거부한다.
// - 비회원끼리 같은 이름은 허용하되, 쿠키 식별자에서 파생한 4자리 태그를 붙여 구분한다.
//   ("홍길동#a3f2") 태그는 브라우저마다 고정이라 같은 사람은 항상 같은 태그를 갖는다.
const GUEST_TAG_SEPARATOR = "#";
const GUEST_TAG_LENGTH = 4;
const textEncoder = new TextEncoder();

// 사용자가 직접 "#"을 넣어 남의 태그를 흉내 내지 못하게 막는다.
export function validateGuestName(value) {
  const text = String(value || "").trim();

  if (text.includes(GUEST_TAG_SEPARATOR)) {
    return { ok: false, message: `비회원 이름에는 ${GUEST_TAG_SEPARATOR} 기호를 넣을 수 없습니다.` };
  }

  return { ok: true, message: "" };
}

export async function isReservedByMember(db, guestName) {
  const text = String(guestName || "").trim();

  if (!text) {
    return false;
  }

  const row = await db
    .prepare("SELECT id FROM users WHERE username = ? COLLATE NOCASE LIMIT 1")
    .bind(text)
    .first();

  return Boolean(row);
}

// 비회원 태그를 만들고, 새 쿠키가 필요하면 응답 헤더도 함께 돌려준다.
export async function resolveGuestIdentity(request, guestName) {
  const text = String(guestName || "").trim();

  if (!text) {
    return { tag: null, cookie: "" };
  }

  const guestVote = await getOrCreateGuestVoteIdentifier(request);

  return {
    tag: guestVote.identifier ? await createGuestTag(guestVote.identifier) : null,
    cookie: guestVote.cookie,
  };
}

export function formatGuestName(guestName, guestTag) {
  const name = String(guestName || "").trim();
  const tag = String(guestTag || "").trim();

  if (!name) {
    return "";
  }

  return tag ? `${name}${GUEST_TAG_SEPARATOR}${tag}` : name;
}

// 회원은 username, 비회원은 이름+태그를 표시 이름으로 쓴다.
export function formatAuthorName(row) {
  return row?.username || formatGuestName(row?.guest_name, row?.guest_tag) || "비회원";
}

async function createGuestTag(identifier) {
  const digest = await crypto.subtle.digest("SHA-256", textEncoder.encode(`guest-tag:${identifier}`));

  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, GUEST_TAG_LENGTH);
}
