ALTER TABLE users ADD COLUMN status TEXT NOT NULL DEFAULT 'active';
ALTER TABLE users ADD COLUMN blocked_reason TEXT;
ALTER TABLE users ADD COLUMN blocked_until TEXT;
ALTER TABLE users ADD COLUMN theme_preference TEXT NOT NULL DEFAULT 'dark';

CREATE TABLE IF NOT EXISTS reports (
  id TEXT PRIMARY KEY,
  target_type TEXT NOT NULL,
  target_id TEXT NOT NULL,
  reporter_user_id INTEGER,
  reporter_fingerprint TEXT,
  reason TEXT NOT NULL,
  detail TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  reviewed_at TEXT,
  reviewed_by INTEGER,
  FOREIGN KEY (reporter_user_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL,
  CHECK (target_type IN ('photo', 'title', 'comment')),
  CHECK (status IN ('pending', 'reviewing', 'resolved', 'dismissed'))
);

CREATE INDEX IF NOT EXISTS idx_reports_target ON reports(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_reports_status_created_at ON reports(status, created_at);
CREATE INDEX IF NOT EXISTS idx_reports_reporter_user_id ON reports(reporter_user_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_reports_user_once ON reports(target_type, target_id, reporter_user_id) WHERE reporter_user_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_reports_guest_once ON reports(target_type, target_id, reporter_fingerprint) WHERE reporter_user_id IS NULL AND reporter_fingerprint IS NOT NULL;

CREATE TABLE IF NOT EXISTS user_restrictions (
  id TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL,
  restriction_type TEXT NOT NULL,
  reason TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at TEXT,
  created_by INTEGER,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  CHECK (restriction_type IN ('write', 'upload', 'message'))
);

CREATE INDEX IF NOT EXISTS idx_user_restrictions_user_type ON user_restrictions(user_id, restriction_type);
CREATE INDEX IF NOT EXISTS idx_user_restrictions_expires_at ON user_restrictions(expires_at);

CREATE TABLE IF NOT EXISTS user_badges (
  id TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL,
  badge_key TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(user_id, badge_key)
);

CREATE INDEX IF NOT EXISTS idx_user_badges_user_id ON user_badges(user_id);
