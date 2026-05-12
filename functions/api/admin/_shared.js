import { getCurrentUser, getDb, json } from "../auth/_shared.js";

export const ADMIN_ROLES = new Set(["admin", "owner"]);
export const OWNER_ROLE = "owner";
export const USER_ROLE = "user";

export const IMAGE_STATUSES = new Set(["pending", "approved", "rejected", "deleted"]);
export const REPORT_STATUSES = new Set(["new", "reviewing", "resolved", "rejected"]);
export const INQUIRY_STATUSES = new Set(["new", "reviewing", "resolved", "ignored"]);

export function isAdminRole(role) {
  return ADMIN_ROLES.has(role);
}

export function isOwnerRole(role) {
  return role === OWNER_ROLE;
}

export async function requireAdmin(context) {
  const user = await getCurrentUser(context);

  if (!user) {
    return { response: json({ message: "로그인이 필요합니다." }, 401), user: null };
  }

  if (await isAdminUser(context, user)) {
    return { response: null, user };
  }

  return { response: json({ message: "관리자 권한이 필요합니다." }, 403), user };
}

export async function isAdminUser(context, user) {
  if (!user) {
    return false;
  }

  if (isAdminRole(user.role)) {
    return true;
  }

  try {
    const db = getDb(context);
    const row = await db.prepare("SELECT role FROM users WHERE id = ? LIMIT 1").bind(user.id).first();
    return isAdminRole(row?.role);
  } catch {
    return false;
  }
}
