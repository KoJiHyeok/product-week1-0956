# CLAUDE.md

이 파일은 이 repo에서 작업하는 모든 AI 에이전트(Claude Code · Cowork · Codex 등)의 **단일 출처(single source of truth)** 작업 지침이다. 방향이 바뀌면 이 파일을 고친다.

## 프로젝트 개요

- **무엇:** "제목 학원" — 사진에 제목을 붙이고 랭킹·하트·댓글로 노는 한국어 웹 서비스.
- **스택:** Cloudflare Pages + Pages Functions(서버리스 API) + D1(SQLite) + Resend(메일). 빌드 도구·프레임워크·`package.json` **없음** (의존성 없는 순수 ES modules).
- **진입점:** 루트의 `index.html`, `main.js`, `style.css`. 정적 자산은 `assets/`.

## 구조

- `functions/api/` — 서버 API. 기능별 그룹: `auth`, `admin`, `submissions`, `reports`, `images`, `messages`, `profile`.
  - 각 파일은 `onRequestGet` / `onRequestPost` / `onRequestPatch` 등 Cloudflare 핸들러를 export.
  - 공통 헬퍼는 각 폴더의 `_shared.js` (예: `functions/api/auth/_shared.js`의 `getDb`, `json`, `getCurrentUser`).
- `functions/admin/[[path]].js` — 보호된 admin 페이지 fallback.
- `migrations/` — D1 스키마 이력(`0002_…` ~ `0014_…`). `schema.sql` = 현재 전체 스키마.
- `workers/` + `wrangler.daily-summary.toml` — 독립 Cron Worker(일일 요약).
- `wrangler.toml` — Pages 설정. D1 바인딩 `DB` → 데이터베이스 `product-week1-0956-auth`.

## 작업 전 검증 게이트 (커밋 전 필수)

```bash
# 모든 JS 문법 검사
find . -name '*.js' -not -path './node_modules/*' -print0 | xargs -0 -n1 node --check
# 공백/줄바꿈 오류
git diff --check
```

정식 테스트 프레임워크는 없다. API 변경은 가능한 owner/admin 수동 엔드포인트로 검증한다 (예: `POST /api/admin/daily-summary/send-test` 에 `{ "dryRun": true }`).

## ⚠️ 이 repo의 함정 (반드시 숙지 — 실제로 데인 것들)

1. **마이그레이션은 repo에 있어도 prod D1엔 자동 적용되지 않는다.** 코드가 새 컬럼을 참조하는데 prod에 없으면 `no such column` → 500 → 프런트는 일반 토스트로 뭉뚱그려 표시. 새 migration을 추가하면 **반드시**:
   ```
   npx wrangler d1 migrations list  product-week1-0956-auth --remote   # pending 확인 (read-only)
   npx wrangler d1 migrations apply product-week1-0956-auth --remote   # 적용
   ```
2. **OneDrive/Windows가 LF→CRLF로 바꿔** 워크트리 전체가 "modified"로 뜰 수 있다. `.gitattributes`(`* text=auto eol=lf`)로 방지된다. 그래도 `git add .` 전에 `git status`로 진짜 변경만 들어가는지 확인할 것. (`git diff -w`가 비면 전부 줄바꿈 노이즈) — 또한 실패한 git 작업이 `.git/index.lock`을 남기면 다음 커밋이 막히니 `Remove-Item ".git\index.lock"`로 지운다.
3. **D1 변경은 추가형만.** `ADD COLUMN` / `CREATE INDEX IF NOT EXISTS` / `CREATE TABLE` OK. **`DROP`·데이터 삭제 UPDATE 금지.**
4. **500 디버깅:** 서버 `catch`는 사용자에게 일반 메시지만 내려준다(`"제목 목록을 불러오지 못했습니다"` 등). 실제 예외는 `console.error` → Cloudflare 함수 로그에서 본다. 급하면 해당 `catch`에 `detail: error?.message`를 임시로 넣어 DevTools → Network 응답에서 확인하고, 원인 확정 후 제거한다.

## 위험 작업 규율 (prod DB · 배포 · 실제 메일 발송 전)

1. **read-only로 현재 상태부터 확인한다** (예: `wrangler d1 execute --remote --command "PRAGMA table_info(...)"`).
2. **전체 영향을 한 줄로 적어보고** 실행한다 — 무엇이 바뀌고 무엇이 안 바뀌나.
3. **1건 테스트 → 확인 → 전체 적용** 순서. 한 번에 전체 적용 금지.
4. 모르면 추측으로 메우지 말고 **확인 명령을 먼저** 돌린다.

## 코딩 스타일

순수 JS ES modules, 의존성 최소. `const`/`let`, async/await, early return, 작은 헬퍼 함수. 2-space 들여쓰기, 세미콜론, 기존 camelCase 유지. API 파일은 `onRequestGet`/`onRequestPost`/`onRequestPatch` 핸들러를 export. migration 파일은 zero-padded 숫자 prefix (예: `0014_admin_daily_summaries.sql`).

## 갤러리에 새 사진 추가 (워크플로)

**사용자는 사진 파일만 올린다.** 캡션 텍스트는 에이전트가 이미지를 보고 기존 톤으로 자동 작성한다 — 사용자에게 제목·설명 등 추가 입력을 요구하지 않는다.

각 갤러리 항목은 사진 + 텍스트 6개로 구성된다 (카드·상세에 쓰임): `title`(카드 제목), `description`(장면 설명), `alt`(접근성 대체텍스트), `prompt`(제목짓기 힌트), `observationPoints[]`(관찰 포인트 3개), `exampleTitles[]`(예시 제목 3개).

절차:

1. 업로드 이미지를 `assets/gallery/`에 저장 (예: `24-<slug>.png`). 가능하면 `assets/gallery/webp/`에 webp도.
2. **두 리스트에 동일 항목 추가** (하나만 넣으면 서버↔프런트 불일치):
   - `functions/api/images/index.js`의 `defaultImages`
   - `main.js`의 `defaultGalleryImages`
   - `imageKey`는 마지막 순번 +1 (현재 마지막 `"23"` → 다음 `"24"`), `id`는 `imm-00x` 형식, `isUserUpload: false`.
3. `title`/`description`/`alt`/`prompt`/`observationPoints`/`exampleTitles`를 이미지 기반으로 기존 항목 톤에 맞춰 작성.
4. **랭킹·하트·댓글·신고 버튼은 카드 UI가 모든 항목에 자동 렌더** → 별도 작업 없음.
5. `node --check` → 1건만 추가해 사용자에게 보여주고 확인 → 커밋·푸시(자동 배포). (함정: 두 리스트의 `imageKey` 순번이 겹치지 않게)

## 배포

- **Pages:** `main`을 GitHub에 push → Cloudflare Pages 통합이 자동 빌드·배포.
- **Cron Worker:** `npx wrangler deploy -c wrangler.daily-summary.toml`.
- 배포에 스키마 변경이 끼면 **migration apply --remote를 잊지 말 것**(함정 1).

## 보안 · 환경변수

- secrets는 코드/API 응답에 **절대 노출 금지.** Cloudflare Pages 환경변수로 관리.
- 모든 admin API는 **서버 측 role 검사** 필수. owner 전용 동작은 `wlgur2101@gmail.com`을 보호한다.
- 주요 env: `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, `CONTACT_TO_EMAIL`, `AUTH_FROM_EMAIL`, `APP_ORIGIN`, `DAILY_ADMIN_SUMMARY_TO`.
- 유저 직접 이미지 업로드는 비활성(`/api/images/upload`·`/file/:id`가 503 반환). 승인 이미지는 정적 `assets/gallery`로 운영한다.

## 커밋 / PR

짧은 명령형 요약(`Add admin moderation controls`처럼). 커밋은 한 가지에 집중. PR엔 요약·영향받는 API/UI·migration 이름·수동 검증 절차·(보이는 변경이면) 스크린샷을 포함.

## 운영 메모

- 사고 진단 사례: `진단_및_수정_런북.md` — "서버 저장소를 이용할 수 없습니다" 토스트(500)의 실제 원인은 migration 0013 미적용이었음. (함정 1 사례)
