import {
  createRandomToken,
  getCurrentUser,
  getDb,
  hashToken,
  json,
} from "../_shared.js";

export async function onRequestPost(context) {
  try {
    return await handleSend(context);
  } catch (error) {
    console.error("auth/email/send unhandled error", error);
    return json({ message: "인증 메일 발송 중 오류가 발생했습니다." }, 500);
  }
}

async function handleSend(context) {
  const user = await getCurrentUser(context);

  if (!user) {
    return json({ message: "로그인이 필요합니다." }, 401);
  }

  if (!user.email) {
    return json({ message: "인증할 이메일이 없습니다." }, 400);
  }

  if (user.email_verified_at) {
    return json({ message: "이미 인증된 이메일입니다." });
  }

  if (!context.env.RESEND_API_KEY) {
    return json({ message: "메일 발송 환경변수가 설정되지 않았습니다." }, 500);
  }

  const db = getDb(context);
  const sent = await createEmailVerification(context, db, user);

  if (!sent) {
    return json({ message: "인증 메일 발송에 실패했습니다." }, 502);
  }

  return json({ message: "인증 메일을 발송했습니다." });
}

async function createEmailVerification(context, db, user) {
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
