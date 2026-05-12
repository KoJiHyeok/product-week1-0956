import { ensureUserCanWrite, getCurrentUser, getDb, json, readJson } from "../auth/_shared.js";
import { sanitizeLongText } from "../images/_shared.js";

const reportCookieName = "title_school_content_reporter";
const validTargetTypes = new Set(["photo", "title", "comment"]);
const validReasons = new Set(["copyright", "portrait", "privacy", "sexual_violent", "hate", "abuse", "other"]);

export async function onRequestPost(context) {
  try {
    const db = getDb(context);
    const user = await getCurrentUser(context);
    const body = await readJson(context.request);
    const targetType = String(body?.targetType || "").trim();
    const targetId = String(body?.targetId || "").trim();
    const reason = String(body?.reason || "").trim();
    const detail = sanitizeLongText(body?.detail, 1000);

    if (!validTargetTypes.has(targetType) || !targetId) {
      return json({ message: "신고 대상이 올바르지 않습니다." }, 400);
    }

    if (!validReasons.has(reason)) {
      return json({ message: "신고 사유를 선택하세요." }, 400);
    }

    const restrictionResponse = await ensureUserCanWrite(context, user, "write");

    if (restrictionResponse) {
      return restrictionResponse;
    }

    if (!(await targetExists(db, targetType, targetId))) {
      return json({ message: "신고할 대상을 찾을 수 없습니다." }, 404);
    }

    const reporter = getReporter(context.request);
    const reportId = crypto.randomUUID();

    try {
      await db
        .prepare(
          `INSERT INTO reports (id, target_type, target_id, reporter_user_id, reporter_fingerprint, reason, detail)
           VALUES (?, ?, ?, ?, ?, ?, ?)`
        )
        .bind(reportId, targetType, targetId, user?.id || null, user ? null : reporter.value, reason, detail || null)
        .run();
    } catch {
      return json({ message: "이미 신고한 대상입니다." }, 409, reporter.cookie ? { "set-cookie": reporter.cookie } : {});
    }

    const count = await db
      .prepare("SELECT COUNT(*) AS report_count FROM reports WHERE target_type = ? AND target_id = ? AND status = 'new'")
      .bind(targetType, targetId)
      .first();
    const reportCount = Number(count?.report_count) || 0;

    return json(
      {
        message: reportCount >= 3 ? "신고가 접수되었습니다. 관리자 검토 대상으로 표시됩니다." : "신고가 접수되었습니다.",
        reportCount,
        reviewRequired: reportCount >= 3,
      },
      201,
      reporter.cookie ? { "set-cookie": reporter.cookie } : {}
    );
  } catch {
    return json({ message: "신고를 접수하지 못했습니다." }, 500);
  }
}

async function targetExists(db, targetType, targetId) {
  if (targetType === "title") {
    const row = await db
      .prepare(
        `SELECT id
         FROM submissions
         WHERE id = ?
           AND hidden_at IS NULL
           AND deleted_at IS NULL
           AND excluded_from_ranking = 0
         LIMIT 1`
      )
      .bind(Number(targetId))
      .first();
    return Boolean(row);
  }

  if (targetType === "comment") {
    const row = await db
      .prepare("SELECT id FROM comments WHERE id = ? AND hidden_at IS NULL AND deleted_at IS NULL LIMIT 1")
      .bind(Number(targetId))
      .first();
    return Boolean(row);
  }

  if (targetType === "photo") {
    if (!targetId.startsWith("uploaded:")) {
      return true;
    }

    const row = await db
      .prepare("SELECT id FROM uploaded_images WHERE id = ? AND status = 'approved' LIMIT 1")
      .bind(targetId.slice("uploaded:".length))
      .first();
    return Boolean(row);
  }

  return false;
}

function getReporter(request) {
  const existing = getCookie(request, reportCookieName);

  if (existing) {
    return { value: existing, cookie: "" };
  }

  const value = crypto.randomUUID();
  const url = new URL(request.url);
  const attributes = [
    `${reportCookieName}=${value}`,
    "HttpOnly",
    "Path=/",
    "Max-Age=31536000",
    "SameSite=Lax",
  ];

  if (url.protocol === "https:") {
    attributes.push("Secure");
  }

  return { value, cookie: attributes.join("; ") };
}

function getCookie(request, name) {
  const cookie = request.headers.get("cookie") || "";
  return cookie
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${name}=`))
    ?.slice(name.length + 1) || "";
}
