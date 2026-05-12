const ADMIN_SUMMARY_SUBJECT = "[제목 학원] 일일 신고/문의 요약";
const ADMIN_URL = "https://jemokhakwon.com/admin";
const DEFAULT_SUMMARY_TO = "wlgur2101@gmail.com";

export async function buildDailyAdminSummary(env, scheduledTime = Date.now()) {
  const db = getDb(env);
  const period = getRecent24HourPeriod(scheduledTime);
  const [reportCounts, inquiryCounts] = await Promise.all([
    countByStatus(db, "reports", ["new", "reviewing", "resolved", "rejected"], period),
    countByStatus(db, "contact_inquiries", ["new", "reviewing", "resolved", "ignored"], period),
  ]);
  const reportTotal = sumCounts(reportCounts);
  const inquiryTotal = sumCounts(inquiryCounts);

  return {
    summaryDate: period.summaryDate,
    period,
    reportCounts,
    inquiryCounts,
    reportTotal,
    inquiryTotal,
    subject: ADMIN_SUMMARY_SUBJECT,
    text: buildSummaryText({ period, reportCounts, inquiryCounts, reportTotal, inquiryTotal }),
  };
}

export async function sendDailyAdminSummary({ env, scheduledTime = Date.now(), dryRun = false, force = false } = {}) {
  const summary = await buildDailyAdminSummary(env, scheduledTime);
  const sentTo = getSummaryRecipient(env);

  if (dryRun) {
    return { sent: false, dryRun: true, sentTo, summary };
  }

  const existing = await findExistingSummary(env.DB, summary.summaryDate, sentTo);

  if (existing && !force) {
    return { sent: false, skipped: true, reason: "already_sent", sentTo, summary };
  }

  const logId = crypto.randomUUID();
  await insertSummaryLog(env.DB, {
    id: logId,
    summaryDate: summary.summaryDate,
    sentTo,
    reportCount: summary.reportTotal,
    inquiryCount: summary.inquiryTotal,
    status: "pending",
    errorMessage: "",
  });

  try {
    await sendSummaryEmail(env, sentTo, summary);
    await updateSummaryLog(env.DB, logId, "sent", "");
    return { sent: true, skipped: false, sentTo, summary };
  } catch (error) {
    const message = error instanceof Error ? error.message : "요약 메일 발송에 실패했습니다.";
    await updateSummaryLog(env.DB, logId, "failed", message);
    console.error("daily admin summary failed", message);
    throw error;
  }
}

function getDb(env) {
  if (!env?.DB) {
    throw new Error("D1 DB binding is not configured");
  }

  return env.DB;
}

function getRecent24HourPeriod(scheduledTime) {
  const end = new Date(scheduledTime);
  const start = new Date(end.getTime() - 24 * 60 * 60 * 1000);

  // Cron Trigger time is UTC. This summary intentionally uses the most recent
  // 24-hour UTC window so it stays independent from runtime timezone settings.
  return {
    startIso: start.toISOString(),
    endIso: end.toISOString(),
    summaryDate: toKoreaDateString(end),
    label: `${start.toISOString()} ~ ${end.toISOString()} (UTC, 최근 24시간)`,
  };
}

async function countByStatus(db, tableName, statuses, period) {
  const placeholders = statuses.map(() => "?").join(", ");
  const { results } = await db
    .prepare(
      `SELECT status, COUNT(*) AS count
       FROM ${tableName}
       WHERE datetime(created_at) >= datetime(?)
         AND datetime(created_at) < datetime(?)
         AND status IN (${placeholders})
       GROUP BY status`
    )
    .bind(period.startIso, period.endIso, ...statuses)
    .all();
  const counts = Object.fromEntries(statuses.map((status) => [status, 0]));

  (results || []).forEach((row) => {
    counts[row.status] = Number(row.count) || 0;
  });

  return counts;
}

function sumCounts(counts) {
  return Object.values(counts).reduce((total, count) => total + Number(count || 0), 0);
}

function buildSummaryText({ period, reportCounts, inquiryCounts, reportTotal, inquiryTotal }) {
  return [
    ADMIN_SUMMARY_SUBJECT,
    "",
    `기준 기간: ${period.label}`,
    "",
    "신고 요약",
    `- 신규 신고 수: ${reportCounts.new || 0}`,
    `- 검토 중 신고 수: ${reportCounts.reviewing || 0}`,
    `- 처리 완료 신고 수: ${reportCounts.resolved || 0}`,
    `- 거절/기각 신고 수: ${reportCounts.rejected || 0}`,
    `- 총 신고 수: ${reportTotal}`,
    "",
    "문의 요약",
    `- 신규 문의 수: ${inquiryCounts.new || 0}`,
    `- 검토 중 문의 수: ${inquiryCounts.reviewing || 0}`,
    `- 처리 완료 문의 수: ${inquiryCounts.resolved || 0}`,
    `- 무시/보류 문의 수: ${inquiryCounts.ignored || 0}`,
    `- 총 문의 수: ${inquiryTotal}`,
    "",
    `관리자 페이지: ${ADMIN_URL}`,
    "",
    "상세 내용은 관리자 페이지에서 확인하세요.",
  ].join("\n");
}

function getSummaryRecipient(env) {
  return env.DAILY_ADMIN_SUMMARY_TO || env.CONTACT_TO_EMAIL || DEFAULT_SUMMARY_TO;
}

async function sendSummaryEmail(env, sentTo, summary) {
  if (!env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not configured");
  }

  const from = env.CONTACT_FROM_EMAIL || env.AUTH_FROM_EMAIL || "Title Academy <onboarding@resend.dev>";
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      authorization: `Bearer ${env.RESEND_API_KEY}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: sentTo,
      subject: summary.subject,
      text: summary.text,
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`Resend API error ${response.status}${body ? `: ${body.slice(0, 500)}` : ""}`);
  }
}

async function findExistingSummary(db, summaryDate, sentTo) {
  return db
    .prepare(
      `SELECT id
       FROM admin_daily_summaries
       WHERE summary_date = ?
         AND sent_to = ?
         AND status = 'sent'
       LIMIT 1`
    )
    .bind(summaryDate, sentTo)
    .first();
}

async function insertSummaryLog(db, log) {
  await db
    .prepare(
      `INSERT INTO admin_daily_summaries
         (id, summary_date, sent_to, report_count, inquiry_count, status, error_message)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(log.id, log.summaryDate, log.sentTo, log.reportCount, log.inquiryCount, log.status, log.errorMessage || null)
    .run();
}

async function updateSummaryLog(db, id, status, errorMessage) {
  await db
    .prepare(
      `UPDATE admin_daily_summaries
       SET status = ?, error_message = ?, sent_at = CASE WHEN ? = 'sent' THEN CURRENT_TIMESTAMP ELSE sent_at END
       WHERE id = ?`
    )
    .bind(status, errorMessage || null, status, id)
    .run();
}

function toKoreaDateString(date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));

  return `${values.year}-${values.month}-${values.day}`;
}
