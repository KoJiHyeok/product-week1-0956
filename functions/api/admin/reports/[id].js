import { getDb, json, readJson } from "../../auth/_shared.js";
import { requireAdmin, REPORT_STATUSES } from "../_shared.js";

export async function onRequestPatch(context) {
  try {
    const admin = await requireAdmin(context);

    if (admin.response) {
      return admin.response;
    }

    const body = await readJson(context.request);
    const status = String(body?.status || "").trim();

    if (!REPORT_STATUSES.has(status)) {
      return json({ message: "처리 상태가 올바르지 않습니다." }, 400);
    }

    const db = getDb(context);
    await db
      .prepare("UPDATE reports SET status = ?, reviewed_at = CURRENT_TIMESTAMP, reviewed_by = ? WHERE id = ?")
      .bind(status, admin.user.id, String(context.params.id || ""))
      .run();

    return json({ updated: true });
  } catch {
    return json({ message: "신고 상태를 저장하지 못했습니다." }, 500);
  }
}
