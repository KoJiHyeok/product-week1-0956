-- 디스코드 일일 갤러리 후보 이미지(Openverse 큐레이션) 기록.
-- 추가형 변경만 사용한다(CREATE TABLE IF NOT EXISTS / CREATE INDEX IF NOT EXISTS).

CREATE TABLE IF NOT EXISTS daily_image_candidates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  candidate_date TEXT NOT NULL,        -- KST YYYY-MM-DD
  slot INTEGER NOT NULL,               -- 그날 몇 번(1~6)
  openverse_id TEXT NOT NULL UNIQUE,   -- 중복 방지 키
  image_url TEXT NOT NULL,
  landing_url TEXT NOT NULL DEFAULT '',
  license TEXT NOT NULL DEFAULT '',
  creator TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL DEFAULT '',
  query TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP)
);
CREATE INDEX IF NOT EXISTS idx_daily_image_candidates_date ON daily_image_candidates(candidate_date);
