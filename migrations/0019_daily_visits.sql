-- 일일 방문자 집계. visitor_hash는 KST 날짜별로 로테이트되는 SHA-256(날짜|IP|UA|salt)이라
-- 원본 IP/UA는 저장되지 않는다.
CREATE TABLE IF NOT EXISTS daily_visits (
  visit_date TEXT NOT NULL,
  visitor_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (visit_date, visitor_hash)
);
