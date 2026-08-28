-- 파티 모드: 초대 코드 방에서 같은 사진에 실시간으로 제목을 겨루는 갈틱폰 스타일 게임.
-- 로그인 불필요(닉네임+토큰만). 실시간 동기화는 클라이언트 폴링(state.js)으로 처리한다.
CREATE TABLE IF NOT EXISTS party_rooms (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'lobby',      -- lobby | round | reveal | ended
  host_token TEXT NOT NULL,
  round_number INTEGER NOT NULL DEFAULT 0,
  total_rounds INTEGER NOT NULL DEFAULT 5,
  round_seconds INTEGER NOT NULL DEFAULT 60,
  photo_seed TEXT,
  fallback_image_key TEXT,
  round_deadline_at INTEGER,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS party_players (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  room_id INTEGER NOT NULL,
  token TEXT NOT NULL UNIQUE,
  nickname TEXT NOT NULL,
  is_host INTEGER NOT NULL DEFAULT 0,
  joined_at INTEGER NOT NULL,
  last_seen_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_party_players_room ON party_players(room_id);
CREATE TABLE IF NOT EXISTS party_titles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  room_id INTEGER NOT NULL,
  round_number INTEGER NOT NULL,
  player_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  UNIQUE(room_id, round_number, player_id)
);
