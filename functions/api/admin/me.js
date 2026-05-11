import { json, publicUser } from "../auth/_shared.js";
import { requireAdmin } from "../images/_shared.js";

export async function onRequestGet(context) {
  try {
    const admin = await requireAdmin(context);

    if (admin.response) {
      return admin.response;
    }

    return json({ user: publicUser(admin.user) });
  } catch {
    return json({ message: "관리자 정보를 확인하지 못했습니다." }, 500);
  }
}
