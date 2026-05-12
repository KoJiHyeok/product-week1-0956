ALTER TABLE submissions ADD COLUMN hidden_at TEXT;
ALTER TABLE submissions ADD COLUMN hidden_reason TEXT;
ALTER TABLE submissions ADD COLUMN deleted_at TEXT;
ALTER TABLE submissions ADD COLUMN deleted_reason TEXT;
ALTER TABLE submissions ADD COLUMN excluded_from_ranking INTEGER NOT NULL DEFAULT 0;

ALTER TABLE comments ADD COLUMN hidden_at TEXT;
ALTER TABLE comments ADD COLUMN hidden_reason TEXT;
ALTER TABLE comments ADD COLUMN deleted_at TEXT;
ALTER TABLE comments ADD COLUMN deleted_reason TEXT;
ALTER TABLE comments ADD COLUMN excluded_from_ranking INTEGER NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_submissions_visibility
ON submissions(hidden_at, deleted_at, excluded_from_ranking);

CREATE INDEX IF NOT EXISTS idx_comments_visibility
ON comments(hidden_at, deleted_at);
