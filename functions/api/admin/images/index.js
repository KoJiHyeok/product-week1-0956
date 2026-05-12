import { getDb, json } from "../../auth/_shared.js";
import { serializeUploadedImage } from "../../images/_shared.js";
import { IMAGE_STATUSES, requireAdmin } from "../_shared.js";

export async function onRequestGet(context) {
  try {
    const admin = await requireAdmin(context);

    if (admin.response) {
      return admin.response;
    }

    const db = getDb(context);
    const url = new URL(context.request.url);
    const status = url.searchParams.get("status") || "pending";

    if (status !== "all" && !IMAGE_STATUSES.has(status)) {
      return json({ message: "이미지 상태가 올바르지 않습니다." }, 400);
    }

    const whereClause = status === "all" ? "" : "WHERE uploaded_images.status = ?";
    const statement = db.prepare(
      `SELECT uploaded_images.id, uploaded_images.uploader_user_id, uploaded_images.storage_key,
              uploaded_images.thumbnail_key, uploaded_images.alt_text, uploaded_images.source_type,
              uploaded_images.source_url, uploaded_images.author_name, uploaded_images.license_name,
              uploaded_images.attribution_required, uploaded_images.status, uploaded_images.moderation_reason,
              uploaded_images.report_count, uploaded_images.created_at, uploaded_images.reviewed_at,
              uploaded_images.reviewed_by, users.username, users.email AS uploader_email
       FROM uploaded_images
       LEFT JOIN users ON users.id = uploaded_images.uploader_user_id
       ${whereClause}
       ORDER BY uploaded_images.created_at DESC
       LIMIT 100`
    );
    const { results } = status === "all" ? await statement.all() : await statement.bind(status).all();

    return json({
      images: (results || []).map((row) => ({
        ...serializeUploadedImage(row),
        uploaderEmail: row.uploader_email || "",
      })),
    });
  } catch {
    return json({ message: "관리자 이미지 목록을 불러오지 못했습니다." }, 500);
  }
}
