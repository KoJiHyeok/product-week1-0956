-- 파티 모드: 시간 기반 자동 공개(reveal_started_at, migration 0025)를 버리고
-- 방장이 "다음 제목" 버튼을 눌러 한 명씩 공개하는 방식으로 바꾼다.
-- reveal_index = 지금까지 공개된 제목 수, vote_deadline_at = 15초 투표 마감 시각.
ALTER TABLE party_rooms ADD COLUMN reveal_index INTEGER NOT NULL DEFAULT 0;
ALTER TABLE party_rooms ADD COLUMN vote_deadline_at INTEGER;
