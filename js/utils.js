const maxContactImageBytes = 5 * 1024 * 1024;
const allowedContactImageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const allowedContactImageExtensions = new Set(["jpg", "jpeg", "png", "webp"]);

export function getInitials(name) {
  const cleanName = name.trim();
  return cleanName.slice(0, 2).toUpperCase() || "U";
}

export function formatDate(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function escapeSelector(value) {
  return globalThis.CSS?.escape ? CSS.escape(String(value)) : String(value).replace(/["\\]/g, "\\$&");
}

export function decodeRouteImageKey(value) {
  try {
    return decodeURIComponent(value || "");
  } catch {
    return "";
  }
}

export function getSortedEntries(entries) {
  return entries.slice().sort((left, right) => {
    const likeDifference = right.likes - left.likes;

    if (likeDifference !== 0) {
      return likeDifference;
    }

    return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
  });
}

export function getLatestEntries(entries) {
  return entries.slice().sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime());
}

export function getFileExtension(fileName) {
  const normalizedName = typeof fileName === "string" ? fileName.trim().toLowerCase() : "";
  const dotIndex = normalizedName.lastIndexOf(".");

  return dotIndex >= 0 ? normalizedName.slice(dotIndex + 1) : "";
}

export function formatFileSize(bytes) {
  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  }

  return `${Math.max(1, Math.ceil(bytes / 1024))}KB`;
}

export function validateContactImage(file) {
  if (!file) {
    return "";
  }

  const extension = getFileExtension(file.name);

  if (!allowedContactImageExtensions.has(extension) || !allowedContactImageTypes.has(file.type)) {
    return "jpg, jpeg, png, webp 이미지 파일만 첨부할 수 있습니다.";
  }

  if (file.size > maxContactImageBytes) {
    return "이미지는 최대 5MB까지만 첨부할 수 있습니다.";
  }

  if (file.size <= 0) {
    return "비어 있는 이미지 파일은 첨부할 수 없습니다.";
  }

  return "";
}

export function getTextList(value) {
  return Array.isArray(value)
    ? value
        .map((item) => (typeof item === "string" ? item.trim() : ""))
        .filter(Boolean)
    : [];
}

export function getImagePrompt(image) {
  return image?.prompt || image?.description || "사진 속 장면에서 가장 눈에 띄는 단서를 골라 짧은 제목으로 바꿔보세요.";
}

export function niceAxisMax(maxValue, steps) {
  if (maxValue <= steps) {
    return steps;
  }
  const rawStep = maxValue / steps;
  const pow = Math.pow(10, Math.floor(Math.log10(rawStep)));
  const normalized = rawStep / pow;
  let niceStep;
  if (normalized <= 1) niceStep = 1;
  else if (normalized <= 2) niceStep = 2;
  else if (normalized <= 5) niceStep = 5;
  else niceStep = 10;
  return niceStep * pow * steps;
}

export function formatChartDay(iso) {
  const parts = String(iso).split("-");
  if (parts.length < 3) return iso;
  return `${Number(parts[1])}/${Number(parts[2])}`;
}

export function getReportTargetLabel(type) {
  return { photo: "사진", title: "제목", comment: "댓글" }[type] || "콘텐츠";
}

export function getReportReasonLabel(reason) {
  return {
    copyright: "저작권 침해",
    portrait: "초상권 침해",
    privacy: "개인정보 노출",
    sexual_violent: "음란/폭력적 내용",
    hate: "혐오/차별",
    abuse: "욕설/비방",
    other: "기타",
  }[reason] || reason;
}

export function getAdminContentStatusLabel(item) {
  const statuses = [];

  if (item.deletedAt) {
    statuses.push(`삭제됨${item.deletedReason ? `: ${item.deletedReason}` : ""}`);
  }

  if (item.hiddenAt) {
    statuses.push(`숨김${item.hiddenReason ? `: ${item.hiddenReason}` : ""}`);
  }

  if (item.excludedFromRanking) {
    statuses.push("랭킹 제외");
  }

  return statuses.join(" · ") || "공개";
}

export function getImageSourceLabel(type) {
  return { self: "직접 촬영", free_site: "무료 이미지 사이트", other: "기타" }[type] || type || "-";
}
