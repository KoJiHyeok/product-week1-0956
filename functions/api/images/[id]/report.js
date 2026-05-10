import { getCurrentUser, getDb, json, readJson } from "../../auth/_shared.js";
import { sanitizeLongText, validateReportReason } from "../_shared.js";

const reportCookieName = "title_school_reporter";

export async function onRequestPost(context) {
  try {
    const db = getDb(context);
    const user = await getCurrentUser(context);
    const imageId = String(context.params.id || "");
    const body = await readJson(context.request);
    const reason = validateReportReason(String(body?.reason || ""));
    const detail = sanitizeLongText(body?.detail, 1000);

    if (!reason) {
      return json({ message: "신고 사유를 선택하세요." }, 400);
    }

    const image = await db
      .prepare("SELECT id, status FROM uploaded_images WHERE id = ? AND status IN ('approved', 'hidden') LIMIT 1")
      .bind(imageId)
      .first();

    if (!image) {
      return json({ message: "신고할 수 있는 이미지를 찾을 수 없습니다." }, 404);
    }

    const reporter = getReporter(context.request);
    const reportId = crypto.randomUUID();

    try {
      await db
        .prepare(
          `INSERT INTO image_reports (id, image_id, reporter_user_id, reporter_fingerprint, reason, detail)
           VALUES (?, ?, ?, ?, ?, ?)`
        )
        .bind(reportId, imageId, user?.id || null, user ? null : reporter.value, reason, detail || null)
        .run();
    } catch {
      return json({ message: "이미 신고한 사진입니다." }, 409, reporter.cookie ? { "set-cookie": reporter.cookie } : {});
    }

    const count = await db
      .prepare("SELECT COUNT(*) AS report_count FROM image_reports WHERE image_id = ?")
      .bind(imageId)
      .first();
    const reportCount = Number(count?.report_count) || 0;

    await db
      .prepare(
        `UPDATE uploaded_images
         SET report_count = ?, status = CASE WHEN ? >= 3 AND status = 'approved' THEN 'hidden' ELSE status END
         WHERE id = ?`
      )
      .bind(reportCount, reportCount, imageId)
      .run();

    return json(
      {
        message: reportCount >= 3 ? "신고가 접수되어 해당 사진이 임시 비공개 처리되었습니다." : "신고가 접수되었습니다.",
        reportCount,
        hidden: reportCount >= 3,
      },
      201,
      reporter.cookie ? { "set-cookie": reporter.cookie } : {}
    );
  } catch {
    return json({ message: "신고를 접수하지 못했습니다." }, 500);
  }
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
