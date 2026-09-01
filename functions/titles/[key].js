// /titles/<imageKey>/ 는 2026-09-01에 /gallery/<slug>/ 로 통합됐다.
// 같은 사진에 대해 해설 페이지와 랭킹 페이지가 따로 있어 중복·저품질 페이지 쌍이 생겼고,
// 지금은 functions/gallery/[slug].js 한 곳이 해설 + 제목 랭킹을 함께 렌더한다.
// 기존 색인·공유 링크(?t=<submissionId>)를 살리기 위해 쿼리를 보존한 채 301한다.
import { galleryImages } from "../api/images/gallery-data.js";
import { gallerySlug, findImageByKey } from "../api/images/_gallery-slug.js";

export function onRequestGet(context) {
  const imageKey = typeof context.params.key === "string" ? context.params.key.trim() : "";
  const image = findImageByKey(galleryImages, imageKey);
  const requestUrl = new URL(context.request.url);

  if (!image) {
    return Response.redirect(new URL("/gallery/", requestUrl).toString(), 301);
  }

  const target = new URL(`/gallery/${gallerySlug(image)}/`, requestUrl);
  target.search = requestUrl.search;

  return Response.redirect(target.toString(), 301);
}
