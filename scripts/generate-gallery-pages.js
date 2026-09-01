const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const siteUrl = "https://jemokhakwon.com";
const mainJsPath = path.join(root, "main.js");
const galleryRoot = path.join(root, "gallery");
const galleryCopyDir = path.join(root, "content", "gallery-copy");

const staticBlogUrls = Object.freeze([
  "/blog/funny-photo-titles/",
  "/blog/everyday-photo-titles/",
  "/blog/landscape-photo-titles/",
  "/blog/food-photo-titles/",
  "/blog/title-length-guide/",
  "/blog/title-mistakes/",
  "/blog/popular-title-patterns/",
  "/blog/meme-title-lessons/",
  "/blog/observation-training/",
]);

function loadGalleryCopyMap() {
  const map = new Map();
  if (!fs.existsSync(galleryCopyDir)) {
    return map;
  }

  const files = fs.readdirSync(galleryCopyDir).filter((name) => name.endsWith(".json"));
  for (const file of files) {
    const entries = JSON.parse(fs.readFileSync(path.join(galleryCopyDir, file), "utf8"));
    for (const entry of entries) {
      map.set(entry.id, entry);
    }
  }

  return map;
}

const slugOverrides = Object.freeze({
  "photo-001": "cat-smoke",
});

const photoSourcePresets = Object.freeze({
  curated: Object.freeze({
    sourceName: "제목 학원 운영자 검토 갤러리",
    sourceUrl: "https://jemokhakwon.com/about",
    author: "제목 학원",
    license: "사이트 내 제목 연습용으로 검토된 이미지",
    attributionRequired: false,
    commercialUseAllowed: false,
    modificationAllowed: false,
  }),
});

function extractArrayLiteral(source, marker) {
  const markerIndex = source.indexOf(marker);
  if (markerIndex === -1) {
    throw new Error(`Marker not found: ${marker}`);
  }

  const start = source.indexOf("[", markerIndex);
  if (start === -1) {
    throw new Error("Array start not found");
  }

  let depth = 0;
  let quote = "";
  let escaped = false;
  let lineComment = false;
  let blockComment = false;

  for (let index = start; index < source.length; index += 1) {
    const char = source[index];
    const next = source[index + 1];

    if (lineComment) {
      if (char === "\n") {
        lineComment = false;
      }
      continue;
    }

    if (blockComment) {
      if (char === "*" && next === "/") {
        blockComment = false;
        index += 1;
      }
      continue;
    }

    if (quote) {
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === quote) {
        quote = "";
      }
      continue;
    }

    if (char === "/" && next === "/") {
      lineComment = true;
      index += 1;
      continue;
    }

    if (char === "/" && next === "*") {
      blockComment = true;
      index += 1;
      continue;
    }

    if (char === "\"" || char === "'" || char === "`") {
      quote = char;
      continue;
    }

    if (char === "[") {
      depth += 1;
    } else if (char === "]") {
      depth -= 1;
      if (depth === 0) {
        return source.slice(start, index + 1);
      }
    }
  }

  throw new Error("Array end not found");
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;");
}

function normalizeSlug(value, fallback) {
  const slug = String(value || fallback)
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return slug || fallback;
}

function getSlug(image, index, usedSlugs) {
  const fallback = `photo-${String(index + 1).padStart(3, "0")}`;
  const base = normalizeSlug(slugOverrides[image.id] || image.slug || image.id, fallback);
  let slug = base;
  let suffix = 2;

  while (usedSlugs.has(slug)) {
    slug = `${base}-${suffix}`;
    suffix += 1;
  }

  usedSlugs.add(slug);
  return slug;
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

function footerHtml() {
  return `
    <footer class="info-footer" aria-label="하단 링크">
${navHtml()}
      <p class="info-meta">제목 학원은 공개 권한과 제목 연습 적합성을 검토한 이미지만 갤러리에 게시합니다.</p>
    </footer>`;
}

function galleryIndexHtml(images) {
  const animalTerms = ["고양이", "강아지", "악어", "비둘기", "알파카", "금붕어", "개구리", "두 집게"];
  const personTerms = ["남자", "여자", "남성", "여성", "사람", "아기", "인물", "청년"];
  const groups = [
    { id: "animals", title: "동물이 등장하는 사진", images: [], newestIndex: Infinity },
    { id: "people", title: "사람이 중심인 사진", images: [], newestIndex: Infinity },
    { id: "scenes", title: "사물과 상상 장면", images: [], newestIndex: Infinity },
  ];

  images.forEach((image, index) => {
    const searchable = `${image.title} ${image.alt}`;
    const group = animalTerms.some((term) => searchable.includes(term))
      ? groups[0]
      : personTerms.some((term) => searchable.includes(term))
        ? groups[1]
        : groups[2];
    group.images.push(image);
    group.newestIndex = Math.min(group.newestIndex, index);
  });

  const cardHtml = (image) => {
    const imagePath = encodedAssetUrl(image.webpSrc || image.src);
    return `      <article class="info-card gallery-index-card">
        <a href="/gallery/${escapeHtml(image.slug)}/" aria-label="${escapeHtml(image.title)} 해설 보기">
          <img src="${escapeHtml(imagePath)}" alt="${escapeHtml(image.alt)}" loading="lazy" decoding="async" />
          <strong>${escapeHtml(image.title)}</strong>
        </a>
        <p>${escapeHtml(image.description)}</p>
      </article>`;
  };

  const groupedCards = groups
    .sort((left, right) => left.newestIndex - right.newestIndex)
    .filter((group) => group.images.length > 0)
    .map((group) => `    <section aria-labelledby="gallery-${group.id}">
      <h2 id="gallery-${group.id}">${group.title} <span class="info-meta">${group.images.length}장</span></h2>
      <div class="gallery-index-grid">
${group.images.map(cardHtml).join("\n")}
      </div>
    </section>`)
    .join("\n");

  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="google-adsense-account" content="ca-pub-2571483149742375" />
  <link rel="icon" type="image/png" href="/Logo-image.png">
  <link rel="apple-touch-icon" href="/Logo-image.png">
  <meta name="description" content="제목 학원 사진 해설 모음입니다. 사진별 관찰 포인트, 예시 제목, 제목 짓는 방향을 확인할 수 있습니다." />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="${siteUrl}/gallery/" />
  <meta property="og:type" content="website" />
  <meta property="og:locale" content="ko_KR" />
  <meta property="og:site_name" content="제목 학원" />
  <meta property="og:title" content="사진별 제목 해설 모음 - 제목 학원" />
  <meta property="og:description" content="사진별 관찰 포인트와 예시 제목을 모았습니다." />
  <meta property="og:url" content="${siteUrl}/gallery/" />
  <meta property="og:image" content="${siteUrl}/assets/gallery/logo.png" />
  <meta property="og:image:alt" content="제목 학원 로고" />
  <title>사진별 제목 해설 모음 - 제목 학원</title>
  <link href="/style.css?v=17" rel="stylesheet" />
</head>
<body class="info-page">
  <main class="info-shell">
${headerHtml()}

    <section class="info-hero">
      <p class="info-kicker">사진 해설</p>
      <h1>사진별 제목 해설 모음</h1>
      <p>
        각 사진에서 먼저 볼 단서, 제목으로 바꾸기 좋은 감정, 예시 제목을 정리했습니다.
        사진을 고르기 전에 해설을 읽으면 더 선명한 제목을 만들 수 있습니다.
      </p>
      <p class="info-meta">현재 ${images.length}장의 운영자 검토 사진을 제공합니다. 이미지별 제공 방식과 검토 안내는 각 해설 페이지에서 확인할 수 있습니다.</p>
    </section>

    <section class="info-card info-card-wide" aria-labelledby="gallery-how-to">
      <h2 id="gallery-how-to">사진 고르는 법</h2>
      <p>동물의 표정과 행동을 대사처럼 바꾸고 싶다면 동물 사진을, 자세와 표정에서 감정을 찾고 싶다면 사람 사진을 골라보세요. 사물과 상상 장면은 서로 어울리지 않는 요소의 대비를 제목으로 옮기는 연습에 좋습니다.</p>
      <p class="info-meta">아래 분류는 사진 제목과 대체텍스트에 나타난 중심 소재를 기준으로 나눴습니다. 모든 사진 카드를 눌러 해설을 읽거나 메인에서 직접 제목을 달 수 있습니다.</p>
    </section>

${groupedCards}

${footerHtml()}
  </main>
</body>
</html>
`;
}

function sitemapXml(images) {
  const staticUrls = [
    ["/", "weekly", "1.0"],
    ["/about/", "monthly", "0.8"],
    ["/guide/", "monthly", "0.8"],
    ["/examples/", "monthly", "0.8"],
    ["/gallery/", "weekly", "0.8"],
    ["/blog/", "weekly", "0.8"],
    ["/blog/photo-title-tips/", "monthly", "0.8"],
    ["/blog/animal-photo-titles/", "monthly", "0.8"],
    ["/blog/emotion-photo-titles/", "monthly", "0.8"],
    ...staticBlogUrls.map((loc) => [loc, "monthly", "0.8"]),
    ["/contact/", "monthly", "0.7"],
    ["/privacy/", "monthly", "0.7"],
    ["/terms/", "monthly", "0.7"],
  ];

  const galleryUpdatedAt = images
    .map((image) => image.updatedAt || image.publishedAt || "")
    .sort()
    .at(-1);
  const staticEntries = staticUrls.map(([loc, changefreq, priority]) => `  <url>
    <loc>${siteUrl}${loc}</loc>
${loc === "/gallery/" && galleryUpdatedAt ? `    <lastmod>${galleryUpdatedAt}</lastmod>\n` : ""}    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`);

  const galleryEntries = images
    .filter((image) => galleryCopyMap.has(image.id))
    .map((image) => {
      const lastmod = image.updatedAt || image.publishedAt || "";
      return `  <url>
    <loc>${siteUrl}/gallery/${image.slug}/</loc>
${lastmod ? `    <lastmod>${lastmod}</lastmod>\n` : ""}    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`;
    });

  const entries = [...staticEntries, ...galleryEntries].join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>
`;
}

const galleryCopyMap = loadGalleryCopyMap();

const mainJs = fs.readFileSync(mainJsPath, "utf8");
const arrayLiteral = extractArrayLiteral(mainJs, "const defaultGalleryImages =");
const images = Function("photoSourcePresets", `return ${arrayLiteral};`)(photoSourcePresets);
const usedSlugs = new Set();
const normalizedImages = images.map((image, index) => ({
  ...image,
  slug: getSlug(image, index, usedSlugs),
}));
const newestImages = normalizedImages.slice().reverse();

fs.mkdirSync(galleryRoot, { recursive: true });

// 상세 페이지는 정적 HTML이 아니라 functions/gallery/[slug].js가 서버렌더한다.
// (해설 + 실제 사용자 제목 랭킹을 한 페이지에 합치기 위해 2026-09-01에 전환)
// 예전 생성물이 남아 있으면 Pages가 Function 대신 정적 파일을 서빙할 수 있어 지운다.
removeStaleDetailPages();

// Pages Function은 런타임에 파일을 못 읽으므로 해설 원고를 ESM 모듈로 내보낸다.
writeGalleryCopyModule();

fs.writeFileSync(path.join(galleryRoot, "index.html"), galleryIndexHtml(newestImages), "utf8");
fs.writeFileSync(path.join(root, "sitemap.xml"), sitemapXml(normalizedImages), "utf8");

console.log(
  `Wrote gallery-copy module (${galleryCopyMap.size}편), gallery/index.html, sitemap.xml — ` +
  `상세 ${normalizedImages.length}장은 functions/gallery/[slug].js가 렌더`
);

function removeStaleDetailPages() {
  for (const entry of fs.readdirSync(galleryRoot, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      fs.rmSync(path.join(galleryRoot, entry.name), { recursive: true, force: true });
    }
  }
}

function writeGalleryCopyModule() {
  const entries = normalizedImages
    .filter((image) => galleryCopyMap.has(image.id))
    .map((image) => {
      const copy = galleryCopyMap.get(image.id);
      return `  ${JSON.stringify(image.id)}: ${JSON.stringify({
        scene: copy.scene,
        analysis: copy.analysis,
        composeTip: copy.composeTip,
        extra: copy.extra,
      }, null, 4).split("\n").join("\n  ")},`;
    })
    .join("\n");

  const source = `// 생성 파일 — 직접 고치지 말 것.
// 원본: content/gallery-copy/*.json → \`node scripts/generate-gallery-pages.js\` 로 재생성.
// functions/gallery/[slug].js가 런타임에 이 모듈을 읽어 해설을 렌더한다.
export const galleryCopy = {
${entries}
};
`;

  fs.writeFileSync(path.join(root, "functions/api/images/gallery-copy.js"), source, "utf8");
}
