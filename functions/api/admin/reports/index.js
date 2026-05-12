import { getDb, json } from "../../auth/_shared.js";
import { requireAdmin, REPORT_STATUSES } from "../_shared.js";

export async function onRequestGet(context) {
  try {
    const admin = await requireAdmin(context);

    if (admin.response) {
      return admin.response;
    }

    const db = getDb(context);
    const url = new URL(context.request.url);
    const status = url.searchParams.get("status") || "new";

    if (!REPORT_STATUSES.has(status)) {
      return json({ message: "신고 상태가 올바르지 않습니다." }, 400);
    }

    const { results } = await db
      .prepare(
        `SELECT reports.id, reports.target_type, reports.target_id, reports.reason, reports.detail,
                reports.status, reports.created_at, reports.reviewed_at,
                users.username AS reporter_username, users.email AS reporter_email,
                uploaded_images.id AS uploaded_image_id, uploaded_images.alt_text AS uploaded_image_alt,
                submissions.title AS submission_title, comments.text AS comment_text,
                comment_submissions.title AS comment_submission_title
         FROM reports
         LEFT JOIN users ON users.id = reports.reporter_user_id
         LEFT JOIN uploaded_images
           ON reports.target_type = 'photo'
          AND uploaded_images.id = CASE
            WHEN reports.target_id LIKE 'uploaded:%' THEN substr(reports.target_id, 10)
            ELSE reports.target_id
          END
         LEFT JOIN submissions
           ON reports.target_type = 'title'
          AND submissions.id = CAST(reports.target_id AS INTEGER)
         LEFT JOIN comments
           ON reports.target_type = 'comment'
          AND comments.id = CAST(reports.target_id AS INTEGER)
         LEFT JOIN submissions AS comment_submissions ON comment_submissions.id = comments.submission_id
         WHERE reports.status = ?
         ORDER BY reports.created_at DESC
         LIMIT 100`
      )
      .bind(status)
      .all();

    return json({
      reports: (results || []).map((report) => ({
        id: report.id,
        targetType: report.target_type,
        targetId: report.target_id,
        reason: report.reason,
        detail: report.detail || "",
        status: report.status,
        createdAt: report.created_at,
        reviewedAt: report.reviewed_at || "",
        reporter: report.reporter_username || "비회원",
        reporterEmail: report.reporter_email || "",
        targetTitle:
          report.uploaded_image_alt ||
          report.submission_title ||
          report.comment_submission_title ||
          (report.target_type === "photo" ? "정적 갤러리 사진" : "신고 대상"),
        targetSummary: report.comment_text || report.submission_title || report.uploaded_image_alt || "",
        targetImageSrc: report.uploaded_image_id ? `/api/images/file/${encodeURIComponent(report.uploaded_image_id)}` : "",
        targetUploadedImageId: report.uploaded_image_id || "",
      })),
    });
  } catch {
    return json({ message: "신고 목록을 불러오지 못했습니다." }, 500);
  }
}
