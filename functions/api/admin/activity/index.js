import { getDb, json } from "../../auth/_shared.js";
import { requireAdmin } from "../_shared.js";

export async function onRequestGet(context) {
  try {
    const admin = await requireAdmin(context);

    if (admin.response) {
      return admin.response;
    }

    const db = getDb(context);
    const { results } = await db
      .prepare(
        `SELECT id, admin_user_id, admin_email, action_type, target_type, target_id, description, created_at
         FROM admin_logs
         ORDER BY created_at DESC
         LIMIT 100`
      )
      .all();

    return json({
      logs: (results || []).map((log) => ({
        id: log.id,
        adminUserId: log.admin_user_id ? String(log.admin_user_id) : "",
        adminEmail: log.admin_email || "",
        actionType: log.action_type,
        targetType: log.target_type,
        targetId: log.target_id,
        description: log.description || "",
        createdAt: log.created_at,
      })),
    });
  } catch {
    return json({ message: "관리자 활동 로그를 불러오지 못했습니다." }, 500);
  }
}
