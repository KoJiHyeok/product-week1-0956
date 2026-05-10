import { getCurrentUser, json, readJson, validateEmail } from "./auth/_shared.js";

const ALLOWED_TYPES = new Set(["버그/악용 신고", "개선 방안 제안", "이미지 제안"]);

export async function onRequestPost(context) {
  try {
    return await handleContact(context);
  } catch {
    return json({ message: "문의 제출 중 오류가 발생했습니다." }, 500);
  }
}

async function handleContact(context) {
  const body = await readJson(context.request);

  if (!body) {
    return json({ message: "요청 형식이 올바르지 않습니다." }, 400);
  }

  const type = normalizeText(body.type);
  const title = normalizeText(body.title);
  const message = normalizeText(body.body);
  const replyEmail = normalizeText(body.replyEmail).toLowerCase();
  const user = await getCurrentUser(context);

  if (!ALLOWED_TYPES.has(type)) {
    return json({ message: "문의 유형을 선택하세요." }, 400);
  }

  if (!title) {
    return json({ message: "문의 제목을 입력하세요." }, 400);
  }

  if (!message) {
    return json({ message: "문의 내용을 입력하세요." }, 400);
  }

  if (!replyEmail) {
    return json({ message: "답변 받을 이메일을 입력하세요." }, 400);
  }

  const emailError = validateEmail(replyEmail);

  if (emailError) {
    return json({ message: emailError }, 400);
  }

  if (!context.env.RESEND_API_KEY) {
    return json({ message: "메일 발송 환경변수가 설정되지 않았습니다." }, 500);
  }

  const recipient = context.env.CONTACT_TO_EMAIL;

  if (!recipient) {
    return json({ message: "문의 수신 이메일 환경변수가 설정되지 않았습니다." }, 500);
  }

  const sender = context.env.CONTACT_FROM_EMAIL || "Title Academy <onboarding@resend.dev>";
  const result = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      authorization: `Bearer ${context.env.RESEND_API_KEY}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      from: sender,
      to: recipient,
      reply_to: replyEmail,
      subject: `[제목 학원 문의] ${type} - ${title}`,
      text: [
        `문의 유형: ${type}`,
        `문의 제목: ${title}`,
        `답변 받을 이메일: ${replyEmail}`,
        `로그인 회원: ${user ? `${user.username} (#${user.id})` : "비회원"}`,
        "",
        "문의 내용:",
        message,
      ].join("\n"),
    }),
  });

  if (!result.ok) {
    return json({ message: "메일 발송에 실패했습니다. 잠시 후 다시 시도해주세요." }, 502);
  }

  return json({ message: "문의가 접수되었습니다." });
}

function normalizeText(value) {
  return typeof value === "string" ? value.trim() : "";
}
