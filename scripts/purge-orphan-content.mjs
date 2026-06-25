#!/usr/bin/env node
// scripts/purge-orphan-content.mjs
//
// 갤러리에서 사라진 사진(= 현재 갤러리 목록에 더 이상 없는 image key)에 달린
// 제목(submissions) · 댓글(comments) · 하트(likes)를 원격(prod) D1에서 영구 삭제한다.
//
// 사진이 사라지면 그에 달린 제목/댓글 데이터도 함께 사라져야 한다는 규칙을 강제한다.
// (관리자 대시보드에서 "이동"이 안 되는 고아 항목이 쌓이는 것을 막는다.)
//
// 사용:
//   node scripts/purge-orphan-content.mjs            # 미리보기(dry-run) + 백업 파일 생성, 삭제 안 함
//   node scripts/purge-orphan-content.mjs --apply    # 실제 삭제 (백업 먼저 생성)
//
// 안전장치:
//   - 기본은 dry-run. 실제 삭제는 --apply 플래그가 있을 때만.
//   - 유효 키 집합이 비정상적으로 작으면(파싱 실패 의심) 중단한다.
//   - 삭제 전 대상 행(제목/댓글/하트)을 scripts/backups/ 에 JSON 으로 백업한다.

import { execSync } from "node:child_process";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");
const DB = "product-week1-0956-auth";
const APPLY = process.argv.includes("--apply");
// 유효 키가 이 수보다 적으면 갤러리 파싱이 깨진 것으로 보고 중단(라이브 콘텐츠 보호).
const MIN_VALID_KEYS = 25;

function d1(sql) {
  const command = `npx wrangler d1 execute ${DB} --remote --json --command "${sql}"`;
  const out = execSync(command, {
    cwd: repoRoot,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "ignore"],
    maxBuffer: 32 * 1024 * 1024,
  });
  const start = out.indexOf("[");
  if (start === -1) {
    throw new Error(`예상치 못한 wrangler 출력:\n${out}`);
  }
  const parsed = JSON.parse(out.slice(start));
  return parsed[0]?.results || [];
}

// 1) 현재 살아있는 사진의 유효 image key 집합을 구한다.
//    - 큐레이션 사진: functions/api/images/index.js 의 imageKey 리터럴.
//    - 승인된 업로드 사진: uploaded_images.status='approved' → `uploaded:<id>`.
function collectValidKeys() {
  const indexPath = join(repoRoot, "functions", "api", "images", "index.js");
  const source = readFileSync(indexPath, "utf8");
  const keys = new Set();
  for (const match of source.matchAll(/imageKey:\s*"([^"]+)"/g)) {
    keys.add(match[1]);
  }

  const approved = d1("SELECT id FROM uploaded_images WHERE status = 'approved'");
  for (const row of approved) {
    keys.add(`uploaded:${row.id}`);
  }
  return keys;
}

const canonicalKey = "COALESCE(image_key, CAST(image_index AS TEXT))";

function quoteList(keys) {
  return keys.map((key) => `'${String(key).replace(/'/g, "''")}'`).join(", ");
}

function main() {
  const validKeys = collectValidKeys();
  console.log(`유효(살아있는) 사진 키 ${validKeys.size}개`);

  if (validKeys.size < MIN_VALID_KEYS) {
    console.error(
      `중단: 유효 키가 ${validKeys.size}개뿐 — 갤러리 파싱 실패 가능. 라이브 콘텐츠 보호를 위해 멈춥니다.`
    );
    process.exit(1);
  }

  // 2) 제출에 실제로 쓰인 키들 중 유효 집합에 없는 것 = 고아 키.
  const usedRows = d1(
    `SELECT ${canonicalKey} AS k, COUNT(*) AS subs FROM submissions GROUP BY k`
  );
  const orphanKeys = usedRows
    .map((row) => String(row.k))
    .filter((key) => !validKeys.has(key));

  if (orphanKeys.length === 0) {
    console.log("고아 콘텐츠 없음 — 정리할 것이 없습니다.");
    return;
  }

  const inList = quoteList(orphanKeys);
  const orphanFilter = `${canonicalKey} IN (${inList})`;
  const subIdSubquery = `SELECT id FROM submissions WHERE ${orphanFilter}`;

  // 3) 삭제 대상 백업(제목/댓글/하트).
  const submissions = d1(`SELECT * FROM submissions WHERE ${orphanFilter}`);
  const comments = d1(`SELECT * FROM comments WHERE submission_id IN (${subIdSubquery})`);
  const likes = d1(`SELECT * FROM likes WHERE submission_id IN (${subIdSubquery})`);

  console.log(`사라진 사진 키: ${orphanKeys.join(", ")}`);
  console.log(
    `삭제 대상 → 제목 ${submissions.length} · 댓글 ${comments.length} · 하트 ${likes.length}`
  );

  const backupDir = join(repoRoot, "scripts", "backups");
  mkdirSync(backupDir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupPath = join(backupDir, `orphan-purge-${stamp}.json`);
  writeFileSync(
    backupPath,
    JSON.stringify({ orphanKeys, submissions, comments, likes }, null, 2)
  );
  console.log(`백업 저장: ${backupPath}`);

  if (!APPLY) {
    console.log("\n[dry-run] 실제로 삭제하려면 --apply 를 붙여 다시 실행하세요.");
    return;
  }

  // 4) 자식(댓글/하트) 먼저, 제목 마지막 순서로 영구 삭제.
  d1(`DELETE FROM comments WHERE submission_id IN (${subIdSubquery})`);
  d1(`DELETE FROM likes WHERE submission_id IN (${subIdSubquery})`);
  d1(`DELETE FROM submissions WHERE ${orphanFilter}`);
  console.log("\n삭제 완료. 사라진 사진의 제목/댓글/하트를 모두 제거했습니다.");
}

main();
