// 홈(/)은 main.js가 그리는 SPA라 원본 HTML의 기본 뷰(#galleryGrid)가 빈 div였다.
// 크롤러·심사 도구가 보는 첫 화면이 빈 껍데기가 되지 않도록, 정적 index.html의
// 빈 갤러리 그리드에 사진 목록과 상세 페이지 링크를 서버에서 미리 채워 넣는다.
// main.js는 renderGallery()에서 galleryGrid.replaceChildren()으로 이 자리를 다시 그리므로
// 사용자가 보는 화면은 달라지지 않는다(점진적 향상).
//
// 주의: #homeView(피드)는 정적 HTML에서 hidden이라 주입 대상으로 쓰면 안 된다.
// 숨겨진 영역의 텍스트는 검색엔진이 할인하거나 은닉 텍스트로 볼 수 있다.
// #galleryView는 기본 표시 뷰라 여기에 넣은 내용만 실제로 보인다.
//
// SSR 카드는 .photo-card 클래스를 쓰지 않는다 — main.js의 galleryGrid 클릭 핸들러가
// .photo-card를 잡아 인덱스로 동작하기 때문에, 하이드레이션 전에는 링크 이동에 맡긴다.
import { galleryImages } from "./api/images/gallery-data.js";
import { galleryCopy } from "./api/images/gallery-copy.js";
import { gallerySlug } from "./api/images/_gallery-slug.js";

const GRID_PLACEHOLDER = '<div class="gallery-grid" id="galleryGrid"></div>';

export async function onRequestGet(context) {
  const assetResponse = await context.env.ASSETS.fetch(context.request);

  try {
    const contentType = assetResponse.headers.get("content-type") || "";
    if (!contentType.includes("text/html")) {
      return assetResponse;
    }

    const html = await assetResponse.clone().text();
    if (!html.includes(GRID_PLACEHOLDER)) {
      return assetResponse;
    }

    return new Response(html.replace(GRID_PLACEHOLDER, renderGrid()), {
      status: assetResponse.status,
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "public, max-age=0, s-maxage=600",
      },
    });
  } catch (error) {
    console.error("index SSR error", error);
    return assetResponse;
  }
}

function renderGrid() {
  // main.js와 같은 순서(최신 사진 먼저)로 둔다.
  const cards = galleryImages
    .slice()
    .reverse()
    // 해설 원고가 있는 사진만 링크한다 — 원고 없는 상세는 noindex라 링크할 이유가 없다.
    .filter((image) => galleryCopy[image.id])
    .map((image) => {
      const href = `/gallery/${gallerySlug(image)}/`;
      const src = encodeURI(`/${String(image.webpSrc || image.src).replace(/^\/+/, "")}`);

      return `        <article class="photo-card-ssr">
          <a href="${escapeHtml(href)}">
            <img src="${escapeHtml(src)}" alt="${escapeHtml(image.alt || image.title)}" loading="lazy" decoding="async" />
            <strong>${escapeHtml(image.title)}</strong>
          </a>
        </article>`;
    })
    .join("\n");

  return `<div class="gallery-grid" id="galleryGrid">
${cards}
      </div>`;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
