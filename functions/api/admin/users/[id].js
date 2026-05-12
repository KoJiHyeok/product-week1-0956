import { json, readJson } from "../../auth/_shared.js";
import { requireAdmin } from "../_shared.js";
import { updateUserRole, updateUserStatus } from "./_shared.js";

export async function onRequestPatch(context) {
  try {
    const admin = await requireAdmin(context);

    if (admin.response) {
      return admin.response;
    }

    const userId = Number(context.params.id);
    const body = await readJson(context.request);
    const changes = [];
    let user = null;

    if (typeof body?.status === "string" && body.status.trim()) {
      const result = await updateUserStatus(context, admin.user, userId, {
        status: body.status.trim(),
        reason: body.reason,
        blockedUntil: body.blockedUntil,
      });

      if (result.response) {
        return result.response;
      }

      user = result.user;
      changes.push(`status=${user.status}`);
    }

    if (typeof body?.role === "string" && body.role.trim()) {
      const result = await updateUserRole(context, admin.user, userId, { role: body.role.trim() });

      if (result.response) {
        return result.response;
      }

      user = result.user;
      changes.push(`role=${user.role}`);
    }

    if (!changes.length) {
      return json({ message: "변경할 회원 정보가 없습니다." }, 400);
    }

    return json({ updated: true, user, changes });
  } catch {
    return json({ message: "회원 정보를 저장하지 못했습니다." }, 500);
  }
}
