import { getDb } from "../api/auth/_shared.js";
import { galleryImages } from "../api/images/gallery-data.js";
import { formatAuthorName } from "../api/submissions/_guest-identity.js";

const SITE_ORIGIN = "https://jemokhakwon.com";
const ADSENSE_ACCOUNT = "ca-pub-2571483149742375";
const MIN_INDEXABLE_TITLE_COUNT = 3;
const RANKING_LIMIT = 50;

export async function onRequestGet(context) {
  const imageKey = typeof context.params.key === "string" ? context.params.key.trim() : "";
  const photo = imageKey ? galleryImages.find((image) => image.imageKey === imageKey) : null;

  if (!photo) {
    return htmlResponse(renderNotFoundPage(), 404);
  }

  const requestUrl = new URL(context.request.url);
  const sharedSubmissionId = parsePositiveInt(requestUrl.searchParams.get("t"));

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
    console.error("titles/[key] error", error);
    loadError = true;
  }

  return htmlResponse(renderTitlesPage(photo, imageKey, titles, loadError, sharedSubmission), 200);
}

function parsePositiveInt(value) {
  if (typeof value !== "string" || !/^[1-9]\d*$/.test(value)) {
    return null;
  }

  return Number(value);
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

function renderTitlesPage(photo, imageKey, titles, loadError, sharedSubmission) {
  const titleCount = titles.length;
  const canonicalUrl = `${SITE_ORIGIN}/titles/${encodeURIComponent(imageKey)}/`;
  const imageUrl = toAbsoluteUrl(photo.src);
  const submitUrl = `/#title/key/${encodeURIComponent(imageKey)}`;

  let pageTitle = `${escapeHtml(photo.title)}에 달린 제목 랭킹 | 제목 학원`;
  let description = `${photo.description} 지금까지 ${titleCount}개의 제목이 달렸습니다.`;
  let robots = titleCount >= MIN_INDEXABLE_TITLE_COUNT ? "index, follow" : "noindex, follow";
  let ogUrl = canonicalUrl;

  if (sharedSubmission) {
    pageTitle = `"${escapeHtml(sharedSubmission.title)}" — ${escapeHtml(sharedSubmission.author)}의 제목 | 제목 학원`;
    description = `${photo.title} 사진에 달린 제목입니다. 이보다 웃긴 제목을 지을 수 있다면 도전해보세요!`;
    robots = "noindex, follow";
    ogUrl = `${canonicalUrl}?t=${sharedSubmission.id}`;
  }

  const escapedDescription = escapeHtml(description);
  const sharedSubmissionBlock = sharedSubmission ? renderSharedSubmissionBlock(sharedSubmission) : "";

  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="google-adsense-account" content="${ADSENSE_ACCOUNT}" />
  <link rel="icon" type="image/png" href="/Logo-image.png">
  <link rel="apple-touch-icon" href="/Logo-image.png">
  <meta name="description" content="${escapedDescription}" />
  <meta name="robots" content="${robots}" />
  <link rel="canonical" href="${canonicalUrl}" />
  <meta property="og:type" content="article" />
  <meta property="og:locale" content="ko_KR" />
  <meta property="og:site_name" content="제목 학원" />
  <meta property="og:title" content="${pageTitle}" />
  <meta property="og:description" content="${escapedDescription}" />
  <meta property="og:url" content="${ogUrl}" />
  <meta property="og:image" content="${imageUrl}" />
  <meta property="og:image:alt" content="${escapeHtml(photo.alt || photo.title)}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${pageTitle}" />
  <meta name="twitter:description" content="${escapedDescription}" />
  <meta name="twitter:image" content="${imageUrl}" />
  <title>${pageTitle}</title>
  <link href="/style.css?v=15" rel="stylesheet" />
</head>
<body class="info-page">
  <main class="info-shell">

    <header class="info-header">
      <a class="info-brand" href="/" aria-label="제목 학원 홈">
        <picture>
          <img class="brand-logo" src="/assets/gallery/logo.png" alt="제목 학원 로고" width="56" height="56" />
        </picture>
        <span>제목 학원</span>
      </a>
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
      </nav>
    </header>

    <section class="info-hero">
      <p class="info-kicker">제목 랭킹</p>
      <h1>${escapeHtml(photo.title)}에 달린 제목 랭킹</h1>
      <p>${escapedDescription}</p>
    </section>

    ${sharedSubmissionBlock}

    <section class="info-grid">
      <article class="info-card info-card-wide">
        <picture>
          <img src="${escapeHtml(imageUrl)}"
               alt="${escapeHtml(photo.alt || photo.title)}"
               loading="lazy" decoding="async"
               style="width:100%;height:auto;border-radius:12px;display:block;" />
        </picture>
      </article>

      <article class="info-card info-card-wide">
        <h2>제목 랭킹 (하트순)</h2>
        ${renderRankingList(titles, loadError)}
      </article>
    </section>

    <section class="info-cta">
      <p class="info-kicker">참여하기</p>
      <h2>이 사진에 어울리는 제목을 직접 만들어보세요</h2>
      <p>메인에서 사진을 선택하면 제목을 제출하고 다른 사용자의 제목과 반응을 확인할 수 있습니다.</p>
      <a class="info-primary-button" href="${escapeHtml(submitUrl)}">나도 제목 달아보기</a>
    </section>


    <footer class="info-footer" aria-label="하단 링크">

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
      </nav>
      <p class="info-meta">제목 학원은 공개 권한과 제목 연습 적합성을 검토한 이미지만 갤러리에 게시합니다.</p>
    </footer>
  </main>
</body>
</html>
`;
}

function renderSharedSubmissionBlock(sharedSubmission) {
  return `<article class="info-card info-card-wide">
      <p class="info-kicker">공유된 제목</p>
      <h2>"${escapeHtml(sharedSubmission.title)}"</h2>
      <p>${escapeHtml(sharedSubmission.author)} · 하트 ${sharedSubmission.likeCount}개</p>
    </article>`;
}

function renderRankingList(titles, loadError) {
  if (loadError) {
    return `<p>제목 목록을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.</p>`;
  }

  if (!titles.length) {
    return `<p>아직 이 사진에 달린 제목이 없습니다. 첫 번째 제목의 주인공이 되어보세요.</p>`;
  }

  const items = titles
    .map((entry, index) => {
      const rank = index + 1;
      return `<li><strong>${rank}위 · ${escapeHtml(entry.title)}</strong> - ${escapeHtml(entry.author)} · 하트 ${entry.likeCount}개 · 댓글 ${entry.commentCount}개</li>`;
    })
    .join("\n          ");

  return `<ol class="info-link-list">
          ${items}
        </ol>`;
}

function renderNotFoundPage() {
  const pageTitle = "사진을 찾을 수 없습니다 | 제목 학원";

  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="google-adsense-account" content="${ADSENSE_ACCOUNT}" />
  <link rel="icon" type="image/png" href="/Logo-image.png">
  <link rel="apple-touch-icon" href="/Logo-image.png">
  <meta name="description" content="요청하신 사진을 찾을 수 없습니다." />
  <meta name="robots" content="noindex, follow" />
  <title>${pageTitle}</title>
  <link href="/style.css?v=15" rel="stylesheet" />
</head>
<body class="info-page">
  <main class="info-shell">

    <header class="info-header">
      <a class="info-brand" href="/" aria-label="제목 학원 홈">
        <picture>
          <img class="brand-logo" src="/assets/gallery/logo.png" alt="제목 학원 로고" width="56" height="56" />
        </picture>
        <span>제목 학원</span>
      </a>
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
      </nav>
    </header>

    <section class="info-hero">
      <p class="info-kicker">제목 랭킹</p>
      <h1>사진을 찾을 수 없습니다</h1>
      <p>요청하신 사진이 존재하지 않거나 더 이상 공개되어 있지 않습니다.</p>
    </section>

    <section class="info-cta">
      <p class="info-kicker">둘러보기</p>
      <h2>다른 사진에 제목을 달아보세요</h2>
      <a class="info-primary-button" href="/">메인으로 돌아가기</a>
    </section>

    <footer class="info-footer" aria-label="하단 링크">
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
      </nav>
      <p class="info-meta">제목 학원은 공개 권한과 제목 연습 적합성을 검토한 이미지만 갤러리에 게시합니다.</p>
    </footer>
  </main>
</body>
</html>
`;
}

function toAbsoluteUrl(path) {
  if (typeof path !== "string" || !path) {
    return SITE_ORIGIN;
  }

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  return `${SITE_ORIGIN}/${path.replace(/^\/+/, "")}`;
}

function escapeHtml(value) {
  return String(value == null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function htmlResponse(html, status) {
  return new Response(html, {
    status,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "public, max-age=300",
    },
  });
}
