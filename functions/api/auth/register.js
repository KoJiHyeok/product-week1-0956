import {
  createSession,
  createRandomToken,
  getDb,
  hashToken,
  hashPassword,
  json,
  normalizeEmail,
  normalizeLoginId,
  normalizeUsername,
  publicUser,
  readJson,
  validateEmail,
  validateLoginId,
  validatePassword,
} from "./_shared.js";
import { validateDisplayName } from "../submissions/_moderation.js";

export async function onRequestPost(context) {
  try {
    return await handleRegister(context);
  } catch (error) {
    console.error("auth/register unhandled error", getErrorDetails(error));
    return json({ message: "회원가입 처리 중 오류가 발생했습니다." }, 500);
  }
}

async function handleRegister(context) {
  const body = await readJson(context.request);

  if (!body) {
    return json({ message: "요청 형식이 올바르지 않습니다." }, 400);
  }

  const loginId = normalizeLoginId(body.loginId);
  const email = normalizeEmail(body.email);
  const username = normalizeUsername(body.username);
  const password = body.password;
  const passwordConfirm = body.passwordConfirm;
  const loginIdError = validateLoginId(loginId);
  const emailError = validateEmail(email);
  const passwordError = validatePassword(password);

  if (loginIdError) {
    return json({ message: loginIdError }, 400);
  }

  if (emailError) {
    return json({ message: emailError }, 400);
  }

  if (!username) {
    return json({ message: "사용자 이름을 입력하세요." }, 400);
  }

  const usernameValidation = validateDisplayName(username, "사용자 이름");
  if (!usernameValidation.ok) {
    return json({ message: usernameValidation.message }, 400);
  }

  if (passwordError) {
    return json({ message: passwordError }, 400);
  }

  if (password !== passwordConfirm) {
    return json({ message: "비밀번호가 일치하지 않습니다." }, 400);
  }

  const db = getDb(context);
  const duplicate = await db
    .prepare("SELECT login_id, email, username FROM users WHERE login_id = ? OR email = ? OR username = ? LIMIT 1")
    .bind(loginId, email, username)
    .first();

  if (duplicate?.login_id === loginId) {
    return json({ message: "이미 사용 중인 아이디입니다." }, 409);
  }

  if (duplicate?.email === email) {
    return json({ message: "이미 사용 중인 이메일입니다." }, 409);
  }

  if (duplicate?.username === username) {
    return json({ message: "이미 사용 중인 사용자 이름입니다." }, 409);
  }

  const passwordHash = await hashPassword(password);

  try {
    const result = await db
      .prepare("INSERT INTO users (login_id, email, username, password_hash, auth_provider) VALUES (?, ?, ?, ?, ?)")
      .bind(loginId, email, username, passwordHash, "password")
      .run();

    const user = {
      id: result.meta.last_row_id,
      login_id: loginId,
      email,
      email_verified_at: null,
      username,
      bio: "",
      is_profile_public: 1,
      profile_image_url: "",
      auth_provider: "password",
    };
    const session = await createSession(db, context.request, user.id);
    const emailVerificationSent = await createEmailVerification(context, db, user).catch((error) => {
      console.error("auth/register email verification error", getErrorDetails(error));
      return false;
    });

    return json(
      {
        user: publicUser(user),
        expiresAt: session.expiresAt,
        emailVerificationSent,
      },
      201,
      {
        "set-cookie": session.cookie,
      }
    );
  } catch (error) {
    const message = String(error?.message || "");
    console.error("auth/register database error", getErrorDetails(error));

    if (message.includes("users.login_id")) {
      return json({ message: "이미 사용 중인 아이디입니다." }, 409);
    }

    if (message.includes("users.email")) {
      return json({ message: "이미 사용 중인 이메일입니다." }, 409);
    }

    if (message.includes("users.username")) {
      return json({ message: "이미 사용 중인 사용자 이름입니다." }, 409);
    }

    return json({ message: "회원가입 처리 중 오류가 발생했습니다." }, 500);
  }
}

async function createEmailVerification(context, db, user) {
  if (!context.env.RESEND_API_KEY) {
    return false;
  }

  const token = createRandomToken(32);
  const tokenHash = await hashToken(token);
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString();

  await db
    .prepare(
      `INSERT INTO email_verification_tokens (token_hash, user_id, email, expires_at)
       VALUES (?, ?, ?, ?)`
    )
    .bind(tokenHash, user.id, user.email, expiresAt)
    .run();

  const origin = context.env.APP_ORIGIN || new URL(context.request.url).origin;
  const verifyUrl = `${origin}/?verifyEmailToken=${encodeURIComponent(token)}`;
  const sender = context.env.AUTH_FROM_EMAIL || context.env.CONTACT_FROM_EMAIL || "Title Academy <onboarding@resend.dev>";
  const result = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      authorization: `Bearer ${context.env.RESEND_API_KEY}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      from: sender,
      to: user.email,
      subject: "[제목 학원] 이메일 인증을 완료해주세요",
      text: [
        `${user.username}님, 제목 학원 이메일 인증을 완료해주세요.`,
        "",
        verifyUrl,
        "",
        "이 링크는 24시간 동안 유효합니다.",
      ].join("\n"),
    }),
  });

  return result.ok;
}

function getErrorDetails(error) {
  return {
    name: error?.name || "Error",
    message: error?.message || String(error),
    stack: error?.stack || "",
    cause: error?.cause ? String(error.cause) : "",
  };
}
