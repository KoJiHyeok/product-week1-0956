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

## 유저 이미지 업로드, 검수, 신고

유저 업로드 이미지는 `/api/images/upload`에서 로그인 회원만 접수하며, D1에는 `pending` 상태로 저장됩니다. 일반 갤러리 API(`/api/images`)는 기본 이미지와 `approved` 상태의 업로드 이미지만 반환합니다.

필요한 DB 마이그레이션:

- `migrations/0007_uploaded_images_reports_admin.sql`

적용 예시:

```bash
wrangler d1 migrations apply product-week1-0956-auth
```

필요한 Cloudflare 설정:

- D1 binding: `DB`
- R2 bucket binding: `IMAGE_BUCKET`
- 관리자 지정: `ADMIN_EMAILS` 또는 `ADMIN_USER_IDS` 환경변수에 쉼표로 구분해 설정하거나, `users.role` 값을 `admin`으로 변경합니다.

R2 설정 예시:

```bash
wrangler r2 bucket create product-week1-0956-images
```

Cloudflare Pages 프로젝트 설정에서 R2 bucket binding 이름을 `IMAGE_BUCKET`으로 연결하세요. 원본 객체는 `uploads/private/...` 키에 저장되고, 공개 버킷 URL은 사용하지 않습니다. 승인된 이미지만 `/api/images/file/:id` 프록시 API를 통해 표시됩니다.

현재 구조상 제한:

- Pages Functions 런타임에 이미지 처리 파이프라인을 추가하지 않았기 때문에 EXIF 제거, WebP 변환, 썸네일 생성은 TODO로 남아 있습니다. Cloudflare Images, 별도 Worker, 또는 업로드 후 처리 큐를 연결해 구현하는 방식이 적합합니다.
