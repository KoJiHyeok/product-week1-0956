#!/usr/bin/env node
// Deterministic repo invariant checker. Run from repo root: node scripts/validate.mjs
// Prints a ✓/✗ report per check and exits 1 if any HARD failure occurred.

import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const EXCLUDED_DIRS = new Set(["node_modules", ".wrangler", ".git"]);

let hardFailures = 0;
const results = [];

function pass(label, detail) {
  results.push({ ok: true, label, detail });
}

function fail(label, detail) {
  hardFailures += 1;
  results.push({ ok: false, label, detail });
}

function warn(label, detail) {
  results.push({ ok: null, label, detail });
}

// --- shared array-literal extraction (adapted from scripts/generate-gallery-pages.js) ---
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
      if (char === "\n") lineComment = false;
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
      if (escaped) escaped = false;
      else if (char === "\\") escaped = true;
      else if (char === quote) quote = "";
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

// main.js's defaultGalleryImages spreads ...photoSourcePresets.curated, so that name
// must be bound when evaluating the literal (mirrors generate-gallery-pages.js).
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

function loadArray(filePath, marker, needsPresets) {
  const source = readFileSync(filePath, "utf8");
  const literal = extractArrayLiteral(source, marker);
  return needsPresets
    ? new Function("photoSourcePresets", `return ${literal};`)(photoSourcePresets)
    : new Function(`return ${literal};`)();
}

// --- 1. JS syntax check ---
function walkJsFiles(dir, out) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (EXCLUDED_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkJsFiles(full, out);
    } else if (entry.isFile() && entry.name.endsWith(".js")) {
      out.push(full);
    }
  }
}

function checkSyntax() {
  const files = [];
  walkJsFiles(root, files);
  const failures = [];
  for (const file of files) {
    const result = spawnSync(process.execPath, ["--check", file], { encoding: "utf8" });
    if (result.status !== 0) {
      failures.push({ file: path.relative(root, file), error: (result.stderr || "").trim() });
    }
  }
  if (failures.length === 0) {
    pass("JS syntax", `${files.length}개 파일 검사, 오류 없음`);
  } else {
    fail("JS syntax", `${files.length}개 중 ${failures.length}개 실패:\n` +
      failures.map((f) => `  - ${f.file}: ${f.error}`).join("\n"));
  }
}

// --- 2-4: gallery list checks ---
const SHARED_FIELDS = ["imageKey", "src", "webpSrc", "title", "description", "alt", "prompt", "observationPoints", "exampleTitles"];

function deepEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function checkFieldParity(apiImages, mainImages) {
  const apiById = new Map(apiImages.map((img) => [img.id, img]));
  const mainById = new Map(mainImages.map((img) => [img.id, img]));
  const allIds = new Set([...apiById.keys(), ...mainById.keys()]);

  const mismatches = [];
  const onlyInApi = [];
  const onlyInMain = [];

  for (const id of allIds) {
    const a = apiById.get(id);
    const m = mainById.get(id);
    if (!a) {
      onlyInMain.push(id);
      continue;
    }
    if (!m) {
      onlyInApi.push(id);
      continue;
    }
    for (const field of SHARED_FIELDS) {
      if (!deepEqual(a[field], m[field])) {
        mismatches.push(`${id}.${field}: api=${JSON.stringify(a[field])} main=${JSON.stringify(m[field])}`);
      }
    }
  }

  if (mismatches.length === 0) {
    pass("Dual-list field parity", `공통 id ${allIds.size - onlyInApi.length - onlyInMain.length}개 필드 일치`);
  } else {
    fail("Dual-list field parity", mismatches.map((m) => `  - ${m}`).join("\n"));
  }

  if (onlyInApi.length > 0) {
    warn("Dual-list field parity (id 편중)", `functions/api/images/index.js에만 존재: ${onlyInApi.join(", ")}`);
  }
  if (onlyInMain.length > 0) {
    warn("Dual-list field parity (id 편중)", `main.js에만 존재: ${onlyInMain.join(", ")}`);
  }
}

function checkImageKeyIntegrity(apiImages) {
  const missing = [];
  const nonInteger = [];
  const seen = new Map();
  const duplicates = new Set();
  let max = -Infinity;

  for (const img of apiImages) {
    if (img.imageKey === undefined || img.imageKey === null || img.imageKey === "") {
      missing.push(img.id);
      continue;
    }
    const parsed = Number(img.imageKey);
    if (!Number.isInteger(parsed)) {
      nonInteger.push(`${img.id}=${JSON.stringify(img.imageKey)}`);
      continue;
    }
    if (seen.has(parsed)) {
      duplicates.add(parsed);
    }
    seen.set(parsed, img.id);
    if (parsed > max) max = parsed;
  }

  const problems = [];
  if (missing.length > 0) problems.push(`imageKey 누락: ${missing.join(", ")}`);
  if (nonInteger.length > 0) problems.push(`정수로 파싱 불가: ${nonInteger.join(", ")}`);
  if (duplicates.size > 0) {
    for (const key of duplicates) {
      const ids = apiImages.filter((img) => Number(img.imageKey) === key).map((img) => img.id);
      problems.push(`imageKey ${key} 중복: ${ids.join(", ")}`);
    }
  }

  if (problems.length === 0) {
    const next = Number.isFinite(max) ? max + 1 : 0;
    pass("imageKey integrity", `${apiImages.length}개 항목 모두 고유·정수. max=${max}, 다음 사용 가능=${next}`);
  } else {
    fail("imageKey integrity", problems.map((p) => `  - ${p}`).join("\n"));
  }
}

function checkIdUniqueness(images, label) {
  const seen = new Map();
  const duplicates = new Set();
  for (const img of images) {
    if (seen.has(img.id)) duplicates.add(img.id);
    seen.set(img.id, (seen.get(img.id) || 0) + 1);
  }
  if (duplicates.size === 0) {
    pass(`id uniqueness (${label})`, `${images.length}개 항목 중 중복 없음`);
  } else {
    fail(`id uniqueness (${label})`, [...duplicates].map((id) => `  - "${id}" 중복 (${seen.get(id)}회)`).join("\n"));
  }
}

// --- 5. Asset existence ---
function checkAssetExistence(apiImages, mainImages) {
  const paths = new Set();
  for (const img of [...apiImages, ...mainImages]) {
    if (img.src) paths.add(img.src);
    if (img.webpSrc) paths.add(img.webpSrc);
  }
  const missing = [];
  for (const relPath of paths) {
    const full = path.join(root, relPath);
    if (!existsSync(full)) missing.push(relPath);
  }
  if (missing.length === 0) {
    pass("Asset existence", `${paths.size}개 고유 경로 모두 존재`);
  } else {
    fail("Asset existence", `${paths.size}개 중 ${missing.length}개 누락:\n` +
      missing.map((p) => `  - ${p}`).join("\n"));
  }
}

// --- 6. Cache-bust sanity ---
function checkCacheBust() {
  const indexPath = path.join(root, "index.html");
  const html = readFileSync(indexPath, "utf8");
  const jsMatch = html.match(/main\.js\?v=(\S+?)["']/);
  const cssMatch = html.match(/style\.css\?v=(\S+?)["']/);

  const problems = [];
  let jsVersion = null;
  let cssVersion = null;

  if (!jsMatch) {
    problems.push("main.js?v=N 을 찾을 수 없음");
  } else if (!/^-?\d+$/.test(jsMatch[1])) {
    problems.push(`main.js?v=${jsMatch[1]} 는 정수가 아님`);
  } else {
    jsVersion = jsMatch[1];
  }

  if (!cssMatch) {
    problems.push("style.css?v=M 을 찾을 수 없음");
  } else if (!/^-?\d+$/.test(cssMatch[1])) {
    problems.push(`style.css?v=${cssMatch[1]} 는 정수가 아님`);
  } else {
    cssVersion = cssMatch[1];
  }

  if (problems.length === 0) {
    pass("Cache-bust sanity", `main.js?v=${jsVersion}, style.css?v=${cssVersion}`);
  } else {
    fail("Cache-bust sanity", problems.map((p) => `  - ${p}`).join("\n"));
  }
}

// --- 7. git whitespace ---
function checkGitWhitespace() {
  const result = spawnSync("git", ["diff", "--check"], { cwd: root, encoding: "utf8" });
  const output = (result.stdout || "").trim();
  if (result.status === 0 && !output) {
    pass("git whitespace", "git diff --check 통과 (오류 없음)");
  } else {
    fail("git whitespace", output || `git diff --check 종료 코드 ${result.status}`);
  }
}

// --- run everything ---
checkSyntax();

let apiImages = [];
let mainImages = [];
try {
  apiImages = loadArray(path.join(root, "functions/api/images/index.js"), "const defaultImages =", false);
  mainImages = loadArray(path.join(root, "main.js"), "const defaultGalleryImages =", true);
  pass("Gallery data parsing", `functions/api/images/index.js: ${apiImages.length}개, main.js: ${mainImages.length}개 로드`);
} catch (error) {
  fail("Gallery data parsing", String(error?.stack || error));
}

if (apiImages.length > 0 || mainImages.length > 0) {
  checkFieldParity(apiImages, mainImages);
  checkImageKeyIntegrity(apiImages);
  checkIdUniqueness(apiImages, "functions/api/images/index.js");
  checkIdUniqueness(mainImages, "main.js");
  checkAssetExistence(apiImages, mainImages);
}

checkCacheBust();
checkGitWhitespace();

// --- report ---
console.log("\n=== 검증 리포트 (validate.mjs) ===\n");
for (const r of results) {
  const icon = r.ok === true ? "✓" : r.ok === false ? "✗" : "⚠";
  console.log(`${icon} ${r.label}`);
  if (r.detail) {
    for (const line of String(r.detail).split("\n")) {
      console.log(`    ${line}`);
    }
  }
}

const passCount = results.filter((r) => r.ok === true).length;
const failCount = results.filter((r) => r.ok === false).length;
const warnCount = results.filter((r) => r.ok === null).length;
console.log(`\n${passCount} passed, ${failCount} failed, ${warnCount} warnings`);

if (hardFailures > 0) {
  console.log("\n결과: HARD FAIL");
  process.exit(1);
} else {
  console.log("\n결과: ALL PASS");
  process.exit(0);
}
