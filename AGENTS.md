# Repository Guidelines

이 repo의 작업 지침은 **`CLAUDE.md`를 단일 출처(single source of truth)** 로 사용합니다.
Codex를 포함한 모든 에이전트는 작업 전에 먼저 **`CLAUDE.md`** 를 읽으세요. (프로젝트 구조, 검증 게이트, 함정, 위험 작업 규율, 코딩 스타일, 배포, 보안 모두 거기에 있습니다.)

가장 중요한 가드레일 하나만 미리:

> **새 D1 마이그레이션을 추가하면 운영(prod)에 자동 적용되지 않습니다.**
> 반드시 `npx wrangler d1 migrations apply product-week1-0956-auth --remote` 를 실행하세요.

나머지 모든 규칙은 `CLAUDE.md` 참조.
