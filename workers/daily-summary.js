import { sendDailyDiscordSummary } from "../functions/api/admin/daily-summary/discord.js";
import { sendDailyCandidates } from "../functions/api/admin/daily-summary/candidates.js";

export default {
  async scheduled(controller, env, ctx) {
    // 요약 발송과 갤러리 후보 발송은 서로 독립적이다 — 한쪽이 실패해도 다른 쪽을 막지 않는다.
    ctx.waitUntil(
      sendDailyDiscordSummary({
        env,
        scheduledTime: controller.scheduledTime,
        dryRun: false,
      }).catch((error) => {
        console.error("scheduled daily discord summary failed", error);
      })
    );

    ctx.waitUntil(
      sendDailyCandidates({
        env,
        scheduledTime: controller.scheduledTime,
        dryRun: false,
      }).catch((error) => {
        console.error("scheduled daily image candidates failed", error);
      })
    );
  },
};
