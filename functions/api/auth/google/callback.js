import {
  createRandomToken,
  createSession,
  getDb,
  json,
} from "../_shared.js";

const STATE_COOKIE_NAME = "title_school_google_state";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_USERINFO_URL = "https://openidconnect.googleapis.com/v1/userinfo";

export async function onRequestGet(context) {
  try {
    return await handleCallback(context);
  } catch (error) {
    console.error("auth/google/callback unhandled error", error);
    return redirect(context.request, "/?authMessage=google_failed");
  }
}

async function handleCallback(context) {
  const requestUrl = new URL(context.request.url);
  const code = requestUrl.searchParams.get("code") || "";
  const state = requestUrl.searchParams.get("state") || "";
  const storedState = getStoredState(context.request);
  const next = storedState.next || "/";

  if (!code || !state || state !== storedState.state) {
    return redirect(context.request, "/?authMessage=google_failed", {
      "set-cookie": expireStateCookie(context.request),
    });
  }

  const clientId = context.env.GOOGLE_OAUTH_CLIENT_ID;
  const clientSecret = context.env.GOOGLE_OAUTH_CLIENT_SECRET;
  const redirectUri = context.env.GOOGLE_OAUTH_REDIRECT_URI || `${requestUrl.origin}/api/auth/google/callback`;

  if (!clientId || !clientSecret) {
    return redirect(context.request, "/?authMessage=google_not_configured", {
      "set-cookie": expireStateCookie(context.request),
    });
  }

  const tokenResponse = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      grant_type: "authorization_code",
      redirect_uri: redirectUri,
    }),
  });

  if (!tokenResponse.ok) {
    return redirect(context.request, "/?authMessage=google_failed", {
      "set-cookie": expireStateCookie(context.request),
    });
  }

  const tokenData = await tokenResponse.json();
  const profileResponse = await fetch(GOOGLE_USERINFO_URL, {
    headers: { authorization: `Bearer ${tokenData.access_token}` },
  });

  if (!profileResponse.ok) {
    return redirect(context.request, "/?authMessage=google_failed", {
      "set-cookie": expireStateCookie(context.request),
    });
  }

  const profile = await profileResponse.json();
  const user = await upsertGoogleUser(getDb(context), profile);
  const session = await createSession(getDb(context), context.request, user.id);

  return redirect(context.request, next, {
    "set-cookie": [expireStateCookie(context.request), session.cookie],
  });
}

async function upsertGoogleUser(db, profile) {
  const googleSub = String(profile.sub || "");
  const email = String(profile.email || "").trim().toLowerCase();
  const emailVerifiedAt = profile.email_verified ? new Date().toISOString() : null;
  const displayName = normalizeUsername(profile.name) || email.split("@")[0] || "Google 사용자";

  if (!googleSub || !email) {
    throw new Error("Google profile is missing required fields");
  }

  let user = await db
    .prepare(
      `SELECT id, login_id, username, email, email_verified_at, bio, is_profile_public,
              profile_image_url, auth_provider
       FROM users
       WHERE google_sub = ? OR email = ?
       LIMIT 1`
    )
    .bind(googleSub, email)
    .first();

  if (user) {
    await db
      .prepare(
        `UPDATE users
         SET google_sub = ?, email_verified_at = COALESCE(email_verified_at, ?), auth_provider = ?
         WHERE id = ?`
      )
      .bind(googleSub, emailVerifiedAt, user.auth_provider === "password" ? "password_google" : "google", user.id)
      .run();

    return {
      ...user,
      google_sub: googleSub,
      email_verified_at: user.email_verified_at || emailVerifiedAt,
      auth_provider: user.auth_provider === "password" ? "password_google" : "google",
    };
  }

  const loginId = await createUniqueLoginId(db, googleSub);
  const username = await createUniqueUsername(db, displayName);
  const result = await db
    .prepare(
      `INSERT INTO users (login_id, email, username, password_hash, email_verified_at, google_sub, auth_provider)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(loginId, email, username, `oauth_google_${createRandomToken(24)}`, emailVerifiedAt, googleSub, "google")
    .run();

  return {
    id: result.meta.last_row_id,
    login_id: loginId,
      email,
      username,
      email_verified_at: emailVerifiedAt,
      bio: "",
      is_profile_public: 1,
      profile_image_url: "",
      auth_provider: "google",
  };
}

async function createUniqueLoginId(db, googleSub) {
  const base = `google_${googleSub.replace(/[^a-zA-Z0-9]/g, "").slice(0, 20)}`.padEnd(8, "0");

  for (let index = 0; index < 5; index += 1) {
    const loginId = index === 0 ? base : `${base}_${index}`;
    const existing = await db.prepare("SELECT id FROM users WHERE login_id = ? LIMIT 1").bind(loginId).first();

    if (!existing) {
      return loginId;
    }
  }

  return `google_${createRandomToken(8)}`;
}

async function createUniqueUsername(db, name) {
  const base = name.slice(0, 20) || "Google 사용자";

  for (let index = 0; index < 20; index += 1) {
    const username = index === 0 ? base : `${base}${index + 1}`;
    const existing = await db.prepare("SELECT id FROM users WHERE username = ? LIMIT 1").bind(username).first();

    if (!existing) {
      return username;
    }
  }

  return `${base}${Date.now().toString().slice(-4)}`;
}

function normalizeUsername(value) {
  return typeof value === "string" ? value.trim().replace(/\s+/g, " ").slice(0, 24) : "";
}

function getStoredState(request) {
  const raw = getCookie(request, STATE_COOKIE_NAME);

  if (!raw) {
    return {};
  }

  try {
    const parsed = JSON.parse(decodeURIComponent(raw));
    return {
      state: typeof parsed.state === "string" ? parsed.state : "",
      next: getSafeNext(parsed.next),
    };
  } catch {
    return {};
  }
}

function getSafeNext(value) {
  if (typeof value !== "string" || !value.startsWith("/")) {
    return "/";
  }

  if (value.startsWith("//") || value.includes("://")) {
    return "/";
  }

  return value;
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

function expireStateCookie(request) {
  const url = new URL(request.url);
  const attributes = [
    `${STATE_COOKIE_NAME}=`,
    "HttpOnly",
    "Path=/api/auth/google",
    "Max-Age=0",
    "SameSite=Lax",
  ];

  if (url.protocol === "https:") {
    attributes.push("Secure");
  }

  return attributes.join("; ");
}

function redirect(request, location, headers = {}) {
  const url = new URL(location, request.url);
  const responseHeaders = new Headers({ location: url.toString() });

  Object.entries(headers).forEach(([name, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => responseHeaders.append(name, item));
      return;
    }

    responseHeaders.set(name, value);
  });

  return new Response(null, {
    status: 302,
    headers: responseHeaders,
  });
}

export function onRequest() {
  return json({ message: "Not found" }, 404);
}
