import { getCurrentUser, getDb, json } from "../auth/_shared.js";

export async function onRequestGet(context) {
  try {
    const user = await getCurrentUser(context);

    if (!user) {
      return json({ message: "로그인이 필요합니다." }, 401);
    }

    const db = getDb(context);
    const { results } = await db
      .prepare(
        `SELECT
           submissions.id,
           submissions.image_index,
           submissions.image_key,
           submissions.image_src,
           submissions.title,
           submissions.created_at,
           COUNT(DISTINCT likes.id) AS like_count
         FROM submissions
         LEFT JOIN likes ON likes.submission_id = submissions.id
         WHERE submissions.author_user_id = ?
           AND submissions.hidden_at IS NULL
           AND submissions.deleted_at IS NULL
         GROUP BY submissions.id
         ORDER BY submissions.created_at DESC`
      )
      .bind(user.id)
      .all();

    const submissions = await Promise.all(
      (results || []).map(async (row) => {
        const comments = await db
          .prepare(
            `SELECT comments.id, comments.text, comments.created_at, comments.author_user_id,
                    comments.guest_name, users.username, users.is_profile_public, users.profile_image_url
             FROM comments
             LEFT JOIN users ON users.id = comments.author_user_id
             WHERE comments.submission_id = ?
               AND comments.hidden_at IS NULL
               AND comments.deleted_at IS NULL
             ORDER BY comments.created_at ASC`
          )
          .bind(row.id)
          .all();

        return {
          id: String(row.id),
          imageIndex: row.image_index,
          imageKey: row.image_key || String(row.image_index),
          imageSrc: row.image_src,
          title: row.title,
          createdAt: row.created_at,
          likes: Number(row.like_count) || 0,
          canDelete: true,
          comments: (comments.results || []).map((comment) => ({
            id: String(comment.id),
            author: comment.username || comment.guest_name || "비회원",
            authorIsProfilePublic: comment.author_user_id ? comment.is_profile_public !== 0 : true,
            authorProfileImageUrl: comment.is_profile_public !== 0 ? comment.profile_image_url || "" : "",
            text: comment.text,
            createdAt: comment.created_at,
            canDelete: comment.author_user_id === user.id,
          })),
        };
      })
    );

    return json({ submissions });
  } catch {
    return json({ message: "나의 제목들을 불러오지 못했습니다." }, 500);
  }
}
