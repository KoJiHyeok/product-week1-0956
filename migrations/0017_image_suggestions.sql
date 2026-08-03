-- 문의 폼으로 접수된 "이미지 제안"을 이미지 데이터까지 함께 보관한다.
-- 관리자 대시보드의 이미지 제안 탭에서 미리보고 승인하면 갤러리에 즉시 게시된다.
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
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL,
  CHECK (status IN ('pending', 'approved', 'rejected', 'deleted'))
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_image_suggestions_inquiry_id
ON image_suggestions(inquiry_id);

CREATE INDEX IF NOT EXISTS idx_image_suggestions_status_created_at
ON image_suggestions(status, created_at);

-- 이미 문의로 접수된 이미지 제안을 옮겨온다. 첨부 이미지는 메일로만 발송돼
-- 남아 있지 않으므로 image_data 없이 접수 기록만 이관한다.
INSERT OR IGNORE INTO image_suggestions (
  id, inquiry_id, user_id, submitter_email, inquiry_title, inquiry_body, status, created_at
)
SELECT id, id, user_id, reply_email, title, body, 'pending', created_at
FROM contact_inquiries
WHERE type = '이미지 제안';
