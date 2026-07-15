-- 하트 규칙 변경: "하루 한 번(사용자·날짜당 1개)" → "제목당 1개, 여러 제목 가능".
-- 유니크 제약을 (user, vote_date)/(guest, vote_date)에서 (user, submission)/(guest, submission)로 옮긴다.
-- vote_date 컬럼은 오늘/이달 랭킹 집계에 계속 쓰이므로 유지한다.

-- 새 유니크 인덱스와 충돌할 중복 하트 정리(같은 대상에 대한 최소 id 1건만 남긴다).
DELETE FROM likes
WHERE user_id IS NOT NULL
  AND id NOT IN (
    SELECT MIN(id) FROM likes WHERE user_id IS NOT NULL GROUP BY user_id, submission_id
  );

DELETE FROM likes
WHERE guest_identifier IS NOT NULL
  AND id NOT IN (
    SELECT MIN(id) FROM likes WHERE guest_identifier IS NOT NULL GROUP BY guest_identifier, submission_id
  );

-- 하루 1회 제약 제거.
DROP INDEX IF EXISTS idx_likes_user_vote_date;
DROP INDEX IF EXISTS idx_likes_guest_vote_date;

-- 제목당 1회 제약 추가.
CREATE UNIQUE INDEX IF NOT EXISTS idx_likes_user_submission ON likes(user_id, submission_id) WHERE user_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_likes_guest_submission ON likes(guest_identifier, submission_id) WHERE guest_identifier IS NOT NULL;
