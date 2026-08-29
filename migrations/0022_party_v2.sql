-- 파티 모드 v2: 투표·점수, 방 안 사진 업로드, 공개 방, 업로드 사진의 갤러리 제안.
-- 모두 추가형 변경만 사용한다(ALTER ADD COLUMN / CREATE TABLE IF NOT EXISTS / CREATE INDEX IF NOT EXISTS).

ALTER TABLE party_rooms ADD COLUMN is_public INTEGER NOT NULL DEFAULT 0;
ALTER TABLE party_rooms ADD COLUMN round_photo_id INTEGER;

-- 라운드별 투표. 플레이어당 라운드에 한 표만 인정하되 마음을 바꾸면 갱신한다.
CREATE TABLE IF NOT EXISTS party_votes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  room_id INTEGER NOT NULL,
  round_number INTEGER NOT NULL,
  voter_player_id INTEGER NOT NULL,
  target_player_id INTEGER NOT NULL,
  created_at INTEGER NOT NULL,
  UNIQUE(room_id, round_number, voter_player_id)
);
CREATE INDEX IF NOT EXISTS idx_party_votes_room_round ON party_votes(room_id, round_number);

-- 방 안(초대 코드 프라이빗 방 전용) 사진 업로드. base64로 D1에 직접 보관한다.
CREATE TABLE IF NOT EXISTS party_photos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  room_id INTEGER NOT NULL,
  uploader_player_id INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  data_base64 TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  used_in_round INTEGER
);
CREATE INDEX IF NOT EXISTS idx_party_photos_room ON party_photos(room_id);

-- 파티 모드 업로드 사진을 기존 이미지 제안 큐(image_suggestions)로도 보낼 수 있게 보강한다.
-- 기존 컬럼과 쿼리는 그대로 두고 추가 컬럼만 붙인다.
ALTER TABLE image_suggestions ADD COLUMN suggested_title TEXT;
ALTER TABLE image_suggestions ADD COLUMN source TEXT NOT NULL DEFAULT 'contact';
ALTER TABLE image_suggestions ADD COLUMN party_photo_id INTEGER;
CREATE INDEX IF NOT EXISTS idx_image_suggestions_party_photo ON image_suggestions(party_photo_id);
