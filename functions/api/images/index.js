import { getDb, json } from "../auth/_shared.js";
import { serializeUploadedImage } from "./_shared.js";

const defaultImages = [
  { id: "photo-001", imageKey: "0", src: "assets/gallery/01-cat-smoke.png", webpSrc: "assets/gallery/webp/01-cat-smoke.webp", alt: "Cat reaching through smoke", isUserUpload: false },
  { id: "photo-002", imageKey: "1", src: "assets/gallery/02-memorial.png", webpSrc: "assets/gallery/webp/02-memorial.webp", alt: "People placing flowers outside a store", isUserUpload: false },
  { id: "photo-003", imageKey: "2", src: "assets/gallery/03-alligators.jpeg", webpSrc: "assets/gallery/webp/03-alligators.webp", alt: "Alligators resting together", isUserUpload: false },
  { id: "photo-004", imageKey: "3", src: "assets/gallery/04-field-portrait.jpg", webpSrc: "assets/gallery/webp/04-field-portrait.webp", alt: "Person walking in a field", isUserUpload: false },
  { id: "photo-005", imageKey: "4", src: "assets/gallery/05-screaming-man.png", webpSrc: "assets/gallery/webp/05-screaming-man.webp", alt: "Man shouting in a suit", isUserUpload: false },
  { id: "photo-006", imageKey: "5", src: "assets/gallery/06-husky-bowl.jpg", webpSrc: "assets/gallery/webp/06-husky-bowl.webp", alt: "Husky staring at a food bowl", isUserUpload: false },
  { id: "photo-007", imageKey: "6", src: "assets/gallery/07-puppy-oh-hi.jpg", webpSrc: "assets/gallery/webp/07-puppy-oh-hi.webp", alt: "Smiling puppy close to the camera", isUserUpload: false },
  { id: "photo-008", imageKey: "7", src: "assets/gallery/08-convenience-store.jpg", webpSrc: "assets/gallery/webp/08-convenience-store.webp", alt: "Person reaching into a convenience store cooler", isUserUpload: false },
  { id: "photo-009", imageKey: "8", src: "assets/gallery/09-reggae-singer.jpg", webpSrc: "assets/gallery/webp/09-reggae-singer.webp", alt: "Reggae singer performing on stage", isUserUpload: false },
  { id: "photo-010", imageKey: "9", src: "assets/gallery/10-sparkler.jpg", webpSrc: "assets/gallery/webp/10-sparkler.webp", alt: "Person holding a lit sparkler", isUserUpload: false },
];

export async function onRequestGet(context) {
  try {
    const db = getDb(context);
    const { results } = await db
      .prepare(
        `SELECT uploaded_images.*, users.username
         FROM uploaded_images
         LEFT JOIN users ON users.id = uploaded_images.uploader_user_id
         WHERE uploaded_images.status = 'approved'
         ORDER BY uploaded_images.created_at DESC`
      )
      .all();

    return json({
      images: [...defaultImages, ...(results || []).map(serializeUploadedImage)],
    });
  } catch {
    return json({ message: "이미지 목록을 불러오지 못했습니다." }, 500);
  }
}
