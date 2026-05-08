import { createRandomToken, json } from "./_shared.js";

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const STATE_COOKIE_NAME = "title_school_google_state";

export async function onRequestGet(context) {
  const clientId = context.env.GOOGLE_OAUTH_CLIENT_ID;
  const redirectUri = context.env.GOOGLE_OAUTH_REDIRECT_URI || `${new URL(context.request.url).origin}/api/auth/google/callback`;
  const next = getSafeNext(new URL(context.request.url).searchParams.get("next"));

  if (!clientId) {
    return redirect(context.request, `/?authMessage=google_not_configured${next ? `#${next.replace(/^#/, "")}` : ""}`);
  }

  const state = createRandomToken(24);
  const authUrl = new URL(GOOGLE_AUTH_URL);
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", "openid email profile");
  authUrl.searchParams.set("state", state);
  authUrl.searchParams.set("prompt", "select_account");

  return redirect(context.request, authUrl.toString(), {
    "set-cookie": getStateCookie(context.request, state, next),
  });
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

function getStateCookie(request, state, next) {
  const url = new URL(request.url);
  const attributes = [
    `${STATE_COOKIE_NAME}=${encodeURIComponent(JSON.stringify({ state, next }))}`,
    "HttpOnly",
    "Path=/api/auth/google",
    "Max-Age=600",
    "SameSite=Lax",
  ];

  if (url.protocol === "https:") {
    attributes.push("Secure");
  }

  return attributes.join("; ");
}

function redirect(request, location, headers = {}) {
  const url = new URL(location, request.url);
  return new Response(null, {
    status: 302,
    headers: {
      location: url.toString(),
      ...headers,
    },
  });
}

export function onRequest() {
  return json({ message: "Not found" }, 404);
}
