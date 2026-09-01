import { json, readJson } from "../../auth/_shared.js";
import { requireOwnerUser, requireAdmin } from "../_shared.js";
import { sendDailyDiscordSummary } from "./discord.js";

export async function onRequestPost(context) {
  try {
    const admin = await requireAdmin(context);

    if (admin.response) {
      return admin.response;
    }

    const ownerResponse = requireOwnerUser(admin.user);

    if (ownerResponse) {
      return ownerResponse;
    }

    const body = await readJson(context.request);
    const dryRun = body?.dryRun !== false;
    const force = body?.force === true;
    const result = await sendDailyDiscordSummary({
      env: context.env,
      scheduledTime: Date.now(),
      dryRun,
      force,
    });

    return json({
      dryRun,
      sent: result.sent,
      skipped: Boolean(result.skipped),
      reason: result.reason || "",
      sentTo: result.sentTo,
      summary: serializeSummary(result.summary),
    });
  } catch (error) {
    console.error("daily summary test send failed", error);
    return json({ message: "일일 요약 디스코드 발송 테스트에 실패했습니다." }, 500);
  }
}

function serializeSummary(summary) {
  return {
    summaryDate: summary.summaryDate,
    coveredDate: summary.coveredDate,
    dayBeforeDate: summary.dayBeforeDate,
    metrics: summary.metrics,
    partyCompletion: summary.partyCompletion,
    reportNew: summary.reportNew,
    inquiryNew: summary.inquiryNew,
    text: summary.text,
    discordPayload: summary.discordPayload,
  };
}
