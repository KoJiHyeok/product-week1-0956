import { getDb, json } from "../auth/_shared.js";
import { serializeUploadedImage } from "./_shared.js";
import { toGalleryImage } from "./_suggestions.js";
import { galleryImages as defaultImages } from "./gallery-data.js";
import { formatAuthorName } from "../submissions/_guest-identity.js";

const TODAY_POPULAR_LIMIT = 5;
const MONTHLY_RANKING_LIMIT = 5;
const NEW_IMAGE_WINDOW_MS = 72 * 60 * 60 * 1000;
const EMPTY_STAT = Object.freeze({ submissions: 0, likes: 0, todayLikes: 0, comments: 0 });

function imageKeyOf(image, index) {
  return image?.imageKey != null ? String(image.imageKey) : String(index);
}

function hasValidDateTimeParts(text) {
  const match = text.match(
    /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2})(?:\.\d+)?)?)?/
  );
  if (!match) {
    return false;
  }

  const [, yearText, monthText, dayText, hourText, minuteText, secondText] = match;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const check = new Date(0);
  check.setUTCFullYear(year, month - 1, day);
  check.setUTCHours(0, 0, 0, 0);
  if (
    check.getUTCFullYear() !== year ||
    check.getUTCMonth() !== month - 1 ||
    check.getUTCDate() !== day
  ) {
    return false;
  }

  return (
    hourText == null ||
    (Number(hourText) <= 23 && Number(minuteText) <= 59 && Number(secondText || 0) <= 59)
  );
}

function parsePublicationValue(value) {
  const text = typeof value === "string" ? value.trim() : "";
  let timestamp;

  if (!hasValidDateTimeParts(text)) {
    return null;
  }

  // 정적 갤러리의 날짜는 한국 시간 자정, D1 기본 datetime은 UTC로 해석한다.
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) {
    timestamp = Date.parse(`${text}T00:00:00+09:00`);
  } else if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(text)) {
    timestamp = Date.parse(`${text.replace(" ", "T")}Z`);
  } else if (/^\d{4}-\d{2}-\d{2}T.*(?:Z|[+-]\d{2}:\d{2})$/i.test(text)) {
    timestamp = Date.parse(text);
  } else {
    return null;
  }

  return Number.isFinite(timestamp) ? timestamp : null;
}

function parsePublicationTimestamp(image) {
  for (const value of [image?.publishedAt, image?.reviewedAt, image?.createdAt]) {
    const timestamp = parsePublicationValue(value);

    if (timestamp != null) {
      return timestamp;
    }
  }

  return null;
}

function sortGalleryImages(images, stats, now = Date.now()) {
  return images
    .map((image, baseIndex) => {
      const publishedAt = parsePublicationTimestamp(image);
      const age = publishedAt == null ? null : now - publishedAt;
      const isFresh = age != null && age >= 0 && age < NEW_IMAGE_WINDOW_MS;
      const key = imageKeyOf(image, baseIndex);
      const likes = Number(stats.get(key)?.likes) || 0;
      return { image, baseIndex, publishedAt, isFresh, likes };
    })
    .sort((left, right) => {
      if (left.isFresh !== right.isFresh) {
        return left.isFresh ? -1 : 1;
      }
      if (left.isFresh && right.isFresh && left.publishedAt !== right.publishedAt) {
        return right.publishedAt - left.publishedAt;
      }
      if (!left.isFresh && left.likes !== right.likes) {
        return right.likes - left.likes;
      }
      return left.baseIndex - right.baseIndex;
    })
    .map((entry) => entry.image);
}

function buildTodayPopular(images, stats) {
  return images
    .map((image, index) => {
      const key = imageKeyOf(image, index);
      const stat = stats.get(key) || EMPTY_STAT;
      return { key, image, todayLikes: stat.todayLikes };
    })
    .filter((entry) => entry.todayLikes > 0)
    .sort((a, b) => b.todayLikes - a.todayLikes)
    .slice(0, TODAY_POPULAR_LIMIT)
    // 사진의 제목/설명은 의도적으로 응답에 넣지 않는다(제목짓기 창작성 보호).
    // 썸네일(src)·순위·하트수만 내려보낸다.
    .map((entry) => ({
      imageKey: entry.key,
      src: entry.image.src,
      webpSrc: entry.image.webpSrc || "",
      todayLikes: entry.todayLikes,
    }));
}

async function getImageStats(context, voteDate) {
  const db = getDb(context);
  const { results } = await db
    .prepare(
      `SELECT
         COALESCE(submissions.image_key, CAST(submissions.image_index AS TEXT)) AS image_key,
         COUNT(DISTINCT submissions.id) AS submission_count,
         COUNT(DISTINCT likes.id) AS like_count,
         COUNT(DISTINCT CASE WHEN likes.vote_date = ? THEN likes.id END) AS today_like_count,
         COUNT(DISTINCT comments.id) AS comment_count
       FROM submissions
       LEFT JOIN likes ON likes.submission_id = submissions.id
       LEFT JOIN comments ON comments.submission_id = submissions.id
         AND comments.hidden_at IS NULL AND comments.deleted_at IS NULL
       WHERE submissions.hidden_at IS NULL
         AND submissions.deleted_at IS NULL
         AND submissions.excluded_from_ranking = 0
       GROUP BY COALESCE(submissions.image_key, CAST(submissions.image_index AS TEXT))`
    )
    .bind(voteDate)
    .all();

  const map = new Map();
  for (const row of results || []) {
    map.set(String(row.image_key), {
      submissions: Number(row.submission_count) || 0,
      likes: Number(row.like_count) || 0,
      todayLikes: Number(row.today_like_count) || 0,
      comments: Number(row.comment_count) || 0,
    });
  }
  return map;
}

// 이달의 랭킹: 이번 달(monthPrefix = "YYYY-MM") 동안 자신의 제목이 받은 하트 합계로
// 참여자를 순위 매김. 가입 사용자는 author_user_id로, 비회원은 guest_name + guest_tag로 묶는다
// (이름이 같아도 태그가 다르면 다른 사람이다).
// (사이트 활동이 대부분 비회원이라, 회원만 집계하면 랭킹이 거의 항상 비어 비회원도 포함한다.)
async function getMonthlyRanking(context, monthPrefix) {
  const db = getDb(context);
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
         users.is_profile_public AS is_profile_public,
         users.profile_image_url AS profile_image_url,
         COUNT(likes.id) AS month_likes
       FROM submissions
       JOIN likes ON likes.submission_id = submissions.id
       LEFT JOIN users ON users.id = submissions.author_user_id
       WHERE submissions.hidden_at IS NULL
         AND submissions.deleted_at IS NULL
         AND submissions.excluded_from_ranking = 0
         AND (submissions.author_user_id IS NOT NULL
              OR (submissions.guest_name IS NOT NULL AND submissions.guest_name <> ''))
         AND likes.vote_date LIKE ?
       GROUP BY rank_key
       ORDER BY month_likes DESC, display_name ASC
       LIMIT ${MONTHLY_RANKING_LIMIT}`
    )
    .bind(`${monthPrefix}-%`)
    .all();

  return (results || []).map((row) => ({
    userId: row.user_id ? String(row.user_id) : "",
    username: formatAuthorName(row),
    isGuest: !row.user_id,
    // 회원 비공개 프로필/비회원은 아바타 이미지를 노출하지 않는다(이름은 제목에 이미 공개됨).
    avatarUrl: row.user_id && row.is_profile_public !== 0 ? row.profile_image_url || "" : "",
    monthLikes: Number(row.month_likes) || 0,
  }));
}

export async function onRequestGet(context) {
  const uploadedImages = await getApprovedUploadedImages(context);
  const suggestedImages = await getApprovedImageSuggestions(context);
  // 정적 사진은 append 순서의 역순, 승인 업로드/제안은 쿼리의 최신순을 사용한다.
  // 둘 다 원본을 복사해 정렬하므로 stable imageKey는 바뀌지 않는다.
  const baseImages = [...uploadedImages, ...suggestedImages, ...defaultImages.slice().reverse()];

  const now = Date.now();
  const voteDate = new Date(now).toISOString().slice(0, 10);
  const monthPrefix = voteDate.slice(0, 7); // YYYY-MM
  let stats;

  try {
    stats = await getImageStats(context, voteDate);
  } catch (error) {
    // 집계 실패 시 하트 수를 추정하지 않고, 72시간 상단 고정과 기존 동률 순서만 유지한다.
    console.error("images ranking error", error);
    return json({
      images: sortGalleryImages(baseImages, new Map(), now),
      todayPopular: [],
      monthlyRanking: [],
    });
  }

  const sortedImages = sortGalleryImages(baseImages, stats, now);
  let monthlyRanking = [];
  try {
    monthlyRanking = await getMonthlyRanking(context, monthPrefix);
  } catch (error) {
    console.error("images monthly ranking error", error);
  }

  return json({
    images: sortedImages,
    todayPopular: buildTodayPopular(sortedImages, stats),
    monthlyRanking,
  });
}

// 관리자가 승인한 이미지 제안은 배포 없이 즉시 갤러리에 합류한다.
async function getApprovedImageSuggestions(context) {
  try {
    const db = getDb(context);
    const { results } = await db
      .prepare(
        `SELECT image_suggestions.id, image_suggestions.submitter_name, image_suggestions.gallery_title,
                image_suggestions.gallery_description, image_suggestions.gallery_alt, image_suggestions.gallery_prompt,
                image_suggestions.gallery_observation_points, image_suggestions.gallery_example_titles,
                image_suggestions.created_at, image_suggestions.reviewed_at, image_suggestions.published_at,
                users.username
         FROM image_suggestions
         LEFT JOIN users ON users.id = image_suggestions.user_id
         WHERE image_suggestions.status = 'approved' AND image_suggestions.image_data IS NOT NULL
         ORDER BY COALESCE(image_suggestions.published_at, image_suggestions.reviewed_at, image_suggestions.created_at) DESC
         LIMIT 100`
      )
      .all();

    return (results || []).map(toGalleryImage);
  } catch (error) {
    console.error("approved image suggestions error", error);
    return [];
  }
}

async function getApprovedUploadedImages(context) {
  try {
    const db = getDb(context);
    const { results } = await db
      .prepare(
        `SELECT uploaded_images.id, uploaded_images.uploader_user_id, uploaded_images.storage_key,
                uploaded_images.thumbnail_key, uploaded_images.alt_text, uploaded_images.source_type,
                uploaded_images.source_url, uploaded_images.author_name, uploaded_images.license_name,
                uploaded_images.attribution_required, uploaded_images.status, uploaded_images.moderation_reason,
                uploaded_images.report_count, uploaded_images.created_at, uploaded_images.reviewed_at,
                uploaded_images.reviewed_by, users.username
         FROM uploaded_images
         LEFT JOIN users ON users.id = uploaded_images.uploader_user_id
         WHERE uploaded_images.status = 'approved'
         ORDER BY uploaded_images.created_at DESC
         LIMIT 100`
      )
      .all();

    return (results || []).map(serializeUploadedImage);
  } catch {
    return [];
  }
}
