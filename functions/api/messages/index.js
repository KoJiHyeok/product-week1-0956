import { getCurrentUser, getDb, json, readJson } from "../auth/_shared.js";
import { ensureMessagesSchema } from "./_schema.js";

const MAX_MESSAGE_LENGTH = 1000;

export async function onRequestGet(context) {
  try {
    const user = await getCurrentUser(context);

    if (!user) {
      return json({ message: "로그인이 필요합니다." }, 401);
    }

    const db = getDb(context);
    await ensureMessagesSchema(db);

    const { results } = await db
      .prepare(
        `SELECT
           messages.id,
           messages.body,
           messages.read_at,
           messages.created_at,
           users.id AS sender_id,
           users.username AS sender_username,
           users.is_profile_public AS sender_is_profile_public,
           users.profile_image_url AS sender_profile_image_url
         FROM messages
         JOIN users ON users.id = messages.sender_user_id
         WHERE messages.recipient_user_id = ?
         ORDER BY messages.created_at DESC`
      )
      .bind(user.id)
      .all();

    return json({
      messages: (results || []).map((message) => ({
        id: String(message.id),
        sender: {
          id: String(message.sender_id),
          username: message.sender_username,
          isProfilePublic: message.sender_is_profile_public !== 0,
          profileImageUrl: message.sender_is_profile_public !== 0 ? message.sender_profile_image_url || "" : "",
        },
        preview: makePreview(message.body),
        readAt: message.read_at || "",
        createdAt: message.created_at,
      })),
    });
  } catch {
    return json({ message: "쪽지 목록을 불러오지 못했습니다." }, 500);
  }
}

export async function onRequestPost(context) {
  try {
    const user = await getCurrentUser(context);

    if (!user) {
      return json({ message: "로그인이 필요합니다." }, 401);
    }

    const body = await readJson(context.request);
    const recipientUserId = Number(body?.recipientUserId);
    const messageBody = normalizeMessage(body?.body);

    if (!Number.isInteger(recipientUserId)) {
      return json({ message: "받는 사람 정보가 올바르지 않습니다." }, 400);
    }

    if (!messageBody) {
      return json({ message: "쪽지 내용을 입력하세요." }, 400);
    }

    if (recipientUserId === user.id) {
      return json({ message: "본인에게는 쪽지를 보낼 수 없습니다." }, 400);
    }

    const db = getDb(context);
    await ensureMessagesSchema(db);

    const recipient = await db.prepare("SELECT id, username FROM users WHERE id = ? LIMIT 1").bind(recipientUserId).first();

    if (!recipient) {
      return json({ message: "받는 회원을 찾을 수 없습니다." }, 404);
    }

    const result = await db
      .prepare("INSERT INTO messages (sender_user_id, recipient_user_id, body) VALUES (?, ?, ?)")
      .bind(user.id, recipientUserId, messageBody)
      .run();

    return json(
      {
        message: {
          id: String(result.meta.last_row_id),
          recipient: {
            id: String(recipient.id),
            username: recipient.username,
          },
          body: messageBody,
        },
      },
      201
    );
  } catch {
    return json({ message: "쪽지를 보내지 못했습니다." }, 500);
  }
}

function normalizeMessage(value) {
  return typeof value === "string" ? value.trim().slice(0, MAX_MESSAGE_LENGTH) : "";
}

function makePreview(body) {
  const normalized = normalizeMessage(body).replace(/\s+/g, " ");
  return normalized.length > 60 ? `${normalized.slice(0, 60)}...` : normalized;
}
