import { getDb, json } from "../../auth/_shared.js";
import { requireAdmin } from "../_shared.js";
import { serializeAdminUser } from "./_shared.js";

export async function onRequestGet(context) {
  try {
    const admin = await requireAdmin(context);

    if (admin.response) {
      return admin.response;
    }

    const db = getDb(context);
    const { results } = await db
      .prepare(
        `SELECT users.id, users.login_id, users.email, users.username, users.role, users.status,
                users.blocked_reason, users.blocked_until, users.created_at,
                MAX(sessions.created_at) AS last_session_at
         FROM users
         LEFT JOIN sessions ON sessions.user_id = users.id
         GROUP BY users.id
         ORDER BY users.created_at DESC, users.id DESC
         LIMIT 200`
      )
      .all();

    return json({
      users: (results || []).map((user) => serializeAdminUser(user)),
      currentAdminRole: admin.user.role || "user",
    });
  } catch {
    return json({ message: "회원 목록을 불러오지 못했습니다." }, 500);
  }
}
