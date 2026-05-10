import { json } from "../auth/_shared.js";

const defaultImages = [
  // 관리자가 승인한 정적 이미지는 assets/gallery에 파일을 넣고 이 목록에 추가하면 공개됩니다.
  // 예: { src: "assets/gallery/example.webp", title: "이미지 제목", description: "이미지 설명" }
  { id: "photo-001", imageKey: "0", src: "assets/gallery/01-cat-smoke.png", webpSrc: "assets/gallery/webp/01-cat-smoke.webp", title: "Cat reaching through smoke", description: "Cat reaching through smoke", alt: "Cat reaching through smoke", isUserUpload: false },
  { id: "photo-002", imageKey: "1", src: "assets/gallery/02-memorial.png", webpSrc: "assets/gallery/webp/02-memorial.webp", title: "People placing flowers outside a store", description: "People placing flowers outside a store", alt: "People placing flowers outside a store", isUserUpload: false },
  { id: "photo-003", imageKey: "2", src: "assets/gallery/03-alligators.jpeg", webpSrc: "assets/gallery/webp/03-alligators.webp", title: "Alligators resting together", description: "Alligators resting together", alt: "Alligators resting together", isUserUpload: false },
  { id: "photo-004", imageKey: "3", src: "assets/gallery/04-field-portrait.jpg", webpSrc: "assets/gallery/webp/04-field-portrait.webp", title: "Person walking in a field", description: "Person walking in a field", alt: "Person walking in a field", isUserUpload: false },
  { id: "photo-005", imageKey: "4", src: "assets/gallery/05-screaming-man.png", webpSrc: "assets/gallery/webp/05-screaming-man.webp", title: "Man shouting in a suit", description: "Man shouting in a suit", alt: "Man shouting in a suit", isUserUpload: false },
  { id: "photo-006", imageKey: "5", src: "assets/gallery/06-husky-bowl.jpg", webpSrc: "assets/gallery/webp/06-husky-bowl.webp", title: "Husky staring at a food bowl", description: "Husky staring at a food bowl", alt: "Husky staring at a food bowl", isUserUpload: false },
  { id: "photo-007", imageKey: "6", src: "assets/gallery/07-puppy-oh-hi.jpg", webpSrc: "assets/gallery/webp/07-puppy-oh-hi.webp", title: "Smiling puppy close to the camera", description: "Smiling puppy close to the camera", alt: "Smiling puppy close to the camera", isUserUpload: false },
  { id: "photo-008", imageKey: "7", src: "assets/gallery/08-convenience-store.jpg", webpSrc: "assets/gallery/webp/08-convenience-store.webp", title: "Person reaching into a convenience store cooler", description: "Person reaching into a convenience store cooler", alt: "Person reaching into a convenience store cooler", isUserUpload: false },
  { id: "photo-009", imageKey: "8", src: "assets/gallery/09-reggae-singer.jpg", webpSrc: "assets/gallery/webp/09-reggae-singer.webp", title: "Reggae singer performing on stage", description: "Reggae singer performing on stage", alt: "Reggae singer performing on stage", isUserUpload: false },
  { id: "photo-010", imageKey: "9", src: "assets/gallery/10-sparkler.jpg", webpSrc: "assets/gallery/webp/10-sparkler.webp", title: "Person holding a lit sparkler", description: "Person holding a lit sparkler", alt: "Person holding a lit sparkler", isUserUpload: false },
];

export async function onRequestGet(context) {
  return json({ images: defaultImages });
}
