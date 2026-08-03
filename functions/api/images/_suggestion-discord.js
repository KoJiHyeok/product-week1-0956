// 새 이미지 제안이 접수되면 디스코드 채널(기존 DISCORD_WEBHOOK_URL 웹훅)로 알린다.
// 제안 이미지는 첨부로 함께 올려 채널에서 바로 보이게 한다.
// 알림 실패가 문의 접수 자체를 막지 않도록 호출부에서 오류를 삼킨다.

const ADMIN_URL = "https://jemokhakwon.com/admin";
const EMBED_COLOR = 0xfaa61a;
const MAX_BODY_LENGTH = 900;
const EXTENSION_BY_TYPE = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
]);

export async function notifyImageSuggestionToDiscord(env, suggestion) {
  const url = env?.DISCORD_WEBHOOK_URL;

  if (!url) {
    return false;
  }

  const attachmentName = suggestion.attachment
    ? `suggestion-${suggestion.id}.${EXTENSION_BY_TYPE.get(suggestion.attachment.type) || "jpg"}`
    : "";
  const payload = {
    // DISCORD_ADMIN_USER_ID를 넣어두면 채널 글에서 직접 멘션해 푸시 알림이 확실히 온다.
    content: env.DISCORD_ADMIN_USER_ID ? `<@${env.DISCORD_ADMIN_USER_ID}> 새 이미지 제안이 접수됐어요.` : "새 이미지 제안이 접수됐어요.",
    embeds: [buildEmbed(suggestion, attachmentName)],
    allowed_mentions: env.DISCORD_ADMIN_USER_ID ? { users: [String(env.DISCORD_ADMIN_USER_ID)] } : { parse: [] },
  };

  const body = new FormData();
  body.append("payload_json", JSON.stringify(payload));

  if (suggestion.attachment) {
    body.append(
      "files[0]",
      new File([suggestion.attachment.bytes], attachmentName, { type: suggestion.attachment.type }),
      attachmentName
    );
  }

  const response = await fetch(url, { method: "POST", body });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Discord webhook error ${response.status}${detail ? `: ${detail.slice(0, 300)}` : ""}`);
  }

  return true;
}

function buildEmbed(suggestion, attachmentName) {
  const fields = [
    {
      name: "제안자",
      value: `${suggestion.submitter || "비회원"}${suggestion.submitterEmail ? `\n${suggestion.submitterEmail}` : ""}`,
      inline: true,
    },
    {
      name: "첨부",
      value: suggestion.attachment
        ? `${suggestion.attachment.displayName || "이미지"}\n${formatSize(suggestion.attachment.size)}`
        : "이미지 없음",
      inline: true,
    },
  ];

  return {
    title: `🖼️ 새 이미지 제안 · ${truncate(suggestion.title || "제목 없음", 80)}`,
    description: truncate(suggestion.body || "내용 없음", MAX_BODY_LENGTH),
    url: ADMIN_URL,
    color: EMBED_COLOR,
    fields,
    ...(attachmentName ? { image: { url: `attachment://${attachmentName}` } } : {}),
    footer: { text: "제목 학원 · 관리자 > 이미지 제안 탭에서 승인" },
  };
}

function truncate(value, maxLength) {
  const text = String(value || "").trim();
  return text.length > maxLength ? `${text.slice(0, maxLength - 1)}…` : text;
}

function formatSize(bytes) {
  const size = Number(bytes) || 0;
  return size >= 1024 * 1024 ? `${(size / (1024 * 1024)).toFixed(1)}MB` : `${Math.max(1, Math.round(size / 1024))}KB`;
}
