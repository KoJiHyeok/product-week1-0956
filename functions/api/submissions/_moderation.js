import { looseTerms, strictTerms } from "./_profanity-words.js";

const blockedTerms = [
  "카지노",
  "바카라",
  "토토",
  "도박",
  "마약",
  "필로폰",
  "대출",
  "성인사이트",
  "야동",
  "포르노",
  "porn",
  "casino",
  "gambling",
  "loan",
];

const urlPattern = /(https?:\/\/|www\.|[a-z0-9-]+\.(com|net|org|kr|io|xyz|shop|site)\b)/i;
const emailPattern = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i;
const phonePattern = /\b01[016789][-\s]?\d{3,4}[-\s]?\d{4}\b/;
const residentNumberPattern = /\b\d{6}[-\s]?\d{7}\b/;
const repeatedCharacterPattern = /([^\s])\1{7,}/u;
const singleLatinLetterPattern = /^[a-z]$/i;
const hangulJamoOnlyPattern = /^[\u1100-\u11ff\u3130-\u318f\ua960-\ua97f\ud7b0-\ud7ff]+$/u;

// 한글 음절이 양옆에 붙어 있지 않을 때만 looseTerms를 매칭한다(오탐 방지).
const looseProfanityPattern = new RegExp(
  `(?<![가-힣])(${looseTerms.map(escapeRegExp).join("|")})(?![가-힣])`,
  "u"
);

// 우회 방어용 정규화: 소문자화 + 한글/한글자모/영문 외 문자(공백·숫자·특수문자·이모지) 제거.
// "시 1 발" / "씨@발" / "ㅅ.ㅂ" → "시발" / "씨발" / "ㅅㅂ" 로 압축해 한 번에 잡는다.
function normalizeForMatch(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z가-힣ㄱ-ㅎㅏ-ㅣ]/g, "");
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function containsProfanity(value) {
  const text = String(value || "");
  const normalized = normalizeForMatch(text);

  if (strictTerms.some((term) => normalized.includes(term))) {
    return true;
  }

  return looseProfanityPattern.test(text.toLowerCase());
}

// 제어문자(NUL 등)는 저장되면 서버렌더 HTML을 invalid하게 만든다. 입력 단계에서 지운다.
// 이미 저장된 옛 행은 렌더 시점에도 한 번 더 걸러진다(functions/gallery/[slug].js).
export function stripControlChars(value) {
  return String(value ?? "").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "");
}

export function validatePublicText(value, label = "내용") {
  const text = String(value || "").trim();
  const normalized = text.toLowerCase().replace(/\s+/g, "");
  const meaningfulCharacters = text.normalize("NFC").replace(/[^\p{L}\p{N}]/gu, "");

  if (
    singleLatinLetterPattern.test(meaningfulCharacters) ||
    hangulJamoOnlyPattern.test(meaningfulCharacters)
  ) {
    return { ok: false, message: `${label}은 의미 있는 단어나 문장으로 입력해 주세요.` };
  }

  if (urlPattern.test(text)) {
    return { ok: false, message: `${label}에는 외부 링크를 넣을 수 없습니다.` };
  }

  if (emailPattern.test(text) || phonePattern.test(text) || residentNumberPattern.test(text)) {
    return { ok: false, message: `${label}에 개인정보로 보이는 문구가 포함되어 있습니다.` };
  }

  if (repeatedCharacterPattern.test(text)) {
    return { ok: false, message: `${label}에 과도하게 반복된 문자가 포함되어 있습니다.` };
  }

  if (blockedTerms.some((term) => normalized.includes(term))) {
    return { ok: false, message: `${label}에 광고 또는 정책 위반 가능성이 높은 표현이 포함되어 있습니다.` };
  }

  if (containsProfanity(text)) {
    return { ok: false, message: `${label}에 공개하기 어려운 욕설 또는 음란 표현이 포함되어 있습니다.` };
  }

  return { ok: true, message: "" };
}

export function validateDisplayName(value, label = "이름") {
  const text = String(value || "").trim();

  if (!text) {
    return { ok: true, message: "" };
  }

  if (urlPattern.test(text) || emailPattern.test(text) || phonePattern.test(text)) {
    return { ok: false, message: `${label}에는 링크나 연락처를 넣을 수 없습니다.` };
  }

  if (blockedTerms.some((term) => text.toLowerCase().replace(/\s+/g, "").includes(term))) {
    return { ok: false, message: `${label}에 광고 또는 정책 위반 가능성이 높은 표현이 포함되어 있습니다.` };
  }

  if (containsProfanity(text)) {
    return { ok: false, message: `${label}에 사용할 수 없는 욕설 또는 음란 표현이 포함되어 있습니다.` };
  }

  return { ok: true, message: "" };
}
