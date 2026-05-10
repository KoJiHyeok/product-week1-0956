import { json } from "../../auth/_shared.js";
import { requireAdmin } from "../../images/_shared.js";

export async function onRequestGet(context) {
  try {
    const admin = await requireAdmin(context);

    if (admin.response) {
      return admin.response;
    }

    return json({
      images: [],
      uploadDisabled: true,
      message: "유저 직접 업로드는 비활성화되어 있습니다. 이미지는 관리자가 직접 추가합니다.",
    });
  } catch {
    return json({ message: "관리자 이미지 목록을 불러오지 못했습니다." }, 500);
  }
}
