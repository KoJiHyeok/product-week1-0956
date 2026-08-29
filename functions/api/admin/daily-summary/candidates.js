// 디스코드 일일 "갤러리 후보 이미지" 큐레이션.
// Openverse(CC 라이선스 이미지 검색 API, 무료·키 불필요)에서 웃긴 동물·표정 사진을
// 매일 6장 골라 기존 요약과 같은 디스코드 웹훅으로 별도 메시지로 보낸다. 사용자가
// 디스코드에서 "N번 승인"이라고 답하면 CLAUDE.md의 승인 워크플로대로 갤러리에 등록한다.
// 기록은 daily_image_candidates(migration 0023)에 남기며, 웹훅 발송은
// discord.js의 postDiscordWebhook을 재사용한다.

import { postDiscordWebhook } from "./discord.js";

const KST_OFFSET_MS = 9 * 60 * 60 * 1000;
const OPENVERSE_ENDPOINT = "https://api.openverse.org/v1/images/";
const OPENVERSE_USER_AGENT = "TitleAcademyBot/1.0 (jemokhakwon.com)";
const ALLOWED_LICENSES = new Set(["cc0", "pdm", "by"]);
const IMAGE_EXTENSION_RE = /\.(jpe?g|png|webp)(\?.*)?$/i;
const CANDIDATES_PER_DAY = 6;
const QUERIES_PER_DAY = 3;

// 짤 감성의 동물·표정 검색어 풀. 매일 결정적으로 3개를 골라 로테이션한다.
const QUERY_POOL = [
  "funny cat face",
  "surprised dog",
  "grumpy cat",
  "angry duck",
  "hamster cheeks",
  "goat standing on car",
  "dog head tilt",
  "seagull stealing food",
  "screaming marmot",
  "awkward penguin",
  "confused monkey",
  "raccoon caught",
  "dramatic squirrel",
  "cat in box",
  "sleepy owl",
  "derpy dog tongue",
  "chicken side eye",
  "llama funny face",
];

export async function buildDailyCandidates(env, scheduledTime = Date.now()) {
  const candidateDate = kstDateString(scheduledTime);
  const queries = pickQueriesForDate(candidateDate);

  const groups = [];
  for (const query of queries) {
    let results = [];
    try {
      results = await fetchOpenverseResults(query);
    } catch (error) {
      console.error(`openverse fetch failed for query "${query}"`, error?.message || error);
    }
    groups.push({ query, candidates: toCandidates(results, query) });
  }

  dedupeAcrossGroups(groups);
  await excludeExisting(env, groups);

  const selected = pickEvenly(groups, CANDIDATES_PER_DAY).map((candidate, index) => ({
    ...candidate,
    slot: index + 1,
  }));

  return {
    candidateDate,
    candidates: selected,
    discordPayload: buildDiscordPayload(candidateDate, selected),
  };
}

export async function sendDailyCandidates({ env, scheduledTime = Date.now(), dryRun = false, force = false } = {}) {
  const built = await buildDailyCandidates(env, scheduledTime);

  if (dryRun) {
    return { sent: false, dryRun: true, ...built };
  }

  const existingCount = await countExistingForDate(env, built.candidateDate);
  if (existingCount > 0 && !force) {
    return { sent: false, skipped: true, reason: "already_sent", ...built };
  }

  await postDiscordWebhook(env, built.discordPayload);
  await insertCandidates(env, built.candidateDate, built.candidates);

  return { sent: true, skipped: false, ...built };
}

function kstDateString(ms) {
  return new Date(ms + KST_OFFSET_MS).toISOString().slice(0, 10);
}

function pickQueriesForDate(candidateDate) {
  const start = dayIndex(candidateDate);
  const queries = [];
  for (let i = 0; i < QUERIES_PER_DAY; i++) {
    queries.push(QUERY_POOL[(start + i) % QUERY_POOL.length]);
  }
  return queries;
}

function dayIndex(candidateDate) {
  let hash = 0;
  for (let i = 0; i < candidateDate.length; i++) {
    hash = (hash * 31 + candidateDate.charCodeAt(i)) >>> 0;
  }
  return hash % QUERY_POOL.length;
}

async function fetchOpenverseResults(query) {
  const url = `${OPENVERSE_ENDPOINT}?q=${encodeURIComponent(query)}&license=cc0,pdm,by&page_size=20&mature=false`;
  const response = await fetch(url, {
    headers: { "User-Agent": OPENVERSE_USER_AGENT },
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`Openverse API error ${response.status}${body ? `: ${body.slice(0, 300)}` : ""}`);
  }

  const data = await response.json();
  return Array.isArray(data?.results) ? data.results : [];
}

function toCandidates(results, query) {
  const candidates = [];
  for (const result of results) {
    const candidate = toCandidate(result, query);
    if (candidate) candidates.push(candidate);
  }
  return candidates;
}

function toCandidate(result, query) {
  if (!result || typeof result !== "object") return null;

  const openverseId = typeof result.id === "string" ? result.id : "";
  const imageUrl = typeof result.url === "string" ? result.url : "";
  if (!openverseId || !/^https?:\/\//i.test(imageUrl)) return null;

  const mimetype = typeof result.mimetype === "string" ? result.mimetype.toLowerCase() : "";
  const looksLikeImage = IMAGE_EXTENSION_RE.test(imageUrl) || mimetype.startsWith("image/");
  if (!looksLikeImage) return null;

  const license = typeof result.license === "string" ? result.license.toLowerCase() : "";
  if (!ALLOWED_LICENSES.has(license)) return null;

  if (result.width != null && Number(result.width) < 400) return null;
  if (result.height != null && Number(result.height) < 400) return null;

  return {
    openverseId,
    imageUrl,
    landingUrl: typeof result.foreign_landing_url === "string" ? result.foreign_landing_url : "",
    license,
    creator: typeof result.creator === "string" ? result.creator : "",
    title: typeof result.title === "string" ? result.title : "",
    query,
  };
}

// 검색어가 겹쳐 같은 이미지가 여러 그룹에 들어오는 경우를 제거한다(먼저 나온 그룹이 우선).
// Openverse에는 같은 사진이 소스만 달리(Flickr/Wikimedia 등) 별도 id로 중복 등록된 경우가
// 흔해서, id 외에 제목+작가 조합으로도 같은 사진을 걸러낸다.
function dedupeAcrossGroups(groups) {
  const seenIds = new Set();
  const seenTitleCreator = new Set();
  for (const group of groups) {
    group.candidates = group.candidates.filter((candidate) => {
      if (seenIds.has(candidate.openverseId)) return false;

      const title = candidate.title.trim().toLowerCase();
      const creator = candidate.creator.trim().toLowerCase();
      const titleKey = title ? `${title}|${creator}` : "";
      if (titleKey && seenTitleCreator.has(titleKey)) return false;

      seenIds.add(candidate.openverseId);
      if (titleKey) seenTitleCreator.add(titleKey);
      return true;
    });
  }
}

async function excludeExisting(env, groups) {
  const db = env?.DB;
  const allIds = groups.flatMap((group) => group.candidates.map((candidate) => candidate.openverseId));
  if (!db || allIds.length === 0) return;

  const placeholders = allIds.map(() => "?").join(", ");
  const { results } = await db
    .prepare(`SELECT openverse_id FROM daily_image_candidates WHERE openverse_id IN (${placeholders})`)
    .bind(...allIds)
    .all();
  const existing = new Set((results || []).map((row) => row.openverse_id));
  if (existing.size === 0) return;

  for (const group of groups) {
    group.candidates = group.candidates.filter((candidate) => !existing.has(candidate.openverseId));
  }
}

// 검색어별로 고르게(라운드 로빈) 섞어 limit장까지 선정한다.
function pickEvenly(groups, limit) {
  const queues = groups.map((group) => [...group.candidates]);
  const picked = [];

  while (picked.length < limit) {
    let addedAny = false;
    for (const queue of queues) {
      if (picked.length >= limit) break;
      if (queue.length === 0) continue;
      picked.push(queue.shift());
      addedAny = true;
    }
    if (!addedAny) break;
  }

  return picked;
}

function buildDiscordPayload(candidateDate, candidates) {
  const embeds = candidates.map((candidate) => {
    const embed = {
      title: `${candidate.slot}번 · ${candidate.title || candidate.query}`,
      image: { url: candidate.imageUrl },
      description: `라이선스 ${candidate.license.toUpperCase()} · 작가 ${candidate.creator || "미상"} · 검색어 ${candidate.query}`,
    };
    if (candidate.landingUrl) embed.url = candidate.landingUrl;
    return embed;
  });

  return {
    content: [
      `🖼️ **제목 학원 오늘의 갤러리 후보** · ${candidateDate}`,
      `마음에 드는 번호로 "N번 승인"이라고 답하면 갤러리에 등록됩니다. (CC0/PD는 표기 불필요, BY는 저작자 표기 필요)`,
    ].join("\n"),
    embeds,
  };
}

async function countExistingForDate(env, candidateDate) {
  const db = env?.DB;
  if (!db) return 0;

  const row = await db
    .prepare(`SELECT COUNT(*) AS cnt FROM daily_image_candidates WHERE candidate_date = ?`)
    .bind(candidateDate)
    .first();
  return Number(row?.cnt) || 0;
}

async function insertCandidates(env, candidateDate, candidates) {
  const db = env?.DB;
  if (!db) {
    throw new Error("D1 DB binding is not configured");
  }

  for (const candidate of candidates) {
    await db
      .prepare(
        `INSERT OR IGNORE INTO daily_image_candidates
           (candidate_date, slot, openverse_id, image_url, landing_url, license, creator, title, query)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        candidateDate,
        candidate.slot,
        candidate.openverseId,
        candidate.imageUrl,
        candidate.landingUrl,
        candidate.license,
        candidate.creator,
        candidate.title,
        candidate.query
      )
      .run();
  }
}
