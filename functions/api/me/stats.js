import { getCurrentUser, getDb, json } from "../auth/_shared.js";

export async function onRequestGet(context) {
  try {
    const user = await getCurrentUser(context);

    if (!user) {
      return json({ message: "로그인이 필요합니다." }, 401);
    }

    const db = getDb(context);
    const stats = await db
      .prepare(
        `SELECT
           (SELECT COUNT(*) FROM submissions WHERE author_user_id = ?) AS title_count,
           (SELECT COUNT(*) FROM comments WHERE author_user_id = ?) AS comment_count,
           (SELECT COUNT(*)
            FROM likes
            JOIN submissions ON submissions.id = likes.submission_id
            WHERE submissions.author_user_id = ?) AS received_likes`
      )
      .bind(user.id, user.id, user.id)
      .first();
    const best = await db
      .prepare(
        `SELECT submissions.id, submissions.title, COUNT(likes.id) AS like_count
         FROM submissions
         LEFT JOIN likes ON likes.submission_id = submissions.id
         WHERE submissions.author_user_id = ?
         GROUP BY submissions.id
         ORDER BY like_count DESC, submissions.created_at ASC
         LIMIT 1`
      )
      .bind(user.id)
      .first();

    const titleCount = Number(stats?.title_count) || 0;
    const commentCount = Number(stats?.comment_count) || 0;
    const receivedLikes = Number(stats?.received_likes) || 0;
    const badges = [
      titleCount >= 1 ? { key: "first_title", label: "첫 제목 작성" } : null,
      receivedLikes >= 10 ? { key: "likes_10", label: "좋아요 10개 달성" } : null,
      commentCount >= 10 ? { key: "comments_10", label: "댓글 10개 작성" } : null,
      Number(best?.like_count) >= 5 ? { key: "popular_title", label: "인기 제목 보유" } : null,
    ].filter(Boolean);

    return json({
      stats: {
        titleCount,
        commentCount,
        receivedLikes,
        bestTitle: best
          ? {
              id: String(best.id),
              title: best.title,
              likes: Number(best.like_count) || 0,
            }
          : null,
        badges,
      },
    });
  } catch {
    return json({ message: "활동 통계를 불러오지 못했습니다." }, 500);
  }
}
