import { getCurrentUser, getDb, json } from "../auth/_shared.js";
import { ensureMessagesSchema } from "./_schema.js";

export async function onRequestGet(context) {
  try {
    const user = await getCurrentUser(context);

    if (!user) {
      return json({ message: "로그인이 필요합니다." }, 401);
    }

    const messageId = Number(context.params.id);

    if (!Number.isInteger(messageId)) {
      return json({ message: "쪽지 정보가 올바르지 않습니다." }, 400);
    }

    const db = getDb(context);
    await ensureMessagesSchema(db);

    const message = await db
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
         WHERE messages.id = ? AND messages.recipient_user_id = ?
         LIMIT 1`
      )
      .bind(messageId, user.id)
      .first();

    if (!message) {
      return json({ message: "쪽지를 찾을 수 없습니다." }, 404);
    }

    let readAt = message.read_at || "";

    if (!readAt) {
      readAt = new Date().toISOString();
      await db.prepare("UPDATE messages SET read_at = ? WHERE id = ? AND recipient_user_id = ?").bind(readAt, messageId, user.id).run();
    }

    return json({
      message: {
        id: String(message.id),
        sender: {
          id: String(message.sender_id),
          username: message.sender_username,
          isProfilePublic: message.sender_is_profile_public !== 0,
          profileImageUrl: message.sender_is_profile_public !== 0 ? message.sender_profile_image_url || "" : "",
        },
        body: message.body,
        readAt,
        createdAt: message.created_at,
      },
    });
  } catch {
    return json({ message: "쪽지를 불러오지 못했습니다." }, 500);
  }
}
