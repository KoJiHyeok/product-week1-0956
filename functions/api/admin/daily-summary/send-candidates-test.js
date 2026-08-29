import { json, readJson } from "../../auth/_shared.js";
import { requireOwnerUser, requireAdmin } from "../_shared.js";
import { sendDailyCandidates } from "./candidates.js";

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
    const result = await sendDailyCandidates({
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
      candidateDate: result.candidateDate,
      candidates: result.candidates,
      discordPayload: result.discordPayload,
    });
  } catch (error) {
    console.error("daily candidates test send failed", error);
    return json({ message: "일일 갤러리 후보 디스코드 발송 테스트에 실패했습니다." }, 500);
  }
}
