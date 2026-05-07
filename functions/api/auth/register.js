import {
  createSession,
  getDb,
  hashPassword,
  json,
  normalizeLoginId,
  normalizeUsername,
  publicUser,
  readJson,
  validateLoginId,
  validatePassword,
} from "./_shared.js";

export async function onRequestPost(context) {
  try {
    return await handleRegister(context);
  } catch {
    return json({ message: "회원가입 처리 중 오류가 발생했습니다." }, 500);
  }
}

async function handleRegister(context) {
  const body = await readJson(context.request);

  if (!body) {
    return json({ message: "요청 형식이 올바르지 않습니다." }, 400);
  }

  const loginId = normalizeLoginId(body.loginId);
  const username = normalizeUsername(body.username);
  const password = body.password;
  const passwordConfirm = body.passwordConfirm;
  const loginIdError = validateLoginId(loginId);
  const passwordError = validatePassword(password);

  if (loginIdError) {
    return json({ message: loginIdError }, 400);
  }

  if (!username) {
    return json({ message: "사용자 이름을 입력하세요." }, 400);
  }

  if (passwordError) {
    return json({ message: passwordError }, 400);
  }

  if (password !== passwordConfirm) {
    return json({ message: "비밀번호가 일치하지 않습니다." }, 400);
  }

  const db = getDb(context);
  const duplicate = await db
    .prepare("SELECT login_id, username FROM users WHERE login_id = ? OR username = ? LIMIT 1")
    .bind(loginId, username)
    .first();

  if (duplicate?.login_id === loginId) {
    return json({ message: "이미 사용 중인 아이디입니다." }, 409);
  }

  if (duplicate?.username === username) {
    return json({ message: "이미 사용 중인 사용자 이름입니다." }, 409);
  }

  const passwordHash = await hashPassword(password);

  try {
    const result = await db
      .prepare("INSERT INTO users (login_id, username, password_hash) VALUES (?, ?, ?)")
      .bind(loginId, username, passwordHash)
      .run();

    const user = {
      id: result.meta.last_row_id,
      login_id: loginId,
      username,
      profile_image_url: "",
    };
    const session = await createSession(db, context.request, user.id);

    return json(
      {
        user: publicUser(user),
        expiresAt: session.expiresAt,
      },
      201,
      {
        "set-cookie": session.cookie,
      }
    );
  } catch (error) {
    const message = String(error?.message || "");

    if (message.includes("users.login_id")) {
      return json({ message: "이미 사용 중인 아이디입니다." }, 409);
    }

    if (message.includes("users.username")) {
      return json({ message: "이미 사용 중인 사용자 이름입니다." }, 409);
    }

    return json({ message: "회원가입 처리 중 오류가 발생했습니다." }, 500);
  }
}
