import { createRandomToken, json } from "./_shared.js";

export const STATE_COOKIE_NAME = "title_school_google_state";
const STATE_COOKIE_PATH = "/api/auth/google";
const STATE_MAX_AGE_SECONDS = 600;

export async function onRequestGet(context) {
  const { request, env } = context;

  if (!isGoogleConfigured(env)) {
    return googleAuthDisabled(request);
  }

  const state = createRandomToken(24);
  const redirectUri = getGoogleRedirectUri(request, env);
  const authorizeUrl = buildAuthorizeUrl(env, state, redirectUri);

  return new Response(null, {
    status: 302,
    headers: {
      location: authorizeUrl,
      "set-cookie": getStateCookieHeader(request, state),
      "cache-control": "no-store",
    },
  });
}

export function isGoogleConfigured(env) {
  return Boolean(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET);
}

export function getGoogleRedirectUri(request, env) {
  const origin = env.APP_ORIGIN || new URL(request.url).origin;
  return `${origin}/api/auth/google/callback`;
}

export function getExpiredGoogleStateCookieHeader(request) {
  return buildStateCookieHeader(request, "", 0);
}

function buildAuthorizeUrl(env, state, redirectUri) {
  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.searchParams.set("client_id", env.GOOGLE_CLIENT_ID);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "openid email profile");
  url.searchParams.set("state", state);
  url.searchParams.set("prompt", "select_account");

  return url.toString();
}

function getStateCookieHeader(request, state) {
  return buildStateCookieHeader(request, state, STATE_MAX_AGE_SECONDS);
}

function buildStateCookieHeader(request, state, maxAgeSeconds) {
  const url = new URL(request.url);
  const attributes = [
    `${STATE_COOKIE_NAME}=${state}`,
    "HttpOnly",
    `Path=${STATE_COOKIE_PATH}`,
    `Max-Age=${maxAgeSeconds}`,
    "SameSite=Lax",
  ];

  if (url.protocol === "https:") {
    attributes.push("Secure");
  }

  return attributes.join("; ");
}

function googleAuthDisabled(request) {
  return json(
    {
      error: "google_auth_disabled",
      message: "Google 로그인 기능은 현재 지원하지 않습니다.",
    },
    410,
    {
      "set-cookie": getExpiredGoogleStateCookieHeader(request),
    }
  );
}
