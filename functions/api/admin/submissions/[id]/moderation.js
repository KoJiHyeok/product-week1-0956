import { getDb, json, readJson } from "../../../auth/_shared.js";
import { logAdminAction, normalizeReason, requireAdmin } from "../../_shared.js";

const targetTypes = new Set(["submission", "comment"]);
const actions = new Set(["hide", "unhide", "delete", "exclude_ranking", "include_ranking"]);

export async function onRequestPatch(context) {
  try {
    const admin = await requireAdmin(context);

    if (admin.response) {
      return admin.response;
    }

    const id = Number(context.params.id);
    const body = await readJson(context.request);
    const targetType = String(body?.targetType || "submission").trim();
    const action = String(body?.action || "").trim();
    const reason = normalizeReason(body?.reason, 1000);

    if (!Number.isInteger(id) || !targetTypes.has(targetType) || !actions.has(action)) {
      return json({ message: "관리 대상 정보가 올바르지 않습니다." }, 400);
    }

    const db = getDb(context);
    const table = targetType === "comment" ? "comments" : "submissions";
    const target = await db.prepare(`SELECT id FROM ${table} WHERE id = ? LIMIT 1`).bind(id).first();

    if (!target) {
      return json({ message: "관리 대상을 찾을 수 없습니다." }, 404);
    }

    await updateModeration(db, table, id, action, reason);
    await logAdminAction(context, admin.user, action, targetType, id, getLogDescription(targetType, action, reason));

    return json({ updated: true });
  } catch {
    return json({ message: "콘텐츠 관리 상태를 저장하지 못했습니다." }, 500);
  }
}

async function updateModeration(db, table, id, action, reason) {
  if (action === "hide") {
    await db.prepare(`UPDATE ${table} SET hidden_at = CURRENT_TIMESTAMP, hidden_reason = ? WHERE id = ?`).bind(reason || null, id).run();
    return;
  }

  if (action === "unhide") {
    await db.prepare(`UPDATE ${table} SET hidden_at = NULL, hidden_reason = NULL WHERE id = ?`).bind(id).run();
    return;
  }

  if (action === "delete") {
    await db.prepare(`UPDATE ${table} SET deleted_at = CURRENT_TIMESTAMP, deleted_reason = ? WHERE id = ?`).bind(reason || null, id).run();
    return;
  }

  if (action === "exclude_ranking") {
    await db.prepare(`UPDATE ${table} SET excluded_from_ranking = 1 WHERE id = ?`).bind(id).run();
    return;
  }

  await db.prepare(`UPDATE ${table} SET excluded_from_ranking = 0 WHERE id = ?`).bind(id).run();
}

function getLogDescription(targetType, action, reason) {
  const targetLabel = targetType === "comment" ? "댓글" : "제목";
  const actionLabel = {
    hide: "숨김 처리",
    unhide: "숨김 해제",
    delete: "삭제 처리",
    exclude_ranking: "랭킹 제외",
    include_ranking: "랭킹 제외 해제",
  }[action];

  return `${targetLabel}을 ${actionLabel}했습니다.${reason ? ` 사유: ${reason}` : ""}`;
}
