-- 오늘의 짤 운영자 지정(하이브리드 선정의 오버라이드). 지정이 없는 날은 갤러리 결정적 로테이션.
CREATE TABLE IF NOT EXISTS daily_featured (
  feature_date TEXT PRIMARY KEY,
  image_key TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
