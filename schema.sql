CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  login_id TEXT NOT NULL UNIQUE,
  email TEXT UNIQUE,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  email_verified_at TEXT,
  google_sub TEXT UNIQUE,
  naver_sub TEXT UNIQUE,
  auth_provider TEXT NOT NULL DEFAULT 'password',
  bio TEXT NOT NULL DEFAULT '',
  is_profile_public INTEGER NOT NULL DEFAULT 1,
  profile_image_url TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin', 'owner')),
  status TEXT NOT NULL DEFAULT 'active',
  blocked_reason TEXT,
  blocked_until TEXT,
  theme_preference TEXT NOT NULL DEFAULT 'dark',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);

CREATE TABLE IF NOT EXISTS email_verification_tokens (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  token_hash TEXT NOT NULL UNIQUE,
  user_id INTEGER NOT NULL,
  email TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at TEXT NOT NULL,
  used_at TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_email_verification_tokens_user_id ON email_verification_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_email_verification_tokens_expires_at ON email_verification_tokens(expires_at);

CREATE TABLE IF NOT EXISTS submissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  image_index INTEGER NOT NULL,
  image_key TEXT,
  image_src TEXT NOT NULL,
  title TEXT NOT NULL,
  author_user_id INTEGER,
  guest_name TEXT,
  guest_tag TEXT,
  hidden_at TEXT,
  hidden_reason TEXT,
  deleted_at TEXT,
  deleted_reason TEXT,
  excluded_from_ranking INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (author_user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  submission_id INTEGER NOT NULL,
  author_user_id INTEGER,
  guest_name TEXT,
  guest_tag TEXT,
  text TEXT NOT NULL,
  hidden_at TEXT,
  hidden_reason TEXT,
  deleted_at TEXT,
  deleted_reason TEXT,
  excluded_from_ranking INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (submission_id) REFERENCES submissions(id) ON DELETE CASCADE,
  FOREIGN KEY (author_user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS likes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  submission_id INTEGER NOT NULL,
  user_id INTEGER,
  guest_identifier TEXT,
  vote_date TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (submission_id) REFERENCES submissions(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CHECK (user_id IS NOT NULL OR guest_identifier IS NOT NULL)
);

CREATE INDEX IF NOT EXISTS idx_submissions_image_index ON submissions(image_index);
CREATE INDEX IF NOT EXISTS idx_submissions_image_key ON submissions(image_key);
CREATE INDEX IF NOT EXISTS idx_submissions_author_user_id ON submissions(author_user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_user_duplicate_guard ON submissions(author_user_id, image_key, title, created_at) WHERE author_user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_submissions_guest_duplicate_guard ON submissions(guest_name, image_key, title, created_at) WHERE author_user_id IS NULL;
CREATE INDEX IF NOT EXISTS idx_submissions_guest_tag_duplicate_guard ON submissions(guest_name, guest_tag, image_key, title, created_at) WHERE author_user_id IS NULL;
CREATE INDEX IF NOT EXISTS idx_submissions_visibility ON submissions(hidden_at, deleted_at, excluded_from_ranking);
CREATE INDEX IF NOT EXISTS idx_comments_submission_id ON comments(submission_id);
CREATE INDEX IF NOT EXISTS idx_comments_visibility ON comments(hidden_at, deleted_at);
CREATE INDEX IF NOT EXISTS idx_likes_submission_id ON likes(submission_id);
CREATE INDEX IF NOT EXISTS idx_likes_vote_date ON likes(vote_date);
CREATE UNIQUE INDEX IF NOT EXISTS idx_likes_user_submission ON likes(user_id, submission_id) WHERE user_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_likes_guest_submission ON likes(guest_identifier, submission_id) WHERE guest_identifier IS NOT NULL;

CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sender_user_id INTEGER NOT NULL,
  recipient_user_id INTEGER NOT NULL,
  body TEXT NOT NULL,
  read_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sender_user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (recipient_user_id) REFERENCES users(id) ON DELETE CASCADE,
  CHECK (sender_user_id != recipient_user_id)
);

CREATE INDEX IF NOT EXISTS idx_messages_recipient_created_at ON messages(recipient_user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_messages_recipient_read_at ON messages(recipient_user_id, read_at);
CREATE INDEX IF NOT EXISTS idx_messages_sender_user_id ON messages(sender_user_id);

CREATE TABLE IF NOT EXISTS uploaded_images (
  id TEXT PRIMARY KEY,
  uploader_user_id INTEGER NOT NULL,
  storage_key TEXT NOT NULL,
  thumbnail_key TEXT,
  alt_text TEXT,
  source_type TEXT NOT NULL,
  source_url TEXT,
  author_name TEXT,
  license_name TEXT,
  attribution_required INTEGER NOT NULL DEFAULT 0,
  uploader_confirmed_rights INTEGER NOT NULL DEFAULT 0,
  no_rights_violation_confirmed INTEGER NOT NULL DEFAULT 0,
  prohibited_content_confirmed INTEGER NOT NULL DEFAULT 0,
  policy_agreed INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending',
  moderation_reason TEXT,
  report_count INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  reviewed_at TEXT,
  reviewed_by INTEGER,
  FOREIGN KEY (uploader_user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL,
  CHECK (source_type IN ('self', 'free_site', 'other')),
  CHECK (status IN ('pending', 'approved', 'rejected', 'deleted'))
);

CREATE INDEX IF NOT EXISTS idx_uploaded_images_status_created_at ON uploaded_images(status, created_at);
CREATE INDEX IF NOT EXISTS idx_uploaded_images_uploader_user_id ON uploaded_images(uploader_user_id);
CREATE INDEX IF NOT EXISTS idx_uploaded_images_report_count ON uploaded_images(report_count);

CREATE TABLE IF NOT EXISTS image_reports (
  id TEXT PRIMARY KEY,
  image_id TEXT NOT NULL,
  reporter_user_id INTEGER,
  reporter_fingerprint TEXT,
  reason TEXT NOT NULL,
  detail TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (image_id) REFERENCES uploaded_images(id) ON DELETE CASCADE,
  FOREIGN KEY (reporter_user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_image_reports_image_id ON image_reports(image_id);
CREATE INDEX IF NOT EXISTS idx_image_reports_reporter_user_id ON image_reports(reporter_user_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_image_reports_user_once ON image_reports(image_id, reporter_user_id) WHERE reporter_user_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_image_reports_guest_once ON image_reports(image_id, reporter_fingerprint) WHERE reporter_user_id IS NULL AND reporter_fingerprint IS NOT NULL;

CREATE TABLE IF NOT EXISTS reports (
  id TEXT PRIMARY KEY,
  target_type TEXT NOT NULL,
  target_id TEXT NOT NULL,
  reporter_user_id INTEGER,
  reporter_fingerprint TEXT,
  reason TEXT NOT NULL,
  detail TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  reviewed_at TEXT,
  reviewed_by INTEGER,
  FOREIGN KEY (reporter_user_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL,
  CHECK (target_type IN ('photo', 'title', 'comment')),
  CHECK (status IN ('new', 'reviewing', 'resolved', 'rejected'))
);

CREATE INDEX IF NOT EXISTS idx_reports_target ON reports(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_reports_status_created_at ON reports(status, created_at);
CREATE INDEX IF NOT EXISTS idx_reports_reporter_user_id ON reports(reporter_user_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_reports_user_once ON reports(target_type, target_id, reporter_user_id) WHERE reporter_user_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_reports_guest_once ON reports(target_type, target_id, reporter_fingerprint) WHERE reporter_user_id IS NULL AND reporter_fingerprint IS NOT NULL;

CREATE TABLE IF NOT EXISTS contact_inquiries (
  id TEXT PRIMARY KEY,
  user_id INTEGER,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  reply_email TEXT NOT NULL,
  body TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  reviewed_at TEXT,
  reviewed_by INTEGER,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL,
  CHECK (status IN ('new', 'reviewing', 'resolved', 'ignored'))
);

CREATE INDEX IF NOT EXISTS idx_contact_inquiries_status_created_at ON contact_inquiries(status, created_at);
CREATE INDEX IF NOT EXISTS idx_contact_inquiries_user_id ON contact_inquiries(user_id);

CREATE TABLE IF NOT EXISTS user_restrictions (
  id TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL,
  restriction_type TEXT NOT NULL,
  reason TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at TEXT,
  created_by INTEGER,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  CHECK (restriction_type IN ('write', 'upload', 'message'))
);

CREATE INDEX IF NOT EXISTS idx_user_restrictions_user_type ON user_restrictions(user_id, restriction_type);
CREATE INDEX IF NOT EXISTS idx_user_restrictions_expires_at ON user_restrictions(expires_at);

CREATE TABLE IF NOT EXISTS user_badges (
  id TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL,
  badge_key TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(user_id, badge_key)
);

CREATE INDEX IF NOT EXISTS idx_user_badges_user_id ON user_badges(user_id);

CREATE TABLE IF NOT EXISTS admin_logs (
  id TEXT PRIMARY KEY,
  admin_user_id INTEGER,
  admin_email TEXT,
  action_type TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT NOT NULL,
  description TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (admin_user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_admin_logs_created_at ON admin_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_admin_logs_admin_user_id ON admin_logs(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_logs_target ON admin_logs(target_type, target_id);

CREATE TABLE IF NOT EXISTS admin_daily_summaries (
  id TEXT PRIMARY KEY,
  summary_date TEXT NOT NULL,
  sent_to TEXT NOT NULL,
  sent_at TEXT,
  report_count INTEGER NOT NULL DEFAULT 0,
  inquiry_count INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending',
  error_message TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CHECK (status IN ('pending', 'sent', 'failed', 'skipped'))
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_admin_daily_summaries_date_recipient
ON admin_daily_summaries(summary_date, sent_to)
WHERE status = 'sent';

CREATE INDEX IF NOT EXISTS idx_admin_daily_summaries_created_at
ON admin_daily_summaries(created_at);

CREATE TABLE IF NOT EXISTS image_suggestions (
  id TEXT PRIMARY KEY,
  inquiry_id TEXT,
  user_id INTEGER,
  submitter_name TEXT,
  submitter_email TEXT,
  inquiry_title TEXT,
  inquiry_body TEXT,
  file_name TEXT,
  content_type TEXT,
  byte_size INTEGER NOT NULL DEFAULT 0,
  image_data BLOB,
  status TEXT NOT NULL DEFAULT 'pending',
  gallery_title TEXT,
  gallery_description TEXT,
  gallery_alt TEXT,
  gallery_prompt TEXT,
  gallery_observation_points TEXT,
  gallery_example_titles TEXT,
  moderation_reason TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  reviewed_at TEXT,
  reviewed_by INTEGER,
  published_at TEXT,
  suggested_title TEXT,
  source TEXT NOT NULL DEFAULT 'contact',
  party_photo_id INTEGER,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL,
  CHECK (status IN ('pending', 'approved', 'rejected', 'deleted'))
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_image_suggestions_inquiry_id
ON image_suggestions(inquiry_id);

CREATE INDEX IF NOT EXISTS idx_image_suggestions_status_created_at
ON image_suggestions(status, created_at);

CREATE INDEX IF NOT EXISTS idx_image_suggestions_party_photo
ON image_suggestions(party_photo_id);

-- 일일 방문자 집계. visitor_hash는 KST 날짜별로 로테이트되는 SHA-256(날짜|IP|UA|salt)이라
-- 원본 IP/UA는 저장되지 않는다.
CREATE TABLE IF NOT EXISTS daily_visits (
  visit_date TEXT NOT NULL,
  visitor_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (visit_date, visitor_hash)
);

-- 오늘의 짤 운영자 지정(하이브리드 선정의 오버라이드). 지정이 없는 날은 갤러리 결정적 로테이션.
CREATE TABLE IF NOT EXISTS daily_featured (
  feature_date TEXT PRIMARY KEY,
  image_key TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

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
  vote_seconds INTEGER NOT NULL DEFAULT 15,
  photo_seed TEXT,
  fallback_image_key TEXT,
  round_deadline_at INTEGER,
  is_public INTEGER NOT NULL DEFAULT 0,
  round_photo_id INTEGER,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  reveal_started_at INTEGER,
  reveal_index INTEGER NOT NULL DEFAULT 0,
  vote_deadline_at INTEGER
);
CREATE TABLE IF NOT EXISTS party_players (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  room_id INTEGER NOT NULL,
  token TEXT NOT NULL UNIQUE,
  nickname TEXT NOT NULL,
  is_host INTEGER NOT NULL DEFAULT 0,
  joined_at INTEGER NOT NULL,
  last_seen_at INTEGER NOT NULL,
  user_id INTEGER
);
CREATE INDEX IF NOT EXISTS idx_party_players_room ON party_players(room_id);
CREATE INDEX IF NOT EXISTS idx_party_players_user ON party_players(user_id);
CREATE TABLE IF NOT EXISTS party_titles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  room_id INTEGER NOT NULL,
  round_number INTEGER NOT NULL,
  player_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  UNIQUE(room_id, round_number, player_id)
);
-- 라운드별 투표(파티 모드 v2).
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
-- 방 안(프라이빗 방 전용) 사진 업로드(파티 모드 v2).
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
-- 디스코드 일일 갤러리 후보 이미지(Openverse 큐레이션) 기록.
CREATE TABLE IF NOT EXISTS daily_image_candidates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  candidate_date TEXT NOT NULL,
  slot INTEGER NOT NULL,
  openverse_id TEXT NOT NULL UNIQUE,
  image_url TEXT NOT NULL,
  landing_url TEXT NOT NULL DEFAULT '',
  license TEXT NOT NULL DEFAULT '',
  creator TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL DEFAULT '',
  query TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP)
);
CREATE INDEX IF NOT EXISTS idx_daily_image_candidates_date ON daily_image_candidates(candidate_date);
