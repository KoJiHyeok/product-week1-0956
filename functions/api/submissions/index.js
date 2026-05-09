import { getCurrentUser, getDb, json, readJson } from "../auth/_shared.js";
import { getOrCreateGuestVoteIdentifier, getVoteDate } from "./_vote.js";

export async function onRequestGet(context) {
  try {
    const db = getDb(context);
    const user = await getCurrentUser(context);
    const url = new URL(context.request.url);
    const rawImageIndex = url.searchParams.get("imageIndex");
    const imageIndex = Number(rawImageIndex);
    const guestVote = user ? { identifier: "", cookie: "" } : await getOrCreateGuestVoteIdentifier(context.request);
    const voteDate = getVoteDate();

    if (!Number.isInteger(imageIndex)) {
      return json({ message: "사진 번호가 올바르지 않습니다." }, 400);
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
           submissions.created_at,
           users.username,
           users.is_profile_public,
           users.profile_image_url,
           COUNT(DISTINCT likes.id) AS like_count,
           MAX(
             CASE
               WHEN likes.vote_date = ?
                AND ((? IS NOT NULL AND likes.user_id = ?) OR (? != '' AND likes.guest_identifier = ?))
               THEN 1
               ELSE 0
             END
           ) AS liked_by_me
         FROM submissions
         LEFT JOIN users ON users.id = submissions.author_user_id
         LEFT JOIN likes ON likes.submission_id = submissions.id
         WHERE submissions.image_index = ?
         GROUP BY submissions.id
         ORDER BY like_count DESC, submissions.created_at DESC`
      )
      .bind(voteDate, user?.id || null, user?.id || null, guestVote.identifier, guestVote.identifier, imageIndex)
      .all();

    const submissions = await Promise.all((results || []).map((row) => withComments(db, row, user)));
    return json({ submissions }, 200, guestVote.cookie ? { "set-cookie": guestVote.cookie } : {});
  } catch {
    return json({ message: "제목 목록을 불러오지 못했습니다." }, 500);
  }
}

export async function onRequestPost(context) {
  try {
    const db = getDb(context);
    const user = await getCurrentUser(context);
    const body = await readJson(context.request);
    const imageIndex = Number(body?.imageIndex);
    const imageSrc = typeof body?.imageSrc === "string" ? body.imageSrc.trim() : "";
    const title = typeof body?.title === "string" ? body.title.trim() : "";
    const guestName = typeof body?.guestName === "string" ? body.guestName.trim() : "";

    if (!Number.isInteger(imageIndex) || !imageSrc || !title) {
      return json({ message: "제목 정보가 올바르지 않습니다." }, 400);
    }

    if (!user && !guestName) {
      return json({ message: "비회원 이름을 입력하세요." }, 400);
    }

    const result = await db
      .prepare(
        `INSERT INTO submissions (image_index, image_src, title, author_user_id, guest_name)
         VALUES (?, ?, ?, ?, ?)`
      )
      .bind(imageIndex, imageSrc, title, user?.id || null, user ? null : guestName)
      .run();

    const row = await db
      .prepare(
        `SELECT submissions.id, submissions.image_index, submissions.image_src, submissions.title,
                submissions.author_user_id,
                submissions.guest_name, submissions.created_at, users.username,
                users.is_profile_public, users.profile_image_url,
                0 AS like_count, 0 AS liked_by_me
         FROM submissions
         LEFT JOIN users ON users.id = submissions.author_user_id
         WHERE submissions.id = ?`
      )
      .bind(result.meta.last_row_id)
      .first();

    return json({ submission: await withComments(db, row, user) }, 201);
  } catch {
    return json({ message: "제목을 저장하지 못했습니다." }, 500);
  }
}

async function withComments(db, row, user) {
  const { results } = await db
    .prepare(
      `SELECT comments.id, comments.text, comments.created_at, comments.author_user_id,
              comments.guest_name, users.username, users.is_profile_public, users.profile_image_url
       FROM comments
       LEFT JOIN users ON users.id = comments.author_user_id
       WHERE comments.submission_id = ?
       ORDER BY comments.created_at ASC`
    )
    .bind(row.id)
    .all();

  return {
    id: String(row.id),
    imageIndex: row.image_index,
    imageSrc: row.image_src,
    title: row.title,
    author: row.username || row.guest_name || "비회원",
    authorIsProfilePublic: row.author_user_id ? row.is_profile_public !== 0 : true,
    authorProfileImageUrl: row.is_profile_public !== 0 ? row.profile_image_url || "" : "",
    createdAt: row.created_at,
    likes: Number(row.like_count) || 0,
    likedByMe: Boolean(row.liked_by_me),
    canDelete: Boolean(user && row.author_user_id === user.id),
    comments: (results || []).map((comment) => ({
      id: String(comment.id),
      author: comment.username || comment.guest_name || "비회원",
      authorIsProfilePublic: comment.author_user_id ? comment.is_profile_public !== 0 : true,
      authorProfileImageUrl: comment.is_profile_public !== 0 ? comment.profile_image_url || "" : "",
      text: comment.text,
      createdAt: comment.created_at,
      canDelete: Boolean(user && comment.author_user_id === user.id),
    })),
  };
}
