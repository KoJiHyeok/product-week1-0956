export async function ensureMessagesSchema(db) {
  await db
    .prepare(
      `CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sender_user_id INTEGER NOT NULL,
        recipient_user_id INTEGER NOT NULL,
        body TEXT NOT NULL,
        read_at TEXT,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (sender_user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (recipient_user_id) REFERENCES users(id) ON DELETE CASCADE,
        CHECK (sender_user_id != recipient_user_id)
      )`
    )
    .run();

  await db.prepare("CREATE INDEX IF NOT EXISTS idx_messages_recipient_created_at ON messages(recipient_user_id, created_at)").run();
  await db.prepare("CREATE INDEX IF NOT EXISTS idx_messages_recipient_read_at ON messages(recipient_user_id, read_at)").run();
  await db.prepare("CREATE INDEX IF NOT EXISTS idx_messages_sender_user_id ON messages(sender_user_id)").run();
}
