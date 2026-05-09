import { getCurrentUser, getDb, json, readJson } from "../../auth/_shared.js";

export async function onRequestPost(context) {
  try {
    const db = getDb(context);
    const user = await getCurrentUser(context);
    const submissionId = Number(context.params.id);
    const body = await readJson(context.request);
    const text = typeof body?.text === "string" ? body.text.trim() : "";
    const guestName = typeof body?.guestName === "string" ? body.guestName.trim() : "";

    if (!Number.isInteger(submissionId) || !text) {
      return json({ message: "댓글 정보가 올바르지 않습니다." }, 400);
    }

    if (!user && !guestName) {
      return json({ message: "비회원 이름을 입력하세요." }, 400);
    }

    const result = await db
      .prepare(
        `INSERT INTO comments (submission_id, author_user_id, guest_name, text)
         VALUES (?, ?, ?, ?)`
      )
      .bind(submissionId, user?.id || null, user ? null : guestName, text)
      .run();

    return json(
      {
        comment: {
          id: String(result.meta.last_row_id),
          author: user?.username || guestName || "비회원",
          authorIsProfilePublic: user ? user.is_profile_public !== 0 : true,
          authorProfileImageUrl: user && user.is_profile_public !== 0 ? user.profile_image_url || "" : "",
          text,
          createdAt: new Date().toISOString(),
          canDelete: Boolean(user),
        },
      },
      201
    );
  } catch {
    return json({ message: "댓글을 저장하지 못했습니다." }, 500);
  }
}
