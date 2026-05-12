import {
  getCurrentUser,
  getDb,
  hashPassword,
  json,
  readJson,
  validatePassword,
  verifyPassword,
} from "../auth/_shared.js";

export async function onRequestPost(context) {
  try {
    return await changePassword(context);
  } catch (error) {
    console.error("profile password error", error);
    return json({ message: "비밀번호를 변경하지 못했습니다." }, 500);
  }
}

async function changePassword(context) {
  const user = await getCurrentUser(context);

  if (!user) {
    return json({ message: "로그인이 필요합니다." }, 401);
  }

  if (user.auth_provider === "google") {
    return json({ message: "외부 로그인 계정은 비밀번호를 변경할 수 없습니다." }, 400);
  }

  const body = await readJson(context.request);
  const currentPassword = typeof body?.currentPassword === "string" ? body.currentPassword : "";
  const newPassword = typeof body?.newPassword === "string" ? body.newPassword : "";
  const newPasswordConfirm = typeof body?.newPasswordConfirm === "string" ? body.newPasswordConfirm : "";
  const passwordError = validatePassword(newPassword);

  if (passwordError) {
    return json({ message: passwordError }, 400);
  }

  if (newPassword !== newPasswordConfirm) {
    return json({ message: "새 비밀번호가 일치하지 않습니다." }, 400);
  }

  const db = getDb(context);
  const row = await db.prepare("SELECT password_hash FROM users WHERE id = ? LIMIT 1").bind(user.id).first();

  if (!row || !(await verifyPassword(currentPassword, row.password_hash))) {
    return json({ message: "현재 비밀번호가 올바르지 않습니다." }, 401);
  }

  const passwordHash = await hashPassword(newPassword);
  await db.prepare("UPDATE users SET password_hash = ? WHERE id = ?").bind(passwordHash, user.id).run();

  return json({ message: "비밀번호가 변경되었습니다." });
}
