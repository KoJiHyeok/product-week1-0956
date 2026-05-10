import { getDb, json } from "../../auth/_shared.js";
import { requireAdmin, serializeUploadedImage, validateImageStatus } from "../../images/_shared.js";

export async function onRequestGet(context) {
  try {
    const admin = await requireAdmin(context);

    if (admin.response) {
      return admin.response;
    }

    const db = getDb(context);
    const url = new URL(context.request.url);
    const status = String(url.searchParams.get("status") || "pending");
    const query =
      status === "reported"
        ? `SELECT uploaded_images.*, users.username
           FROM uploaded_images
           LEFT JOIN users ON users.id = uploaded_images.uploader_user_id
           WHERE uploaded_images.status != 'removed'
             AND (uploaded_images.report_count > 0 OR uploaded_images.status = 'hidden')
           ORDER BY uploaded_images.report_count DESC, uploaded_images.created_at DESC`
        : `SELECT uploaded_images.*, users.username
           FROM uploaded_images
           LEFT JOIN users ON users.id = uploaded_images.uploader_user_id
           WHERE uploaded_images.status = ?
           ORDER BY uploaded_images.created_at DESC`;

    const result =
      status === "reported"
        ? await db.prepare(query).all()
        : await db.prepare(query).bind(validateImageStatus(status, "pending")).all();

    return json({ images: (result.results || []).map(serializeUploadedImage) });
  } catch {
    return json({ message: "관리자 이미지 목록을 불러오지 못했습니다." }, 500);
  }
}
