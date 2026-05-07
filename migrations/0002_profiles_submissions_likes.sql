ALTER TABLE users ADD COLUMN profile_image_url TEXT;

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
  user_id INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (submission_id) REFERENCES submissions(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(user_id, submission_id)
);

CREATE INDEX IF NOT EXISTS idx_submissions_image_index ON submissions(image_index);
CREATE INDEX IF NOT EXISTS idx_submissions_author_user_id ON submissions(author_user_id);
CREATE INDEX IF NOT EXISTS idx_comments_submission_id ON comments(submission_id);
CREATE INDEX IF NOT EXISTS idx_likes_submission_id ON likes(submission_id);
