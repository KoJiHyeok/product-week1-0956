import { getDb, json, readJson } from "../../auth/_shared.js";
import { INQUIRY_STATUSES, logAdminAction, requireAdmin } from "../_shared.js";

export async function onRequestPatch(context) {
  try {
    const admin = await requireAdmin(context);

    if (admin.response) {
      return admin.response;
    }

    const body = await readJson(context.request);
    const status = String(body?.status || "").trim();

    if (!INQUIRY_STATUSES.has(status)) {
      return json({ message: "문의 상태가 올바르지 않습니다." }, 400);
    }

    const inquiryId = String(context.params.id || "");
    const db = getDb(context);
    const result = await db
      .prepare(
        `UPDATE contact_inquiries
         SET status = ?, reviewed_at = CURRENT_TIMESTAMP, reviewed_by = ?
         WHERE id = ?`
      )
      .bind(status, admin.user.id, inquiryId)
      .run();

    if (!result.meta.changes) {
      return json({ message: "문의를 찾을 수 없습니다." }, 404);
    }

    await logAdminAction(context, admin.user, "update_status", "inquiry", inquiryId, `문의 상태를 ${status}(으)로 변경했습니다.`);

    return json({ updated: true });
  } catch {
    return json({ message: "문의 상태를 저장하지 못했습니다." }, 500);
  }
}
