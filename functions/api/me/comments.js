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
           comments.id,
           comments.submission_id,
           comments.text,
           comments.created_at,
           submissions.image_index,
           submissions.image_src,
           submissions.title AS submission_title
         FROM comments
         JOIN submissions ON submissions.id = comments.submission_id
         WHERE comments.author_user_id = ?
         ORDER BY comments.created_at DESC`
      )
      .bind(user.id)
      .all();

    return json({
      comments: (results || []).map((comment) => ({
        id: String(comment.id),
        submissionId: String(comment.submission_id),
        imageIndex: comment.image_index,
        imageSrc: comment.image_src,
        submissionTitle: comment.submission_title,
        text: comment.text,
        createdAt: comment.created_at,
        canDelete: true,
      })),
    });
  } catch {
    return json({ message: "나의 댓글들을 불러오지 못했습니다." }, 500);
  }
}
