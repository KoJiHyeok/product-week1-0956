# 제목 학원

## 문의 메일 발송 환경변수

문의 페이지는 프론트에서 직접 이메일을 보내지 않고 `/api/contact` 서버 API를 호출합니다. 서버 API는 Resend를 통해 `wlgur2101@gmail.com`으로 문의 내용을 전송합니다.

필요한 환경변수:

- `RESEND_API_KEY`: Resend API key입니다. 실제 키는 코드에 넣지 말고 Cloudflare Pages 환경변수로 설정하세요.
- `CONTACT_FROM_EMAIL`: Resend에서 발송 가능한 인증된 발신자 이메일입니다. 생략 시 `Title Academy <onboarding@resend.dev>`를 사용합니다.
