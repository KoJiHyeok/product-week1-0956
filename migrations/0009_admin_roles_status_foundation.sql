UPDATE users
SET role = 'user'
WHERE role IS NULL OR role NOT IN ('user', 'admin', 'owner');

UPDATE users
SET role = 'owner'
WHERE lower(email) = 'wlgur2101@gmail.com'
  AND (email_verified_at IS NOT NULL OR auth_provider IN ('google', 'password_google'));

PRAGMA foreign_keys = OFF;

CREATE TABLE IF NOT EXISTS uploaded_images_next (
  id TEXT PRIMARY KEY,
  uploader_user_id INTEGER NOT NULL,
  storage_key TEXT NOT NULL,
  thumbnail_key TEXT,
  alt_text TEXT,
  source_type TEXT NOT NULL,
  source_url TEXT,
  author_name TEXT,
  license_name TEXT,
  attribution_required INTEGER NOT NULL DEFAULT 0,
  uploader_confirmed_rights INTEGER NOT NULL DEFAULT 0,
  no_rights_violation_confirmed INTEGER NOT NULL DEFAULT 0,
  prohibited_content_confirmed INTEGER NOT NULL DEFAULT 0,
  policy_agreed INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending',
  moderation_reason TEXT,
  report_count INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  reviewed_at TEXT,
  reviewed_by INTEGER,
  FOREIGN KEY (uploader_user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL,
  CHECK (source_type IN ('self', 'free_site', 'other')),
  CHECK (status IN ('pending', 'approved', 'rejected', 'deleted'))
);

INSERT INTO uploaded_images_next (
  id, uploader_user_id, storage_key, thumbnail_key, alt_text, source_type, source_url,
  author_name, license_name, attribution_required, uploader_confirmed_rights,
  no_rights_violation_confirmed, prohibited_content_confirmed, policy_agreed,
  status, moderation_reason, report_count, created_at, reviewed_at, reviewed_by
)
SELECT
  id, uploader_user_id, storage_key, thumbnail_key, alt_text, source_type, source_url,
  author_name, license_name, attribution_required, uploader_confirmed_rights,
  no_rights_violation_confirmed, prohibited_content_confirmed, policy_agreed,
  CASE status
    WHEN 'hidden' THEN 'rejected'
    WHEN 'removed' THEN 'deleted'
    WHEN 'pending' THEN 'pending'
    WHEN 'approved' THEN 'approved'
    WHEN 'rejected' THEN 'rejected'
    ELSE 'pending'
  END,
  moderation_reason, report_count, created_at, reviewed_at, reviewed_by
FROM uploaded_images;

DROP TABLE uploaded_images;
ALTER TABLE uploaded_images_next RENAME TO uploaded_images;

CREATE INDEX IF NOT EXISTS idx_uploaded_images_status_created_at ON uploaded_images(status, created_at);
CREATE INDEX IF NOT EXISTS idx_uploaded_images_uploader_user_id ON uploaded_images(uploader_user_id);
CREATE INDEX IF NOT EXISTS idx_uploaded_images_report_count ON uploaded_images(report_count);

CREATE TABLE IF NOT EXISTS reports_next (
  id TEXT PRIMARY KEY,
  target_type TEXT NOT NULL,
  target_id TEXT NOT NULL,
  reporter_user_id INTEGER,
  reporter_fingerprint TEXT,
  reason TEXT NOT NULL,
  detail TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  reviewed_at TEXT,
  reviewed_by INTEGER,
  FOREIGN KEY (reporter_user_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL,
  CHECK (target_type IN ('photo', 'title', 'comment')),
  CHECK (status IN ('new', 'reviewing', 'resolved', 'rejected'))
);

INSERT INTO reports_next (
  id, target_type, target_id, reporter_user_id, reporter_fingerprint, reason,
  detail, status, created_at, reviewed_at, reviewed_by
)
SELECT
  id, target_type, target_id, reporter_user_id, reporter_fingerprint, reason,
  detail,
  CASE status
    WHEN 'pending' THEN 'new'
    WHEN 'dismissed' THEN 'rejected'
    WHEN 'new' THEN 'new'
    WHEN 'reviewing' THEN 'reviewing'
    WHEN 'resolved' THEN 'resolved'
    WHEN 'rejected' THEN 'rejected'
    ELSE 'new'
  END,
  created_at, reviewed_at, reviewed_by
FROM reports;

DROP TABLE reports;
ALTER TABLE reports_next RENAME TO reports;

CREATE INDEX IF NOT EXISTS idx_reports_target ON reports(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_reports_status_created_at ON reports(status, created_at);
CREATE INDEX IF NOT EXISTS idx_reports_reporter_user_id ON reports(reporter_user_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_reports_user_once ON reports(target_type, target_id, reporter_user_id) WHERE reporter_user_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_reports_guest_once ON reports(target_type, target_id, reporter_fingerprint) WHERE reporter_user_id IS NULL AND reporter_fingerprint IS NOT NULL;

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS contact_inquiries (
  id TEXT PRIMARY KEY,
  user_id INTEGER,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  reply_email TEXT NOT NULL,
  body TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  reviewed_at TEXT,
  reviewed_by INTEGER,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL,
  CHECK (status IN ('new', 'reviewing', 'resolved', 'ignored'))
);

CREATE INDEX IF NOT EXISTS idx_contact_inquiries_status_created_at ON contact_inquiries(status, created_at);
CREATE INDEX IF NOT EXISTS idx_contact_inquiries_user_id ON contact_inquiries(user_id);
