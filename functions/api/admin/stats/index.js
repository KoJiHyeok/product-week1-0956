import { getDb, json } from "../../auth/_shared.js";
import { requireAdmin } from "../_shared.js";

// 최근 N일(오늘 포함)의 일별/누적 추이. created_at은 UTC로 저장되므로
// KST(+9h) 기준으로 날짜를 끊어 한국 사용자 기준 "하루"와 맞춘다.
const KST_OFFSET = "+9 hours";
const WINDOW_DAYS = 7;

const SERIES = [
  { key: "titles", label: "제목", table: "submissions" },
  { key: "comments", label: "댓글", table: "comments" },
  { key: "members", label: "회원", table: "users" },
];

function kstDate(offsetDays) {
  const ms = Date.now() + 9 * 60 * 60 * 1000 + offsetDays * 24 * 60 * 60 * 1000;
  return new Date(ms).toISOString().slice(0, 10);
}

async function dailyCounts(db, table, windowStart) {
  // table은 위 SERIES의 고정 리터럴만 들어오므로 인젝션 위험 없음.
  const { results } = await db
    .prepare(
      `SELECT date(created_at, '${KST_OFFSET}') AS day, COUNT(*) AS cnt
       FROM ${table}
       WHERE date(created_at, '${KST_OFFSET}') >= ?
       GROUP BY day`
    )
    .bind(windowStart)
    .all();

  const map = new Map();
  for (const row of results || []) {
    map.set(row.day, Number(row.cnt) || 0);
  }
  return map;
}

async function baselineCount(db, table, windowStart) {
  const row = await db
    .prepare(`SELECT COUNT(*) AS cnt FROM ${table} WHERE date(created_at, '${KST_OFFSET}') < ?`)
    .bind(windowStart)
    .first();
  return Number(row?.cnt) || 0;
}

export async function onRequestGet(context) {
  try {
    const admin = await requireAdmin(context);

    if (admin.response) {
      return admin.response;
    }

    const db = getDb(context);

    const days = [];
    for (let i = WINDOW_DAYS - 1; i >= 0; i--) {
      days.push(kstDate(-i));
    }
    const windowStart = days[0];

    const series = [];
    for (const item of SERIES) {
      const baseline = await baselineCount(db, item.table, windowStart);
      const map = await dailyCounts(db, item.table, windowStart);
      const daily = days.map((day) => map.get(day) || 0);

      let running = baseline;
      const cumulative = daily.map((count) => (running += count));

      series.push({ key: item.key, label: item.label, daily, cumulative });
    }

    return json({ days, series });
  } catch (error) {
    console.error("admin stats error", error);
    return json({ message: "통계를 불러오지 못했습니다." }, 500);
  }
}
