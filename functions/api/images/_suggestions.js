// 문의 폼으로 접수된 이미지 제안 공용 헬퍼.
// 이미지 바이트는 D1 BLOB(image_suggestions.image_data)에 보관하고,
// 승인되면 /api/images/suggestion/:id 로 공개 서빙된다.

export const IMAGE_SUGGESTION_TYPE = "이미지 제안";
// D1 행 크기 상한(약 2MB)에 여유를 둔 제안 이미지 상한.
export const MAX_SUGGESTION_IMAGE_BYTES = 1_500_000;
export const SUGGESTION_STATUSES = new Set(["pending", "approved", "rejected", "deleted"]);

const MAX_TITLE_LENGTH = 80;
const MAX_ALT_LENGTH = 200;
const MAX_DESCRIPTION_LENGTH = 800;
const MAX_PROMPT_LENGTH = 300;
const MAX_LIST_ITEMS = 5;
const MAX_LIST_ITEM_LENGTH = 80;

export function getSuggestionImageUrl(id) {
  return `/api/images/suggestion/${encodeURIComponent(String(id))}`;
}

export function getSuggestionImageKey(id) {
  return `suggestion:${id}`;
}

// D1은 BLOB을 ArrayBuffer 또는 정수 배열로 돌려줄 수 있어 둘 다 받아준다.
export function toImageBytes(value) {
  if (value == null) {
    return null;
  }

  if (value instanceof ArrayBuffer) {
    return new Uint8Array(value);
  }

  if (ArrayBuffer.isView(value)) {
    return new Uint8Array(value.buffer, value.byteOffset, value.byteLength);
  }

  if (Array.isArray(value)) {
    return new Uint8Array(value);
  }

  return null;
}

export function sanitizeSuggestionText(value, maxLength) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().replace(/\s+/g, " ").slice(0, maxLength);
}

export function sanitizeSuggestionParagraph(value, maxLength) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().replace(/[ \t]+/g, " ").slice(0, maxLength);
}

export function sanitizeSuggestionList(value) {
  const items = Array.isArray(value) ? value : typeof value === "string" ? value.split("\n") : [];

  return items
    .map((item) => sanitizeSuggestionText(item, MAX_LIST_ITEM_LENGTH))
    .filter(Boolean)
    .slice(0, MAX_LIST_ITEMS);
}

export function parseSuggestionList(value) {
  if (!value) {
    return [];
  }

  try {
    return sanitizeSuggestionList(JSON.parse(value));
  } catch {
    return [];
  }
}

// 관리자가 비워둔 문구는 문의 제목/내용으로 채운다.
export function buildGalleryFields(input, row) {
  const fallbackTitle = sanitizeSuggestionText(row?.inquiry_title || "", MAX_TITLE_LENGTH) || "제안 이미지";
  const title = sanitizeSuggestionText(input?.title, MAX_TITLE_LENGTH) || fallbackTitle;
  const alt = sanitizeSuggestionText(input?.alt, MAX_ALT_LENGTH) || title;
  const description =
    sanitizeSuggestionParagraph(input?.description, MAX_DESCRIPTION_LENGTH) ||
    sanitizeSuggestionParagraph(row?.inquiry_body || "", MAX_DESCRIPTION_LENGTH);
  const prompt = sanitizeSuggestionParagraph(input?.prompt, MAX_PROMPT_LENGTH);

  return {
    title,
    alt,
    description,
    prompt,
    observationPoints: sanitizeSuggestionList(input?.observationPoints),
    exampleTitles: sanitizeSuggestionList(input?.exampleTitles),
  };
}

export function serializeSuggestion(row) {
  const isPartySourced = row.source === "party" && row.party_photo_id != null;

  return {
    id: String(row.id),
    inquiryId: row.inquiry_id ? String(row.inquiry_id) : "",
    status: row.status || "pending",
    hasImage: Boolean(row.has_image) || isPartySourced,
    src: row.has_image || isPartySourced ? getSuggestionImageUrl(row.id) : "",
    fileName: row.file_name || "",
    contentType: row.content_type || "",
    byteSize: Number(row.byte_size) || 0,
    submitter: row.username || row.submitter_name || "비회원",
    submitterEmail: row.submitter_email || row.user_email || "",
    inquiryTitle: row.inquiry_title || "",
    inquiryBody: row.inquiry_body || "",
    title: row.gallery_title || "",
    description: row.gallery_description || "",
    alt: row.gallery_alt || "",
    prompt: row.gallery_prompt || "",
    observationPoints: parseSuggestionList(row.gallery_observation_points),
    exampleTitles: parseSuggestionList(row.gallery_example_titles),
    moderationReason: row.moderation_reason || "",
    createdAt: row.created_at || "",
    reviewedAt: row.reviewed_at || "",
    publishedAt: row.published_at || "",
    suggestedTitle: row.suggested_title || "",
    source: row.source || "contact",
  };
}

// 갤러리(/api/images)에 합쳐 내려보낼 형태. 정적 갤러리 항목과 같은 필드 이름을 쓴다.
export function toGalleryImage(row) {
  const title = row.gallery_title || "제안 이미지";

  return {
    id: `suggestion-${row.id}`,
    imageKey: getSuggestionImageKey(row.id),
    src: getSuggestionImageUrl(row.id),
    webpSrc: "",
    title,
    description: row.gallery_description || "",
    alt: row.gallery_alt || title,
    prompt: row.gallery_prompt || "",
    observationPoints: parseSuggestionList(row.gallery_observation_points),
    exampleTitles: parseSuggestionList(row.gallery_example_titles),
    isUserUpload: true,
    hasDetailPage: false,
    publishedAt: row.published_at || row.reviewed_at || row.created_at || "",
    sourceName: "회원 이미지 제안",
    sourceUrl: "",
    author: row.username || row.submitter_name || "제안자",
    license: "제안자가 게시에 동의한 이미지",
    attributionRequired: false,
    commercialUseAllowed: false,
    modificationAllowed: false,
  };
}
