import {
  getDb,
  hashToken,
  json,
  OWNER_EMAIL,
  readJson,
} from "../_shared.js";

export async function onRequestPost(context) {
  try {
    return await handleVerify(context);
  } catch (error) {
    console.error("auth/email/verify unhandled error", error);
    return json({ message: "이메일 인증 중 오류가 발생했습니다." }, 500);
  }
}

async function handleVerify(context) {
  const body = await readJson(context.request);
  const token = typeof body?.token === "string" ? body.token.trim() : "";

  if (!token) {
    return json({ message: "인증 토큰이 없습니다." }, 400);
  }

  const db = getDb(context);
  const tokenHash = await hashToken(token);
  const now = new Date().toISOString();
  const record = await db
    .prepare(
      `SELECT id, user_id, email
       FROM email_verification_tokens
       WHERE token_hash = ? AND used_at IS NULL AND expires_at > ?
       LIMIT 1`
    )
    .bind(tokenHash, now)
    .first();

  if (!record) {
    return json({ message: "인증 링크가 만료되었거나 올바르지 않습니다." }, 400);
  }

  await db
    .prepare(
      `UPDATE users
       SET email_verified_at = ?,
           role = CASE WHEN lower(email) = ? THEN 'owner' ELSE role END
       WHERE id = ? AND email = ?`
    )
    .bind(now, OWNER_EMAIL, record.user_id, record.email)
    .run();

  await db
    .prepare("UPDATE email_verification_tokens SET used_at = ? WHERE id = ?")
    .bind(now, record.id)
    .run();

  return json({ message: "이메일 인증이 완료되었습니다." });
}
