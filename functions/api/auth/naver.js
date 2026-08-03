import { createRandomToken, json } from "./_shared.js";

const STATE_COOKIE_NAME = "title_school_naver_state";
const STATE_COOKIE_PATH = "/api/auth/naver";
const STATE_MAX_AGE_SECONDS = 600;

export async function onRequestGet(context) {
  const { env, request } = context;

  if (!env.NAVER_CLIENT_ID || !env.NAVER_CLIENT_SECRET) {
    return naverAuthDisabled();
  }

  const state = createRandomToken(24);
  const redirectUri = getRedirectUri(context);
  const authorizeUrl = new URL("https://nid.naver.com/oauth2.0/authorize");
  authorizeUrl.searchParams.set("response_type", "code");
  authorizeUrl.searchParams.set("client_id", env.NAVER_CLIENT_ID);
  authorizeUrl.searchParams.set("redirect_uri", redirectUri);
  authorizeUrl.searchParams.set("state", state);

  return new Response(null, {
    status: 302,
    headers: {
      location: authorizeUrl.toString(),
      "set-cookie": getStateCookieHeader(request, state),
    },
  });
}

export function onRequest(context) {
  return json({ message: "Not found" }, 404);
}

function naverAuthDisabled() {
  return json(
    {
      error: "naver_auth_disabled",
      message: "네이버 로그인 기능은 현재 지원하지 않습니다.",
    },
    410
  );
}

function getRedirectUri(context) {
  const origin = context.env.APP_ORIGIN || new URL(context.request.url).origin;
  return `${origin}/api/auth/naver/callback`;
}

function getStateCookieHeader(request, state) {
  const url = new URL(request.url);
  const attributes = [
    `${STATE_COOKIE_NAME}=${state}`,
    "HttpOnly",
    `Path=${STATE_COOKIE_PATH}`,
    `Max-Age=${STATE_MAX_AGE_SECONDS}`,
    "SameSite=Lax",
  ];

  if (url.protocol === "https:") {
    attributes.push("Secure");
  }

  return attributes.join("; ");
}
