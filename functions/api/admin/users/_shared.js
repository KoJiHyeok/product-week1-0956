import { getDb, json } from "../../auth/_shared.js";
import { isOwnerRole, isProtectedOwnerUser, logAdminAction, normalizeReason, normalizeUserStatus, requireOwnerUser, USER_STATUSES } from "../_shared.js";

export async function getAdminTargetUser(db, userId) {
  return db
    .prepare(
      `SELECT id, login_id, email, username, role, status, blocked_reason, blocked_until, created_at
       FROM users
       WHERE id = ?
       LIMIT 1`
    )
    .bind(userId)
    .first();
}

export function serializeAdminUser(user, lastSessionAt = "") {
  return {
    id: String(user.id),
    email: user.email || "",
    loginId: user.login_id || "",
    username: user.username || "",
    role: user.role || "user",
    status: normalizeUserStatus(user.status),
    blockedReason: user.blocked_reason || "",
    blockedUntil: user.blocked_until || "",
    createdAt: user.created_at || "",
    lastSessionAt: lastSessionAt || user.last_session_at || "",
  };
}

export async function updateUserStatus(context, adminUser, userId, { status, reason = "", blockedUntil = "" }) {
  if (!Number.isInteger(userId) || !USER_STATUSES.has(status)) {
    return { response: json({ message: "회원 상태값이 올바르지 않습니다." }, 400) };
  }

  if (userId === adminUser.id) {
    return { response: json({ message: "자기 자신은 정지할 수 없습니다." }, 403) };
  }

  const db = getDb(context);
  const target = await getAdminTargetUser(db, userId);

  if (!target) {
    return { response: json({ message: "회원을 찾을 수 없습니다." }, 404) };
  }

  if (isProtectedOwnerUser(target) && !isOwnerRole(adminUser.role)) {
    return { response: json({ message: "owner 계정은 admin이 정지할 수 없습니다." }, 403) };
  }

  if (status === "suspended") {
    const safeReason = normalizeReason(reason, 500) || "관리자에 의해 계정이 정지되었습니다.";
    const safeBlockedUntil = normalizeReason(blockedUntil, 80) || null;
    const restrictionId = crypto.randomUUID();

    await db
      .prepare("UPDATE users SET status = 'suspended', blocked_reason = ?, blocked_until = ? WHERE id = ?")
      .bind(safeReason, safeBlockedUntil, userId)
      .run();
    await db
      .prepare(
        `INSERT INTO user_restrictions (id, user_id, restriction_type, reason, expires_at, created_by)
         VALUES (?, ?, 'write', ?, ?, ?)`
      )
      .bind(restrictionId, userId, safeReason, safeBlockedUntil, adminUser.id)
      .run();
    await logAdminAction(context, adminUser, "suspend", "user", userId, safeReason);
  } else {
    await db.prepare("DELETE FROM user_restrictions WHERE user_id = ?").bind(userId).run();
    await db.prepare("UPDATE users SET status = 'active', blocked_reason = NULL, blocked_until = NULL WHERE id = ?").bind(userId).run();
    await logAdminAction(context, adminUser, "unsuspend", "user", userId, "회원 정지를 해제했습니다.");
  }

  const updated = await getAdminTargetUser(db, userId);
  return { response: null, user: serializeAdminUser(updated) };
}

export async function updateUserRole(context, adminUser, userId, { role }) {
  const ownerResponse = requireOwnerUser(adminUser);

  if (ownerResponse) {
    return { response: ownerResponse };
  }

  if (!Number.isInteger(userId) || !["user", "admin"].includes(role)) {
    return { response: json({ message: "회원 role 값이 올바르지 않습니다." }, 400) };
  }

  if (userId === adminUser.id) {
    return { response: json({ message: "자기 자신의 role은 이 화면에서 변경할 수 없습니다." }, 403) };
  }

  const db = getDb(context);
  const target = await getAdminTargetUser(db, userId);

  if (!target) {
    return { response: json({ message: "회원을 찾을 수 없습니다." }, 404) };
  }

  if (isProtectedOwnerUser(target)) {
    return { response: json({ message: "owner 계정의 role은 변경할 수 없습니다." }, 403) };
  }

  await db.prepare("UPDATE users SET role = ? WHERE id = ?").bind(role, userId).run();
  await logAdminAction(context, adminUser, "update_role", "user", userId, `${target.username || userId} role을 ${role}(으)로 변경했습니다.`);

  const updated = await getAdminTargetUser(db, userId);
  return { response: null, user: serializeAdminUser(updated) };
}
