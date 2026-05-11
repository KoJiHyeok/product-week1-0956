import { getDb, json } from "../../auth/_shared.js";
import { requireAdmin } from "../../images/_shared.js";

export async function onRequestGet(context) {
  try {
    const admin = await requireAdmin(context);

    if (admin.response) {
      return admin.response;
    }

    const db = getDb(context);
    const url = new URL(context.request.url);
    const status = url.searchParams.get("status") || "new";
    const { results } = await db
      .prepare(
        `SELECT reports.id, reports.target_type, reports.target_id, reports.reason, reports.detail,
                reports.status, reports.created_at, reports.reviewed_at,
                users.username AS reporter_username
         FROM reports
         LEFT JOIN users ON users.id = reports.reporter_user_id
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
      })),
    });
  } catch {
    return json({ message: "신고 목록을 불러오지 못했습니다." }, 500);
  }
}
