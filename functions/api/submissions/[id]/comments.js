import { ensureUserCanWrite, getCurrentUser, getDb, json, readJson } from "../../auth/_shared.js";
import { validateDisplayName, validatePublicText } from "../_moderation.js";
import {
  formatGuestName,
  isReservedByMember,
  resolveGuestIdentity,
  validateGuestName,
} from "../_guest-identity.js";

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

    const commentValidation = validatePublicText(text, "댓글");
    if (!commentValidation.ok) {
      return json({ message: commentValidation.message }, 400);
    }

    const guestNameValidation = validateDisplayName(guestName);
    if (!guestNameValidation.ok) {
      return json({ message: guestNameValidation.message }, 400);
    }

    const guestNameFormat = validateGuestName(guestName);
    if (!guestNameFormat.ok) {
      return json({ message: guestNameFormat.message, code: "guest_name_invalid" }, 400);
    }

    if (!user && (await isReservedByMember(db, guestName))) {
      return json(
        { message: "이미 사용 중인 회원 이름입니다. 다른 이름을 입력해 주세요.", code: "guest_name_taken" },
        400
      );
    }

    const restrictionResponse = await ensureUserCanWrite(context, user, "write");

    if (restrictionResponse) {
      return restrictionResponse;
    }

    const submission = await db
      .prepare(
        `SELECT id
         FROM submissions
         WHERE id = ?
           AND hidden_at IS NULL
           AND deleted_at IS NULL
           AND excluded_from_ranking = 0
         LIMIT 1`
      )
      .bind(submissionId)
      .first();

    if (!submission) {
      return json({ message: "댓글을 작성할 제목을 찾을 수 없습니다." }, 404);
    }

    const guestIdentity = user
      ? { tag: null, cookie: "" }
      : await resolveGuestIdentity(context.request, guestName);

    const result = await db
      .prepare(
        `INSERT INTO comments (submission_id, author_user_id, guest_name, guest_tag, text)
         VALUES (?, ?, ?, ?, ?)`
      )
      .bind(
        submissionId,
        user?.id || null,
        user ? null : guestName,
        user ? null : guestIdentity.tag,
        text
      )
      .run();

    return json(
      {
        comment: {
          id: String(result.meta.last_row_id),
          authorUserId: user ? String(user.id) : "",
          author: user?.username || formatGuestName(guestName, guestIdentity.tag) || "비회원",
          authorIsProfilePublic: user ? user.is_profile_public !== 0 : true,
          authorProfileImageUrl: user && user.is_profile_public !== 0 ? user.profile_image_url || "" : "",
          text,
          createdAt: new Date().toISOString(),
          canDelete: Boolean(user),
        },
      },
      201,
      guestIdentity.cookie ? { "set-cookie": guestIdentity.cookie } : {}
    );
  } catch (error) {
    console.error("submissions/comments/create error", error);
    return json({ message: "댓글을 저장하지 못했습니다." }, 500);
  }
}
