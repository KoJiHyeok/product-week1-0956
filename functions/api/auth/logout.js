import { deleteCurrentSession, getExpiredSessionCookieHeader, json } from "./_shared.js";

export async function onRequestPost(context) {
  await deleteCurrentSession(context);

  return json(
    {
      ok: true,
    },
    200,
    {
      "set-cookie": getExpiredSessionCookieHeader(context.request),
    }
  );
}
