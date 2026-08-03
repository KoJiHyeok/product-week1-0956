import { json } from "./_shared.js";

export function onRequestGet(context) {
  const { env } = context;

  return json({
    google: Boolean(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET),
    naver: Boolean(env.NAVER_CLIENT_ID && env.NAVER_CLIENT_SECRET),
  });
}
