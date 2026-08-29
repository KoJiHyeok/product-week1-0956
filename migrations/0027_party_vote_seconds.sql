-- 파티 방 투표 시간을 방장이 조절할 수 있도록 컬럼 추가(기본 15초, 기존 상수와 동일).
ALTER TABLE party_rooms ADD COLUMN vote_seconds INTEGER NOT NULL DEFAULT 15;
