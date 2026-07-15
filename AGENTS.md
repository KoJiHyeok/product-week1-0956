# Repository Guidelines

이 repo의 작업 지침은 **`CLAUDE.md`를 단일 출처(single source of truth)** 로 사용합니다.
Codex를 포함한 모든 에이전트는 작업 전에 먼저 **`CLAUDE.md`** 를 읽으세요. (프로젝트 구조, 검증 게이트, 함정, 위험 작업 규율, 코딩 스타일, 배포, 보안 모두 거기에 있습니다.)

가장 중요한 가드레일 하나만 미리:

> **새 D1 마이그레이션을 추가하면 운영(prod)에 자동 적용되지 않습니다.**
> 반드시 `npx wrangler d1 migrations apply product-week1-0956-auth --remote` 를 실행하세요.

나머지 모든 규칙은 `CLAUDE.md` 참조.

## Multi-agent harness (조건부 위임)

작업 위험도에 따라 위임 수준을 정합니다 — 무조건 위임하지 않습니다.
- 저위험·단일 파일·기계적 작업(캐시 버전, 문구 수정, 갤러리 1건 추가, 작은 CSS): sol이 직접.
- 실행·문법·계약 검사: `node scripts/validate.mjs` 등 결정적 스크립트로.
- 다계층·고위험(여러 파일 로직, D1 마이그레이션, 배포, 복합 장애): sol이 판단, 코드 작성·수정은 subagents(luna max)에 위임.

자세한 기준은 `CLAUDE.md`의 "실행 하네스 — 조건부 위임 규율" 참조.
