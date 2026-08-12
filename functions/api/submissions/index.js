import { ensureUserCanWrite, getCurrentUser, getDb, json, readJson } from "../auth/_shared.js";
import { validateDisplayName, validatePublicText } from "./_moderation.js";
import {
  formatAuthorName,
  isReservedByMember,
  resolveGuestIdentity,
  validateGuestName,
} from "./_guest-identity.js";
import { getOrCreateGuestVoteIdentifier } from "./_vote.js";

export async function onRequestGet(context) {
  try {
    const db = getDb(context);
    const user = await getCurrentUser(context);
    const url = new URL(context.request.url);
    const rawImageIndex = url.searchParams.get("imageIndex");
    const imageKey = normalizeImageKey(url.searchParams.get("imageKey"), rawImageIndex);
    const imageIndex = Number(rawImageIndex);
    const guestVote = user ? { identifier: "", cookie: "" } : await getOrCreateGuestVoteIdentifier(context.request);

    if (!imageKey || !Number.isInteger(imageIndex)) {
      return json({ message: "사진 번호가 올바르지 않습니다." }, 400);
    }

    if (!(await canUseImageKey(db, imageKey))) {
      return json({ submissions: [] });
    }

    const { results } = await db
      .prepare(
        `SELECT
           submissions.id,
           submissions.image_index,
           submissions.image_src,
           submissions.title,
           submissions.author_user_id,
           submissions.guest_name,
           submissions.guest_tag,
           submissions.created_at,
           users.username,
           users.is_profile_public,
           users.profile_image_url,
           COUNT(DISTINCT likes.id) AS like_count,
           MAX(
             CASE
               WHEN (? IS NOT NULL AND likes.user_id = ?) OR (? != '' AND likes.guest_identifier = ?)
               THEN 1
               ELSE 0
             END
           ) AS liked_by_me
         FROM submissions
         LEFT JOIN users ON users.id = submissions.author_user_id
         LEFT JOIN likes ON likes.submission_id = submissions.id
         WHERE COALESCE(submissions.image_key, CAST(submissions.image_index AS TEXT)) = ?
           AND submissions.hidden_at IS NULL
           AND submissions.deleted_at IS NULL
           AND submissions.excluded_from_ranking = 0
         GROUP BY submissions.id
         ORDER BY like_count DESC, submissions.created_at DESC`
      )
      .bind(user?.id || null, user?.id || null, guestVote.identifier, guestVote.identifier, imageKey)
      .all();

    const submissions = await Promise.all((results || []).map((row) => withComments(db, row, user)));
    return json({ submissions }, 200, guestVote.cookie ? { "set-cookie": guestVote.cookie } : {});
  } catch (error) {
    console.error("submissions/list error", error);
    return json({ message: "제목 목록을 불러오지 못했습니다." }, 500);
  }
}

export async function onRequestPost(context) {
  try {
    const db = getDb(context);
    const user = await getCurrentUser(context);
    const body = await readJson(context.request);
    const imageIndex = Number(body?.imageIndex);
    const imageKey = normalizeImageKey(body?.imageKey, body?.imageIndex);
    const imageSrc = typeof body?.imageSrc === "string" ? body.imageSrc.trim() : "";
    const title = typeof body?.title === "string" ? body.title.trim() : "";
    const guestName = typeof body?.guestName === "string" ? body.guestName.trim() : "";

    if (!Number.isInteger(imageIndex) || !imageKey || !imageSrc || !title) {
      return json({ message: "제목 정보가 올바르지 않습니다." }, 400);
    }

    if (!user && !guestName) {
      return json({ message: "비회원 이름을 입력하세요." }, 400);
    }

    const titleValidation = validatePublicText(title, "제목");
    if (!titleValidation.ok) {
      return json({ message: titleValidation.message }, 400);
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

    if (!(await canUseImageKey(db, imageKey))) {
      return json({ message: "공개된 사진에만 제목을 입력할 수 있습니다." }, 403);
    }

    const guestIdentity = user
      ? { tag: null, cookie: "" }
      : await resolveGuestIdentity(context.request, guestName);
    const guestHeaders = guestIdentity.cookie ? { "set-cookie": guestIdentity.cookie } : {};
    const duplicateRow = await findRecentDuplicateSubmission(db, {
      imageKey,
      title,
      user,
      guestName,
      guestTag: guestIdentity.tag,
    });

    if (duplicateRow) {
      return json({ submission: await withComments(db, duplicateRow, user) }, 200, guestHeaders);
    }

    const result = await db
      .prepare(
        `INSERT INTO submissions (image_index, image_key, image_src, title, author_user_id, guest_name, guest_tag)
         VALUES (?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        imageIndex,
        imageKey,
        imageSrc,
        title,
        user?.id || null,
        user ? null : guestName,
        user ? null : guestIdentity.tag
      )
      .run();

    const row = await db
      .prepare(
        `SELECT submissions.id, submissions.image_index, submissions.image_key, submissions.image_src, submissions.title,
                submissions.author_user_id,
                submissions.guest_name, submissions.guest_tag, submissions.created_at, users.username,
                users.is_profile_public, users.profile_image_url,
                0 AS like_count, 0 AS liked_by_me
         FROM submissions
         LEFT JOIN users ON users.id = submissions.author_user_id
         WHERE submissions.id = ?`
      )
      .bind(result.meta.last_row_id)
      .first();

    return json({ submission: await withComments(db, row, user) }, 201, guestHeaders);
  } catch (error) {
    console.error("submissions/create error", error);
    return json({ message: "제목을 저장하지 못했습니다." }, 500);
  }
}

async function findRecentDuplicateSubmission(db, { imageKey, title, user, guestName, guestTag }) {
  const authorCondition = user
    ? "submissions.author_user_id = ?"
    : "submissions.author_user_id IS NULL AND submissions.guest_name = ? AND submissions.guest_tag IS ?";
  const authorValues = user ? [user.id] : [guestName, guestTag || null];

  return db
    .prepare(
      `SELECT submissions.id, submissions.image_index, submissions.image_key, submissions.image_src, submissions.title,
              submissions.author_user_id,
              submissions.guest_name, submissions.guest_tag, submissions.created_at, users.username,
              users.is_profile_public, users.profile_image_url,
              0 AS like_count, 0 AS liked_by_me
       FROM submissions
       LEFT JOIN users ON users.id = submissions.author_user_id
       WHERE COALESCE(submissions.image_key, CAST(submissions.image_index AS TEXT)) = ?
         AND submissions.title = ?
         AND ${authorCondition}
         AND submissions.hidden_at IS NULL
         AND submissions.deleted_at IS NULL
         AND submissions.created_at >= datetime('now', '-10 seconds')
       ORDER BY submissions.created_at DESC, submissions.id DESC
       LIMIT 1`
    )
    .bind(imageKey, title, ...authorValues)
    .first();
}

async function withComments(db, row, user) {
  const { results } = await db
    .prepare(
      `SELECT comments.id, comments.text, comments.created_at, comments.author_user_id,
              comments.guest_name, comments.guest_tag, users.username, users.is_profile_public, users.profile_image_url
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
    authorUserId: row.author_user_id ? String(row.author_user_id) : "",
    author: formatAuthorName(row),
    authorIsProfilePublic: row.author_user_id ? row.is_profile_public !== 0 : true,
    authorProfileImageUrl: row.is_profile_public !== 0 ? row.profile_image_url || "" : "",
    createdAt: row.created_at,
    likes: Number(row.like_count) || 0,
    likedByMe: Boolean(row.liked_by_me),
    canDelete: Boolean(user && row.author_user_id === user.id),
    comments: (results || []).map((comment) => ({
      id: String(comment.id),
      authorUserId: comment.author_user_id ? String(comment.author_user_id) : "",
      author: formatAuthorName(comment),
      authorIsProfilePublic: comment.author_user_id ? comment.is_profile_public !== 0 : true,
      authorProfileImageUrl: comment.is_profile_public !== 0 ? comment.profile_image_url || "" : "",
      text: comment.text,
      createdAt: comment.created_at,
      canDelete: Boolean(user && comment.author_user_id === user.id),
    })),
  };
}

function normalizeImageKey(value, fallbackIndex) {
  const raw = typeof value === "string" ? value.trim() : "";

  if (raw) {
    return raw.slice(0, 160);
  }

  const imageIndex = Number(fallbackIndex);
  return Number.isInteger(imageIndex) ? String(imageIndex) : "";
}

async function canUseImageKey(db, imageKey) {
  if (!imageKey.startsWith("uploaded:")) {
    return true;
  }

  const imageId = imageKey.slice("uploaded:".length);
  const row = await db
    .prepare("SELECT status FROM uploaded_images WHERE id = ? LIMIT 1")
    .bind(imageId)
    .first();

  return row?.status === "approved";
}
