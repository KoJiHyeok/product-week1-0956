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
CREATE INDEX IF NOT EXISTS idx_submissions_author_user_id ON submissions(author_user_id);
CREATE INDEX IF NOT EXISTS idx_comments_submission_id ON comments(submission_id);
CREATE INDEX IF NOT EXISTS idx_likes_submission_id ON likes(submission_id);
CREATE INDEX IF NOT EXISTS idx_likes_vote_date ON likes(vote_date);
CREATE UNIQUE INDEX IF NOT EXISTS idx_likes_user_vote_date ON likes(user_id, vote_date) WHERE user_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_likes_guest_vote_date ON likes(guest_identifier, vote_date) WHERE guest_identifier IS NOT NULL;
