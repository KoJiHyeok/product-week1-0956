import { OWNER_EMAIL, getCurrentUser, getDb, json } from "../auth/_shared.js";

export const ADMIN_ROLES = new Set(["admin", "owner"]);
export const OWNER_ROLE = "owner";
export const USER_ROLE = "user";

export const IMAGE_STATUSES = new Set(["pending", "approved", "rejected", "deleted"]);
export const REPORT_STATUSES = new Set(["new", "reviewing", "resolved", "rejected"]);
export const INQUIRY_STATUSES = new Set(["new", "reviewing", "resolved", "ignored"]);
export const USER_STATUSES = new Set(["active", "suspended"]);

export function isAdminRole(role) {
  return ADMIN_ROLES.has(role);
}

export function isOwnerRole(role) {
  return role === OWNER_ROLE;
}

export function isProtectedOwnerUser(user) {
  return isOwnerRole(user?.role) || String(user?.email || "").toLowerCase() === OWNER_EMAIL;
}

export function requireOwnerUser(adminUser) {
  if (!isOwnerRole(adminUser?.role)) {
    return json({ message: "owner 권한이 필요합니다." }, 403);
  }

  return null;
}

export function normalizeUserStatus(status) {
  return status === "blocked" || status === "suspended" ? "suspended" : "active";
}

export function normalizeReason(value, maxLength = 500) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
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

export async function logAdminAction(context, adminUser, actionType, targetType, targetId, description = "") {
  try {
    const db = getDb(context);
    await db
      .prepare(
        `INSERT INTO admin_logs (id, admin_user_id, admin_email, action_type, target_type, target_id, description)
         VALUES (?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        crypto.randomUUID(),
        adminUser?.id || null,
        adminUser?.email || "",
        String(actionType || "").slice(0, 80),
        String(targetType || "").slice(0, 80),
        String(targetId || "").slice(0, 160),
        String(description || "").slice(0, 1000)
      )
      .run();
  } catch {
    // Admin actions must not fail when the log migration has not been applied yet.
  }
}
