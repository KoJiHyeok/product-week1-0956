const SESSION_COOKIE_NAME = "title_school_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;
const PASSWORD_HASH_ALGORITHM = "pbkdf2_sha256";
const PASSWORD_HASH_ITERATIONS = 100000;
const PASSWORD_KEY_BITS = 256;
const textEncoder = new TextEncoder();

export function onRequest() {
  return json({ message: "Not found" }, 404);
}

export function json(body, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      ...extraHeaders,
    },
  });
}

export async function readJson(request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

export function getDb(context) {
  if (!context.env.DB) {
    throw new Error("D1 DB binding is not configured");
  }

  return context.env.DB;
}

export function normalizeLoginId(loginId) {
  return typeof loginId === "string" ? loginId.trim() : "";
}

export function normalizeUsername(username) {
  return typeof username === "string" ? username.trim() : "";
}

export function normalizeEmail(email) {
  return typeof email === "string" ? email.trim().toLowerCase() : "";
}

export function validateLoginId(loginId) {
  if (loginId.length < 8) {
    return "아이디는 8자리 이상이어야 합니다.";
  }

  return "";
}

export function validatePassword(password) {
  if (typeof password !== "string" || password.length < 8) {
    return "비밀번호는 8자리 이상이어야 합니다.";
  }

  return "";
}

export function validateEmail(email) {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return "올바른 이메일을 입력하세요.";
  }

  return "";
}

export function publicUser(user) {
  return {
    id: user.id,
    loginId: user.login_id,
    username: user.username,
    email: user.email || "",
    emailVerified: Boolean(user.email_verified_at),
    profileImageUrl: user.profile_image_url || "",
    authProvider: user.auth_provider || "password",
  };
}

export function getSessionCookieHeader(request, token, maxAgeSeconds = SESSION_MAX_AGE_SECONDS) {
  const url = new URL(request.url);
  const attributes = [
    `${SESSION_COOKIE_NAME}=${token}`,
    "HttpOnly",
    "Path=/",
    `Max-Age=${maxAgeSeconds}`,
    "SameSite=Lax",
  ];

  if (url.protocol === "https:") {
    attributes.push("Secure");
  }

  return attributes.join("; ");
}

export function getExpiredSessionCookieHeader(request) {
  return getSessionCookieHeader(request, "", 0);
}

export async function createSession(db, request, userId) {
  const token = randomToken(32);
  const sessionId = await sha256Base64Url(token);
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE_SECONDS * 1000).toISOString();

  await db
    .prepare("INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)")
    .bind(sessionId, userId, expiresAt)
    .run();

  return {
    cookie: getSessionCookieHeader(request, token),
    expiresAt,
  };
}

export async function getCurrentUser(context) {
  const token = getCookie(context.request, SESSION_COOKIE_NAME);

  if (!token) {
    return null;
  }

  const db = getDb(context);
  const sessionId = await sha256Base64Url(token);
  const now = new Date().toISOString();

  try {
    return await db
      .prepare(
        `SELECT users.id, users.login_id, users.username, users.email, users.email_verified_at,
                users.profile_image_url, users.auth_provider
         FROM sessions
         JOIN users ON users.id = sessions.user_id
         WHERE sessions.id = ? AND sessions.expires_at > ?
         LIMIT 1`
      )
      .bind(sessionId, now)
      .first();
  } catch {
    return db
      .prepare(
        `SELECT users.id, users.login_id, users.username
         FROM sessions
         JOIN users ON users.id = sessions.user_id
         WHERE sessions.id = ? AND sessions.expires_at > ?
         LIMIT 1`
      )
      .bind(sessionId, now)
      .first();
  }
}

export async function deleteCurrentSession(context) {
  const token = getCookie(context.request, SESSION_COOKIE_NAME);

  if (!token) {
    return;
  }

  const db = getDb(context);
  const sessionId = await sha256Base64Url(token);
  await db.prepare("DELETE FROM sessions WHERE id = ?").bind(sessionId).run();
}

export async function hashPassword(password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const hash = await derivePassword(password, salt, PASSWORD_HASH_ITERATIONS);

  return [
    PASSWORD_HASH_ALGORITHM,
    String(PASSWORD_HASH_ITERATIONS),
    bytesToBase64Url(salt),
    bytesToBase64Url(hash),
  ].join("$");
}

export async function hashToken(token) {
  return sha256Base64Url(token);
}

export function createRandomToken(byteLength = 32) {
  return randomToken(byteLength);
}

export async function verifyPassword(password, storedHash) {
  if (typeof storedHash !== "string") {
    return false;
  }

  const [algorithm, iterationsText, saltText, hashText] = storedHash.split("$");
  const iterations = Number(iterationsText);

  if (algorithm !== PASSWORD_HASH_ALGORITHM || !Number.isInteger(iterations) || !saltText || !hashText) {
    return false;
  }

  const salt = base64UrlToBytes(saltText);
  const expectedHash = await derivePassword(password, salt, iterations);
  return constantTimeEqual(bytesToBase64Url(expectedHash), hashText);
}

async function derivePassword(password, salt, iterations) {
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    textEncoder.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits"]
  );
  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      hash: "SHA-256",
      salt,
      iterations,
    },
    keyMaterial,
    PASSWORD_KEY_BITS
  );

  return new Uint8Array(bits);
}

async function sha256Base64Url(value) {
  const digest = await crypto.subtle.digest("SHA-256", textEncoder.encode(value));
  return bytesToBase64Url(new Uint8Array(digest));
}

function randomToken(byteLength) {
  const bytes = crypto.getRandomValues(new Uint8Array(byteLength));
  return bytesToBase64Url(bytes);
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

function base64UrlToBytes(value) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes;
}

function constantTimeEqual(left, right) {
  const leftBytes = textEncoder.encode(left);
  const rightBytes = textEncoder.encode(right);
  const length = Math.max(leftBytes.length, rightBytes.length);
  let difference = leftBytes.length ^ rightBytes.length;

  for (let index = 0; index < length; index += 1) {
    difference |= (leftBytes[index] || 0) ^ (rightBytes[index] || 0);
  }

  return difference === 0;
}
