import { json, readJson } from "../../../auth/_shared.js";
import { requireAdmin } from "../../_shared.js";
import { updateUserRole } from "../_shared.js";

export async function onRequestPatch(context) {
  try {
    const admin = await requireAdmin(context);

    if (admin.response) {
      return admin.response;
    }

    const body = await readJson(context.request);
    const result = await updateUserRole(context, admin.user, Number(context.params.id), {
      role: String(body?.role || "").trim(),
    });

    if (result.response) {
      return result.response;
    }

    return json({ updated: true, user: result.user });
  } catch {
    return json({ message: "회원 role을 저장하지 못했습니다." }, 500);
  }
}
