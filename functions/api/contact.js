import { getCurrentUser, json, readJson, validateEmail } from "./auth/_shared.js";

const ALLOWED_TYPES = new Set(["버그/악용 신고", "개선 방안 제안", "이미지 제안"]);
const MAX_ATTACHMENT_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_EXTENSIONS = new Set(["jpg", "jpeg", "png", "webp"]);
const ALLOWED_IMAGE_MIME_TYPES = new Map([
  ["image/jpeg", new Set(["jpg", "jpeg"])],
  ["image/png", new Set(["png"])],
  ["image/webp", new Set(["webp"])],
]);

export async function onRequestPost(context) {
  try {
    return await handleContact(context);
  } catch {
    return json({ message: "문의 제출 중 오류가 발생했습니다." }, 500);
  }
}

async function handleContact(context) {
  const payload = await readContactPayload(context.request);

  if (!payload) {
    return json({ message: "요청 형식이 올바르지 않습니다." }, 400);
  }

  const type = normalizeText(payload.type);
  const title = normalizeText(payload.title);
  const message = normalizeText(payload.body);
  const replyEmail = normalizeText(payload.replyEmail).toLowerCase();
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

  const inquiryId = crypto.randomUUID();
  const attachmentResult = payload.image ? await prepareImageAttachment(payload.image, inquiryId) : null;

  if (attachmentResult?.error) {
    return json({ message: attachmentResult.error }, 400);
  }

  const attachment = attachmentResult?.attachment || null;
  await saveInquiry(context, inquiryId, user, { type, title, replyEmail, message });

  const safeEmail = {
    type: escapeHtml(type),
    title: escapeHtml(title),
    message: escapeHtml(message),
    replyEmail: escapeHtml(replyEmail),
    username: escapeHtml(user?.username || ""),
    userId: escapeHtml(user?.id || ""),
  };
  const emailText = [
    `문의 유형: ${safeEmail.type}`,
    `문의 제목: ${safeEmail.title}`,
    `답변 받을 이메일: ${safeEmail.replyEmail}`,
    `로그인 회원: ${user ? `${safeEmail.username} (#${safeEmail.userId})` : "비회원"}`,
    ...(attachment
      ? [
          "",
          "첨부 이미지:",
          `첨부 파일명: ${escapeHtml(attachment.displayName)}`,
          `첨부 파일 크기: ${formatFileSize(attachment.size)}`,
          `첨부 파일 MIME type: ${escapeHtml(attachment.type)}`,
        ]
      : []),
    "",
    "문의 내용:",
    safeEmail.message,
  ].join("\n");
  const emailPayload = {
    from: context.env.CONTACT_FROM_EMAIL || "Title Academy <onboarding@resend.dev>",
    to: recipient,
    reply_to: replyEmail,
    subject: `[제목 학원 문의] ${type} - ${singleLine(title)}`,
    text: emailText,
  };

  if (attachment) {
    emailPayload.attachments = [
      {
        filename: attachment.filename,
        content: attachment.content,
      },
    ];
  }

  const result = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      authorization: `Bearer ${context.env.RESEND_API_KEY}`,
      "content-type": "application/json",
    },
    body: JSON.stringify(emailPayload),
  });

  if (!result.ok) {
    return json({ message: "메일 발송에 실패했습니다. 잠시 후 다시 시도해주세요." }, 502);
  }

  return json({ message: "문의가 접수되었습니다." });
}

async function saveInquiry(context, inquiryId, user, inquiry) {
  if (!context.env.DB) {
    return;
  }

  try {
    await context.env.DB
      .prepare(
        `INSERT INTO contact_inquiries (id, user_id, type, title, reply_email, body)
         VALUES (?, ?, ?, ?, ?, ?)`
      )
      .bind(inquiryId, user?.id || null, inquiry.type, inquiry.title, inquiry.replyEmail, inquiry.message)
      .run();
  } catch {
    // The email path remains the source of truth until the inquiry table migration is applied.
  }
}

function normalizeText(value) {
  return typeof value === "string" ? value.trim() : "";
}

async function readContactPayload(request) {
  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("multipart/form-data")) {
    try {
      const form = await request.formData();
      const imageValue = form.get("image");
      const image =
        (isFile(imageValue) && imageValue.size === 0 && !imageValue.name) || imageValue === "" ? null : imageValue;

      return {
        type: form.get("type"),
        title: form.get("title"),
        replyEmail: form.get("replyEmail"),
        body: form.get("body"),
        image,
      };
    } catch {
      return null;
    }
  }

  return readJson(request);
}

async function prepareImageAttachment(file, inquiryId) {
  if (!isFile(file)) {
    return { error: "이미지 파일 형식이 올바르지 않습니다." };
  }

  if (file.size <= 0) {
    return { error: "비어 있는 이미지 파일은 첨부할 수 없습니다." };
  }

  if (file.size > MAX_ATTACHMENT_BYTES) {
    return { error: "이미지는 최대 5MB까지만 첨부할 수 있습니다." };
  }

  const extension = getFileExtension(file.name);
  const mimeExtensions = ALLOWED_IMAGE_MIME_TYPES.get(file.type);

  if (!ALLOWED_IMAGE_EXTENSIONS.has(extension)) {
    return { error: "jpg, jpeg, png, webp 이미지 파일만 첨부할 수 있습니다." };
  }

  if (!mimeExtensions || !mimeExtensions.has(extension)) {
    return { error: "이미지 MIME type이 허용되지 않은 형식입니다." };
  }

  const buffer = await file.arrayBuffer();

  if (buffer.byteLength > MAX_ATTACHMENT_BYTES) {
    return { error: "이미지는 최대 5MB까지만 첨부할 수 있습니다." };
  }

  return {
    attachment: {
      displayName: file.name || "첨부 이미지",
      filename: `contact-image-${inquiryId}.${extension}`,
      size: buffer.byteLength,
      type: file.type,
      content: arrayBufferToBase64(buffer),
    },
  };
}

function isFile(value) {
  return typeof File !== "undefined" && value instanceof File;
}

function getFileExtension(fileName) {
  const normalizedName = normalizeText(fileName).toLowerCase();
  const dotIndex = normalizedName.lastIndexOf(".");

  return dotIndex >= 0 ? normalizedName.slice(dotIndex + 1) : "";
}

function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  const chunkSize = 0x8000;
  let binary = "";

  for (let index = 0; index < bytes.length; index += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(index, index + chunkSize));
  }

  return btoa(binary);
}

function formatFileSize(bytes) {
  const megabytes = bytes / (1024 * 1024);

  return `${bytes} bytes (${megabytes >= 1 ? megabytes.toFixed(1) : (bytes / 1024).toFixed(1)}${megabytes >= 1 ? "MB" : "KB"})`;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function singleLine(value) {
  return String(value).replace(/[\r\n]+/g, " ");
}
