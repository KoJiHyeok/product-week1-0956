-- 비회원 표시 이름 구분자. guest_name 은 사용자가 입력한 이름 그대로 두고,
-- guest_tag 에 쿠키 식별자에서 파생한 4자리 태그를 저장해 "홍길동#a3f2" 로 표시한다.
-- 기존 행은 guest_tag 가 NULL 이라 태그 없이 그대로 표시된다.
ALTER TABLE submissions ADD COLUMN guest_tag TEXT;
ALTER TABLE comments ADD COLUMN guest_tag TEXT;

CREATE INDEX IF NOT EXISTS idx_submissions_guest_tag_duplicate_guard
ON submissions(guest_name, guest_tag, image_key, title, created_at)
WHERE author_user_id IS NULL;
