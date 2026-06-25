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

const abusiveTerms = [
  "시발",
  "씨발",
  "ㅅㅂ",
  "병신",
  "개새끼",
  "좆",
];

const urlPattern = /(https?:\/\/|www\.|[a-z0-9-]+\.(com|net|org|kr|io|xyz|shop|site)\b)/i;
const emailPattern = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i;
const phonePattern = /\b01[016789][-\s]?\d{3,4}[-\s]?\d{4}\b/;
const residentNumberPattern = /\b\d{6}[-\s]?\d{7}\b/;
const repeatedCharacterPattern = /([^\s])\1{7,}/u;

export function validatePublicText(value, label = "내용") {
  const text = String(value || "").trim();
  const normalized = text.toLowerCase().replace(/\s+/g, "");

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

  if (abusiveTerms.some((term) => normalized.includes(term))) {
    return { ok: false, message: `${label}에 공개하기 어려운 욕설 표현이 포함되어 있습니다.` };
  }

  return { ok: true, message: "" };
}

export function validateDisplayName(value) {
  const text = String(value || "").trim();

  if (!text) {
    return { ok: true, message: "" };
  }

  if (urlPattern.test(text) || emailPattern.test(text) || phonePattern.test(text)) {
    return { ok: false, message: "이름에는 링크나 연락처를 넣을 수 없습니다." };
  }

  if (blockedTerms.some((term) => text.toLowerCase().replace(/\s+/g, "").includes(term))) {
    return { ok: false, message: "이름에 광고 또는 정책 위반 가능성이 높은 표현이 포함되어 있습니다." };
  }

  return { ok: true, message: "" };
}
