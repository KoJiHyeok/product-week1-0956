import { json } from "../auth/_shared.js";

const DIRECT_UPLOAD_DISABLED_MESSAGE = "이미지 직접 업로드 기능은 현재 비활성화되어 있습니다.";

export async function onRequest(context) {
  return json({ message: DIRECT_UPLOAD_DISABLED_MESSAGE }, 503);
}
