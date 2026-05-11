CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  login_id TEXT NOT NULL UNIQUE,
  email TEXT UNIQUE,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  email_verified_at TEXT,
  google_sub TEXT UNIQUE,
  auth_provider TEXT NOT NULL DEFAULT 'password',
  bio TEXT NOT NULL DEFAULT '',
  is_profile_public INTEGER NOT NULL DEFAULT 1,
  profile_image_url TEXT,
  role TEXT NOT NULL DEFAULT 'user',
  status TEXT NOT NULL DEFAULT 'active',
  blocked_reason TEXT,
  blocked_until TEXT,
  theme_preference TEXT NOT NULL DEFAULT 'dark',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);

CREATE TABLE IF NOT EXISTS email_verification_tokens (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  token_hash TEXT NOT NULL UNIQUE,
  user_id INTEGER NOT NULL,
  email TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at TEXT NOT NULL,
  used_at TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_email_verification_tokens_user_id ON email_verification_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_email_verification_tokens_expires_at ON email_verification_tokens(expires_at);

CREATE TABLE IF NOT EXISTS submissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  image_index INTEGER NOT NULL,
  image_key TEXT,
  image_src TEXT NOT NULL,
  title TEXT NOT NULL,
  author_user_id INTEGER,
  guest_name TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (author_user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  submission_id INTEGER NOT NULL,
  author_user_id INTEGER,
  guest_name TEXT,
  text TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (submission_id) REFERENCES submissions(id) ON DELETE CASCADE,
  FOREIGN KEY (author_user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS likes (
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

CREATE INDEX IF NOT EXISTS idx_submissions_image_index ON submissions(image_index);
CREATE INDEX IF NOT EXISTS idx_submissions_image_key ON submissions(image_key);
CREATE INDEX IF NOT EXISTS idx_submissions_author_user_id ON submissions(author_user_id);
CREATE INDEX IF NOT EXISTS idx_comments_submission_id ON comments(submission_id);
CREATE INDEX IF NOT EXISTS idx_likes_submission_id ON likes(submission_id);
CREATE INDEX IF NOT EXISTS idx_likes_vote_date ON likes(vote_date);
CREATE UNIQUE INDEX IF NOT EXISTS idx_likes_user_vote_date ON likes(user_id, vote_date) WHERE user_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_likes_guest_vote_date ON likes(guest_identifier, vote_date) WHERE guest_identifier IS NOT NULL;

CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sender_user_id INTEGER NOT NULL,
  recipient_user_id INTEGER NOT NULL,
  body TEXT NOT NULL,
  read_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sender_user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (recipient_user_id) REFERENCES users(id) ON DELETE CASCADE,
  CHECK (sender_user_id != recipient_user_id)
);

CREATE INDEX IF NOT EXISTS idx_messages_recipient_created_at ON messages(recipient_user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_messages_recipient_read_at ON messages(recipient_user_id, read_at);
CREATE INDEX IF NOT EXISTS idx_messages_sender_user_id ON messages(sender_user_id);

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
  CHECK (status IN ('pending', 'approved', 'rejected', 'deleted'))
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

CREATE TABLE IF NOT EXISTS reports (
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

CREATE INDEX IF NOT EXISTS idx_reports_target ON reports(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_reports_status_created_at ON reports(status, created_at);
CREATE INDEX IF NOT EXISTS idx_reports_reporter_user_id ON reports(reporter_user_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_reports_user_once ON reports(target_type, target_id, reporter_user_id) WHERE reporter_user_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_reports_guest_once ON reports(target_type, target_id, reporter_fingerprint) WHERE reporter_user_id IS NULL AND reporter_fingerprint IS NOT NULL;

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
