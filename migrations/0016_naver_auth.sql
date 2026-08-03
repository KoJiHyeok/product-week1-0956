ALTER TABLE users ADD COLUMN naver_sub TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_users_naver_sub ON users(naver_sub);
