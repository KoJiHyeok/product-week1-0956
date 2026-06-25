import {
  getCurrentUser,
  getDb,
  getExpiredSessionCookieHeader,
  json,
  normalizeUsername,
  publicUser,
  readJson,
} from "./auth/_shared.js";
import { validateDisplayName } from "./submissions/_moderation.js";

export async function onRequestPatch(context) {
  try {
    return await updateProfile(context);
  } catch (error) {
    console.error("profile update error", error);
    return json({ message: "프로필 정보를 저장하지 못했습니다." }, 500);
  }
}

export async function onRequestDelete(context) {
  try {
    return await deleteProfile(context);
  } catch (error) {
    console.error("profile delete error", error);
    return json({ message: "회원 탈퇴 처리 중 오류가 발생했습니다." }, 500);
  }
}

async function updateProfile(context) {
  const user = await getCurrentUser(context);

  if (!user) {
    return json({ message: "로그인이 필요합니다." }, 401);
  }

  const body = await readJson(context.request);

  if (!body) {
    return json({ message: "요청 형식이 올바르지 않습니다." }, 400);
  }

  const username = normalizeUsername(body.username).slice(0, 24);
  const bio = normalizeText(body.bio).slice(0, 240);
  const isProfilePublic = body.isProfilePublic === false ? 0 : 1;

  if (!username) {
    return json({ message: "프로필 이름을 입력하세요." }, 400);
  }

  const usernameValidation = validateDisplayName(username, "프로필 이름");
  if (!usernameValidation.ok) {
    return json({ message: usernameValidation.message }, 400);
  }

  const db = getDb(context);
  const duplicate = await db
    .prepare("SELECT id FROM users WHERE username = ? AND id != ? LIMIT 1")
    .bind(username, user.id)
    .first();

  if (duplicate) {
    return json({ message: "이미 사용 중인 프로필 이름입니다." }, 409);
  }

  await db
    .prepare("UPDATE users SET username = ?, bio = ?, is_profile_public = ? WHERE id = ?")
    .bind(username, bio, isProfilePublic, user.id)
    .run();

  return json({
    user: publicUser({
      ...user,
      username,
      bio,
      is_profile_public: isProfilePublic,
    }),
  });
}

async function deleteProfile(context) {
  const user = await getCurrentUser(context);

  if (!user) {
    return json({ message: "로그인이 필요합니다." }, 401);
  }

  const db = getDb(context);
  await db
    .prepare("UPDATE submissions SET author_user_id = NULL, guest_name = ? WHERE author_user_id = ?")
    .bind("탈퇴한 회원", user.id)
    .run();
  await db
    .prepare("UPDATE comments SET author_user_id = NULL, guest_name = ? WHERE author_user_id = ?")
    .bind("탈퇴한 회원", user.id)
    .run();
  await db.prepare("DELETE FROM likes WHERE user_id = ?").bind(user.id).run();
  await db.prepare("DELETE FROM email_verification_tokens WHERE user_id = ?").bind(user.id).run();
  await db.prepare("DELETE FROM sessions WHERE user_id = ?").bind(user.id).run();
  await db.prepare("DELETE FROM users WHERE id = ?").bind(user.id).run();

  return json(
    { message: "회원 탈퇴가 완료되었습니다." },
    200,
    {
      "set-cookie": getExpiredSessionCookieHeader(context.request),
    }
  );
}

function normalizeText(value) {
  return typeof value === "string" ? value.trim() : "";
}
