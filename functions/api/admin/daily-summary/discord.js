// 일일 "변화율" 디스코드 알림.
// 어제(KST 하루) 신규 건수를 그저께와 비교해 증감(Δ)·변화율(%)을 디스코드 채널
// 웹훅으로 보낸다. 중복 방지·발송 로그는 기존 admin_daily_summaries 테이블을
// 재사용하며(sent_to="discord"), 이메일 요약 코드(_shared.js)는 건드리지 않는다.

const DISCORD_TITLE = "📊 제목 학원 일일 변화";
const ADMIN_URL = "https://jemokhakwon.com/admin";
const KST_OFFSET_MS = 9 * 60 * 60 * 1000;
const SENT_TO = "discord";

// 변화율 추적 지표. table 값은 아래 고정 리터럴만 들어오므로 인젝션 위험 없음.
const METRICS = [
  { key: "visitors", label: "방문자", unit: "명", table: "daily_visits", emoji: "👀" },
  { key: "titles", label: "제목", unit: "건", table: "submissions", emoji: "📝" },
  { key: "members", label: "회원", unit: "명", table: "users", emoji: "🙋" },
  { key: "hearts", label: "하트", unit: "개", table: "likes", emoji: "❤️" },
];

export async function buildDailyChangeSummary(env, scheduledTime = Date.now()) {
  const db = getDb(env);
  // created_at은 UTC로 저장 → '+9 hours'로 KST 날짜를 끊어 한국 "하루"와 맞춘다.
  const sendDay = kstDateString(scheduledTime); // 발송일(KST)
  const coveredDate = shiftKstDate(sendDay, -1); // 어제
  const dayBeforeDate = shiftKstDate(sendDay, -2); // 그저께

  const metrics = [];
  for (const metric of METRICS) {
    const yesterday = await countOnKstDay(db, metric.table, coveredDate);
    const dayBefore = await countOnKstDay(db, metric.table, dayBeforeDate);
    metrics.push({ ...metric, yesterday, dayBefore, ...changeOf(yesterday, dayBefore) });
  }

  const reportNew = await countOnKstDay(db, "reports", coveredDate);
  const inquiryNew = await countOnKstDay(db, "contact_inquiries", coveredDate);

  const payload = { coveredDate, metrics, reportNew, inquiryNew };

  return {
    summaryDate: sendDay,
    coveredDate,
    dayBeforeDate,
    metrics,
    reportNew,
    inquiryNew,
    text: buildSummaryText(payload),
    discordPayload: buildDiscordEmbed(payload),
  };
}

export async function sendDailyDiscordSummary({ env, scheduledTime = Date.now(), dryRun = false, force = false } = {}) {
  const summary = await buildDailyChangeSummary(env, scheduledTime);

  if (dryRun) {
    return { sent: false, dryRun: true, sentTo: SENT_TO, summary };
  }

  const existing = await findExistingSummary(env.DB, summary.summaryDate);

  if (existing && !force) {
    return { sent: false, skipped: true, reason: "already_sent", sentTo: SENT_TO, summary };
  }

  const logId = crypto.randomUUID();
  await insertSummaryLog(env.DB, {
    id: logId,
    summaryDate: summary.summaryDate,
    reportCount: summary.reportNew,
    inquiryCount: summary.inquiryNew,
  });

  try {
    await postDiscordWebhook(env, summary.discordPayload);
    await updateSummaryLog(env.DB, logId, "sent", "");
    return { sent: true, skipped: false, sentTo: SENT_TO, summary };
  } catch (error) {
    const message = error instanceof Error ? error.message : "디스코드 전송에 실패했습니다.";
    await updateSummaryLog(env.DB, logId, "failed", message);
    console.error("daily discord summary failed", message);
    throw error;
  }
}

function getDb(env) {
  if (!env?.DB) {
    throw new Error("D1 DB binding is not configured");
  }

  return env.DB;
}

function kstDateString(ms) {
  return new Date(ms + KST_OFFSET_MS).toISOString().slice(0, 10);
}

function shiftKstDate(kstDay, deltaDays) {
  const base = new Date(`${kstDay}T00:00:00Z`).getTime();
  return new Date(base + deltaDays * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

async function countOnKstDay(db, table, kstDay) {
  // table은 위 고정 리터럴(daily_visits/submissions/users/likes/reports/contact_inquiries)만 들어온다.
  // daily_visits는 created_at이 아니라 이미 KST 문자열인 visit_date 컬럼으로 센다.
  const row =
    table === "daily_visits"
      ? await db.prepare("SELECT COUNT(*) AS cnt FROM daily_visits WHERE visit_date = ?").bind(kstDay).first()
      : await db
          .prepare(`SELECT COUNT(*) AS cnt FROM ${table} WHERE date(created_at, '+9 hours') = ?`)
          .bind(kstDay)
          .first();
  return Number(row?.cnt) || 0;
}

function changeOf(yesterday, dayBefore) {
  const delta = yesterday - dayBefore;
  const deltaText = delta > 0 ? `+${delta}` : delta < 0 ? `${delta}` : "±0";
  let pctText;

  if (dayBefore === 0) {
    pctText = yesterday === 0 ? "0.0%" : "신규";
  } else {
    const pct = (delta / dayBefore) * 100;
    const sign = pct > 0 ? "+" : "";
    pctText = `${sign}${pct.toFixed(1)}%`;
  }

  return { delta, deltaText, pctText };
}

function trendEmoji(delta) {
  return delta > 0 ? "📈" : delta < 0 ? "📉" : "➖";
}

function summaryColor(metrics) {
  const primary = metrics[0];
  if (!primary || primary.delta === 0) return 0x5865f2; // blurple
  return primary.delta > 0 ? 0x57f287 : 0xed4245; // green / red
}

function buildDiscordEmbed({ coveredDate, metrics, reportNew, inquiryNew }) {
  const fields = metrics.map((metric) => ({
    name: `${metric.emoji} ${metric.label}`,
    value: `${trendEmoji(metric.delta)} **${metric.yesterday}${metric.unit}**\n그저께 ${metric.dayBefore}${metric.unit}\n${metric.deltaText} (${metric.pctText})`,
    inline: true,
  }));

  fields.push({
    name: "🛡️ 신고 · 문의 (어제 신규)",
    value: `신고 ${reportNew}건 · 문의 ${inquiryNew}건`,
    inline: false,
  });

  return {
    embeds: [
      {
        title: `${DISCORD_TITLE} · ${coveredDate}`,
        description: "어제(KST) 신규 · 그저께 대비",
        url: ADMIN_URL,
        color: summaryColor(metrics),
        fields,
        footer: { text: "제목 학원 · 매일 자동 집계" },
      },
    ],
  };
}

function buildSummaryText({ coveredDate, metrics, reportNew, inquiryNew }) {
  return [
    `${DISCORD_TITLE} — ${coveredDate} (KST), 그저께 대비`,
    "",
    ...metrics.map(
      (metric) =>
        `- ${metric.label}: ${metric.yesterday}${metric.unit} (그저께 ${metric.dayBefore}${metric.unit}, ${metric.deltaText}, ${metric.pctText})`
    ),
    "",
    `신고 신규 ${reportNew}건 · 문의 신규 ${inquiryNew}건`,
    `관리자: ${ADMIN_URL}`,
  ].join("\n");
}

export async function postDiscordWebhook(env, payload) {
  const url = env.DISCORD_WEBHOOK_URL;

  if (!url) {
    throw new Error("DISCORD_WEBHOOK_URL is not configured");
  }

  const response = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`Discord webhook error ${response.status}${body ? `: ${body.slice(0, 500)}` : ""}`);
  }
}

async function findExistingSummary(db, summaryDate) {
  return db
    .prepare(
      `SELECT id
       FROM admin_daily_summaries
       WHERE summary_date = ?
         AND sent_to = ?
         AND status = 'sent'
       LIMIT 1`
    )
    .bind(summaryDate, SENT_TO)
    .first();
}

async function insertSummaryLog(db, log) {
  await db
    .prepare(
      `INSERT INTO admin_daily_summaries
         (id, summary_date, sent_to, report_count, inquiry_count, status, error_message)
       VALUES (?, ?, ?, ?, ?, 'pending', NULL)`
    )
    .bind(log.id, log.summaryDate, SENT_TO, log.reportCount, log.inquiryCount)
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
