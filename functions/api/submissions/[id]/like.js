import { getCurrentUser, getDb, json } from "../../auth/_shared.js";
import { getOrCreateGuestVoteIdentifier, getVoteDate } from "../_vote.js";

export async function onRequestPost(context) {
  try {
    const user = await getCurrentUser(context);
    const db = getDb(context);
    const submissionId = Number(context.params.id);
    const guestVote = user ? { identifier: "", cookie: "" } : await getOrCreateGuestVoteIdentifier(context.request);
    const voteDate = getVoteDate();

    if (!Number.isInteger(submissionId)) {
      return json({ message: "제목 정보가 올바르지 않습니다." }, 400);
    }

    const submission = await db.prepare("SELECT id FROM submissions WHERE id = ? LIMIT 1").bind(submissionId).first();

    if (!submission) {
      return json({ message: "제목을 찾을 수 없습니다." }, 404);
    }

    const existing = await db
      .prepare(
        user
          ? "SELECT id, submission_id FROM likes WHERE user_id = ? AND vote_date = ? LIMIT 1"
          : "SELECT id, submission_id FROM likes WHERE guest_identifier = ? AND vote_date = ? LIMIT 1"
      )
      .bind(user ? user.id : guestVote.identifier, voteDate)
      .first();

    if (existing) {
      const count = await countLikes(db, submissionId);

      return json(
        {
          liked: Number(existing.submission_id) === submissionId,
          likes: count,
          dailyVoteUsed: true,
          message: "투표는 하루에 한 번만 가능합니다.",
        },
        409,
        guestVote.cookie ? { "set-cookie": guestVote.cookie } : {}
      );
    }

    await db
      .prepare("INSERT INTO likes (submission_id, user_id, guest_identifier, vote_date) VALUES (?, ?, ?, ?)")
      .bind(submissionId, user?.id || null, user ? null : guestVote.identifier, voteDate)
      .run();

    return json(
      {
        liked: true,
        likes: await countLikes(db, submissionId),
        dailyVoteUsed: true,
      },
      200,
      guestVote.cookie ? { "set-cookie": guestVote.cookie } : {}
    );
  } catch {
    return json({ message: "하트를 처리하지 못했습니다." }, 500);
  }
}

async function countLikes(db, submissionId) {
  const count = await db
    .prepare("SELECT COUNT(*) AS like_count FROM likes WHERE submission_id = ?")
    .bind(submissionId)
    .first();

  return Number(count?.like_count) || 0;
}
