ALTER TABLE users ADD COLUMN role TEXT NOT NULL DEFAULT 'user';

ALTER TABLE submissions ADD COLUMN image_key TEXT;

UPDATE submissions
SET image_key = CAST(image_index AS TEXT)
WHERE image_key IS NULL;

CREATE INDEX IF NOT EXISTS idx_submissions_image_key ON submissions(image_key);

CREATE TABLE IF NOT EXISTS uploaded_images (
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
  CHECK (status IN ('pending', 'approved', 'rejected', 'hidden', 'removed'))
);

CREATE INDEX IF NOT EXISTS idx_uploaded_images_status_created_at ON uploaded_images(status, created_at);
CREATE INDEX IF NOT EXISTS idx_uploaded_images_uploader_user_id ON uploaded_images(uploader_user_id);
CREATE INDEX IF NOT EXISTS idx_uploaded_images_report_count ON uploaded_images(report_count);

CREATE TABLE IF NOT EXISTS image_reports (
  id TEXT PRIMARY KEY,
  image_id TEXT NOT NULL,
  reporter_user_id INTEGER,
  reporter_fingerprint TEXT,
  reason TEXT NOT NULL,
  detail TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (image_id) REFERENCES uploaded_images(id) ON DELETE CASCADE,
  FOREIGN KEY (reporter_user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_image_reports_image_id ON image_reports(image_id);
CREATE INDEX IF NOT EXISTS idx_image_reports_reporter_user_id ON image_reports(reporter_user_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_image_reports_user_once ON image_reports(image_id, reporter_user_id) WHERE reporter_user_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_image_reports_guest_once ON image_reports(image_id, reporter_fingerprint) WHERE reporter_user_id IS NULL AND reporter_fingerprint IS NOT NULL;
