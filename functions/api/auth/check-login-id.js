import { getDb, json, normalizeLoginId, validateLoginId } from "./_shared.js";

export async function onRequestGet(context) {
  try {
    return await handleCheckLoginId(context);
  } catch (error) {
    console.error("auth/check-login-id unhandled error", getErrorDetails(error));
    return json({ available: false, reason: "error", message: "확인에 실패했습니다. 잠시 후 다시 시도해주세요." });
  }
}

async function handleCheckLoginId(context) {
  const url = new URL(context.request.url);
  const loginId = normalizeLoginId(url.searchParams.get("loginId"));
  const loginIdError = validateLoginId(loginId);

  if (loginIdError) {
    return json({ available: false, reason: "invalid", message: loginIdError });
  }

  const db = getDb(context);
  const existing = await db.prepare("SELECT 1 FROM users WHERE login_id = ? LIMIT 1").bind(loginId).first();

  if (existing) {
    return json({ available: false, reason: "taken", message: "이미 사용 중인 아이디입니다." });
  }

  return json({ available: true });
}

function getErrorDetails(error) {
  return {
    name: error?.name || "Error",
    message: error?.message || String(error),
    stack: error?.stack || "",
    cause: error?.cause ? String(error.cause) : "",
  };
}
