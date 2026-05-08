import {
  createSession,
  getDb,
  json,
  normalizeLoginId,
  publicUser,
  readJson,
  verifyPassword,
} from "./_shared.js";

export async function onRequestPost(context) {
  try {
    return await handleLogin(context);
  } catch {
    return json({ message: "로그인 처리 중 오류가 발생했습니다." }, 500);
  }
}

async function handleLogin(context) {
  const body = await readJson(context.request);

  if (!body) {
    return json({ message: "요청 형식이 올바르지 않습니다." }, 400);
  }

  const loginId = normalizeLoginId(body.loginId);
  const password = typeof body.password === "string" ? body.password : "";

  if (!loginId || !password) {
    return json({ message: "아이디 또는 비밀번호가 올바르지 않습니다." }, 401);
  }

  const db = getDb(context);
  let user;

  try {
    user = await db
      .prepare(
        `SELECT id, login_id, username, email, email_verified_at, password_hash,
                profile_image_url, auth_provider
         FROM users
         WHERE login_id = ?
         LIMIT 1`
      )
      .bind(loginId)
      .first();
  } catch {
    user = await db
      .prepare("SELECT id, login_id, username, password_hash FROM users WHERE login_id = ? LIMIT 1")
      .bind(loginId)
      .first();
  }

  if (!user || !(await verifyPassword(password, user.password_hash))) {
    return json({ message: "아이디 또는 비밀번호가 올바르지 않습니다." }, 401);
  }

  const session = await createSession(db, context.request, user.id);

  return json(
    {
      user: publicUser(user),
      expiresAt: session.expiresAt,
    },
    200,
    {
      "set-cookie": session.cookie,
    }
  );
}
