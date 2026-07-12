const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const siteUrl = "https://jemokhakwon.com";
const mainJsPath = path.join(root, "main.js");
const galleryRoot = path.join(root, "gallery");

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

function listItems(items) {
  return items.map((item) => `          <li>${escapeHtml(item)}</li>`).join("\n");
}

// 받침 유무로 조사를 고른다(을/를, 이/가, 은/는, 으로/로).
function hasBatchim(word) {
  const text = String(word ?? "").trim();
  if (!text) return false;
  const code = text.charCodeAt(text.length - 1);
  if (code < 0xac00 || code > 0xd7a3) return false;
  return (code - 0xac00) % 28 !== 0;
}

function josa(word, withBatchim, withoutBatchim) {
  return hasBatchim(word) ? withBatchim : withoutBatchim;
}

// 으로/로는 받침 규칙이 다르다: 받침이 없거나 ㄹ받침이면 "로", 그 외엔 "으로".
function ro(word) {
  const text = String(word ?? "").trim();
  if (!text) return "로";
  const code = text.charCodeAt(text.length - 1);
  if (code < 0xac00 || code > 0xd7a3) return "로";
  const jong = (code - 0xac00) % 28;
  return (jong === 0 || jong === 8) ? "로" : "으로";
}

function pick(pool, seed) {
  return pool[((seed % pool.length) + pool.length) % pool.length];
}

// 페이지마다 연결 문장이 똑같이 반복되면 검색엔진이 양산형(저가치) 콘텐츠로 볼 수 있어,
// 이미지 인덱스를 시드로 어휘를 결정론적으로 분산시킨다(재생성 시 diff가 안정적).
const analysisPhrases = [
  (p) => `${p}${josa(p, "을", "를")} 실마리 삼아 장면의 감정을 한 문장으로 좁힌 제목입니다.`,
  (p) => `${p}에서 출발해 사진의 분위기를 짧게 붙잡은 표현입니다.`,
  (p) => `${p}에 초점을 두고 군더더기를 덜어낸 제목 방향입니다.`,
  (p) => `${p}${josa(p, "이", "가")} 주는 인상을 한 호흡에 눌러 담은 예시입니다.`,
  (p) => `${p}${josa(p, "을", "를")} 앞세워 보는 사람의 시선을 한곳으로 모은 제목입니다.`,
  (p) => `${p}${josa(p, "은", "는")} 그대로 두고 해석의 여지를 남긴 표현입니다.`,
  (p) => `${p}에 담긴 기운을 단정하지 않고 가볍게 건드린 제목입니다.`,
  (p) => `${p}${ro(p)} 시선을 끌고 나머지는 사진에 맡긴 예시입니다.`,
];

const pointIntroTemplates = [
  (first, rest) => `첫 단서는 ${first}입니다.${rest ? ` 이어서 ${rest}까지 천천히 따라가 보세요.` : ""}`,
  (first, rest) => `가장 먼저 눈에 들어오는 건 ${first}입니다.${rest ? ` 그다음 ${rest} 순으로 시선을 옮겨보세요.` : ""}`,
  (first, rest) => `시선을 먼저 둘 곳은 ${first}입니다.${rest ? ` 이어 ${rest}까지 확인하면 단서가 모입니다.` : ""}`,
  (first, rest) => `${first}부터 눈여겨보세요.${rest ? ` ${rest}도 함께 살피면 장면이 더 또렷해집니다.` : ""}`,
  (first, rest) => `${first}에서 시작하면 좋습니다.${rest ? ` ${rest}까지 읽고 나면 제목의 방향이 잡힙니다.` : ""}`,
];

const observationIntros = [
  "제목을 짓기 전에 사진 안의 단서를 세 가지로 나누어 보면 문장이 더 선명해집니다.",
  "아래 세 단서를 따로 떼어 보면 어디서부터 제목을 시작할지 정하기 쉽습니다.",
  "사진을 한눈에 보지 말고 다음 세 단서로 끊어 읽으면 표현이 또렷해집니다.",
  "제목이 막막할 때는 이 세 가지 포인트를 하나씩 짚으며 단서를 모아보세요.",
];

const composeCards = [
  {
    a: "처음에는 사진을 길게 설명해도 됩니다. 그다음 불필요한 수식어를 줄이고, 가장 강한 단서 하나와 감정 하나만 남겨보세요.",
    b: "인물이나 상황을 사실처럼 단정하기보다 화면에 보이는 표정, 자세, 배경, 거리감에서 출발하는 제목이 안전하고 오래 읽힙니다.",
  },
  {
    a: "떠오르는 문장을 먼저 그대로 적은 뒤 한 단어씩 지워보세요. 지워도 장면이 살아 있다면 그 단어는 없어도 됩니다.",
    b: "보이지 않는 사연을 지어내기보다 사진에 실제로 있는 단서에서 감정을 끌어오면 보는 사람도 제목과 사진을 쉽게 연결합니다.",
  },
  {
    a: "긴 설명에서 시작해 핵심 명사와 동사만 남겨보세요. 짧아질수록 제목은 또렷해지고 기억에 오래 남습니다.",
    b: "단정 대신 여지를 남기는 편이 좋습니다. 표정이나 상황을 못 박지 않으면 사람마다 다른 해석이 댓글로 이어집니다.",
  },
  {
    a: "감정을 한 단어로 먼저 정하면 문장의 온도가 따라옵니다. 웃김, 조용함, 긴장처럼 방향부터 잡아보세요.",
    b: "반전이 있는 사진이라면 가장 재미있는 말을 문장 끝으로 미뤄두세요. 마지막 단어 하나가 제목의 인상을 좌우합니다.",
  },
];

function analysisItems(image, pageIndex) {
  const points = image.observationPoints || [];
  return (image.exampleTitles || []).map((title, i) => {
    const point = points[i % Math.max(points.length, 1)] || image.title;
    const phrase = pick(analysisPhrases, pageIndex * 3 + i)(point);
    return `          <li><strong>${escapeHtml(title)}</strong> - ${escapeHtml(phrase)}</li>`;
  }).join("\n");
}

function detailHtml(image, index) {
  const canonical = `${siteUrl}/gallery/${image.slug}/`;
  const imagePath = assetUrl(image.src);
  const encodedImagePath = encodedAssetUrl(image.src);
  const webpPath = image.webpSrc ? encodedAssetUrl(image.webpSrc) : "";
  const imageFullUrl = `${siteUrl}${encodedImagePath}`;
  const title = `${image.title} - 사진 해설 | 제목 학원`;
  const isUserProvided = image.sourceName === "사용자 제공 이미지";
  const sourceSummary = isUserProvided
    ? "이 사진은 사이트 게시를 위해 사용자가 직접 제공한 이미지입니다."
    : "제목 학원에서 사용하는 이미지는 저작권이 없는 사진과 AI로 생성한 이미지입니다.";
  const sourceReview = isUserProvided
    ? "운영자는 제목 연습 적합성과 제공자가 전달한 권리·초상권 정보를 검토한 뒤 공개했습니다."
    : `이 이미지는 ${image.sourceName || "제목 학원 운영자 검토 갤러리"}에 포함된 자료입니다. 운영자는 제목 연습에 맞는지, 저작권과 초상권 문제가 없는지 확인한 뒤 공개합니다.`;
  const firstPoint = image.observationPoints?.[0];
  const restPoints = image.observationPoints?.slice(1).join(", ");
  const pointText = firstPoint
    ? pick(pointIntroTemplates, index)(firstPoint, restPoints || "")
    : "사진에서 가장 먼저 눈에 들어오는 대상과 배경의 관계를 확인해보세요.";
  const observationIntro = pick(observationIntros, index);
  const composeCard = pick(composeCards, index);

  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="google-adsense-account" content="ca-pub-2571483149742375" />
  <link rel="icon" type="image/png" href="/Logo-image.png">
  <link rel="apple-touch-icon" href="/Logo-image.png">
  <meta name="description" content="${escapeHtml(image.description)}" />
  <meta name="robots" content="noindex, follow" />
  <link rel="canonical" href="${canonical}" />
  <meta property="og:type" content="article" />
  <meta property="og:locale" content="ko_KR" />
  <meta property="og:site_name" content="제목 학원" />
  <meta property="og:title" content="${escapeHtml(title)}" />
  <meta property="og:description" content="${escapeHtml(image.description)}" />
  <meta property="og:url" content="${canonical}" />
  <meta property="og:image" content="${imageFullUrl}" />
  <meta property="og:image:alt" content="${escapeHtml(image.alt)}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(title)}" />
  <meta name="twitter:description" content="${escapeHtml(image.description)}" />
  <meta name="twitter:image" content="${imageFullUrl}" />
  <title>${escapeHtml(title)}</title>
  <link href="/style.css?v=2" rel="stylesheet" />
  <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": ${JSON.stringify(image.title)},
      "description": ${JSON.stringify(image.description)},
      "inLanguage": "ko-KR",
      "mainEntityOfPage": "${canonical}",
      "image": "${imageFullUrl}",
      "author": { "@type": "Organization", "name": "제목 학원" },
      "publisher": {
        "@type": "Organization",
        "name": "제목 학원",
        "url": "${siteUrl}/"
      }
    }
  </script>
</head>
<body class="info-page">
  <main class="info-shell">
${headerHtml()}

    <section class="info-hero">
      <p class="info-kicker">사진 해설</p>
      <h1>${escapeHtml(image.title)}</h1>
      <p>${escapeHtml(image.description)}</p>
    </section>

    <section class="info-grid">
      <article class="info-card info-card-wide">
        <picture>
${webpPath ? `          <source srcset="${escapeHtml(webpPath)}" type="image/webp" />\n` : ""}          <img src="${escapeHtml(encodedImagePath)}"
               alt="${escapeHtml(image.alt)}"
               loading="lazy" decoding="async"
               style="width:100%;height:auto;border-radius:12px;display:block;" />
        </picture>
      </article>

      <article class="info-card">
        <h2>이 사진의 핵심 장면</h2>
        <p>${escapeHtml(image.prompt || image.description)}</p>
        <p>${escapeHtml(pointText)}</p>
      </article>

      <article class="info-card">
        <h2>관찰 포인트</h2>
        <p>${escapeHtml(observationIntro)}</p>
        <ul class="info-link-list">
${listItems(image.observationPoints || [])}
        </ul>
      </article>

      <article class="info-card">
        <h2>예시 제목과 해석</h2>
        <p>아래 제목은 정답이 아니라 표현 방향을 보여주는 참고용입니다.</p>
        <ul class="info-link-list">
${analysisItems(image, index)}
        </ul>
      </article>

      <article class="info-card">
        <h2>직접 제목을 만들 때</h2>
        <p>${escapeHtml(composeCard.a)}</p>
        <p>${escapeHtml(composeCard.b)}</p>
      </article>

      <article class="info-card info-card-wide">
        <h2>이미지 출처와 검토</h2>
        <p>${escapeHtml(sourceSummary)}</p>
        <p>${escapeHtml(sourceReview)}</p>
        <p>권리 침해가 의심되거나 부적절한 내용이 보이면 <a href="/contact/">문의 페이지</a> 또는 사진 신고 기능으로 알려주세요. 검토 중인 이미지는 숨김 처리될 수 있습니다.</p>
      </article>
    </section>

    <section class="info-cta">
      <p class="info-kicker">참여하기</p>
      <h2>이 사진에 어울리는 제목을 직접 만들어보세요</h2>
      <p>메인에서 사진을 선택하면 제목을 제출하고 다른 사용자의 제목과 반응을 확인할 수 있습니다.</p>
      <a class="info-primary-button" href="/#title/${index}">제목 달아보기</a>
    </section>

${footerHtml()}
  </main>
</body>
</html>
`;
}

function galleryIndexHtml(images) {
  const animalTerms = ["고양이", "강아지", "악어", "비둘기", "알파카", "금붕어", "개구리", "두 집게"];
  const personTerms = ["남자", "여자", "남성", "여성", "사람", "아기", "인물", "청년"];
  const groups = [
    { id: "animals", title: "동물이 등장하는 사진", images: [] },
    { id: "people", title: "사람이 중심인 사진", images: [] },
    { id: "scenes", title: "사물과 상상 장면", images: [] },
  ];

  for (const image of images) {
    const searchable = `${image.title} ${image.alt}`;
    const group = animalTerms.some((term) => searchable.includes(term))
      ? groups[0]
      : personTerms.some((term) => searchable.includes(term))
        ? groups[1]
        : groups[2];
    group.images.push(image);
  }

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
  <link href="/style.css?v=2" rel="stylesheet" />
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

function sitemapXml() {
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
    ["/contact/", "monthly", "0.7"],
    ["/privacy/", "monthly", "0.7"],
    ["/terms/", "monthly", "0.7"],
  ];

  const entries = staticUrls.map(([loc, changefreq, priority]) => `  <url>
    <loc>${siteUrl}${loc}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>
`;
}

const mainJs = fs.readFileSync(mainJsPath, "utf8");
const arrayLiteral = extractArrayLiteral(mainJs, "const defaultGalleryImages =");
const images = Function("photoSourcePresets", `return ${arrayLiteral};`)(photoSourcePresets);
const usedSlugs = new Set();
const normalizedImages = images.map((image, index) => ({
  ...image,
  slug: getSlug(image, index, usedSlugs),
}));

fs.mkdirSync(galleryRoot, { recursive: true });
for (const image of normalizedImages) {
  const directory = path.join(galleryRoot, image.slug);
  fs.mkdirSync(directory, { recursive: true });
  fs.writeFileSync(path.join(directory, "index.html"), detailHtml(image, normalizedImages.indexOf(image)), "utf8");
}

fs.writeFileSync(path.join(galleryRoot, "index.html"), galleryIndexHtml(normalizedImages), "utf8");
fs.writeFileSync(path.join(root, "sitemap.xml"), sitemapXml(), "utf8");

console.log(`Generated ${normalizedImages.length} gallery detail pages and sitemap.xml`);
