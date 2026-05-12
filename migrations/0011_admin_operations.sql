-- Admin operation phase 2: member status normalization and activity logs.
-- New tables/indexes use IF NOT EXISTS so this migration is safe to apply once
-- even when a fresh database was created from schema.sql.

UPDATE users
SET status = 'suspended'
WHERE status = 'blocked';

UPDATE users
SET status = 'active'
WHERE status IS NULL OR status NOT IN ('active', 'suspended');

CREATE TABLE IF NOT EXISTS admin_logs (
  id TEXT PRIMARY KEY,
  admin_user_id INTEGER,
  admin_email TEXT,
  action_type TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT NOT NULL,
  description TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (admin_user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_admin_logs_created_at ON admin_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_admin_logs_admin_user_id ON admin_logs(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_logs_target ON admin_logs(target_type, target_id);
