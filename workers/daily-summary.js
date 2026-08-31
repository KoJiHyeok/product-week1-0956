import { sendDailyDiscordSummary } from "../functions/api/admin/daily-summary/discord.js";

// Openverse 자동 갤러리 후보 발송(sendDailyCandidates)은 2026-09-01에 크론에서 제외했다.
// cc0/pdm/by 코퍼스에 제목학원용 "결정적 순간" 사진이 거의 없어 평범한 동물 도감 사진만
// 올라왔기 때문이다(쿼리에 따라 결과 0건도 발생). 코드·D1 테이블·수동 테스트 엔드포인트
// (POST /api/admin/daily-summary/send-candidates-test)는 되살릴 수 있도록 그대로 둔다.
// 일일 후보는 scripts/daily-image-candidates-prompt.md의 생성 절차로만 받는다.
export default {
  async scheduled(controller, env, ctx) {
    ctx.waitUntil(
      sendDailyDiscordSummary({
        env,
        scheduledTime: controller.scheduledTime,
        dryRun: false,
      }).catch((error) => {
        console.error("scheduled daily discord summary failed", error);
      })
    );
  },
};
