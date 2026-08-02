-- LOCAL PREVIEW SEED ONLY. 절대 --remote 로 실행하지 말 것.
-- 갤러리 인기 정렬 + 오늘의 인기 + 이달의 랭킹(가입 사용자)을 데모하기 위한 가짜 데이터.
-- 오늘 날짜(머신 기준) = 2026-06-25, 이번 달 = 2026-06. 재실행 안전: 먼저 시드 행을 지운다.

DELETE FROM likes WHERE guest_identifier LIKE 'seedpv-%';
DELETE FROM submissions WHERE title LIKE 'SEEDPV %';
DELETE FROM users WHERE login_id LIKE 'seedpv_%';

-- 가입 사용자 시드 (이달의 랭킹용). password_hash/login_id/username 은 NOT NULL.
INSERT INTO users (login_id, username, password_hash, is_profile_public) VALUES
  ('seedpv_user1', '제목왕',   'x', 1),
  ('seedpv_user2', '한줄장인', 'x', 1),
  ('seedpv_user3', '드립요정', 'x', 0);  -- 비공개 프로필: 아바타 미노출, 이름은 표시

-- 제목(submission) 시드: image_key별 고유 title. 일부는 비회원, 일부는 위 가입 사용자 작성.
INSERT INTO submissions (image_index, image_key, image_src, title, guest_name) VALUES
  (8,  '8',  'assets/gallery/09-reggae-singer.jpg',          'SEEDPV 무대를 태우는 목소리', '시드프리뷰'),
  (8,  '8',  'assets/gallery/09-reggae-singer.jpg',          'SEEDPV 노랗게 번진 한 소절',   '시드프리뷰'),
  (8,  '8',  'assets/gallery/09-reggae-singer.jpg',          'SEEDPV 마이크 0센티',          '시드프리뷰'),
  (2,  '2',  'assets/gallery/03-alligators.jpeg',            'SEEDPV 습지 회의 시작 전',     '시드프리뷰'),
  (2,  '2',  'assets/gallery/03-alligators.jpeg',            'SEEDPV 누가 먼저 움직일까',     '시드프리뷰'),
  (31, '31', 'assets/gallery/title-academy-cat-student.png', 'SEEDPV 오늘 첫 수업입니다',     '시드프리뷰'),
  (15, '15', 'assets/gallery/Subject6.png',                  'SEEDPV 자세 점수 만점',         '시드프리뷰'),
  (23, '23', 'assets/gallery/24-funny-red-polo.jpg',         'SEEDPV 나 부른 거 다 들었어',   '시드프리뷰'),
  (12, '12', 'assets/gallery/Subject3.png',                  'SEEDPV 채소계 최종 보스',       '시드프리뷰');

-- 가입 사용자 작성 제목 (author_user_id 연결)
INSERT INTO submissions (image_index, image_key, image_src, title, author_user_id)
SELECT 6, '6', 'assets/gallery/07-puppy-oh-hi.jpg', 'SEEDPV 제목왕의 한 수', id FROM users WHERE login_id='seedpv_user1';
INSERT INTO submissions (image_index, image_key, image_src, title, author_user_id)
SELECT 9, '9', 'assets/gallery/10-sparkler.jpg', 'SEEDPV 한줄의 미학', id FROM users WHERE login_id='seedpv_user2';
INSERT INTO submissions (image_index, image_key, image_src, title, author_user_id)
SELECT 12, '12', 'assets/gallery/Subject3.png', 'SEEDPV 드립 한 방울', id FROM users WHERE login_id='seedpv_user3';

-- ===== 좋아요(하트) 시드: 같은 날짜엔 guest_identifier가 유일해야 함 =====
-- [오늘의 인기] 오늘(2026-06-25) 비회원 하트: reggae 5, alligators 3, cat 2, subject6 2, polo 1
INSERT INTO likes (submission_id, guest_identifier, vote_date) SELECT id,'seedpv-r-t1','2026-06-25' FROM submissions WHERE title='SEEDPV 무대를 태우는 목소리';
INSERT INTO likes (submission_id, guest_identifier, vote_date) SELECT id,'seedpv-r-t2','2026-06-25' FROM submissions WHERE title='SEEDPV 무대를 태우는 목소리';
INSERT INTO likes (submission_id, guest_identifier, vote_date) SELECT id,'seedpv-r-t3','2026-06-25' FROM submissions WHERE title='SEEDPV 무대를 태우는 목소리';
INSERT INTO likes (submission_id, guest_identifier, vote_date) SELECT id,'seedpv-r-t4','2026-06-25' FROM submissions WHERE title='SEEDPV 노랗게 번진 한 소절';
INSERT INTO likes (submission_id, guest_identifier, vote_date) SELECT id,'seedpv-r-t5','2026-06-25' FROM submissions WHERE title='SEEDPV 노랗게 번진 한 소절';
INSERT INTO likes (submission_id, guest_identifier, vote_date) SELECT id,'seedpv-r-o1','2026-06-20' FROM submissions WHERE title='SEEDPV 마이크 0센티';
INSERT INTO likes (submission_id, guest_identifier, vote_date) SELECT id,'seedpv-r-o2','2026-06-20' FROM submissions WHERE title='SEEDPV 마이크 0센티';
INSERT INTO likes (submission_id, guest_identifier, vote_date) SELECT id,'seedpv-r-o3','2026-06-21' FROM submissions WHERE title='SEEDPV 마이크 0센티';
INSERT INTO likes (submission_id, guest_identifier, vote_date) SELECT id,'seedpv-a-t1','2026-06-25' FROM submissions WHERE title='SEEDPV 습지 회의 시작 전';
INSERT INTO likes (submission_id, guest_identifier, vote_date) SELECT id,'seedpv-a-t2','2026-06-25' FROM submissions WHERE title='SEEDPV 습지 회의 시작 전';
INSERT INTO likes (submission_id, guest_identifier, vote_date) SELECT id,'seedpv-a-t3','2026-06-25' FROM submissions WHERE title='SEEDPV 누가 먼저 움직일까';
INSERT INTO likes (submission_id, guest_identifier, vote_date) SELECT id,'seedpv-c-t1','2026-06-25' FROM submissions WHERE title='SEEDPV 오늘 첫 수업입니다';
INSERT INTO likes (submission_id, guest_identifier, vote_date) SELECT id,'seedpv-c-t2','2026-06-25' FROM submissions WHERE title='SEEDPV 오늘 첫 수업입니다';
INSERT INTO likes (submission_id, guest_identifier, vote_date) SELECT id,'seedpv-s-t1','2026-06-25' FROM submissions WHERE title='SEEDPV 자세 점수 만점';
INSERT INTO likes (submission_id, guest_identifier, vote_date) SELECT id,'seedpv-s-t2','2026-06-25' FROM submissions WHERE title='SEEDPV 자세 점수 만점';
INSERT INTO likes (submission_id, guest_identifier, vote_date) SELECT id,'seedpv-p-t1','2026-06-25' FROM submissions WHERE title='SEEDPV 나 부른 거 다 들었어';

-- [이달의 랭킹] 이번 달(2026-06) 가입 사용자 제목이 받은 하트. 제목왕9 > 한줄장인5 > 드립요정2
INSERT INTO likes (submission_id, guest_identifier, vote_date) SELECT id,'seedpv-u1-a','2026-06-25' FROM submissions WHERE title='SEEDPV 제목왕의 한 수';
INSERT INTO likes (submission_id, guest_identifier, vote_date) SELECT id,'seedpv-u1-b','2026-06-25' FROM submissions WHERE title='SEEDPV 제목왕의 한 수';
INSERT INTO likes (submission_id, guest_identifier, vote_date) SELECT id,'seedpv-u1-c','2026-06-25' FROM submissions WHERE title='SEEDPV 제목왕의 한 수';
INSERT INTO likes (submission_id, guest_identifier, vote_date) SELECT id,'seedpv-u1-d','2026-06-25' FROM submissions WHERE title='SEEDPV 제목왕의 한 수';
INSERT INTO likes (submission_id, guest_identifier, vote_date) SELECT id,'seedpv-u1-e','2026-06-24' FROM submissions WHERE title='SEEDPV 제목왕의 한 수';
INSERT INTO likes (submission_id, guest_identifier, vote_date) SELECT id,'seedpv-u1-f','2026-06-24' FROM submissions WHERE title='SEEDPV 제목왕의 한 수';
INSERT INTO likes (submission_id, guest_identifier, vote_date) SELECT id,'seedpv-u1-g','2026-06-24' FROM submissions WHERE title='SEEDPV 제목왕의 한 수';
INSERT INTO likes (submission_id, guest_identifier, vote_date) SELECT id,'seedpv-u1-h','2026-06-23' FROM submissions WHERE title='SEEDPV 제목왕의 한 수';
INSERT INTO likes (submission_id, guest_identifier, vote_date) SELECT id,'seedpv-u1-i','2026-06-23' FROM submissions WHERE title='SEEDPV 제목왕의 한 수';
INSERT INTO likes (submission_id, guest_identifier, vote_date) SELECT id,'seedpv-u2-a','2026-06-25' FROM submissions WHERE title='SEEDPV 한줄의 미학';
INSERT INTO likes (submission_id, guest_identifier, vote_date) SELECT id,'seedpv-u2-b','2026-06-25' FROM submissions WHERE title='SEEDPV 한줄의 미학';
INSERT INTO likes (submission_id, guest_identifier, vote_date) SELECT id,'seedpv-u2-c','2026-06-22' FROM submissions WHERE title='SEEDPV 한줄의 미학';
INSERT INTO likes (submission_id, guest_identifier, vote_date) SELECT id,'seedpv-u2-d','2026-06-22' FROM submissions WHERE title='SEEDPV 한줄의 미학';
INSERT INTO likes (submission_id, guest_identifier, vote_date) SELECT id,'seedpv-u2-e','2026-06-22' FROM submissions WHERE title='SEEDPV 한줄의 미학';
INSERT INTO likes (submission_id, guest_identifier, vote_date) SELECT id,'seedpv-u3-a','2026-06-21' FROM submissions WHERE title='SEEDPV 드립 한 방울';
INSERT INTO likes (submission_id, guest_identifier, vote_date) SELECT id,'seedpv-u3-b','2026-06-21' FROM submissions WHERE title='SEEDPV 드립 한 방울';

-- 댓글 시드(종합 점수 댓글 가중치 확인용): radish 사진에 2개
INSERT INTO comments (submission_id, guest_name, text) SELECT id,'시드프리뷰','SEEDPV 댓글 1' FROM submissions WHERE title='SEEDPV 채소계 최종 보스';
INSERT INTO comments (submission_id, guest_name, text) SELECT id,'시드프리뷰','SEEDPV 댓글 2' FROM submissions WHERE title='SEEDPV 채소계 최종 보스';
