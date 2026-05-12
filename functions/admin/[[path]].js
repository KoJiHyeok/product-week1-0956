import { requireAdmin } from "../api/admin/_shared.js";

export async function onRequest(context) {
  const admin = await requireAdmin(context);

  if (admin.response) {
    const url = new URL(context.request.url);
    url.pathname = "/";
    url.search = "";
    url.hash = "";

    return Response.redirect(url.toString(), 302);
  }

  const url = new URL(context.request.url);
  url.pathname = "/";
  url.search = "";

  const response = await context.env.ASSETS.fetch(new Request(url, context.request));
  const headers = new Headers(response.headers);
  headers.set("cache-control", "no-store");

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
