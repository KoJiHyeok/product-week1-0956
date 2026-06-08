import { getCurrentUser, getDb, json } from "../../../auth/_shared.js";

export async function onRequestDelete(context) {
  try {
    const user = await getCurrentUser(context);

    if (!user) {
      return json({ message: "로그인이 필요합니다." }, 401);
    }

    const db = getDb(context);
    const submissionId = Number(context.params.id);
    const commentId = Number(context.params.commentId);

    if (!Number.isInteger(submissionId) || !Number.isInteger(commentId)) {
      return json({ message: "댓글 정보가 올바르지 않습니다." }, 400);
    }

    const comment = await db
      .prepare("SELECT author_user_id FROM comments WHERE id = ? AND submission_id = ? AND deleted_at IS NULL LIMIT 1")
      .bind(commentId, submissionId)
      .first();

    if (!comment) {
      return json({ message: "댓글을 찾을 수 없습니다." }, 404);
    }

    if (comment.author_user_id !== user.id) {
      return json({ message: "본인이 작성한 댓글만 삭제할 수 있습니다." }, 403);
    }

    await db
      .prepare("UPDATE comments SET deleted_at = CURRENT_TIMESTAMP, deleted_reason = 'author_deleted' WHERE id = ?")
      .bind(commentId)
      .run();
    return json({ deleted: true });
  } catch (error) {
    console.error("submissions/comments/delete error", error);
    return json({ message: "댓글을 삭제하지 못했습니다." }, 500);
  }
}
