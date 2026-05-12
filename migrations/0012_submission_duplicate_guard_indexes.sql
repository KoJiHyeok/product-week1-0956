CREATE INDEX IF NOT EXISTS idx_submissions_user_duplicate_guard
ON submissions(author_user_id, image_key, title, created_at)
WHERE author_user_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_submissions_guest_duplicate_guard
ON submissions(guest_name, image_key, title, created_at)
WHERE author_user_id IS NULL;
