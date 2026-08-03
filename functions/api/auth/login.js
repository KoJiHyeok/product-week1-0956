import {
  createSession,
  getDb,
  json,
  normalizeLoginId,
  publicUser,
  readJson,
  verifyPassword,
} from "./_shared.js";
import { createEmailVerification } from "./register.js";

const EMAIL_VERIFICATION_RESEND_COOLDOWN_MS = 5 * 60 * 1000;

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
  let hasEmailColumns = true;

  try {
    user = await db
      .prepare(
        `SELECT id, login_id, username, email, email_verified_at, password_hash,
                bio, is_profile_public, profile_image_url, auth_provider, role,
                status, blocked_reason, blocked_until, theme_preference
         FROM users
         WHERE login_id = ?
         LIMIT 1`
      )
      .bind(loginId)
      .first();
  } catch {
    hasEmailColumns = false;
    user = await db
      .prepare("SELECT id, login_id, username, password_hash FROM users WHERE login_id = ? LIMIT 1")
      .bind(loginId)
      .first();
  }

  if (!user || !(await verifyPassword(password, user.password_hash))) {
    return json({ message: "아이디 또는 비밀번호가 올바르지 않습니다." }, 401);
  }

  // email이 없는 초기 계정(migration 0003 이전 가입)은 인증 자체가 불가능하므로 게이트 제외.
  if (hasEmailColumns && user.auth_provider === "password" && user.email && !user.email_verified_at) {
    return await handleUnverifiedEmail(context, db, user);
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

async function handleUnverifiedEmail(context, db, user) {
  const recentToken = await db
    .prepare(
      `SELECT created_at FROM email_verification_tokens
       WHERE user_id = ?
       ORDER BY created_at DESC
       LIMIT 1`
    )
    .bind(user.id)
    .first();

  const isRecent = Date.now() - parseSqliteTimestamp(recentToken?.created_at) < EMAIL_VERIFICATION_RESEND_COOLDOWN_MS;

  let sent = false;
  if (!isRecent) {
    sent = await createEmailVerification(context, db, user).catch((error) => {
      console.error("auth/login email verification resend error", error);
      return false;
    });
  }

  let message;
  if (isRecent) {
    message = "최근 발송된 인증 메일이 있습니다. 메일함과 스팸함을 확인해주세요.";
  } else if (sent) {
    message = `이메일 인증이 필요합니다. ${user.email}로 인증 메일을 보냈으니 링크를 눌러 인증 후 다시 로그인해주세요.`;
  } else {
    message = "인증 메일 발송에 실패했습니다. 잠시 후 다시 시도해주세요. 문제가 계속되면 문의 페이지로 알려주세요.";
  }

  return json({ error: "email_unverified", message }, 403);
}

function parseSqliteTimestamp(value) {
  if (!value) {
    return 0;
  }

  const iso = value.includes("T") ? value : `${value.replace(" ", "T")}Z`;
  const time = new Date(iso).getTime();

  return Number.isFinite(time) ? time : 0;
}
