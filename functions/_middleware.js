// pages.dev 중복 도메인 → 커스텀 도메인 301 (애드센스 중복 사이트/색인 분산 방지)
const CANONICAL_HOST = "jemokhakwon.com";

export async function onRequest(context) {
  const url = new URL(context.request.url);
  if (url.hostname.endsWith(".pages.dev")) {
    const method = context.request.method.toUpperCase();
    if (method === "GET" || method === "HEAD") {
      url.hostname = CANONICAL_HOST;
      return Response.redirect(url.toString(), 301);
    }
  }
  return context.next();
}
