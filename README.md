# 제목 학원

## 문의 메일 발송 환경변수

문의 페이지는 프론트에서 직접 이메일을 보내지 않고 `/api/contact` 서버 API를 호출합니다. 서버 API는 Resend를 통해 `wlgur2101@gmail.com`으로 문의 내용을 전송합니다.

필요한 환경변수:

- `RESEND_API_KEY`: Resend API key입니다. 실제 키는 코드에 넣지 말고 Cloudflare Pages 환경변수로 설정하세요.
- `CONTACT_FROM_EMAIL`: Resend에서 발송 가능한 인증된 발신자 이메일입니다. 생략 시 `Title Academy <onboarding@resend.dev>`를 사용합니다.

## 인증 환경변수와 DB 변경

이메일 인증은 회원가입 직후 `/api/auth/email/send`와 동일한 토큰 저장/메일 발송 로직을 사용합니다. 인증 링크는 `/?verifyEmailToken=...`으로 돌아오고 프론트에서 `/api/auth/email/verify`를 호출해 검증합니다.

필요한 DB 마이그레이션:

- `migrations/0003_auth_email_google.sql`
- `migrations/0004_profile_editing.sql`

`0004_profile_editing.sql`은 프로필 자기소개(`bio`)와 내 정보 공개 여부(`is_profile_public`) 필드를 추가합니다.

추가 환경변수:

- `APP_ORIGIN`: 이메일 인증 링크에 사용할 서비스 origin입니다. 예: `https://product-week1-0956.pages.dev`
- `AUTH_FROM_EMAIL`: 인증 메일 발신자입니다. 생략 시 `CONTACT_FROM_EMAIL`, 그다음 `Title Academy <onboarding@resend.dev>`를 사용합니다.
- `RESEND_API_KEY`: 인증 메일 발송에도 사용합니다.
- `GOOGLE_OAUTH_CLIENT_ID`: Google OAuth Client ID입니다.
- `GOOGLE_OAUTH_CLIENT_SECRET`: Google OAuth Client Secret입니다.
- `GOOGLE_OAUTH_REDIRECT_URI`: Google OAuth Redirect URI입니다. 생략 시 현재 origin의 `/api/auth/google/callback`을 사용합니다.

Google OAuth 콘솔에는 Redirect URI를 `https://도메인/api/auth/google/callback` 형태로 등록해야 합니다. 값이 설정되지 않은 상태에서 Google 버튼을 누르면 로그인 기능을 시작하지 않고 설정 필요 안내로 돌아옵니다.

## 이미지 제안과 정적 갤러리 운영

유저가 사이트에서 이미지를 직접 업로드하는 기능은 비활성화되어 있습니다. 이미지는 문의 유형 `이미지 제안`으로 제안받고, 관리자가 이메일로 받은 파일을 검토한 뒤 승인된 이미지만 `assets/gallery` 같은 정적 폴더에 추가합니다.

## 문의 메일 환경변수

문의 API는 민감한 수신 주소와 발송 키를 코드에 하드코딩하지 않습니다. 배포 환경에는 `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, 선택적으로 `CONTACT_FROM_EMAIL`을 설정해야 합니다.

갤러리에 이미지를 공개하려면 이미지 파일을 정적 assets에 넣고 `main.js`와 `functions/api/images/index.js`의 정적 이미지 목록에 항목을 추가합니다.

`/api/images/upload`와 `/api/images/file/:id`는 직접 업로드 비활성화 안내를 503으로 반환하므로, `IMAGE_BUCKET` 바인딩이 없어도 사이트 기본 기능과 정적 갤러리는 동작합니다.
