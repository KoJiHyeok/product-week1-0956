import { getCurrentUser, getDb, json } from "../auth/_shared.js";
import { ensureMessagesSchema } from "./_schema.js";

export async function onRequestGet(context) {
  try {
    const user = await getCurrentUser(context);

    if (!user) {
      return json({ unreadCount: 0 });
    }

    const db = getDb(context);
    await ensureMessagesSchema(db);

    const row = await db
      .prepare("SELECT COUNT(*) AS unread_count FROM messages WHERE recipient_user_id = ? AND read_at IS NULL")
      .bind(user.id)
      .first();

    return json({ unreadCount: Number(row?.unread_count) || 0 });
  } catch {
    return json({ message: "알림을 불러오지 못했습니다." }, 500);
  }
}
