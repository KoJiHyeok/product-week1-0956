import { sendDailyDiscordSummary } from "../functions/api/admin/daily-summary/discord.js";

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
