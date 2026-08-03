import {
  createRandomToken,
  createSession,
  getDb,
  hashPassword,
  normalizeEmail,
  normalizeUsername,
} from "../_shared.js";
import { validateDisplayName } from "../../submissions/_moderation.js";

const STATE_COOKIE_NAME = "title_school_naver_state";
const STATE_COOKIE_PATH = "/api/auth/naver";

export async function onRequestGet(context) {
  const { request } = context;

  try {
    return await handleCallback(context);
  } catch (error) {
    console.error("auth/naver/callback unhandled error", getErrorDetails(error));
    return failureRedirect(request, "naver_failed");
  }
}

async function handleCallback(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const stateParam = url.searchParams.get("state") || "";
  const code = url.searchParams.get("code") || "";
  const cookieState = getCookie(request, STATE_COOKIE_NAME);

  if (!stateParam || !cookieState || stateParam !== cookieState) {
    return failureRedirect(request, "naver_state");
  }

  if (!code || !env.NAVER_CLIENT_ID || !env.NAVER_CLIENT_SECRET) {
    console.error("auth/naver/callback missing code or credentials");
    return failureRedirect(request, "naver_failed");
  }

  const accessToken = await exchangeCodeForToken(env, code, stateParam);
  if (!accessToken) {
    console.error("auth/naver/callback token exchange failed");
    return failureRedirect(request, "naver_failed");
  }

  const profile = await fetchNaverProfile(accessToken);
  if (!profile?.id) {
    console.error("auth/naver/callback profile fetch failed");
    return failureRedirect(request, "naver_failed");
  }

  const db = getDb(context);
  const user = await resolveUser(db, profile);

  if (!user) {
    console.error("auth/naver/callback could not resolve user");
    return failureRedirect(request, "naver_failed");
  }

  if (user.status && user.status !== "active") {
    return failureRedirect(request, "account_blocked");
  }

  const session = await createSession(db, request, user.id);
  return buildRedirectResponse("/", [session.cookie, getExpiredStateCookieHeader(request)]);
}

async function exchangeCodeForToken(env, code, state) {
  const tokenUrl = new URL("https://nid.naver.com/oauth2.0/token");
  tokenUrl.searchParams.set("grant_type", "authorization_code");
  tokenUrl.searchParams.set("client_id", env.NAVER_CLIENT_ID);
  tokenUrl.searchParams.set("client_secret", env.NAVER_CLIENT_SECRET);
  tokenUrl.searchParams.set("code", code);
  tokenUrl.searchParams.set("state", state);

  const response = await fetch(tokenUrl.toString());

  if (!response.ok) {
    return "";
  }

  const data = await response.json().catch(() => null);
  return data?.access_token || "";
}

async function fetchNaverProfile(accessToken) {
  const response = await fetch("https://openapi.naver.com/v1/nid/me", {
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    return null;
  }

  const data = await response.json().catch(() => null);

  if (!data || data.resultcode !== "00" || !data.response) {
    return null;
  }

  return data.response;
}

async function resolveUser(db, profile) {
  const naverSub = String(profile.id);
  const email = normalizeEmail(profile.email || "");
  const nickname = profile.nickname || profile.name || "";
  const now = new Date().toISOString();

  const bySub = await db
    .prepare("SELECT id, status, email, email_verified_at FROM users WHERE naver_sub = ? LIMIT 1")
    .bind(naverSub)
    .first();

  if (bySub) {
    return bySub;
  }

  if (email) {
    const byEmail = await db
      .prepare("SELECT id, status, email, email_verified_at FROM users WHERE email = ? LIMIT 1")
      .bind(email)
      .first();

    if (byEmail) {
      const emailVerifiedAt = byEmail.email_verified_at || now;
      await db
        .prepare("UPDATE users SET naver_sub = ?, email_verified_at = ? WHERE id = ?")
        .bind(naverSub, emailVerifiedAt, byEmail.id)
        .run();

      return { ...byEmail, email_verified_at: emailVerifiedAt };
    }
  }

  return createNaverUser(db, naverSub, email, nickname, now);
}

async function createNaverUser(db, naverSub, email, nickname, now) {
  const loginId = await buildUniqueLoginId(db, naverSub);
  const username = await buildUniqueUsername(db, nickname);
  const passwordHash = await hashPassword(createRandomToken());

  const result = await db
    .prepare(
      `INSERT INTO users (login_id, email, username, password_hash, email_verified_at, naver_sub, auth_provider)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(loginId, email || null, username, passwordHash, email ? now : null, naverSub, "naver")
    .run();

  return {
    id: result.meta.last_row_id,
    status: "active",
    email,
    email_verified_at: email ? now : null,
  };
}

async function buildUniqueLoginId(db, naverSub) {
  const sanitized = String(naverSub || "").replace(/[^a-zA-Z0-9]/g, "").slice(0, 20);
  const base = `naver_${sanitized || "user"}`;
  let candidate = base;
  let suffix = 1;

  while (await loginIdTaken(db, candidate)) {
    suffix += 1;
    candidate = `${base}${suffix}`;
  }

  return candidate;
}

async function loginIdTaken(db, loginId) {
  const row = await db.prepare("SELECT 1 FROM users WHERE login_id = ? LIMIT 1").bind(loginId).first();
  return Boolean(row);
}

async function buildUniqueUsername(db, rawNickname) {
  const trimmed = normalizeUsername(rawNickname);
  const validation = validateDisplayName(trimmed, "사용자 이름");
  const base = trimmed && validation.ok ? trimmed : "네이버사용자";
  let candidate = base;
  let suffix = 1;

  while (await usernameTaken(db, candidate)) {
    suffix += 1;
    candidate = `${base}${suffix}`;
  }

  return candidate;
}

async function usernameTaken(db, username) {
  const row = await db.prepare("SELECT 1 FROM users WHERE username = ? LIMIT 1").bind(username).first();
  return Boolean(row);
}

function failureRedirect(request, reason) {
  return buildRedirectResponse(`/?auth_error=${reason}`, [getExpiredStateCookieHeader(request)]);
}

function buildRedirectResponse(location, cookies) {
  const headers = new Headers({ location });
  cookies.forEach((cookie) => headers.append("set-cookie", cookie));
  return new Response(null, { status: 302, headers });
}

function getExpiredStateCookieHeader(request) {
  const url = new URL(request.url);
  const attributes = [
    `${STATE_COOKIE_NAME}=`,
    "HttpOnly",
    `Path=${STATE_COOKIE_PATH}`,
    "Max-Age=0",
    "SameSite=Lax",
  ];

  if (url.protocol === "https:") {
    attributes.push("Secure");
  }

  return attributes.join("; ");
}

function getCookie(request, name) {
  const header = request.headers.get("cookie") || "";
  const target = `${name}=`;

  return (
    header
      .split(";")
      .map((part) => part.trim())
      .find((part) => part.startsWith(target))
      ?.slice(target.length) || ""
  );
}

function getErrorDetails(error) {
  return {
    name: error?.name || "Error",
    message: error?.message || String(error),
    stack: error?.stack || "",
    cause: error?.cause ? String(error.cause) : "",
  };
}
