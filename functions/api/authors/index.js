import { getDb, json } from "../auth/_shared.js";
import { formatGuestName } from "../submissions/_guest-identity.js";

// 이달의 랭킹에서 이름을 눌렀을 때 보여줄 공개 작성자 정보.
// 신원 식별은 getMonthlyRanking의 rank_key와 동일하게 맞춘다:
// 회원은 ?userId=, 비회원은 ?guestName= + ?guestTag= (이름이 같아도 태그가 다르면 다른 사람).
const TITLE_LIMIT = 20;

export async function onRequestGet(context) {
  try {
    const url = new URL(context.request.url);
    const rawUserId = (url.searchParams.get("userId") || "").trim();
    const guestName = (url.searchParams.get("guestName") || "").trim();
    const guestTag = (url.searchParams.get("guestTag") || "").trim();
    const db = getDb(context);
    const monthPrefix = `${new Date().toISOString().slice(0, 7)}-%`;

    let ownerFilter = "";
    let ownerBindings = [];
    let author = null;

    if (rawUserId) {
      const userId = Number(rawUserId);

      if (!Number.isInteger(userId)) {
        return json({ message: "사용자 정보가 올바르지 않습니다." }, 400);
      }

      const user = await db
        .prepare(
          `SELECT id, username, bio, is_profile_public, profile_image_url
           FROM users
           WHERE id = ?
           LIMIT 1`
        )
        .bind(userId)
        .first();

      if (!user) {
        return json({ message: "사용자를 찾을 수 없습니다." }, 404);
      }

      const isProfilePublic = user.is_profile_public !== 0;
      author = {
        id: String(user.id),
        username: user.username,
        memberType: "회원",
        isGuest: false,
        isProfilePublic,
        // 비공개 프로필은 이름만 노출한다(이름은 제목 옆에 이미 공개돼 있다).
        bio: isProfilePublic ? user.bio || "" : "",
        avatarUrl: isProfilePublic ? user.profile_image_url || "" : "",
        canReceiveMessages: true,
      };
      ownerFilter = "submissions.author_user_id = ?";
      ownerBindings = [userId];
    } else if (guestName) {
      author = {
        id: "",
        username: formatGuestName(guestName, guestTag) || "비회원",
        memberType: "비회원",
        isGuest: true,
        isProfilePublic: false,
        bio: "",
        avatarUrl: "",
        canReceiveMessages: false,
      };
      ownerFilter =
        "submissions.author_user_id IS NULL AND submissions.guest_name = ? AND COALESCE(submissions.guest_tag, '') = ?";
      ownerBindings = [guestName, guestTag];
    } else {
      return json({ message: "작성자 정보가 필요합니다." }, 400);
    }

    // 랭킹 집계와 동일한 제외 조건(숨김·삭제·랭킹 제외)을 쓴다.
    const visibilityFilter = `submissions.hidden_at IS NULL
       AND submissions.deleted_at IS NULL
       AND submissions.excluded_from_ranking = 0`;

    const stats = await db
      .prepare(
        `SELECT
           COUNT(DISTINCT submissions.id) AS title_count,
           COUNT(likes.id) AS total_likes,
           COUNT(CASE WHEN likes.vote_date LIKE ? THEN 1 END) AS month_likes
         FROM submissions
         LEFT JOIN likes ON likes.submission_id = submissions.id
         WHERE ${ownerFilter} AND ${visibilityFilter}`
      )
      .bind(monthPrefix, ...ownerBindings)
      .first();

    const titleCount = Number(stats?.title_count) || 0;

    if (!titleCount && author.isGuest) {
      return json({ message: "작성자를 찾을 수 없습니다." }, 404);
    }

    const { results } = await db
      .prepare(
        `SELECT
           submissions.id,
           submissions.image_index,
           submissions.image_key,
           submissions.image_src,
           submissions.title,
           submissions.created_at,
           COUNT(likes.id) AS like_count
         FROM submissions
         LEFT JOIN likes ON likes.submission_id = submissions.id
         WHERE ${ownerFilter} AND ${visibilityFilter}
         GROUP BY submissions.id
         ORDER BY like_count DESC, submissions.created_at DESC
         LIMIT ${TITLE_LIMIT}`
      )
      .bind(...ownerBindings)
      .all();

    return json({
      author,
      stats: {
        titleCount,
        totalLikes: Number(stats?.total_likes) || 0,
        monthLikes: Number(stats?.month_likes) || 0,
      },
      titles: (results || []).map((row) => ({
        id: String(row.id),
        imageIndex: row.image_index,
        imageKey: row.image_key || String(row.image_index),
        imageSrc: row.image_src || "",
        title: row.title,
        createdAt: row.created_at,
        likes: Number(row.like_count) || 0,
      })),
      hasMore: titleCount > TITLE_LIMIT,
    });
  } catch (error) {
    console.error("author profile error", error);
    return json({ message: "작성자 정보를 불러오지 못했습니다." }, 500);
  }
}
