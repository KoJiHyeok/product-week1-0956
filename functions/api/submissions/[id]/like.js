import { getCurrentUser, getDb, json } from "../../auth/_shared.js";

export async function onRequestPost(context) {
  try {
    const user = await getCurrentUser(context);

    if (!user) {
      return json({ message: "로그인 후 하트를 누를 수 있습니다." }, 401);
    }

    const db = getDb(context);
    const submissionId = Number(context.params.id);

    if (!Number.isInteger(submissionId)) {
      return json({ message: "제목 정보가 올바르지 않습니다." }, 400);
    }

    const existing = await db
      .prepare("SELECT id FROM likes WHERE submission_id = ? AND user_id = ? LIMIT 1")
      .bind(submissionId, user.id)
      .first();

    if (existing) {
      await db.prepare("DELETE FROM likes WHERE id = ?").bind(existing.id).run();
    } else {
      await db
        .prepare("INSERT OR IGNORE INTO likes (submission_id, user_id) VALUES (?, ?)")
        .bind(submissionId, user.id)
        .run();
    }

    const count = await db
      .prepare("SELECT COUNT(*) AS like_count FROM likes WHERE submission_id = ?")
      .bind(submissionId)
      .first();

    return json({
      liked: !existing,
      likes: Number(count?.like_count) || 0,
    });
  } catch {
    return json({ message: "하트를 처리하지 못했습니다." }, 500);
  }
}
