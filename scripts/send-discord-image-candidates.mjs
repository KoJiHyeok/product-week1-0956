import { readFile, stat } from "node:fs/promises";
import path from "node:path";

const EXPECTED_CHANNEL_ID = "1521551673741279295";
const MAX_FILE_BYTES = 10 * 1024 * 1024;
const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"]);

function usage() {
  return [
    "사용법:",
    "  DISCORD_WEBHOOK_URL=... node scripts/send-discord-image-candidates.mjs <후보1> <후보2> <후보3> <후보4>",
    "  node scripts/send-discord-image-candidates.mjs --dry-run <후보1> <후보2> <후보3> <후보4>",
  ].join("\n");
}

function mimeType(filePath) {
  const extension = path.extname(filePath).toLowerCase();
  if (extension === ".png") return "image/png";
  if (extension === ".webp") return "image/webp";
  return "image/jpeg";
}

function webhookApiUrl(rawUrl) {
  const url = new URL(rawUrl);
  if (url.protocol !== "https:" || url.hostname !== "discord.com") {
    throw new Error("DISCORD_WEBHOOK_URL은 https://discord.com/api/webhooks/... 형식이어야 합니다.");
  }
  return url;
}

async function localWebhookUrl() {
  if (process.env.DISCORD_WEBHOOK_URL) return process.env.DISCORD_WEBHOOK_URL;

  try {
    const source = await readFile(path.resolve(".env"), "utf8");
    const line = source
      .split(/\r?\n/)
      .find((entry) => entry.trim().startsWith("DISCORD_WEBHOOK_URL="));
    if (!line) return "";

    const value = line.slice(line.indexOf("=") + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      return value.slice(1, -1);
    }
    return value;
  } catch (error) {
    if (error?.code === "ENOENT") return "";
    throw error;
  }
}

async function validateFiles(files) {
  if (files.length !== 4) {
    throw new Error(`후보 이미지는 정확히 4장이어야 합니다. 현재 ${files.length}장입니다.\n${usage()}`);
  }

  return Promise.all(
    files.map(async (filePath, index) => {
      const absolutePath = path.resolve(filePath);
      const extension = path.extname(absolutePath).toLowerCase();
      if (!IMAGE_EXTENSIONS.has(extension)) {
        throw new Error(`후보 ${index + 1}의 형식을 지원하지 않습니다: ${extension || "확장자 없음"}`);
      }

      const info = await stat(absolutePath);
      if (!info.isFile()) throw new Error(`파일이 아닙니다: ${absolutePath}`);
      if (info.size > MAX_FILE_BYTES) {
        throw new Error(`후보 ${index + 1}이 10MB를 초과합니다: ${absolutePath}`);
      }

      return { absolutePath, filename: `candidate-${index + 1}${extension}`, size: info.size };
    })
  );
}

async function verifyWebhookChannel(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Discord Webhook 확인 실패: HTTP ${response.status}`);
  }

  const webhook = await response.json();
  if (String(webhook.channel_id) !== EXPECTED_CHANNEL_ID) {
    throw new Error(
      `Webhook 채널이 다릅니다. 예상 ${EXPECTED_CHANNEL_ID}, 실제 ${webhook.channel_id || "알 수 없음"}`
    );
  }
}

async function sendCandidates(url, files) {
  await verifyWebhookChannel(url);

  const date = new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());

  const form = new FormData();
  form.set(
    "payload_json",
    JSON.stringify({
      username: "Spidey Bot",
      content: [
        `🖼️ **제목 학원 이미지 후보 · ${date}**`,
        "후보 1~4를 확인한 뒤 Codex에 `오늘 3번 승인`처럼 알려주세요.",
        "승인 전에는 사이트에 반영하거나 배포하지 않습니다.",
      ].join("\n"),
      allowed_mentions: { parse: [] },
    })
  );

  for (const [index, file] of files.entries()) {
    const bytes = await readFile(file.absolutePath);
    form.set(`files[${index}]`, new Blob([bytes], { type: mimeType(file.absolutePath) }), file.filename);
  }

  const executeUrl = new URL(url);
  executeUrl.searchParams.set("wait", "true");
  const response = await fetch(executeUrl, { method: "POST", body: form });
  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`Discord 후보 전송 실패: HTTP ${response.status}${body ? ` — ${body.slice(0, 500)}` : ""}`);
  }

  const message = await response.json();
  console.log(`Discord 후보 4장 전송 완료 (message_id=${message.id})`);
}

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const fileArgs = args.filter((arg) => arg !== "--dry-run");

try {
  const files = await validateFiles(fileArgs);
  if (dryRun) {
    console.log(
      JSON.stringify(
        { dryRun: true, expectedChannelId: EXPECTED_CHANNEL_ID, files: files.map(({ filename, size }) => ({ filename, size })) },
        null,
        2
      )
    );
  } else {
    const rawUrl = await localWebhookUrl();
    if (!rawUrl) throw new Error(`DISCORD_WEBHOOK_URL이 설정되지 않았습니다.\n${usage()}`);
    await sendCandidates(webhookApiUrl(rawUrl), files);
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
