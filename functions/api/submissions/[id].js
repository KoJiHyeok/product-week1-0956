import { getCurrentUser, getDb, json, readJson } from "../auth/_shared.js";

export async function onRequestPatch(context) {
  try {
    const user = await getCurrentUser(context);

    if (!user) {
      return json({ message: "로그인이 필요합니다." }, 401);
    }

    const db = getDb(context);
    const submissionId = Number(context.params.id);
    const body = await readJson(context.request);
    const title = typeof body?.title === "string" ? body.title.trim().slice(0, 60) : "";

    if (!Number.isInteger(submissionId) || !title) {
      return json({ message: "제목 정보가 올바르지 않습니다." }, 400);
    }

    const submission = await db
      .prepare("SELECT author_user_id FROM submissions WHERE id = ? AND hidden_at IS NULL AND deleted_at IS NULL LIMIT 1")
      .bind(submissionId)
      .first();

    if (!submission) {
      return json({ message: "제목을 찾을 수 없습니다." }, 404);
    }

    if (submission.author_user_id !== user.id) {
      return json({ message: "본인이 작성한 제목만 수정할 수 있습니다." }, 403);
    }

    await db.prepare("UPDATE submissions SET title = ? WHERE id = ?").bind(title, submissionId).run();
    return json({ updated: true, title });
  } catch (error) {
    console.error("submissions/update error", error);
    return json({ message: "제목을 수정하지 못했습니다." }, 500);
  }
}

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
      .prepare("SELECT author_user_id FROM submissions WHERE id = ? AND deleted_at IS NULL LIMIT 1")
      .bind(submissionId)
      .first();

    if (!submission) {
      return json({ message: "제목을 찾을 수 없습니다." }, 404);
    }

    if (submission.author_user_id !== user.id) {
      return json({ message: "본인이 작성한 제목만 삭제할 수 있습니다." }, 403);
    }

    await db
      .prepare("UPDATE submissions SET deleted_at = CURRENT_TIMESTAMP, deleted_reason = 'author_deleted' WHERE id = ?")
      .bind(submissionId)
      .run();
    return json({ deleted: true });
  } catch (error) {
    console.error("submissions/delete error", error);
    return json({ message: "제목을 삭제하지 못했습니다." }, 500);
  }
}
