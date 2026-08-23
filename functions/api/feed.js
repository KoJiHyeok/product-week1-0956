import { getDb, json } from "./auth/_shared.js";
import { galleryImages } from "./images/gallery-data.js";
import { formatAuthorName } from "./submissions/_guest-identity.js";

// 홈 "유머 피드"용 목록. daily.js와 동일한 KST 계산 방식을 쓴다.
const KST_OFFSET_MS = 9 * 60 * 60 * 1000;
const PAGE_SIZE = 20;
const WINDOWS = ["12h", "today", "week", "all"];

function kstDateString(ms) {
  return new Date(ms + KST_OFFSET_MS).toISOString().slice(0, 10);
}

function shiftKstDate(kstDay, deltaDays) {
  const base = new Date(`${kstDay}T00:00:00Z`).getTime();
  return new Date(base + deltaDays * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

// kstDay가 속한 주(월요일 시작, KST)의 월요일 날짜 문자열.
function mondayOfKstWeek(kstDay) {
  const dayOfWeek = new Date(`${kstDay}T00:00:00Z`).getUTCDay(); // 0=일 ~ 6=토
  const deltaToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  return shiftKstDate(kstDay, deltaToMonday);
}

function buildImageSrcMap() {
  const map = new Map();
  for (const image of galleryImages) {
    if (image?.imageKey != null) {
      map.set(String(image.imageKey), { src: image.src || "", webpSrc: image.webpSrc || "" });
    }
  }
  return map;
}

const imageSrcMap = buildImageSrcMap();

// window별 추가 WHERE 절과 바인드 값. created_at은 D1 기본(UTC) 저장이라
// KST 비교는 daily.js와 같이 +9시간 보정한 날짜 문자열로 한다.
function windowClause(windowKey) {
  const now = Date.now();

  if (windowKey === "12h") {
    return { sql: "AND datetime(submissions.created_at) >= datetime('now', '-12 hours')", binds: [] };
  }

  if (windowKey === "today") {
    return {
      sql: "AND date(datetime(submissions.created_at, '+9 hours')) = ?",
      binds: [kstDateString(now)],
    };
  }

  if (windowKey === "week") {
    return {
      sql: "AND date(datetime(submissions.created_at, '+9 hours')) >= ?",
      binds: [mondayOfKstWeek(kstDateString(now))],
    };
  }

  return { sql: "", binds: [] };
}

export async function onRequestGet(context) {
  try {
    const db = getDb(context);
    const url = new URL(context.request.url);
    const rawWindow = String(url.searchParams.get("window") || "12h").toLowerCase();
    const windowKey = WINDOWS.includes(rawWindow) ? rawWindow : "12h";
    const rawOffset = Number(url.searchParams.get("offset"));
    const offset = Number.isInteger(rawOffset) && rawOffset > 0 ? rawOffset : 0;

    const { sql: extraClause, binds } = windowClause(windowKey);

    const { results } = await db
      .prepare(
        `SELECT
           submissions.id,
           submissions.title,
           submissions.image_key,
           submissions.image_index,
           submissions.image_src,
           submissions.author_user_id,
           submissions.guest_name,
           submissions.guest_tag,
           submissions.created_at,
           users.username,
           COUNT(DISTINCT likes.id) AS like_count,
           COUNT(DISTINCT comments.id) AS comment_count
         FROM submissions
         LEFT JOIN users ON users.id = submissions.author_user_id
         LEFT JOIN likes ON likes.submission_id = submissions.id
         LEFT JOIN comments ON comments.submission_id = submissions.id
           AND comments.hidden_at IS NULL AND comments.deleted_at IS NULL
         WHERE submissions.hidden_at IS NULL
           AND submissions.deleted_at IS NULL
           AND submissions.excluded_from_ranking = 0
           ${extraClause}
         GROUP BY submissions.id
         ORDER BY like_count DESC, submissions.created_at DESC
         LIMIT ${PAGE_SIZE} OFFSET ?`
      )
      .bind(...binds, offset)
      .all();

    const items = (results || []).map((row) => {
      const imageKey = row.image_key != null && row.image_key !== ""
        ? String(row.image_key)
        : String(row.image_index);
      const mapped = imageSrcMap.get(imageKey);

      return {
        id: row.id,
        title: row.title,
        imageKey,
        imageSrc: mapped?.src || row.image_src || "",
        imageWebpSrc: mapped?.webpSrc || "",
        author: formatAuthorName(row),
        likeCount: Number(row.like_count) || 0,
        commentCount: Number(row.comment_count) || 0,
        createdAt: row.created_at,
      };
    });

    return json({ window: windowKey, offset, items }, 200, { "cache-control": "public, max-age=30" });
  } catch (error) {
    console.error("feed error", error);
    return json({ message: "피드를 불러오지 못했습니다." }, 500);
  }
}
