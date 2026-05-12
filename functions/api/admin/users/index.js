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
        `SELECT id, email, username, role, status, created_at
         FROM users
         ORDER BY created_at DESC, id DESC
         LIMIT 200`
      )
      .all();

    return json({
      users: (results || []).map((user) => ({
        id: String(user.id),
        email: user.email || "",
        username: user.username || "",
        role: user.role || "user",
        status: normalizeUserStatus(user.status),
        createdAt: user.created_at || "",
      })),
      currentAdminRole: admin.user.role || "user",
    });
  } catch {
    return json({ message: "회원 목록을 불러오지 못했습니다." }, 500);
  }
}

function normalizeUserStatus(status) {
  return status === "blocked" || status === "suspended" ? "suspended" : "active";
}
