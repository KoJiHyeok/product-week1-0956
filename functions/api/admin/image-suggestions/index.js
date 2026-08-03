import { json } from "../../auth/_shared.js";
import { SUGGESTION_STATUSES, serializeSuggestion } from "../../images/_suggestions.js";
import { requireAdmin } from "../_shared.js";
import { selectSuggestions } from "./_shared.js";

export async function onRequestGet(context) {
  try {
    const admin = await requireAdmin(context);

    if (admin.response) {
      return admin.response;
    }

    const url = new URL(context.request.url);
    const status = url.searchParams.get("status") || "pending";

    if (status !== "all" && !SUGGESTION_STATUSES.has(status)) {
      return json({ message: "이미지 제안 상태가 올바르지 않습니다." }, 400);
    }

    const whereClause = status === "all" ? "" : "WHERE image_suggestions.status = ?";
    const statement = selectSuggestions(context, whereClause);
    const { results } = status === "all" ? await statement.all() : await statement.bind(status).all();

    return json({ suggestions: (results || []).map(serializeSuggestion) });
  } catch (error) {
    console.error("admin image suggestions error", error);
    return json({ message: "이미지 제안 목록을 불러오지 못했습니다." }, 500);
  }
}
