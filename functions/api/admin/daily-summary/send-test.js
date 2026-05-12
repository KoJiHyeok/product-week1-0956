import { json, readJson } from "../../auth/_shared.js";
import { requireOwnerUser, requireAdmin } from "../_shared.js";
import { sendDailyAdminSummary } from "./_shared.js";

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
    const result = await sendDailyAdminSummary({
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
    return json({ message: "일일 요약 메일 테스트에 실패했습니다." }, 500);
  }
}

function serializeSummary(summary) {
  return {
    summaryDate: summary.summaryDate,
    period: summary.period,
    reportCounts: summary.reportCounts,
    inquiryCounts: summary.inquiryCounts,
    reportTotal: summary.reportTotal,
    inquiryTotal: summary.inquiryTotal,
    subject: summary.subject,
    text: summary.text,
  };
}
