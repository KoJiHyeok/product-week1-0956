import { getDb, json } from "../../auth/_shared.js";
import { requireAdmin } from "../_shared.js";
import { formatAuthorName } from "../../submissions/_guest-identity.js";

const validTypes = new Set(["all", "submission", "comment"]);
const validStatuses = new Set(["active", "deleted"]);

export async function onRequestGet(context) {
  try {
    const admin = await requireAdmin(context);

    if (admin.response) {
      return admin.response;
    }

    const url = new URL(context.request.url);
    const type = String(url.searchParams.get("type") || "all");
    const status = String(url.searchParams.get("status") || "active");

    if (!validTypes.has(type)) {
      return json({ message: "콘텐츠 유형이 올바르지 않습니다." }, 400);
    }

    if (!validStatuses.has(status)) {
      return json({ message: "콘텐츠 상태가 올바르지 않습니다." }, 400);
    }

    const submissionDeletedClause =
      status === "deleted" ? "submissions.deleted_at IS NOT NULL" : "submissions.deleted_at IS NULL";
    const commentDeletedClause =
      status === "deleted" ? "comments.deleted_at IS NOT NULL" : "comments.deleted_at IS NULL";

    const db = getDb(context);
    const items = [];

    if (type === "all" || type === "submission") {
      const { results } = await db
        .prepare(
          `SELECT submissions.id, submissions.image_index, submissions.image_key, submissions.title,
                  submissions.author_user_id, submissions.guest_name, submissions.guest_tag, submissions.created_at,
                  submissions.hidden_at, submissions.hidden_reason, submissions.deleted_at,
                  submissions.deleted_reason, submissions.excluded_from_ranking,
                  users.username, users.email, users.login_id,
                  COUNT(DISTINCT likes.id) AS like_count,
                  COUNT(DISTINCT comments.id) AS comment_count
           FROM submissions
           LEFT JOIN users ON users.id = submissions.author_user_id
           LEFT JOIN likes ON likes.submission_id = submissions.id
           LEFT JOIN comments ON comments.submission_id = submissions.id AND comments.deleted_at IS NULL
           WHERE ${submissionDeletedClause}
           GROUP BY submissions.id
           ORDER BY submissions.created_at DESC
           LIMIT 100`
        )
        .all();

      items.push(...(results || []).map(serializeSubmission));
    }

    if (type === "all" || type === "comment") {
      const { results } = await db
        .prepare(
          `SELECT comments.id, comments.submission_id, comments.text, comments.author_user_id,
                  comments.guest_name, comments.guest_tag, comments.created_at, comments.hidden_at, comments.hidden_reason,
                  comments.deleted_at, comments.deleted_reason, comments.excluded_from_ranking,
                  users.username, users.email, users.login_id,
                  submissions.image_index, submissions.image_key, submissions.title AS submission_title
           FROM comments
           LEFT JOIN users ON users.id = comments.author_user_id
           LEFT JOIN submissions ON submissions.id = comments.submission_id
           WHERE ${commentDeletedClause}
           ORDER BY comments.created_at DESC
           LIMIT 100`
        )
        .all();

      items.push(...(results || []).map(serializeComment));
    }

    items.sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime());
    return json({ items: items.slice(0, 200) });
  } catch {
    return json({ message: "제목/댓글 관리 목록을 불러오지 못했습니다." }, 500);
  }
}

function serializeSubmission(row) {
  return {
    id: String(row.id),
    type: "submission",
    imageId: row.image_key || String(row.image_index),
    parentSubmissionId: "",
    content: row.title,
    parentTitle: "",
    author: formatAuthorName(row),
    authorEmail: row.email || "",
    authorLoginId: row.login_id || "",
    createdAt: row.created_at,
    status: getModerationStatus(row),
    hiddenAt: row.hidden_at || "",
    hiddenReason: row.hidden_reason || "",
    deletedAt: row.deleted_at || "",
    deletedReason: row.deleted_reason || "",
    excludedFromRanking: row.excluded_from_ranking !== 0,
    likes: Number(row.like_count) || 0,
    comments: Number(row.comment_count) || 0,
  };
}

function serializeComment(row) {
  return {
    id: String(row.id),
    type: "comment",
    imageId: row.image_key || String(row.image_index || ""),
    parentSubmissionId: row.submission_id ? String(row.submission_id) : "",
    content: row.text,
    parentTitle: row.submission_title || "",
    author: formatAuthorName(row),
    authorEmail: row.email || "",
    authorLoginId: row.login_id || "",
    createdAt: row.created_at,
    status: getModerationStatus(row),
    hiddenAt: row.hidden_at || "",
    hiddenReason: row.hidden_reason || "",
    deletedAt: row.deleted_at || "",
    deletedReason: row.deleted_reason || "",
    excludedFromRanking: row.excluded_from_ranking !== 0,
    likes: 0,
    comments: 0,
  };
}

function getModerationStatus(row) {
  if (row.deleted_at) {
    return "deleted";
  }

  if (row.hidden_at) {
    return "hidden";
  }

  if (row.excluded_from_ranking !== 0) {
    return "ranking_excluded";
  }

  return "visible";
}
