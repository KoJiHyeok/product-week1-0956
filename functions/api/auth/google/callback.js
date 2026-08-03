import {
  createRandomToken,
  createSession,
  getDb,
  hashPassword,
  normalizeEmail,
  normalizeUsername,
} from "../_shared.js";
import { validateDisplayName } from "../../submissions/_moderation.js";
import {
  STATE_COOKIE_NAME,
  getExpiredGoogleStateCookieHeader,
  getGoogleRedirectUri,
  isGoogleConfigured,
} from "../google.js";

const TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";
const TOKENINFO_ENDPOINT = "https://oauth2.googleapis.com/tokeninfo";

export async function onRequestGet(context) {
  try {
    return await handleCallback(context);
  } catch (error) {
    console.error("auth/google/callback unhandled error", getErrorDetails(error));
    return redirectWithError(context.request, "google_failed");
  }
}

async function handleCallback(context) {
  const { request, env } = context;

  if (!isGoogleConfigured(env)) {
    return redirectWithError(request, "google_failed");
  }

  const url = new URL(request.url);
  const state = url.searchParams.get("state") || "";
  const code = url.searchParams.get("code") || "";
  const cookieState = getCookie(request, STATE_COOKIE_NAME);

  if (!state || !cookieState || state !== cookieState) {
    return redirectWithError(request, "google_state");
  }

  if (!code) {
    console.error("auth/google/callback missing code", url.searchParams.get("error") || "");
    return redirectWithError(request, "google_failed");
  }

  const redirectUri = getGoogleRedirectUri(request, env);
  const tokenResponse = await exchangeCodeForToken(env, code, redirectUri);

  if (!tokenResponse?.id_token) {
    return redirectWithError(request, "google_failed");
  }

  const claims = await verifyIdToken(env, tokenResponse.id_token);

  if (!claims?.sub) {
    return redirectWithError(request, "google_failed");
  }

  const db = getDb(context);
  const user = await resolveUser(db, claims);

  if (!user) {
    return redirectWithError(request, "google_failed");
  }

  if ((user.status || "active") !== "active") {
    return redirectWithError(request, "account_blocked");
  }

  const session = await createSession(db, request, user.id);

  return redirectSuccess(request, session.cookie);
}

async function exchangeCodeForToken(env, code, redirectUri) {
  const body = new URLSearchParams({
    code,
    client_id: env.GOOGLE_CLIENT_ID,
    client_secret: env.GOOGLE_CLIENT_SECRET,
    redirect_uri: redirectUri,
    grant_type: "authorization_code",
  });

  const response = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  if (!response.ok) {
    console.error("auth/google/callback token exchange failed", response.status, await response.text());
    return null;
  }

  return response.json();
}

async function verifyIdToken(env, idToken) {
  const response = await fetch(`${TOKENINFO_ENDPOINT}?id_token=${encodeURIComponent(idToken)}`);

  if (!response.ok) {
    console.error("auth/google/callback tokeninfo failed", response.status, await response.text());
    return null;
  }

  const claims = await response.json();

  if (claims.aud !== env.GOOGLE_CLIENT_ID) {
    console.error("auth/google/callback tokeninfo aud mismatch");
    return null;
  }

  return claims;
}

async function resolveUser(db, claims) {
  const sub = String(claims.sub);
  const email = normalizeEmail(claims.email || "");
  const emailVerified = claims.email_verified === true || claims.email_verified === "true";
  const name = typeof claims.name === "string" ? claims.name : "";

  const bySub = await selectUser(db, "google_sub = ?", sub);
  if (bySub) {
    return bySub;
  }

  if (email && emailVerified) {
    const byEmail = await selectUser(db, "email = ?", email);

    if (byEmail) {
      const now = new Date().toISOString();
      await db
        .prepare("UPDATE users SET google_sub = ?, email_verified_at = COALESCE(email_verified_at, ?) WHERE id = ?")
        .bind(sub, now, byEmail.id)
        .run();

      return {
        ...byEmail,
        google_sub: sub,
        email_verified_at: byEmail.email_verified_at || now,
      };
    }
  }

  return createGoogleUser(db, sub, email, emailVerified, name);
}

async function selectUser(db, whereClause, value) {
  return db
    .prepare(
      `SELECT id, login_id, username, email, email_verified_at, google_sub,
              bio, is_profile_public, profile_image_url, auth_provider, role,
              status, blocked_reason, blocked_until, theme_preference
       FROM users
       WHERE ${whereClause}
       LIMIT 1`
    )
    .bind(value)
    .first();
}

async function createGoogleUser(db, sub, email, emailVerified, name) {
  const loginId = await generateUniqueLoginId(db, sub);
  const username = await generateUniqueUsername(db, name || loginId);
  const passwordHash = await hashPassword(createRandomToken());
  const now = new Date().toISOString();
  const finalEmail = emailVerified ? email : "";
  const emailVerifiedAt = emailVerified && finalEmail ? now : null;

  try {
    const result = await db
      .prepare(
        `INSERT INTO users (login_id, email, username, password_hash, auth_provider, google_sub, email_verified_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(loginId, finalEmail || null, username, passwordHash, "google", sub, emailVerifiedAt)
      .run();

    return {
      id: result.meta.last_row_id,
      login_id: loginId,
      username,
      email: finalEmail,
      email_verified_at: emailVerifiedAt,
      google_sub: sub,
      auth_provider: "google",
      bio: "",
      is_profile_public: 1,
      profile_image_url: "",
      role: "user",
      status: "active",
      blocked_reason: null,
      blocked_until: null,
      theme_preference: "dark",
    };
  } catch (error) {
    console.error("auth/google/callback create user failed", getErrorDetails(error));
    return null;
  }
}

async function generateUniqueLoginId(db, sub) {
  const base = `google_${sub.slice(0, 20)}`;
  let candidate = base;
  let attempt = 0;

  while (await selectUser(db, "login_id = ?", candidate)) {
    attempt += 1;
    candidate = `${base}${attempt}`;
  }

  return candidate;
}

async function generateUniqueUsername(db, rawName) {
  const base = normalizeUsername(rawName).slice(0, 20) || "구글사용자";
  let candidate = base;
  let attempt = 0;

  while (attempt < 20) {
    const validation = validateDisplayName(candidate, "사용자 이름");
    const taken = validation.ok ? await selectUser(db, "username = ?", candidate) : true;

    if (validation.ok && !taken) {
      return candidate;
    }

    attempt += 1;
    candidate = `${base}${randomUsernameSuffix()}`;
  }

  return `구글사용자${randomUsernameSuffix()}`;
}

function randomUsernameSuffix() {
  return Math.floor(1000 + Math.random() * 9000);
}

function redirectWithError(request, code) {
  return buildRedirectResponse("/?auth_error=" + code, [getExpiredGoogleStateCookieHeader(request)]);
}

function redirectSuccess(request, sessionCookie) {
  return buildRedirectResponse("/", [getExpiredGoogleStateCookieHeader(request), sessionCookie]);
}

function buildRedirectResponse(location, cookies) {
  const headers = new Headers({
    location,
    "cache-control": "no-store",
  });

  cookies.forEach((cookie) => {
    if (cookie) {
      headers.append("set-cookie", cookie);
    }
  });

  return new Response(null, { status: 302, headers });
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
