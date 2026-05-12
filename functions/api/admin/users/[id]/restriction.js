import { getDb, json, readJson } from "../../../auth/_shared.js";
import { requireAdmin } from "../../_shared.js";

const validTypes = new Set(["write", "upload", "message"]);

export async function onRequestPatch(context) {
  try {
    const admin = await requireAdmin(context);

    if (admin.response) {
      return admin.response;
    }

    const body = await readJson(context.request);
    const restrictionType = String(body?.restrictionType || "write").trim();
    const reason = normalizeText(body?.reason, 500);
    const expiresAt = normalizeText(body?.expiresAt, 80) || null;
    const userId = Number(context.params.id);

    if (!Number.isInteger(userId) || !validTypes.has(restrictionType)) {
      return json({ message: "제한 정보가 올바르지 않습니다." }, 400);
    }

    const db = getDb(context);
    const id = crypto.randomUUID();
    await db
      .prepare(
        `INSERT INTO user_restrictions (id, user_id, restriction_type, reason, expires_at, created_by)
         VALUES (?, ?, ?, ?, ?, ?)`
      )
      .bind(id, userId, restrictionType, reason || null, expiresAt, admin.user.id)
      .run();

    await db
      .prepare("UPDATE users SET status = 'blocked', blocked_reason = ?, blocked_until = ? WHERE id = ?")
      .bind(reason || null, expiresAt, userId)
      .run();

    return json({ restricted: true, id });
  } catch {
    return json({ message: "사용자 제한을 저장하지 못했습니다." }, 500);
  }
}

export async function onRequestDelete(context) {
  try {
    const admin = await requireAdmin(context);

    if (admin.response) {
      return admin.response;
    }

    const userId = Number(context.params.id);

    if (!Number.isInteger(userId)) {
      return json({ message: "회원 정보가 올바르지 않습니다." }, 400);
    }

    const db = getDb(context);
    await db.prepare("DELETE FROM user_restrictions WHERE user_id = ?").bind(userId).run();
    await db
      .prepare("UPDATE users SET status = 'active', blocked_reason = NULL, blocked_until = NULL WHERE id = ?")
      .bind(userId)
      .run();

    return json({ restricted: false });
  } catch {
    return json({ message: "사용자 제한 해제에 실패했습니다." }, 500);
  }
}

function normalizeText(value, maxLength) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}
