import { getCurrentUser, getDb, json } from "../auth/_shared.js";

export const IMAGE_BUCKET_BINDING = "IMAGE_BUCKET";
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

const allowedImageTypes = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
]);
const allowedExtensions = new Set(["jpg", "jpeg", "png", "webp"]);
const validSourceTypes = new Set(["self", "free_site", "other"]);
const validStatuses = new Set(["pending", "approved", "rejected", "hidden", "removed"]);
const validReportReasons = new Set([
  "copyright",
  "portrait",
  "privacy",
  "sexual_violent",
  "hate",
  "other",
]);

export function getImageBucket(context) {
  return context.env[IMAGE_BUCKET_BINDING] || null;
}

export async function requireAdmin(context) {
  const user = await getCurrentUser(context);

  if (!user) {
    return { response: json({ message: "로그인이 필요합니다." }, 401), user: null };
  }

  if (await isAdminUser(context, user)) {
    return { response: null, user };
  }

  return { response: json({ message: "관리자 권한이 필요합니다." }, 403), user };
}

export async function isAdminUser(context, user) {
  if (!user) {
    return false;
  }

  const configuredIds = parseEnvList(context.env.ADMIN_USER_IDS);
  const configuredEmails = parseEnvList(context.env.ADMIN_EMAILS).map((email) => email.toLowerCase());

  if (configuredIds.has(String(user.id))) {
    return true;
  }

  if (user.email && configuredEmails.has(String(user.email).toLowerCase())) {
    return true;
  }

  try {
    const db = getDb(context);
    const row = await db.prepare("SELECT role FROM users WHERE id = ? LIMIT 1").bind(user.id).first();
    return row?.role === "admin";
  } catch {
    return false;
  }
}

export function parseEnvList(value) {
  return new Set(
    String(value || "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
  );
}

export function sanitizeText(value, maxLength = 500) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().replace(/\s+/g, " ").slice(0, maxLength);
}

export function sanitizeLongText(value, maxLength = 2000) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().slice(0, maxLength);
}

export function validateSourceType(value) {
  return validSourceTypes.has(value) ? value : "";
}

export function validateImageStatus(value, fallback = "pending") {
  return validStatuses.has(value) ? value : fallback;
}

export function validateReportReason(value) {
  return validReportReasons.has(value) ? value : "";
}

export function validateUploadFile(file) {
  if (!(file instanceof File)) {
    return { message: "이미지 파일을 선택하세요." };
  }

  if (file.size > MAX_IMAGE_BYTES) {
    return { message: "이미지는 5MB 이하만 업로드할 수 있습니다." };
  }

  const extension = getExtension(file.name);

  if (!allowedExtensions.has(extension)) {
    return { message: "jpg, jpeg, png, webp 파일만 업로드할 수 있습니다." };
  }

  if (!allowedImageTypes.has(file.type)) {
    return { message: "JPEG, PNG, WEBP 이미지만 업로드할 수 있습니다." };
  }

  return { extension: allowedImageTypes.get(file.type), contentType: file.type };
}

export function validateImageSignature(bytes, contentType) {
  const data = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);

  if (contentType === "image/jpeg") {
    return data.length >= 3 && data[0] === 0xff && data[1] === 0xd8 && data[2] === 0xff;
  }

  if (contentType === "image/png") {
    const png = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
    return png.every((byte, index) => data[index] === byte);
  }

  if (contentType === "image/webp") {
    return (
      data.length >= 12 &&
      data[0] === 0x52 &&
      data[1] === 0x49 &&
      data[2] === 0x46 &&
      data[3] === 0x46 &&
      data[8] === 0x57 &&
      data[9] === 0x45 &&
      data[10] === 0x42 &&
      data[11] === 0x50
    );
  }

  return false;
}

export function getExtension(fileName) {
  const match = String(fileName || "").toLowerCase().match(/\.([a-z0-9]+)$/);
  return match ? match[1] : "";
}

export function createImageId() {
  return crypto.randomUUID();
}

export function getPublicImageUrl(id) {
  return `/api/images/file/${encodeURIComponent(id)}`;
}

export function serializeUploadedImage(row) {
  const imageKey = `uploaded:${row.id}`;

  return {
    id: String(row.id),
    imageKey,
    src: getPublicImageUrl(row.id),
    webpSrc: "",
    alt: row.alt_text || "사용자 업로드 이미지",
    isUserUpload: true,
    status: row.status,
    sourceType: row.source_type,
    sourceUrl: row.source_url || "",
    authorName: row.author_name || "",
    licenseName: row.license_name || "",
    attributionRequired: Boolean(row.attribution_required),
    reportCount: Number(row.report_count) || 0,
    createdAt: row.created_at,
    uploader: row.username || "회원",
    uploaderUserId: row.uploader_user_id ? String(row.uploader_user_id) : "",
    moderationReason: row.moderation_reason || "",
    reviewedAt: row.reviewed_at || "",
    reviewedBy: row.reviewed_by ? String(row.reviewed_by) : "",
  };
}
