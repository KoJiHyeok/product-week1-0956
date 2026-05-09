CREATE TABLE IF NOT EXISTS likes_daily_migration (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  submission_id INTEGER NOT NULL,
  user_id INTEGER,
  guest_identifier TEXT,
  vote_date TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (submission_id) REFERENCES submissions(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CHECK (user_id IS NOT NULL OR guest_identifier IS NOT NULL)
);

INSERT INTO likes_daily_migration (id, submission_id, user_id, guest_identifier, vote_date, created_at)
SELECT id, submission_id, user_id, NULL, date(created_at), created_at
FROM likes
WHERE id IN (
  SELECT MIN(id)
  FROM likes
  GROUP BY user_id, date(created_at)
);

DROP TABLE likes;

ALTER TABLE likes_daily_migration RENAME TO likes;

CREATE UNIQUE INDEX IF NOT EXISTS idx_likes_user_vote_date ON likes(user_id, vote_date) WHERE user_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_likes_guest_vote_date ON likes(guest_identifier, vote_date) WHERE guest_identifier IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_likes_submission_id ON likes(submission_id);
CREATE INDEX IF NOT EXISTS idx_likes_vote_date ON likes(vote_date);
