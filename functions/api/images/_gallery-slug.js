// 갤러리 상세 페이지(/gallery/<slug>/)의 slug 규칙.
// 과거 정적 페이지 생성기가 쓰던 규칙과 동일해야 기존 색인 URL이 유지된다.
// main.js에도 같은 규칙의 사본이 있다(galleryPageSlug) — 한쪽만 고치지 말 것.
const SLUG_OVERRIDES = Object.freeze({
  "photo-001": "cat-smoke",
});

export function gallerySlug(image) {
  if (!image) {
    return "";
  }

  return SLUG_OVERRIDES[image.id] || image.slug || image.id || "";
}

export function findImageBySlug(images, slug) {
  if (!slug) {
    return null;
  }

  return images.find((image) => gallerySlug(image) === slug) || null;
}

export function findImageByKey(images, imageKey) {
  if (!imageKey) {
    return null;
  }

  return images.find((image) => String(image.imageKey) === String(imageKey)) || null;
}
