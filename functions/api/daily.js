import { getDb, json } from "./auth/_shared.js";
import { galleryImages } from "./images/gallery-data.js";
import { formatAuthorName } from "./submissions/_guest-identity.js";

const KST_OFFSET_MS = 9 * 60 * 60 * 1000;
const WEEKLY_RANKING_LIMIT = 5;

// discord.js의 일일 요약과 동일한 KST 날짜 계산(UTC+9 오프셋).
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

function sortedGalleryKeys() {
  return galleryImages
    .map((image) => (image?.imageKey != null ? String(image.imageKey) : ""))
    .filter((key) => key !== "")
    .sort((a, b) => Number(a) - Number(b));
}

// 같은 날짜는 항상 같은 사진을 가리키는 결정적 로테이션(서버 상태 불필요).
function rotationImageKeyFor(kstDay, keys) {
  if (!keys.length) {
    return "";
  }

  const dayNumber = Math.floor(Date.parse(`${kstDay}T00:00:00Z`) / 86400000);
  const index = ((dayNumber % keys.length) + keys.length) % keys.length;
  return keys[index];
}

// 하이브리드 선정: daily_featured에 그 날짜 지정이 있고 갤러리에 존재하면 그것, 없으면 로테이션.
async function pickFeaturedImageKey(db, kstDay, keys, keySet) {
  try {
    const row = await db
      .prepare("SELECT image_key FROM daily_featured WHERE feature_date = ?")
      .bind(kstDay)
      .first();

    if (row?.image_key && keySet.has(String(row.image_key))) {
      return String(row.image_key);
    }
  } catch (error) {
    // daily_featured 마이그레이션이 아직 적용되지 않은 환경(로컬 등)에서도 로테이션으로 정상 동작해야 한다.
    console.error("daily_featured lookup error", error);
  }

  return rotationImageKeyFor(kstDay, keys);
}

async function countSubmissionsOnKstDay(db, imageKey, kstDay) {
  const row = await db
    .prepare(
      `SELECT COUNT(*) AS count
       FROM submissions
       WHERE COALESCE(image_key, CAST(image_index AS TEXT)) = ?
         AND hidden_at IS NULL
         AND deleted_at IS NULL
         AND excluded_from_ranking = 0
         AND date(datetime(created_at, '+9 hours')) = ?`
    )
    .bind(imageKey, kstDay)
    .first();

  return Number(row?.count) || 0;
}

// 어제(KST)의 짤에 어제(KST) 제출된 제목 중 하트순 1위(동률 시 먼저 제출한 쪽).
async function getWinnerOnKstDay(db, imageKey, kstDay) {
  const row = await db
    .prepare(
      `SELECT submissions.id, submissions.title, submissions.author_user_id,
              submissions.guest_name, submissions.guest_tag, users.username,
              COUNT(likes.id) AS like_count
       FROM submissions
       LEFT JOIN users ON users.id = submissions.author_user_id
       LEFT JOIN likes ON likes.submission_id = submissions.id
       WHERE COALESCE(submissions.image_key, CAST(submissions.image_index AS TEXT)) = ?
         AND submissions.hidden_at IS NULL
         AND submissions.deleted_at IS NULL
         AND submissions.excluded_from_ranking = 0
         AND date(datetime(submissions.created_at, '+9 hours')) = ?
       GROUP BY submissions.id
       ORDER BY like_count DESC, submissions.created_at ASC
       LIMIT 1`
    )
    .bind(imageKey, kstDay)
    .first();

  if (!row) {
    return null;
  }

  return {
    submissionId: Number(row.id),
    title: row.title,
    author: formatAuthorName(row),
    likeCount: Number(row.like_count) || 0,
  };
}

// 이번 주 랭킹: 이번 주 월요일(KST) 0시 이후 받은 하트 합산 상위 사용자.
// "이달의 랭킹"(functions/api/images/index.js의 getMonthlyRanking)과 동일한 회원/비회원 집계 방식을 쓰되,
// 기간 조건만 month LIKE 접두사 대신 likes.vote_date >= 월요일로 바꾼다.
async function getWeeklyRanking(db, mondayKstDay) {
  const { results } = await db
    .prepare(
      `SELECT
         CASE WHEN submissions.author_user_id IS NOT NULL
              THEN 'u:' || submissions.author_user_id
              ELSE 'g:' || submissions.guest_name || ':' || COALESCE(submissions.guest_tag, '') END AS rank_key,
         submissions.author_user_id AS user_id,
         users.username AS username,
         submissions.guest_name AS guest_name,
         submissions.guest_tag AS guest_tag,
         COALESCE(users.username, submissions.guest_name) AS display_name,
         COUNT(likes.id) AS week_likes
       FROM submissions
       JOIN likes ON likes.submission_id = submissions.id
       LEFT JOIN users ON users.id = submissions.author_user_id
       WHERE submissions.hidden_at IS NULL
         AND submissions.deleted_at IS NULL
         AND submissions.excluded_from_ranking = 0
         AND (submissions.author_user_id IS NOT NULL
              OR (submissions.guest_name IS NOT NULL AND submissions.guest_name <> ''))
         AND likes.vote_date >= ?
       GROUP BY rank_key
       ORDER BY week_likes DESC, display_name ASC
       LIMIT ${WEEKLY_RANKING_LIMIT}`
    )
    .bind(mondayKstDay)
    .all();

  return (results || []).map((row) => ({
    author: formatAuthorName(row),
    likes: Number(row.week_likes) || 0,
  }));
}

export async function onRequestGet(context) {
  try {
    const db = getDb(context);
    const now = Date.now();
    const todayKst = kstDateString(now);
    const yesterdayKst = shiftKstDate(todayKst, -1);
    const mondayKst = mondayOfKstWeek(todayKst);

    const keys = sortedGalleryKeys();
    const keySet = new Set(keys);

    const todayImageKey = await pickFeaturedImageKey(db, todayKst, keys, keySet);
    const yesterdayImageKey = await pickFeaturedImageKey(db, yesterdayKst, keys, keySet);

    const [submissionCount, winner, weekly] = await Promise.all([
      todayImageKey ? countSubmissionsOnKstDay(db, todayImageKey, todayKst) : Promise.resolve(0),
      yesterdayImageKey ? getWinnerOnKstDay(db, yesterdayImageKey, yesterdayKst) : Promise.resolve(null),
      getWeeklyRanking(db, mondayKst),
    ]);

    return json(
      {
        today: { date: todayKst, imageKey: todayImageKey, submissionCount },
        yesterday: { date: yesterdayKst, imageKey: yesterdayImageKey, winner },
        weekly,
      },
      200,
      { "cache-control": "public, max-age=60" }
    );
  } catch (error) {
    console.error("daily error", error);
    return json({ message: "오늘의 짤 정보를 불러오지 못했습니다." }, 500);
  }
}
