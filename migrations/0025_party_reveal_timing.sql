-- 파티 모드: 라운드 공개(reveal) 시작 시각을 서버가 기록해, 모든 참가자가
-- 자기 시계가 아니라 이 값 기준으로 같은 순간에 같은 순서로 제목을 보게 한다.
ALTER TABLE party_rooms ADD COLUMN reveal_started_at INTEGER;
