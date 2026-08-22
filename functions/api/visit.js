const BOT_USER_AGENT_PATTERN =
  /bot|crawl|spider|slurp|preview|fetch|monitor|headless|lighthouse|curl|wget|python|axios|node/i;
const KST_OFFSET_MS = 9 * 60 * 60 * 1000;

export async function onRequestPost(context) {
  try {
    return await handleVisit(context);
  } catch (error) {
    console.error("visit tracking error", error);
    return new Response(null, { status: 204 });
  }
}

async function handleVisit(context) {
  const { request, env } = context;

  if (!env.DB) {
    return new Response(null, { status: 204 });
  }

  const ip = request.headers.get("cf-connecting-ip") || "";
  const ua = request.headers.get("user-agent") || "";

  if (!ua || BOT_USER_AGENT_PATTERN.test(ua)) {
    return new Response(null, { status: 204 });
  }

  const kstDay = kstDateString(Date.now());
  const visitorHash = await hashVisitor(kstDay, ip, ua, env.VISIT_SALT || "");

  await env.DB.prepare("INSERT OR IGNORE INTO daily_visits (visit_date, visitor_hash) VALUES (?, ?)")
    .bind(kstDay, visitorHash)
    .run();

  return new Response(null, { status: 204 });
}

function kstDateString(ms) {
  return new Date(ms + KST_OFFSET_MS).toISOString().slice(0, 10);
}

async function hashVisitor(kstDay, ip, ua, salt) {
  const input = `${kstDay}|${ip}|${ua}|${salt}`;
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return bufferToHex(digest);
}

function bufferToHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}
