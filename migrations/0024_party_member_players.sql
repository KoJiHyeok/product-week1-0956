-- 파티 모드: 로그인 회원은 닉네임 입력 없이 회원 이름(username)으로 참가한다.
-- user_id가 있으면 회원 참가, NULL이면 기존과 동일한 게스트 닉네임 참가.
ALTER TABLE party_players ADD COLUMN user_id INTEGER;
CREATE INDEX IF NOT EXISTS idx_party_players_user ON party_players(user_id);
