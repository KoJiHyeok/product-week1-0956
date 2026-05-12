import { json, readJson } from "../../../auth/_shared.js";
import { requireAdmin } from "../../_shared.js";
import { updateUserStatus } from "../_shared.js";

export async function onRequestPatch(context) {
  try {
    const admin = await requireAdmin(context);

    if (admin.response) {
      return admin.response;
    }

    const body = await readJson(context.request);
    const result = await updateUserStatus(context, admin.user, Number(context.params.id), {
      status: String(body?.status || "").trim(),
      reason: body?.reason,
      blockedUntil: body?.blockedUntil,
    });

    if (result.response) {
      return result.response;
    }

    return json({ updated: true, user: result.user });
  } catch {
    return json({ message: "회원 상태를 저장하지 못했습니다." }, 500);
  }
}
