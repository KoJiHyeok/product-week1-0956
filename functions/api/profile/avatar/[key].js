import { json } from "../../auth/_shared.js";

export async function onRequestGet(context) {
  try {
    if (!context.env.AVATARS) {
      return json({ message: "R2 AVATARS 바인딩이 필요합니다." }, 500);
    }

    const key = context.params.key;
    const object = await context.env.AVATARS.get(key);

    if (!object) {
      return json({ message: "이미지를 찾을 수 없습니다." }, 404);
    }

    return new Response(object.body, {
      headers: {
        "content-type": object.httpMetadata?.contentType || "application/octet-stream",
        "cache-control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return json({ message: "이미지를 불러오지 못했습니다." }, 500);
  }
}
