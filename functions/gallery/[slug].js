// /gallery/<slug>/ — 사진 해설 + 실제 사용자 제목 랭킹을 한 페이지에 렌더한다.
// 이전에는 해설(정적 gallery/<slug>/index.html)과 랭킹(/titles/<key>/)이 같은 사진에 대해
// 별도 URL로 쪼개져 있어 중복·저품질 페이지 쌍을 만들었다. 두 페이지를 여기로 합쳤고,
// /titles/<key>/ 는 이 URL로 301한다.
import { getDb } from "../api/auth/_shared.js";
import { galleryImages } from "../api/images/gallery-data.js";
import { galleryCopy } from "../api/images/gallery-copy.js";
import { gallerySlug, findImageBySlug } from "../api/images/_gallery-slug.js";
import { formatAuthorName } from "../api/submissions/_guest-identity.js";

const SITE_ORIGIN = "https://jemokhakwon.com";
const ADSENSE_ACCOUNT = "ca-pub-2571483149742375";
const RANKING_LIMIT = 50;

export async function onRequestGet(context) {
  const slug = typeof context.params.slug === "string" ? context.params.slug.trim() : "";
  const image = findImageBySlug(galleryImages, slug);

  if (!image) {
    return htmlResponse(renderNotFoundPage(), 404);
  }

  const requestUrl = new URL(context.request.url);
  const sharedSubmissionId = parsePositiveInt(requestUrl.searchParams.get("t"));
  const imageKey = String(image.imageKey);

  let titles = [];
  let loadError = false;
  let sharedSubmission = null;

  try {
    const db = getDb(context);
    titles = await loadTitleRanking(db, imageKey);

    if (sharedSubmissionId) {
      sharedSubmission = await loadSharedSubmission(db, sharedSubmissionId, imageKey);
    }
  } catch (error) {
    console.error("gallery/[slug] error", error);
    loadError = true;
  }

  return htmlResponse(renderGalleryPage(image, titles, loadError, sharedSubmission));
}

function parsePositiveInt(value) {
  if (typeof value !== "string" || !/^[1-9]\d*$/.test(value)) {
    return null;
  }

  return Number(value);
}

async function loadTitleRanking(db, imageKey) {
  const { results } = await db
    .prepare(
      `SELECT
         submissions.id,
         submissions.title,
         submissions.author_user_id,
         submissions.guest_name,
         submissions.guest_tag,
         submissions.created_at,
         users.username,
         COUNT(DISTINCT likes.id) AS like_count,
         (
           SELECT COUNT(*) FROM comments
           WHERE comments.submission_id = submissions.id
             AND comments.hidden_at IS NULL
             AND comments.deleted_at IS NULL
         ) AS comment_count
       FROM submissions
       LEFT JOIN users ON users.id = submissions.author_user_id
       LEFT JOIN likes ON likes.submission_id = submissions.id
       WHERE COALESCE(submissions.image_key, CAST(submissions.image_index AS TEXT)) = ?
         AND submissions.hidden_at IS NULL
         AND submissions.deleted_at IS NULL
         AND submissions.excluded_from_ranking = 0
       GROUP BY submissions.id
       ORDER BY like_count DESC, submissions.created_at DESC
       LIMIT ?`
    )
    .bind(imageKey, RANKING_LIMIT)
    .all();

  return (results || []).map((row) => ({
    title: row.title,
    author: formatAuthorName(row),
    likeCount: Number(row.like_count) || 0,
    commentCount: Number(row.comment_count) || 0,
    createdAt: row.created_at,
  }));
}

async function loadSharedSubmission(db, submissionId, imageKey) {
  const row = await db
    .prepare(
      `SELECT submissions.id, submissions.title, submissions.author_user_id,
              submissions.guest_name, submissions.guest_tag, users.username,
              (SELECT COUNT(*) FROM likes WHERE likes.submission_id = submissions.id) AS like_count
       FROM submissions LEFT JOIN users ON users.id = submissions.author_user_id
       WHERE submissions.id = ?
         AND COALESCE(submissions.image_key, CAST(submissions.image_index AS TEXT)) = ?
         AND submissions.hidden_at IS NULL AND submissions.deleted_at IS NULL
         AND submissions.excluded_from_ranking = 0`
    )
    .bind(submissionId, imageKey)
    .first();

  if (!row) {
    return null;
  }

  return {
    id: Number(row.id),
    title: row.title,
    author: formatAuthorName(row),
    likeCount: Number(row.like_count) || 0,
  };
}

function renderGalleryPage(image, titles, loadError, sharedSubmission) {
  const copy = galleryCopy[image.id] || null;
  const slug = gallerySlug(image);
  const imageKey = String(image.imageKey);
  const canonicalUrl = `${SITE_ORIGIN}/gallery/${slug}/`;
  const encodedImagePath = encodedAssetUrl(image.src);
  const imageFullUrl = `${SITE_ORIGIN}${encodedImagePath}`;
  const webpPath = image.webpSrc ? encodedAssetUrl(image.webpSrc) : "";
  const titleCount = titles.length;

  let pageTitle = `${image.title} - 사진 해설과 제목 랭킹 | 제목 학원`;
  let description = image.description;
  // 해설 원고가 없는 사진은 색인 대상에서 뺀다(얇은 페이지 방지).
  let robots = copy ? "index, follow" : "noindex, follow";
  let ogUrl = canonicalUrl;

  if (sharedSubmission) {
    pageTitle = `"${sharedSubmission.title}" — ${sharedSubmission.author}의 제목 | 제목 학원`;
    description = `${image.title} 사진에 달린 제목입니다. 이보다 웃긴 제목을 지을 수 있다면 도전해보세요!`;
    robots = "noindex, follow";
    ogUrl = `${canonicalUrl}?t=${sharedSubmission.id}`;
  }

  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="google-adsense-account" content="${ADSENSE_ACCOUNT}" />
  <link rel="icon" type="image/png" href="/Logo-image.png">
  <link rel="apple-touch-icon" href="/Logo-image.png">
  <meta name="description" content="${escapeHtml(description)}" />
  <meta name="robots" content="${robots}" />
  <link rel="canonical" href="${canonicalUrl}" />
  <meta property="og:type" content="article" />
  <meta property="og:locale" content="ko_KR" />
  <meta property="og:site_name" content="제목 학원" />
  <meta property="og:title" content="${escapeHtml(pageTitle)}" />
  <meta property="og:description" content="${escapeHtml(description)}" />
  <meta property="og:url" content="${escapeHtml(ogUrl)}" />
  <meta property="og:image" content="${imageFullUrl}" />
  <meta property="og:image:alt" content="${escapeHtml(image.alt || image.title)}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(pageTitle)}" />
  <meta name="twitter:description" content="${escapeHtml(description)}" />
  <meta name="twitter:image" content="${imageFullUrl}" />
  <title>${escapeHtml(pageTitle)}</title>
  <link href="/style.css?v=40" rel="stylesheet" />
${articleJsonLd(image, canonicalUrl, imageFullUrl, titleCount)}
</head>
<body class="info-page">
  <main class="info-shell">
${headerHtml()}

    <section class="info-hero">
      <p class="info-kicker">사진 해설</p>
      <h1>${escapeHtml(image.title)}</h1>
      <p>${escapeHtml(image.description)}</p>
    </section>

${sharedSubmission ? renderSharedSubmissionBlock(sharedSubmission) : ""}
    <section class="info-grid">
      <article class="info-card info-card-wide">
        <picture>
${webpPath ? `          <source srcset="${escapeHtml(webpPath)}" type="image/webp" />\n` : ""}          <img src="${escapeHtml(encodedImagePath)}"
               alt="${escapeHtml(image.alt || image.title)}"
               loading="lazy" decoding="async"
               style="width:100%;height:auto;border-radius:12px;display:block;" />
        </picture>
      </article>

${copy ? renderCopyCards(image, copy) : renderFallbackCard(image)}
      <article class="info-card info-card-wide">
        <h2>이 사진에 달린 제목 ${titleCount}개</h2>
${renderRankingList(titles, loadError, image, imageKey)}
      </article>
    </section>

    <section class="info-cta">
      <p class="info-kicker">참여하기</p>
      <h2>이 사진에 어울리는 제목을 직접 만들어보세요</h2>
      <p>제목을 남기면 이 페이지의 랭킹에 바로 올라가고, 다른 사람의 하트와 댓글을 받을 수 있습니다.</p>
      <a class="info-primary-button" href="/#title/key/${encodeURIComponent(imageKey)}">제목 달아보기</a>
    </section>

${footerHtml(image)}
  </main>
</body>
</html>
`;
}

function renderCopyCards(image, copy) {
  return `      <article class="info-card">
        <h2>이 사진의 핵심 장면</h2>
${copy.scene.map((paragraph) => `        <p>${escapeHtml(paragraph)}</p>`).join("\n")}
      </article>

      <article class="info-card">
        <h2>관찰 포인트</h2>
        <ul class="info-link-list">
${(image.observationPoints || []).map((item) => `          <li>${escapeHtml(item)}</li>`).join("\n")}
        </ul>
      </article>

      <article class="info-card">
        <h2>예시 제목과 해석</h2>
        <ul class="info-link-list">
${(image.exampleTitles || []).map((title, i) => `          <li><strong>${escapeHtml(title)}</strong> - ${escapeHtml(copy.analysis[i] || "")}</li>`).join("\n")}
        </ul>
      </article>

      <article class="info-card">
        <h2>직접 제목을 만들 때</h2>
${copy.composeTip.map((paragraph) => `        <p>${escapeHtml(paragraph)}</p>`).join("\n")}
      </article>

      <article class="info-card">
        <h2>한 걸음 더 관찰하기</h2>
        <p>${escapeHtml(copy.extra)}</p>
      </article>

`;
}

function renderFallbackCard(image) {
  return `      <article class="info-card">
        <h2>관찰 포인트</h2>
        <p>${escapeHtml(image.prompt || image.description)}</p>
        <ul class="info-link-list">
${(image.observationPoints || []).map((item) => `          <li>${escapeHtml(item)}</li>`).join("\n")}
        </ul>
      </article>

`;
}

function renderRankingList(titles, loadError, image, imageKey) {
  if (loadError) {
    return `        <p>제목 목록을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.</p>`;
  }

  if (!titles.length) {
    return `        <p>아직 이 사진에 달린 제목이 없습니다. 첫 번째 제목의 주인공이 되어보세요.</p>`;
  }

  const totalHearts = titles.reduce((sum, entry) => sum + entry.likeCount, 0);
  const totalComments = titles.reduce((sum, entry) => sum + entry.commentCount, 0);
  const authors = new Set(titles.map((entry) => entry.author)).size;

  const summary = `${authors}명이 남긴 제목 ${titles.length}개에 하트 ${totalHearts}개와 댓글 ${totalComments}개가 달렸습니다. 같은 사진을 사람마다 어떻게 다르게 읽었는지 비교해보세요.`;

  const items = titles
    .map((entry, index) => {
      const rank = index + 1;
      return `          <li><strong>${rank}위 · ${escapeHtml(entry.title)}</strong> - ${escapeHtml(entry.author)} · 하트 ${entry.likeCount}개 · 댓글 ${entry.commentCount}개</li>`;
    })
    .join("\n");

  return `        <p>${escapeHtml(summary)}</p>
        <ol class="info-link-list">
${items}
        </ol>`;
}

function renderSharedSubmissionBlock(sharedSubmission) {
  return `    <section class="info-grid">
      <article class="info-card info-card-wide">
        <p class="info-kicker">공유된 제목</p>
        <h2>"${escapeHtml(sharedSubmission.title)}"</h2>
        <p>${escapeHtml(sharedSubmission.author)} · 하트 ${sharedSubmission.likeCount}개</p>
      </article>
    </section>

`;
}

function articleJsonLd(image, canonicalUrl, imageFullUrl, titleCount) {
  const dates = image.publishedAt
    ? `    "datePublished": ${JSON.stringify(image.publishedAt)},\n    "dateModified": ${JSON.stringify(image.updatedAt || image.publishedAt)},\n`
    : "";

  return `  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": ${JSON.stringify(image.title)},
    "description": ${JSON.stringify(image.description)},
    "inLanguage": "ko-KR",
    "mainEntityOfPage": ${JSON.stringify(canonicalUrl)},
    "image": ${JSON.stringify(imageFullUrl)},
${dates}    "commentCount": ${titleCount},
    "author": { "@type": "Organization", "name": "제목 학원" },
    "publisher": {
      "@type": "Organization",
      "name": "제목 학원",
      "url": "${SITE_ORIGIN}/"
    }
  }
  </script>`;
}

function renderNotFoundPage() {
  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="icon" type="image/png" href="/Logo-image.png">
  <meta name="description" content="요청하신 사진을 찾을 수 없습니다." />
  <meta name="robots" content="noindex, follow" />
  <title>사진을 찾을 수 없습니다 | 제목 학원</title>
  <link href="/style.css?v=40" rel="stylesheet" />
</head>
<body class="info-page">
  <main class="info-shell">
${headerHtml()}

    <section class="info-hero">
      <p class="info-kicker">사진 해설</p>
      <h1>사진을 찾을 수 없습니다</h1>
      <p>주소가 바뀌었거나 사진이 내려갔을 수 있습니다. <a href="/gallery/">사진 해설 목록</a>에서 다른 사진을 찾아보세요.</p>
    </section>

${footerHtml(null)}
  </main>
</body>
</html>
`;
}

function navHtml() {
  return `
      <nav class="site-nav" aria-label="주요 페이지">
        <a href="/">홈</a>
        <a href="/about/">제목 학원이란?</a>
        <a href="/guide/">사용 가이드</a>
        <a href="/examples/">제목 예시</a>
        <a href="/gallery/">사진 해설</a>
        <a href="/blog/">글쓰기 칼럼</a>
        <a href="/privacy/">개인정보처리방침</a>
        <a href="/terms/">이용약관</a>
        <a href="/contact/">문의</a>
      </nav>`;
}

function headerHtml() {
  return `
    <header class="info-header">
      <a class="info-brand" href="/" aria-label="제목 학원 홈">
        <picture>
          <img class="brand-logo" src="/assets/gallery/logo.png" alt="제목 학원 로고" width="56" height="56" />
        </picture>
        <span>제목 학원</span>
      </a>${navHtml()}
    </header>`;
}

function footerHtml(image) {
  const sourceLine = image
    ? `${escapeHtml(sourceNote(image))} 권리 침해나 부적절한 내용이 보이면 <a href="/contact/">문의</a>로 알려주세요.`
    : `제목 학원은 공개 권한과 제목 연습 적합성을 검토한 이미지만 갤러리에 게시합니다.`;

  return `
    <footer class="info-footer" aria-label="하단 링크">
${navHtml()}
      <p class="info-meta">${sourceLine}</p>
    </footer>`;
}

function sourceNote(image) {
  const sourceName = String(image.sourceName || "");

  if (sourceName.includes("AI 생성")) {
    return "이 이미지는 사용자가 AI 생성물임을 밝히고 게시를 요청해 운영자 검토를 거친 자료입니다.";
  }

  if (sourceName.startsWith("사용자 제공")) {
    return "이 사진은 사용자가 게시를 요청해 운영자가 저작권·초상권과 제목 연습 적합성을 확인한 뒤 공개한 이미지입니다.";
  }

  return "이 이미지는 운영자가 저작권·초상권과 제목 연습 적합성을 확인한 뒤 공개한 자료입니다.";
}

function assetUrl(value) {
  if (!value) {
    return "";
  }

  if (/^https?:\/\//.test(value)) {
    return value;
  }

  return `/${String(value).replace(/^\/+/, "")}`;
}

function encodedAssetUrl(value) {
  return encodeURI(assetUrl(value));
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function htmlResponse(html, status = 200) {
  return new Response(html, {
    status,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "public, max-age=0, s-maxage=300",
    },
  });
}
