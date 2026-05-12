import { getDb, json } from "../../auth/_shared.js";
import { INQUIRY_STATUSES, requireAdmin } from "../_shared.js";

export async function onRequestGet(context) {
  try {
    const admin = await requireAdmin(context);

    if (admin.response) {
      return admin.response;
    }

    const url = new URL(context.request.url);
    const status = url.searchParams.get("status") || "new";

    if (status !== "all" && !INQUIRY_STATUSES.has(status)) {
      return json({ message: "문의 상태가 올바르지 않습니다." }, 400);
    }

    const db = getDb(context);
    const whereClause = status === "all" ? "" : "WHERE contact_inquiries.status = ?";
    const statement = db.prepare(
      `SELECT contact_inquiries.id, contact_inquiries.user_id, contact_inquiries.type,
              contact_inquiries.title, contact_inquiries.reply_email, contact_inquiries.body,
              contact_inquiries.status, contact_inquiries.created_at, contact_inquiries.reviewed_at,
              users.username, users.email AS user_email
       FROM contact_inquiries
       LEFT JOIN users ON users.id = contact_inquiries.user_id
       ${whereClause}
       ORDER BY contact_inquiries.created_at DESC
       LIMIT 100`
    );
    const { results } = status === "all" ? await statement.all() : await statement.bind(status).all();

    return json({
      inquiries: (results || []).map((inquiry) => ({
        id: inquiry.id,
        type: inquiry.type,
        title: inquiry.title,
        body: inquiry.body,
        replyEmail: inquiry.reply_email || "",
        status: inquiry.status || "new",
        createdAt: inquiry.created_at,
        reviewedAt: inquiry.reviewed_at || "",
        user: inquiry.username || "비회원",
        userEmail: inquiry.user_email || "",
      })),
    });
  } catch {
    return json({ message: "문의 목록을 불러오지 못했습니다." }, 500);
  }
}
