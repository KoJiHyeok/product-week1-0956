import { sendDailyAdminSummary } from "../functions/api/admin/daily-summary/_shared.js";

export default {
  async scheduled(controller, env, ctx) {
    ctx.waitUntil(
      sendDailyAdminSummary({
        env,
        scheduledTime: controller.scheduledTime,
        dryRun: false,
      }).catch((error) => {
        console.error("scheduled daily admin summary failed", error);
      })
    );
  },
};
