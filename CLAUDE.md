# CLAUDE.md

이 파일은 이 repo에서 작업하는 모든 AI 에이전트(Claude Code · Cowork · Codex 등)의 **단일 출처(single source of truth)** 작업 지침이다. 방향이 바뀌면 이 파일을 고친다.

## 실행 하네스 — 조건부 위임 규율

**작업 위험도에 따라 위임 수준을 정한다. 무조건 위임하지 않는다.** 판단·리뷰는 상위 모델(Fable / Opus, Codex는 sol), 실제 변경은 위험도가 높을 때만 하위 실행 모델(Sonnet 5, Codex는 luna max)에 위임한다.

- **저위험·단일 파일·기계적 작업 → 오케스트레이터가 직접 처리** (subagent 안 띄움). 예: 캐시 버전 한 줄 올리기, 문구/카피 수정, 워크플로대로 갤러리 레코드 1건 추가, 작은 CSS 조정.
- **실행·문법·계약 검사 → 결정적 스크립트로** (고급 모델 역할 아님). `node scripts/validate.mjs`(문법·갤러리 id/imageKey/필드 동기화·자산·캐시버전·`git diff --check` 일괄), 개별 `node --check`, git 명령.
- **다계층·고위험 작업 → 판단은 오케스트레이터, 코드 작성·수정은 Sonnet 5(luna max) subagent에 위임.** 예: 여러 파일에 걸친 로직 변경, D1 마이그레이션, 배포 영향 변경, 복합 장애 진단. 위임 시 명확한 지시·완료 기준·검증 게이트를 함께 넘기고, 독립 작업은 병렬로. 결과 검증은 오케스트레이터 책임.
- **경계:** 판단에 필요한 읽기·탐색은 오케스트레이터가 직접. prod DB·배포·메일 등 위험 작업은 아래 "위험 작업 규율" 게이트를 반드시 통과한다.

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
node scripts/validate.mjs
```

`scripts/validate.mjs`는 단일 결정적 게이트로 다음을 한 번에 검사한다(크로스플랫폼 — PowerShell·bash 공통, Windows에서 `find`/`xargs` 불필요): 모든 JS `node --check` 문법, 갤러리 두 리스트(`main.js` `defaultGalleryImages` ↔ `functions/api/images/index.js` `defaultImages`)의 id·imageKey·필드 동기화, `src`/`webpSrc` 자산 존재, `index.html` 캐시 버전(`main.js?v=N`) 형식, `git diff --check`(공백/줄바꿈). 하나라도 실패하면 비정상 종료(exit 1).

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

## 프런트엔드 (no-build 정적 UI) 함정

프런트는 프레임워크·번들러 없이 `index.html` + `main.js`(약 5천 줄, 모든 뷰·상태·API 호출) + `style.css`(단일 파일, 디자인 토큰 인라인) 셋으로만 돈다. 백엔드만큼 데인 지점이 있다:

1. **캐시 버스팅 필수.** `style.css`·`main.js`를 고치면 `index.html`의 `?v=N` 쿼리를 **함께 올려야** 배포에 반영된다(CDN·브라우저 캐시). 예: `style.css?v=3`, `main.js?v=4`. 안 올리면 옛 파일이 서빙돼 "고쳤는데 그대로"가 된다.
2. **`[hidden]` 속성이 항상 이기게 둔다.** main.js는 `element.hidden` 토글로 로그인/비회원 UI를 바꾼다(`authActions`·`guestChip`·`memberActions` 등). 그런데 `.auth-actions`/`.member-actions`에 명시적 `display:flex`가 있으면 브라우저 기본 `[hidden]{display:none}`을 덮어써 토글이 안 먹는다(예: 로그인했는데 로그인·회원가입 버튼이 안 사라짐). `style.css` 상단의 전역 `[hidden]{display:none !important;}`를 유지할 것.
3. **클래스 어휘는 계약이다.** `style.css`는 `index.html`과 `main.js`가 생성하는 마크업의 **기존 클래스명/ID**(`.photo-card`, `.ranking-item`, `.auth-button`, `#authActions` 등)를 타깃한다. 클래스·ID를 바꾸면 JS 셀렉터나 스타일이 조용히 깨진다. 리스타일은 새 클래스 도입이 아니라 기존 클래스 재스킨으로 한다.
4. **테마: light 기본.** `:root[data-theme="light"|"dark"]`로 토큰을 스위치하고, main.js가 `document.documentElement.dataset.theme`를 항상 설정하며 `localStorage` 키 `title-academy-theme`에 저장한다.

### 로컬 미리보기

```bash
npx wrangler pages dev . --port 9000   # Functions + 로컬 D1 포함. 첫 실행 시 wrangler 설치
```

로컬 D1은 prod와 **분리**돼 있어 기존 계정·제목이 없다. 로그인 흐름을 보려면 로컬에서 새로 가입해야 한다(이메일 인증 메일은 로컬에 `RESEND_API_KEY`가 없으면 발송이 안 될 수 있음).

## 갤러리에 새 사진 추가 (워크플로)

**사용자는 사진 파일만 올린다.** 캡션 텍스트는 에이전트가 이미지를 보고 기존 톤으로 자동 작성한다 — 사용자에게 제목·설명 등 추가 입력을 요구하지 않는다.

각 갤러리 항목은 사진 + 텍스트 6개로 구성된다 (카드·상세에 쓰임): `title`(카드 제목), `description`(장면 설명), `alt`(접근성 대체텍스트), `prompt`(제목짓기 힌트), `observationPoints[]`(관찰 포인트 3개), `exampleTitles[]`(예시 제목 3개).

절차:

1. 업로드 이미지를 `assets/gallery/`에 저장 (예: `offended-cat.jpg`). 가능하면 `assets/gallery/webp/`에 webp도(선택).
2. **두 리스트에 동일 항목 추가** (하나만 넣으면 서버↔프런트 불일치):
   - `main.js`의 `defaultGalleryImages` — 운영 데이터 연결을 보존하도록 새 항목에 **명시적이고 고유한 `imageKey`**를 넣는다. 기존 키는 삭제된 사진의 빈 슬롯 때문에 배열 인덱스와 다를 수 있으며 절대 재번호를 매기지 않는다. 항목엔 `...photoSourcePresets.curated` 스프레드와 `description`을 포함한다. webp가 있으면 `webpSrc`도 넣는다.
   - `functions/api/images/index.js`의 `defaultImages` — 프런트 항목과 **동일한 `id`·`imageKey`·텍스트·이미지 경로**를 넣는다. 새 `imageKey`는 두 목록 전체의 최대 키보다 1 큰 값을 사용하고, 중복 여부를 확인한다. `id`는 `imm-0NN` 형식, `isUserUpload: false`로 둔다.
3. `title`/`description`/`alt`/`prompt`/`observationPoints`/`exampleTitles`를 이미지 기반으로 기존 항목 톤에 맞춰 작성. (동물·인물 표정은 사람 대사처럼 바꾼 짧은 예시 제목이 톤에 맞음)
4. **랭킹·하트·댓글·신고 버튼은 카드 UI가 모든 항목에 자동 렌더** → 별도 작업 없음.
5. `node --check`(두 파일) → 두 목록의 `id`·`imageKey` 일치와 키 중복 확인 → 1건만 추가해 사용자에게 보여주고 확인 → `index.html`의 `main.js?v=N` 올림 → 커밋·푸시(자동 배포). (함정: 기존 `imageKey`를 배열 인덱스에 맞춰 재번호하면 저장된 제출이 엉뚱한 사진에 붙는다)

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
