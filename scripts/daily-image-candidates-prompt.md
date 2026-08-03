# 제목 학원 일일 이미지 후보 생성

매일 실행할 때 아래 절차를 정확히 따른다.

1. `/Users/kojh/dev/jemokhakwon/product-week1-0956`의 현재 갤러리 이미지와 메타데이터를 확인한다.
2. `content/image-preferences.json`의 승인·탈락 기록과 선호 강도를 읽는다. `preference`는 후보 구성에 가중치로 반영하되 절대 규칙처럼 모든 후보에 강제하지 않는다.
3. 기존 소재·상황·구도와 겹치지 않는 제목 짓기용 사진 아이디어 4개를 만든다. 선호 특성을 반영한 후보와 새로운 방향을 시험하는 후보를 함께 포함해 한 취향으로 과적합되지 않게 한다.
4. `$imagegen`을 사용해 서로 다른 후보 이미지 4장을 각각 생성한다. 한 번의 다중 변형 요청 대신 후보마다 별도 이미지 생성 호출을 사용한다.
5. 생성 규칙:
   - `photorealistic-natural` 유형의 가로형 사진
   - 한눈에 이해되는 상황과 가벼운 반전
   - 중심 대상은 1~2개
   - 브랜드 로고, 글자, 워터마크, 유명인, 저작권 캐릭터 금지
   - 혐오·폭력·선정적 내용 및 식별 가능한 실제 인물 금지
6. 생성 결과를 `output/image-candidates/YYYY-MM-DD/`에 `candidate-1`부터 `candidate-4`까지 저장한다.
7. 네 이미지가 모두 정상적으로 열리고 서로 다른 장면인지 확인한다.
8. 다음 명령으로 Discord 채널에 후보를 전송한다.

   ```bash
   node scripts/send-discord-image-candidates.mjs \
     output/image-candidates/YYYY-MM-DD/candidate-1.png \
     output/image-candidates/YYYY-MM-DD/candidate-2.png \
     output/image-candidates/YYYY-MM-DD/candidate-3.png \
     output/image-candidates/YYYY-MM-DD/candidate-4.png
   ```

9. 후보 이미지를 사이트 갤러리에 추가하거나 커밋·푸시·배포하지 않는다. 사용자의 승인을 기다린다.
10. 전송에 실패하면 이미지 파일은 보존하고 오류 원인만 보고한다. Webhook URL이나 다른 비밀값은 출력하지 않는다.

승인 이후의 별도 Codex 작업은 `CLAUDE.md`의 **일일 후보 승인 후 자동 반영** 절차를 따른다. 예약 실행 자체는 사용자의 승인 없이 후보를 게시하거나 배포하지 않는다.
