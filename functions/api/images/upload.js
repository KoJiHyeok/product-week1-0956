import { getCurrentUser, getDb, json } from "../auth/_shared.js";
import {
  createImageId,
  getImageBucket,
  sanitizeText,
  validateImageSignature,
  validateSourceType,
  validateUploadFile,
} from "./_shared.js";

export async function onRequestPost(context) {
  try {
    const user = await getCurrentUser(context);

    if (!user) {
      return json({ message: "로그인이 필요합니다." }, 401);
    }

    const bucket = getImageBucket(context);

    if (!bucket) {
      // TODO: Bind a private Cloudflare R2 bucket as IMAGE_BUCKET before enabling production uploads.
      return json({ message: "IMAGE_BUCKET R2 바인딩이 필요합니다." }, 500);
    }

    const form = await context.request.formData();
    const file = form.get("image");
    const validation = validateUploadFile(file);

    if (validation.message) {
      return json({ message: validation.message }, 400);
    }

    const sourceType = validateSourceType(String(form.get("sourceType") || ""));
    const altText = sanitizeText(form.get("altText"), 240);
    const sourceUrl = sanitizeText(form.get("sourceUrl"), 800);
    const authorName = sanitizeText(form.get("authorName"), 120);
    const licenseName = sanitizeText(form.get("licenseName"), 120);
    const attributionRequired = form.get("attributionRequired") === "true" ? 1 : 0;
    const confirmedRights = form.get("confirmedRights") === "true" ? 1 : 0;
    const confirmedNoViolation = form.get("confirmedNoViolation") === "true" ? 1 : 0;
    const confirmedNoProhibited = form.get("confirmedNoProhibited") === "true" ? 1 : 0;
    const agreedPolicy = form.get("agreedPolicy") === "true" ? 1 : 0;

    if (!sourceType) {
      return json({ message: "사진 출처 유형을 선택하세요." }, 400);
    }

    if (!altText) {
      return json({ message: "사진 설명 또는 alt text를 입력하세요." }, 400);
    }

    if (sourceType !== "self" && (!sourceUrl || !authorName || !licenseName)) {
      return json({ message: "외부 출처 이미지는 원본 URL, 작가명, 라이선스 이름을 입력해야 합니다." }, 400);
    }

    if (!confirmedRights || !confirmedNoViolation || !confirmedNoProhibited || !agreedPolicy) {
      return json({ message: "필수 동의 항목을 모두 확인해야 업로드할 수 있습니다." }, 400);
    }

    const id = createImageId();
    const storageKey = `uploads/private/${id}.${validation.extension}`;
    const fileBytes = await file.arrayBuffer();

    if (!validateImageSignature(fileBytes, validation.contentType)) {
      return json({ message: "이미지 파일 형식이 올바르지 않습니다." }, 400);
    }

    // TODO: Cloudflare Pages Functions runtime has no bundled image pipeline here.
    // Add an Images binding or a Worker-side image service for EXIF stripping, WebP conversion, and thumbnails.
    await bucket.put(storageKey, fileBytes, {
      httpMetadata: {
        contentType: validation.contentType,
      },
    });

    const db = getDb(context);
    await db
      .prepare(
        `INSERT INTO uploaded_images (
           id, uploader_user_id, storage_key, thumbnail_key, alt_text, source_type,
           source_url, author_name, license_name, attribution_required,
           uploader_confirmed_rights, no_rights_violation_confirmed,
           prohibited_content_confirmed, policy_agreed, status
         )
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`
      )
      .bind(
        id,
        user.id,
        storageKey,
        null,
        altText,
        sourceType,
        sourceType === "self" ? null : sourceUrl,
        sourceType === "self" ? null : authorName,
        sourceType === "self" ? null : licenseName,
        attributionRequired,
        confirmedRights,
        confirmedNoViolation,
        confirmedNoProhibited,
        agreedPolicy
      )
      .run();

    return json(
      {
        message: "업로드가 접수되었습니다. 관리자 검수 후 공개됩니다.",
        image: { id, status: "pending" },
      },
      201
    );
  } catch {
    return json({ message: "이미지 업로드를 처리하지 못했습니다." }, 500);
  }
}
