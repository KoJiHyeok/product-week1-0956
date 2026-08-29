import { getDb } from "../../auth/_shared.js";
import { ensureMessagesSchema } from "../../messages/_schema.js";

// image_data(BLOB)는 목록/조회 응답에 필요 없으므로 존재 여부만 가져온다.
const SUGGESTION_COLUMNS = `image_suggestions.id, image_suggestions.inquiry_id, image_suggestions.user_id,
        image_suggestions.submitter_name, image_suggestions.submitter_email, image_suggestions.inquiry_title,
        image_suggestions.inquiry_body, image_suggestions.file_name, image_suggestions.content_type,
        image_suggestions.byte_size, image_suggestions.status, image_suggestions.gallery_title,
        image_suggestions.gallery_description, image_suggestions.gallery_alt, image_suggestions.gallery_prompt,
        image_suggestions.gallery_observation_points, image_suggestions.gallery_example_titles,
        image_suggestions.moderation_reason, image_suggestions.created_at, image_suggestions.reviewed_at,
        image_suggestions.published_at, image_suggestions.suggested_title, image_suggestions.source,
        image_suggestions.party_photo_id,
        image_suggestions.image_data IS NOT NULL AS has_image,
        users.username, users.email AS user_email`;

export function selectSuggestions(context, whereClause) {
  return getDb(context).prepare(
    `SELECT ${SUGGESTION_COLUMNS}
     FROM image_suggestions
     LEFT JOIN users ON users.id = image_suggestions.user_id
     ${whereClause}
     ORDER BY image_suggestions.created_at DESC
     LIMIT 100`
  );
}

export function findSuggestion(context, id) {
  return getDb(context)
    .prepare(
      `SELECT ${SUGGESTION_COLUMNS}
       FROM image_suggestions
       LEFT JOIN users ON users.id = image_suggestions.user_id
       WHERE image_suggestions.id = ?
       LIMIT 1`
    )
    .bind(id)
    .first();
}

// 게시되면 제안한 회원에게 쪽지로 알린다. 비회원 제안은 받을 계정이 없어 건너뛴다.
// 쪽지 실패가 승인 자체를 막지 않도록 오류는 삼키고 로그만 남긴다.
export async function notifySuggesterApproved(context, suggestion, adminUser, galleryTitle) {
  const recipientUserId = Number(suggestion?.user_id);

  if (!Number.isInteger(recipientUserId) || recipientUserId === Number(adminUser?.id)) {
    return false;
  }

  try {
    const db = getDb(context);
    await ensureMessagesSchema(db);
    await db
      .prepare("INSERT INTO messages (sender_user_id, recipient_user_id, body) VALUES (?, ?, ?)")
      .bind(
        adminUser.id,
        recipientUserId,
        [
          "제안해주신 이미지가 갤러리에 게시되었습니다. 🎉",
          "",
          `게시 제목: ${galleryTitle}`,
          "",
          "홈 갤러리에서 확인하고 첫 제목을 달아보세요. 좋은 사진 제안 감사합니다!",
        ].join("\n")
      )
      .run();

    return true;
  } catch (error) {
    console.error("image suggestion approval message error", error);
    return false;
  }
}

// 이미지 제안을 처리하면 연결된 문의도 같은 흐름으로 닫아준다.
export async function closeLinkedInquiry(context, inquiryId, status = "resolved") {
  if (!inquiryId) {
    return;
  }

  try {
    await getDb(context)
      .prepare("UPDATE contact_inquiries SET status = ?, reviewed_at = CURRENT_TIMESTAMP WHERE id = ?")
      .bind(status, inquiryId)
      .run();
  } catch (error) {
    console.error("linked inquiry update error", error);
  }
}
