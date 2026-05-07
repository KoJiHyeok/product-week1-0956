import { getCurrentUser, getDb, json } from "../auth/_shared.js";

export async function onRequestDelete(context) {
  try {
    const user = await getCurrentUser(context);

    if (!user) {
      return json({ message: "로그인이 필요합니다." }, 401);
    }

    const db = getDb(context);
    const submissionId = Number(context.params.id);

    if (!Number.isInteger(submissionId)) {
      return json({ message: "제목 정보가 올바르지 않습니다." }, 400);
    }

    const submission = await db
      .prepare("SELECT author_user_id FROM submissions WHERE id = ? LIMIT 1")
      .bind(submissionId)
      .first();

    if (!submission) {
      return json({ message: "제목을 찾을 수 없습니다." }, 404);
    }

    if (submission.author_user_id !== user.id) {
      return json({ message: "본인이 작성한 제목만 삭제할 수 있습니다." }, 403);
    }

    await db.prepare("DELETE FROM submissions WHERE id = ?").bind(submissionId).run();
    return json({ deleted: true });
  } catch {
    return json({ message: "제목을 삭제하지 못했습니다." }, 500);
  }
}
