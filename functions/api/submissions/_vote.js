const GUEST_VOTE_COOKIE_NAME = "title_school_guest_vote";
const GUEST_VOTE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;
const textEncoder = new TextEncoder();

export function getVoteDate() {
  return new Date().toISOString().slice(0, 10);
}

export async function getOrCreateGuestVoteIdentifier(request) {
  const existing = normalizeGuestIdentifier(getCookie(request, GUEST_VOTE_COOKIE_NAME));

  if (existing) {
    return {
      identifier: existing,
      cookie: "",
    };
  }

  const identifier = await createGuestVoteIdentifier();
  return {
    identifier,
    cookie: getGuestVoteCookieHeader(request, identifier),
  };
}

export function normalizeGuestIdentifier(value) {
  if (typeof value !== "string") {
    return "";
  }

  const normalized = value.trim();
  return /^[a-zA-Z0-9_-]{32,96}$/.test(normalized) ? normalized : "";
}

function getGuestVoteCookieHeader(request, identifier) {
  const url = new URL(request.url);
  const attributes = [
    `${GUEST_VOTE_COOKIE_NAME}=${identifier}`,
    "HttpOnly",
    "Path=/",
    `Max-Age=${GUEST_VOTE_MAX_AGE_SECONDS}`,
    "SameSite=Lax",
  ];

  if (url.protocol === "https:") {
    attributes.push("Secure");
  }

  return attributes.join("; ");
}

async function createGuestVoteIdentifier() {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  const digest = await crypto.subtle.digest("SHA-256", textEncoder.encode(bytesToBase64Url(bytes)));
  return bytesToBase64Url(new Uint8Array(digest));
}

function getCookie(request, name) {
  const header = request.headers.get("cookie") || "";
  const target = `${name}=`;

  return header
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(target))
    ?.slice(target.length) || "";
}

function bytesToBase64Url(bytes) {
  let binary = "";

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}
