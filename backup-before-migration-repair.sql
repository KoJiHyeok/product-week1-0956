PRAGMA defer_foreign_keys=TRUE;
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  login_id TEXT NOT NULL UNIQUE,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
, profile_image_url TEXT);
INSERT INTO "users" ("id","login_id","username","password_hash","created_at","profile_image_url") VALUES(1,'wlgur2101','얼렁뚱땅','pbkdf2_sha256$100000$iOjAnUekiwm3bOjLLeEs6A$QddyWzewPSbxUvnrU8XKrUnJri-8mRK1LLoQo2fxbPI','2026-05-07 14:30:17',NULL);
INSERT INTO "users" ("id","login_id","username","password_hash","created_at","profile_image_url") VALUES(2,'chlwlsdn10','친저앙','pbkdf2_sha256$100000$QQjyLmFpMSB6N5v0NMt2NA$bimVSYped7bdPbZ4NcOjOi8snqyz8oPJ8lnwDbGMxzI','2026-05-07 14:33:47',NULL);
CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
INSERT INTO "sessions" ("id","user_id","created_at","expires_at") VALUES('x8hUCDU_lLxhSdbTzQZCX2pDXRQ5Qr9DUUEdRv3PxNs',2,'2026-05-07 14:33:47','2026-06-06T14:33:47.179Z');
INSERT INTO "sessions" ("id","user_id","created_at","expires_at") VALUES('kCSf82M7pozNAjZwCXzbQi8gNNXogt7cIZlpjChpBsE',1,'2026-05-08 05:09:14','2026-06-07T05:09:14.252Z');
CREATE TABLE submissions (   id INTEGER PRIMARY KEY AUTOINCREMENT,   image_index INTEGER NOT NULL,   image_src TEXT NOT NULL,   title TEXT NOT NULL,   author_user_id INTEGER,   guest_name TEXT,   created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,   FOREIGN KEY (author_user_id) REFERENCES users(id) ON DELETE SET NULL );
INSERT INTO "submissions" ("id","image_index","image_src","title","author_user_id","guest_name","created_at") VALUES(1,0,'assets/gallery/01-cat-smoke.png','ㅇ',NULL,'ㅊ','2026-05-07 14:32:51');
INSERT INTO "submissions" ("id","image_index","image_src","title","author_user_id","guest_name","created_at") VALUES(3,2,'assets/gallery/03-alligators.jpeg','아거',2,NULL,'2026-05-07 14:33:52');
INSERT INTO "submissions" ("id","image_index","image_src","title","author_user_id","guest_name","created_at") VALUES(4,5,'assets/gallery/06-husky-bowl.jpg','밥알이 몇 개고?',1,NULL,'2026-05-07 15:41:32');
CREATE TABLE comments (   id INTEGER PRIMARY KEY AUTOINCREMENT,   submission_id INTEGER NOT NULL,   author_user_id INTEGER,   guest_name TEXT,   text TEXT NOT NULL,   created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,   FOREIGN KEY (submission_id) REFERENCES submissions(id) ON DELETE CASCADE,   FOREIGN KEY (author_user_id) REFERENCES users(id) ON DELETE SET NULL );
CREATE TABLE likes (   id INTEGER PRIMARY KEY AUTOINCREMENT,   submission_id INTEGER NOT NULL,   user_id INTEGER NOT NULL,   created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,   FOREIGN KEY (submission_id) REFERENCES submissions(id) ON DELETE CASCADE,   FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,   UNIQUE(user_id, submission_id) );
INSERT INTO "likes" ("id","submission_id","user_id","created_at") VALUES(1,3,2,'2026-05-07 14:33:57');
INSERT INTO "likes" ("id","submission_id","user_id","created_at") VALUES(3,1,1,'2026-05-07 14:37:04');
INSERT INTO "likes" ("id","submission_id","user_id","created_at") VALUES(5,1,2,'2026-05-07 14:37:30');
INSERT INTO "likes" ("id","submission_id","user_id","created_at") VALUES(6,4,1,'2026-05-07 15:41:35');
CREATE TABLE d1_migrations(
		id         INTEGER PRIMARY KEY AUTOINCREMENT,
		name       TEXT UNIQUE,
		applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);
DELETE FROM sqlite_sequence;
INSERT INTO "sqlite_sequence" ("name","seq") VALUES('users',2);
INSERT INTO "sqlite_sequence" ("name","seq") VALUES('submissions',4);
INSERT INTO "sqlite_sequence" ("name","seq") VALUES('likes',6);
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);
CREATE INDEX idx_submissions_image_index ON submissions(image_index);
CREATE INDEX idx_submissions_author_user_id ON submissions(author_user_id);
CREATE INDEX idx_comments_submission_id ON comments(submission_id);
CREATE INDEX idx_likes_submission_id ON likes(submission_id);
