import { getDb, json, readJson } from "../../auth/_shared.js";
import { isOwnerRole, logAdminAction, requireAdmin, USER_STATUSES } from "../_shared.js";

const editableRoles = new Set(["user", "admin"]);

export async function onRequestPatch(context) {
  try {
    const admin = await requireAdmin(context);

    if (admin.response) {
      return admin.response;
    }

    const userId = Number(context.params.id);

    if (!Number.isInteger(userId)) {
      return json({ message: "회원 정보가 올바르지 않습니다." }, 400);
    }

    if (userId === admin.user.id) {
      return json({ message: "현재 로그인한 관리자 계정은 이 화면에서 수정할 수 없습니다." }, 403);
    }

    const body = await readJson(context.request);
    const nextStatus = typeof body?.status === "string" ? body.status.trim() : "";
    const nextRole = typeof body?.role === "string" ? body.role.trim() : "";

    if (!nextStatus && !nextRole) {
      return json({ message: "변경할 회원 정보가 없습니다." }, 400);
    }

    if (nextStatus && !USER_STATUSES.has(nextStatus)) {
      return json({ message: "회원 상태값이 올바르지 않습니다." }, 400);
    }

    if (nextRole && !editableRoles.has(nextRole)) {
      return json({ message: "회원 role 값이 올바르지 않습니다." }, 400);
    }

    const db = getDb(context);
    const target = await db
      .prepare("SELECT id, email, username, role, status FROM users WHERE id = ? LIMIT 1")
      .bind(userId)
      .first();

    if (!target) {
      return json({ message: "회원을 찾을 수 없습니다." }, 404);
    }

    const adminIsOwner = isOwnerRole(admin.user.role);

    if (isOwnerRole(target.role) && !adminIsOwner) {
      return json({ message: "owner 계정은 admin이 수정할 수 없습니다." }, 403);
    }

    if (nextRole && !adminIsOwner) {
      return json({ message: "role 변경은 owner만 할 수 있습니다." }, 403);
    }

    if (nextRole === "admin" && !adminIsOwner) {
      return json({ message: "admin role 부여는 owner만 할 수 있습니다." }, 403);
    }

    const nextValues = {
      role: nextRole || target.role || "user",
      status: nextStatus || normalizeUserStatus(target.status),
    };

    await db
      .prepare(
        `UPDATE users
         SET role = ?, status = ?, blocked_reason = CASE WHEN ? = 'active' THEN NULL ELSE blocked_reason END,
             blocked_until = CASE WHEN ? = 'active' THEN NULL ELSE blocked_until END
         WHERE id = ?`
      )
      .bind(nextValues.role, nextValues.status, nextValues.status, nextValues.status, userId)
      .run();

    const changes = [];

    if (nextRole) {
      changes.push(`role=${nextRole}`);
      await logAdminAction(context, admin.user, "update_role", "user", userId, `${target.username || userId} role을 ${nextRole}(으)로 변경했습니다.`);
    }

    if (nextStatus) {
      changes.push(`status=${nextStatus}`);
      await logAdminAction(context, admin.user, "update_status", "user", userId, `${target.username || userId} 상태를 ${nextStatus}(으)로 변경했습니다.`);
    }

    return json({
      updated: true,
      user: {
        id: String(target.id),
        email: target.email || "",
        username: target.username || "",
        role: nextValues.role,
        status: nextValues.status,
      },
      changes,
    });
  } catch {
    return json({ message: "회원 정보를 저장하지 못했습니다." }, 500);
  }
}

function normalizeUserStatus(status) {
  return status === "blocked" || status === "suspended" ? "suspended" : "active";
}
