// /gallery/<slug>/ — 사진과 실제 사용자 제목 랭킹을 한 페이지에 렌더한다.
// 이전에는 해설(정적 gallery/<slug>/index.html)과 랭킹(/titles/<key>/)이 같은 사진에 대해
// 별도 URL로 쪼개져 있어 중복·저품질 페이지 쌍을 만들었다. 두 페이지를 여기로 합쳤고,
// /titles/<key>/ 는 이 URL로 301한다.
import { getDb } from "../api/auth/_shared.js";
import { galleryImages } from "../api/images/gallery-data.js";
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
  const slug = gallerySlug(image);
  const imageKey = String(image.imageKey);
  const canonicalUrl = `${SITE_ORIGIN}/gallery/${slug}/`;
  const encodedImagePath = encodedAssetUrl(image.src);
  const imageFullUrl = `${SITE_ORIGIN}${encodedImagePath}`;
  const webpPath = image.webpSrc ? encodedAssetUrl(image.webpSrc) : "";
  const titleCount = titles.length;

  let pageTitle = `${image.title}에 제목 붙이기 | 제목 학원`;
  let description = `${image.title} 사진을 보고 제목을 붙이고, 다른 이용자들이 남긴 제목을 둘러보세요.`;
  let robots = "index, follow";
  let ogUrl = canonicalUrl;

  if (sharedSubmission) {
    pageTitle = `"${sharedSubmission.title}" — ${sharedSubmission.author}의 제목 | 제목 학원`;
    description = `${image.title} 사진에 ${sharedSubmission.author}님이 남긴 제목입니다.`;
    robots = "noindex, follow";
    ogUrl = `${canonicalUrl}?t=${sharedSubmission.id}`;
  }

  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
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
  <link href="/style.css?v=46" rel="stylesheet" />
${articleJsonLd(image, canonicalUrl, imageFullUrl, titleCount, description)}
</head>
<body class="info-page">
  <main class="info-shell">
${headerHtml()}

    <section class="info-hero">
      <p class="info-kicker">사진 모음</p>
      <h1>${escapeHtml(image.title)}</h1>
    </section>

${sharedSubmission ? renderSharedSubmissionBlock(sharedSubmission) : ""}
    <section class="info-grid">
      <article class="info-card info-card-wide">
        <picture>
${webpPath ? `          <source srcset="${escapeHtml(webpPath)}" type="image/webp" />\n` : ""}          <img src="${escapeHtml(encodedImagePath)}"
               alt="${escapeHtml(image.alt || image.title)}"
               loading="eager" fetchpriority="high" decoding="async"
               style="width:100%;height:auto;border-radius:12px;display:block;" />
        </picture>
      </article>
    </section>

    <section class="info-cta">
      <h2>떠오르는 제목이 있나요?</h2>
      <a class="info-primary-button" href="/#title/key/${encodeURIComponent(imageKey)}">제목 쓰기</a>
    </section>

    <section class="info-grid">
      <article class="info-card info-card-wide">
        <h2>사람들이 붙인 제목 ${titleCount}개</h2>
${renderRankingList(titles, loadError)}
      </article>
${renderPhotoHints(image)}
    </section>

${footerHtml(image)}
  </main>
</body>
</html>
`;
}

function renderPhotoHints(image) {
  const prompt = String(image.prompt || "").trim();
  const observationPoints = Array.isArray(image.observationPoints)
    ? image.observationPoints.filter((item) => String(item || "").trim())
    : [];
  const exampleTitles = Array.isArray(image.exampleTitles)
    ? image.exampleTitles.filter((item) => String(item || "").trim())
    : [];

  if (!prompt && observationPoints.length === 0 && exampleTitles.length === 0) {
    return "";
  }

  const promptHtml = prompt ? `        <p>${escapeHtml(prompt)}</p>\n` : "";
  const observationsHtml = observationPoints.length
    ? `        <div class="image-brief-group">
          <strong>눈여겨볼 것</strong>
          <ul class="info-link-list">
${observationPoints.map((item) => `            <li>${escapeHtml(item)}</li>`).join("\n")}
          </ul>
        </div>
`
    : "";
  const examplesHtml = exampleTitles.length
    ? `        <div class="image-brief-group">
          <strong>운영자 예시</strong>
          <ul class="info-link-list">
${exampleTitles.map((title) => `            <li>${escapeHtml(title)}</li>`).join("\n")}
          </ul>
        </div>
`
    : "";

  return `      <details class="info-card info-card-wide photo-hints">
        <summary>힌트 보기</summary>
${promptHtml}${observationsHtml}${examplesHtml}      </details>
`;
}

function renderRankingList(titles, loadError) {
  if (loadError) {
    return `        <p>제목 목록을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.</p>`;
  }

  if (!titles.length) {
    return `        <p>아직 제목이 없어요. 첫 제목을 남겨주세요.</p>`;
  }

  const totalHearts = titles.reduce((sum, entry) => sum + entry.likeCount, 0);
  const totalComments = titles.reduce((sum, entry) => sum + entry.commentCount, 0);
  const authors = new Set(titles.map((entry) => entry.author)).size;

  const summary = `${authors}명이 제목 ${titles.length}개를 남겼습니다. 하트 ${totalHearts}개 · 댓글 ${totalComments}개`;

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

function articleJsonLd(image, canonicalUrl, imageFullUrl, titleCount, description) {
  const dates = image.publishedAt
    ? `    "datePublished": ${JSON.stringify(image.publishedAt)},\n    "dateModified": ${JSON.stringify(image.updatedAt || image.publishedAt)},\n`
    : "";

  return `  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": ${JSON.stringify(image.title)},
    "description": ${JSON.stringify(description || image.description || image.title)},
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
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
  <link rel="icon" type="image/png" href="/Logo-image.png">
  <meta name="description" content="요청하신 사진을 찾을 수 없습니다." />
  <meta name="robots" content="noindex, follow" />
  <title>사진을 찾을 수 없습니다 | 제목 학원</title>
  <link href="/style.css?v=46" rel="stylesheet" />
</head>
<body class="info-page">
  <main class="info-shell">
${headerHtml()}

    <section class="info-hero">
      <p class="info-kicker">사진 모음</p>
      <h1>사진을 찾을 수 없습니다</h1>
      <p>주소가 바뀌었거나 사진이 내려갔을 수 있습니다. <a href="/gallery/">사진 모음</a>에서 다른 사진을 찾아보세요.</p>
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
        <a href="/gallery/" aria-current="page">사진 모음</a>
        <a href="/blog/">제목 칼럼</a>
        <a href="/examples/">제목 예시</a>
        <a href="/guide/">사용 가이드</a>
        <a href="/about/">소개</a>
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
    if (sourceName.startsWith("사용자 제공")) {
      return "이 이미지는 사용자가 AI 생성물임을 밝히고 게시를 요청해 운영자 검토를 거친 자료입니다.";
    }

    return "이 이미지는 제목 학원이 AI로 생성하고 제목 연습용으로 검토한 자료입니다.";
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
    // 제어문자(특히 NUL)가 섞인 옛 사용자 제목이 있다. 그대로 내보내면 HTML이
    // invalid가 되어 크롤러 파싱이 깨지므로 렌더 시점에 제거한다(탭·개행은 유지).
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
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
