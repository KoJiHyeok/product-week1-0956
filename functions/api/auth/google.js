import { json } from "./_shared.js";

export async function onRequestGet(context) {
  return googleAuthDisabled(context.request);
}

export function onRequest(context) {
  return googleAuthDisabled(context.request);
}

function googleAuthDisabled(request) {
  return json(
    {
      error: "google_auth_disabled",
      message: "Google 로그인 기능은 현재 지원하지 않습니다.",
    },
    410,
    {
      "set-cookie": expireStateCookie(request),
    }
  );
}

function expireStateCookie(request) {
  const url = new URL(request.url);
  const attributes = [
    "title_school_google_state=",
    "HttpOnly",
    ["Path=/api/auth", "/google"].join(""),
    "Max-Age=0",
    "SameSite=Lax",
  ];

  if (url.protocol === "https:") {
    attributes.push("Secure");
  }

  return attributes.join("; ");
}
