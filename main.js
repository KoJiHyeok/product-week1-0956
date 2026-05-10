const homeLink = document.querySelector("#homeLink");
const contactLink = document.querySelector("#contactLink");
const uploadNavButton = document.querySelector("#uploadNavButton");
const adminNavButton = document.querySelector("#adminNavButton");
const homeView = document.querySelector("#homeView");
const uploadView = document.querySelector("#uploadView");
const titleView = document.querySelector("#titleView");
const guestView = document.querySelector("#guestView");
const rankingView = document.querySelector("#rankingView");
const contactView = document.querySelector("#contactView");
const profileView = document.querySelector("#profileView");
const adminView = document.querySelector("#adminView");
const galleryGrid = document.querySelector("#galleryGrid");
const selectedPhoto = document.querySelector("#selectedPhoto");
const rankingPhoto = document.querySelector("#rankingPhoto");
const titleForm = document.querySelector("#titleForm");
const titleInput = document.querySelector("#titleInput");
const guestForm = document.querySelector("#guestForm");
const guestNameInput = document.querySelector("#guestNameInput");
const rankingList = document.querySelector("#rankingList");
const rankingTabs = document.querySelectorAll(".ranking-tab");
const galleryMoreButton = document.querySelector("#galleryMoreButton");
const backToGalleryButton = document.querySelector("#backToGalleryButton");
const rankingSelfLink = document.querySelector("#rankingSelfLink");
const authActions = document.querySelector("#authActions");
const guestChip = document.querySelector("#guestChip");
const loginButton = document.querySelector("#loginButton");
const signupButton = document.querySelector("#signupButton");
const memberActions = document.querySelector("#memberActions");
const notificationButton = document.querySelector("#notificationButton");
const notificationUnread = document.querySelector("#notificationUnread");
const notificationPanel = document.querySelector("#notificationPanel");
const notificationCloseButton = document.querySelector("#notificationCloseButton");
const messageList = document.querySelector("#messageList");
const messageDetail = document.querySelector("#messageDetail");
const userChip = document.querySelector("#userChip");
const userName = document.querySelector("#userName");
const profilePhoto = document.querySelector("#profilePhoto");
const pageDim = document.querySelector("#pageDim");
const profileDrawer = document.querySelector("#profileDrawer");
const drawerEdgeClose = document.querySelector("#drawerEdgeClose");
const drawerTitle = document.querySelector("#drawerTitle");
const guestDrawerCopy = document.querySelector("#guestDrawerCopy");
const drawerStats = document.querySelector("#drawerStats");
const logoutButton = document.querySelector("#logoutButton");
const drawerName = document.querySelector("#drawerName");
const drawerPhoto = document.querySelector("#drawerPhoto");
const avatarEditButton = document.querySelector("#avatarEditButton");
const avatarInput = document.querySelector("#avatarInput");
const profileEditButton = document.querySelector("#profileEditButton");
const myTitlesButton = document.querySelector("#myTitlesButton");
const myCommentsButton = document.querySelector("#myCommentsButton");
const guestLoginButton = document.querySelector("#guestLoginButton");
const guestSignupButton = document.querySelector("#guestSignupButton");
const themeToggleButton = document.querySelector("#themeToggleButton");
const cookieSettingsButton = document.querySelector("#cookieSettingsButton");
const drawerContactButton = document.querySelector("#drawerContactButton");
const drawerMenuView = document.querySelector("#drawerMenuView");
const myTitlesView = document.querySelector("#myTitlesView");
const myCommentsView = document.querySelector("#myCommentsView");
const drawerBackButton = document.querySelector("#drawerBackButton");
const commentsBackButton = document.querySelector("#commentsBackButton");
const myTitleList = document.querySelector("#myTitleList");
const myCommentList = document.querySelector("#myCommentList");
const profileEditForm = document.querySelector("#profileEditForm");
const profileEditPhotoButton = document.querySelector("#profileEditPhotoButton");
const profileEditPhoto = document.querySelector("#profileEditPhoto");
const profileNameInput = document.querySelector("#profileNameInput");
const profileBioInput = document.querySelector("#profileBioInput");
const profilePublicInput = document.querySelector("#profilePublicInput");
const profilePublicHint = document.querySelector("#profilePublicHint");
const profileEditMessage = document.querySelector("#profileEditMessage");
const profileSaveButton = document.querySelector("#profileSaveButton");
const passwordChangeButton = document.querySelector("#passwordChangeButton");
const accountDeleteButton = document.querySelector("#accountDeleteButton");
const deleteAccountModal = document.querySelector("#deleteAccountModal");
const deleteCancelButton = document.querySelector("#deleteCancelButton");
const deleteConfirmButton = document.querySelector("#deleteConfirmButton");
const passwordChangeModal = document.querySelector("#passwordChangeModal");
const passwordChangeForm = document.querySelector("#passwordChangeForm");
const currentPasswordInput = document.querySelector("#currentPasswordInput");
const newPasswordInput = document.querySelector("#newPasswordInput");
const newPasswordConfirmInput = document.querySelector("#newPasswordConfirmInput");
const passwordChangeMessage = document.querySelector("#passwordChangeMessage");
const passwordCancelButton = document.querySelector("#passwordCancelButton");
const authModal = document.querySelector("#authModal");
const authTitle = document.querySelector("#authTitle");
const modalClose = document.querySelector("#modalClose");
const loginTabButton = document.querySelector("#loginTabButton");
const signupTabButton = document.querySelector("#signupTabButton");
const loginForm = document.querySelector("#loginForm");
const signupForm = document.querySelector("#signupForm");
const loginIdInput = document.querySelector("#loginIdInput");
const loginPasswordInput = document.querySelector("#loginPasswordInput");
const signupLoginIdInput = document.querySelector("#signupLoginIdInput");
const signupEmailInput = document.querySelector("#signupEmailInput");
const signupUsernameInput = document.querySelector("#signupUsernameInput");
const signupPasswordInput = document.querySelector("#signupPasswordInput");
const signupPasswordConfirmInput = document.querySelector("#signupPasswordConfirmInput");
const privacyAgreeInput = document.querySelector("#privacyAgreeInput");
const termsAgreeInput = document.querySelector("#termsAgreeInput");
const passwordResetLink = document.querySelector("#passwordResetLink");
const loginGoogleButton = document.querySelector("#loginGoogleButton");
const signupGoogleButton = document.querySelector("#signupGoogleButton");
const loginMessage = document.querySelector("#loginMessage");
const signupMessage = document.querySelector("#signupMessage");
const contactForm = document.querySelector("#contactForm");
const contactTypeInput = document.querySelector("#contactTypeInput");
const contactTitleInput = document.querySelector("#contactTitleInput");
const contactReplyEmailInput = document.querySelector("#contactReplyEmailInput");
const contactBodyInput = document.querySelector("#contactBodyInput");
const contactMessage = document.querySelector("#contactMessage");
const contactSubmitButton = document.querySelector("#contactSubmitButton");
const imageSuggestionButton = document.querySelector("#imageSuggestionButton");
const imageUploadMessage = document.querySelector("#imageUploadMessage");
const uploadCancelButton = document.querySelector("#uploadCancelButton");
const adminPendingTab = document.querySelector("#adminPendingTab");
const adminReportedTab = document.querySelector("#adminReportedTab");
const adminImageMessage = document.querySelector("#adminImageMessage");
const adminImageList = document.querySelector("#adminImageList");
const imageReportModal = document.querySelector("#imageReportModal");
const imageReportTitle = document.querySelector("#imageReportTitle");
const imageReportForm = document.querySelector("#imageReportForm");
const imageReportCloseButton = document.querySelector("#imageReportCloseButton");
const imageReportCancelButton = document.querySelector("#imageReportCancelButton");
const imageReportReasonInput = document.querySelector("#imageReportReasonInput");
const imageReportDetailInput = document.querySelector("#imageReportDetailInput");
const imageReportMessage = document.querySelector("#imageReportMessage");
const imageReportSubmitButton = document.querySelector("#imageReportSubmitButton");
const userInfoPopover = document.querySelector("#userInfoPopover");
const messageComposeModal = document.querySelector("#messageComposeModal");
const messageComposeTitle = document.querySelector("#messageComposeTitle");
const messageComposeForm = document.querySelector("#messageComposeForm");
const messageComposeCloseButton = document.querySelector("#messageComposeCloseButton");
const messageComposeCancelButton = document.querySelector("#messageComposeCancelButton");
const messageRecipient = document.querySelector("#messageRecipient");
const messageBodyInput = document.querySelector("#messageBodyInput");
const messageComposeMessage = document.querySelector("#messageComposeMessage");
const messageSendButton = document.querySelector("#messageSendButton");
const consentBanner = document.querySelector("#consentBanner");
const consentAcceptButton = document.querySelector("#consentAcceptButton");
const consentRejectButton = document.querySelector("#consentRejectButton");
const cookieSettingsModal = document.querySelector("#cookieSettingsModal");
const cookieSettingsForm = document.querySelector("#cookieSettingsForm");
const cookieSettingsCloseButton = document.querySelector("#cookieSettingsCloseButton");
const cookieSettingsCancelButton = document.querySelector("#cookieSettingsCancelButton");
const analyticsCookieInput = document.querySelector("#analyticsCookieInput");
const adsCookieInput = document.querySelector("#adsCookieInput");
const cookieSettingsMessage = document.querySelector("#cookieSettingsMessage");
const toast = document.querySelector("#toast");

const analyticsMeasurementId = "G-V7K1RJ7C62";
const clarityProjectId = "wme6uejz4h";
const adsenseClientId = "ca-pub-2571483149742375";
const trackingConsentStorageKey = "title-academy-tracking-consent";
const cookieSettingsStorageKey = "title-academy-cookie-settings";
const themeStorageKey = "title-academy-theme";
const legacyUserStorageKey = "title-making-google-user";
const guestStorageKey = "title-academy-guest-name";
const submissionsStorageKey = "title-academy-submissions";
const photoSourcePresets = Object.freeze({
  unknown: Object.freeze({
    sourceName: "Unknown",
    sourceUrl: "",
    author: "",
    license: "Unknown",
    attributionRequired: true,
    commercialUseAllowed: false,
    modificationAllowed: false,
  }),
});
// 관리자가 승인한 정적 이미지는 assets/gallery에 파일을 넣고 아래 목록에 추가하면 공개됩니다.
// 예: { src: "assets/gallery/example.webp", title: "이미지 제목", description: "이미지 설명" }
const defaultGalleryImages = [
  {
    id: "photo-001",
    src: "assets/gallery/01-cat-smoke.png",
    webpSrc: "assets/gallery/webp/01-cat-smoke.webp",
    title: "Cat reaching through smoke",
    description: "Cat reaching through smoke",
    alt: "Cat reaching through smoke",
    ...photoSourcePresets.unknown,
  },
  {
    id: "photo-002",
    src: "assets/gallery/02-memorial.png",
    webpSrc: "assets/gallery/webp/02-memorial.webp",
    title: "People placing flowers outside a store",
    description: "People placing flowers outside a store",
    alt: "People placing flowers outside a store",
    ...photoSourcePresets.unknown,
  },
  {
    id: "photo-003",
    src: "assets/gallery/03-alligators.jpeg",
    webpSrc: "assets/gallery/webp/03-alligators.webp",
    title: "Alligators resting together",
    description: "Alligators resting together",
    alt: "Alligators resting together",
    ...photoSourcePresets.unknown,
  },
  {
    id: "photo-004",
    src: "assets/gallery/04-field-portrait.jpg",
    webpSrc: "assets/gallery/webp/04-field-portrait.webp",
    title: "Person walking in a field",
    description: "Person walking in a field",
    alt: "Person walking in a field",
    ...photoSourcePresets.unknown,
  },
  {
    id: "photo-005",
    src: "assets/gallery/05-screaming-man.png",
    webpSrc: "assets/gallery/webp/05-screaming-man.webp",
    title: "Man shouting in a suit",
    description: "Man shouting in a suit",
    alt: "Man shouting in a suit",
    ...photoSourcePresets.unknown,
  },
  {
    id: "photo-006",
    src: "assets/gallery/06-husky-bowl.jpg",
    webpSrc: "assets/gallery/webp/06-husky-bowl.webp",
    title: "Husky staring at a food bowl",
    description: "Husky staring at a food bowl",
    alt: "Husky staring at a food bowl",
    ...photoSourcePresets.unknown,
  },
  {
    id: "photo-007",
    src: "assets/gallery/07-puppy-oh-hi.jpg",
    webpSrc: "assets/gallery/webp/07-puppy-oh-hi.webp",
    title: "Smiling puppy close to the camera",
    description: "Smiling puppy close to the camera",
    alt: "Smiling puppy close to the camera",
    ...photoSourcePresets.unknown,
  },
  {
    id: "photo-008",
    src: "assets/gallery/08-convenience-store.jpg",
    webpSrc: "assets/gallery/webp/08-convenience-store.webp",
    title: "Person reaching into a convenience store cooler",
    description: "Person reaching into a convenience store cooler",
    alt: "Person reaching into a convenience store cooler",
    ...photoSourcePresets.unknown,
  },
  {
    id: "photo-009",
    src: "assets/gallery/09-reggae-singer.jpg",
    webpSrc: "assets/gallery/webp/09-reggae-singer.webp",
    title: "Reggae singer performing on stage",
    description: "Reggae singer performing on stage",
    alt: "Reggae singer performing on stage",
    ...photoSourcePresets.unknown,
  },
  {
    id: "photo-010",
    src: "assets/gallery/10-sparkler.jpg",
    webpSrc: "assets/gallery/webp/10-sparkler.webp",
    title: "Person holding a lit sparkler",
    description: "Person holding a lit sparkler",
    alt: "Person holding a lit sparkler",
    ...photoSourcePresets.unknown,
  },
];
const authModeButtons = [loginTabButton, signupTabButton];
const maxAvatarBytes = 5 * 1024 * 1024;
const galleryInitialCount = defaultGalleryImages.length;
const galleryPageSize = 0;

localStorage.removeItem(legacyUserStorageKey);

let currentUser = null;
let galleryImages = defaultGalleryImages.map((image, index) => ({ ...image, imageKey: String(index), isUserUpload: false }));
let currentGuestName = sessionStorage.getItem(guestStorageKey) || "";
let selectedImageIndex = null;
let pendingTitle = "";
let activeReportImage = null;
let activeReportTarget = null;
let activeAdminStatus = "pending";
let activeRankingTab = "popular";
let activeTheme = "dark";
let toastTimer;
let serverSubmissionsByImage = {};
const expandedCommentIds = new Set();
let pendingRankingFocus = null;
let activeUserProfile = null;
let activeMessageRecipient = null;
let visibleGalleryCount = Math.min(galleryInitialCount, galleryImages.length);
let analyticsScriptsLoaded = false;
let adsScriptsLoaded = false;

function createId(prefix) {
  if (globalThis.crypto?.randomUUID) {
    return `${prefix}-${globalThis.crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function initializeTheme() {
  const storedTheme = localStorage.getItem(themeStorageKey);
  activeTheme = storedTheme === "light" || storedTheme === "dark" ? storedTheme : "dark";
  document.documentElement.dataset.theme = activeTheme;
  updateThemeToggle();
}

function setTheme(theme) {
  activeTheme = theme === "light" ? "light" : "dark";
  localStorage.setItem(themeStorageKey, activeTheme);
  document.documentElement.dataset.theme = activeTheme;
  updateThemeToggle();
}

function updateThemeToggle() {
  if (!themeToggleButton) {
    return;
  }

  const isLight = activeTheme === "light";
  themeToggleButton.textContent = isLight ? "다크 모드로 전환" : "라이트 모드로 전환";
  themeToggleButton.setAttribute("aria-pressed", String(isLight));
}

function getCookieSettings() {
  try {
    const parsed = JSON.parse(localStorage.getItem(cookieSettingsStorageKey) || "{}");
    return {
      necessary: true,
      analytics: Boolean(parsed.analytics),
      ads: Boolean(parsed.ads),
      saved: Boolean(parsed.saved),
    };
  } catch {
    return { necessary: true, analytics: false, ads: false, saved: false };
  }
}

function initializeTrackingConsent() {
  const settings = getCookieSettings();
  const legacyConsent = localStorage.getItem(trackingConsentStorageKey);

  if (!settings.saved && legacyConsent === "accepted") {
    saveCookieSettings({ analytics: true, ads: true });
    return;
  }

  if (!settings.saved && legacyConsent === "rejected") {
    saveCookieSettings({ analytics: false, ads: false });
    return;
  }

  consentBanner.hidden = settings.saved;

  if (settings.analytics || settings.ads) {
    loadTrackingScripts(settings);
  }
}

function saveTrackingConsent(consent) {
  saveCookieSettings({
    analytics: consent === "accepted",
    ads: consent === "accepted",
  });
}

function saveCookieSettings(settings) {
  const next = {
    necessary: true,
    analytics: Boolean(settings.analytics),
    ads: Boolean(settings.ads),
    saved: true,
  };
  localStorage.setItem(cookieSettingsStorageKey, JSON.stringify(next));
  localStorage.setItem(trackingConsentStorageKey, next.analytics || next.ads ? "accepted" : "rejected");
  consentBanner.hidden = true;

  if (next.analytics || next.ads) {
    loadTrackingScripts(next);
  }
}

function openCookieSettings() {
  const settings = getCookieSettings();
  analyticsCookieInput.checked = settings.analytics;
  adsCookieInput.checked = settings.ads;
  cookieSettingsMessage.textContent = "";
  cookieSettingsMessage.classList.remove("is-success");
  cookieSettingsModal.hidden = false;
  analyticsCookieInput.focus();
}

function closeCookieSettings() {
  cookieSettingsModal.hidden = true;
}

function trapFocus(event, container, extraElements = []) {
  if (event.key !== "Tab" || !container || container.hidden || container.getAttribute("aria-hidden") === "true") {
    return false;
  }

  const focusable = Array.from(
    container.querySelectorAll(
      'a[href], button:not([disabled]):not([hidden]), input:not([disabled]):not([hidden]), select:not([disabled]):not([hidden]), textarea:not([disabled]):not([hidden]), [tabindex]:not([tabindex="-1"])'
    )
  ).filter((element) => element.getClientRects().length > 0);
  const extraFocusable = extraElements.filter((element) => element && !element.hidden && element.getClientRects().length > 0);
  focusable.push(...extraFocusable);

  if (focusable.length === 0) {
    return false;
  }

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
    return true;
  }

  if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
    return true;
  }

  return false;
}

function loadTrackingScripts(settings = getCookieSettings()) {
  if (settings.analytics && !analyticsScriptsLoaded) {
    analyticsScriptsLoaded = true;
    loadGoogleAnalytics();
    loadMicrosoftClarity();
  }

  if (settings.ads && !adsScriptsLoaded) {
    adsScriptsLoaded = true;
    loadAdsense();
  }
}

function loadGoogleAnalytics() {
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", analyticsMeasurementId);
  loadScript(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(analyticsMeasurementId)}`);
}

function loadMicrosoftClarity() {
  (function initClarity(c, l, a, r, i, t, y) {
    c[a] =
      c[a] ||
      function clarity() {
        (c[a].q = c[a].q || []).push(arguments);
      };
    t = l.createElement(r);
    t.async = true;
    t.src = `https://www.clarity.ms/tag/${i}`;
    y = l.getElementsByTagName(r)[0];
    y.parentNode.insertBefore(t, y);
  })(window, document, "clarity", "script", clarityProjectId);
}

function loadAdsense() {
  loadScript(`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(adsenseClientId)}`, {
    crossOrigin: "anonymous",
  });
}

function loadScript(src, options = {}) {
  if (document.querySelector(`script[src="${src}"]`)) {
    return;
  }

  const script = document.createElement("script");
  script.async = true;
  script.src = src;

  if (options.crossOrigin) {
    script.crossOrigin = options.crossOrigin;
  }

  document.head.append(script);
}

function getUserDisplayName() {
  return currentUser?.username || "";
}

function setCurrentUser(user) {
  currentUser = user || null;
  renderUser();
  closeUserPopover();
  closeNotificationPanel();

  if (!profileView.hidden) {
    hydrateProfileForm();
  }

  if (currentUser) {
    refreshUnreadCount();
    if (contactReplyEmailInput && currentUser.email && !contactReplyEmailInput.value.trim()) {
      contactReplyEmailInput.value = currentUser.email;
    }
  } else {
    renderUnreadCount(0);
  }
}

function isCurrentAdmin() {
  return currentUser?.role === "admin";
}

async function requestAuth(path, options = {}) {
  const response = await fetch(path, {
    credentials: "include",
    headers: {
      "content-type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "요청 처리 중 오류가 발생했습니다.");
  }

  return data;
}

async function requestJson(path, options = {}) {
  const response = await fetch(path, {
    credentials: "include",
    headers: {
      "content-type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "요청 처리 중 오류가 발생했습니다.");
  }

  return data;
}

async function restoreSession() {
  try {
    const data = await requestAuth("/api/auth/me", { method: "GET", headers: {} });
    setCurrentUser(data.authenticated ? data.user : null);
  } catch {
    setCurrentUser(null);
  }
}

async function loadGalleryImages() {
  try {
    const data = await requestJson("/api/images", { method: "GET", headers: {} });
    const images = Array.isArray(data.images) ? data.images : [];

    if (images.length > 0) {
      galleryImages = images.map((image, index) => ({
        ...image,
        imageKey: image.imageKey || String(index),
        isUserUpload: Boolean(image.isUserUpload),
      }));
      visibleGalleryCount = galleryImages.length;
      renderGallery();
    }
  } catch {
    galleryImages = defaultGalleryImages.map((image, index) => ({ ...image, imageKey: String(index), isUserUpload: false }));
    visibleGalleryCount = galleryImages.length;
    renderGallery();
  }
}

async function login(loginId, password) {
  const data = await requestAuth("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ loginId, password }),
  });

  setCurrentUser(data.user);
  closeAuthModal();
  showToast(`${getUserDisplayName()}님으로 로그인됨`);
}

async function signup(loginId, email, username, password, passwordConfirm) {
  const data = await requestAuth("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ loginId, email, username, password, passwordConfirm }),
  });

  setCurrentUser(data.user);
  closeAuthModal();
  showToast(data.emailVerificationSent ? "가입 완료. 인증 메일을 확인해주세요." : "가입 완료. 인증 메일 설정이 필요합니다.");
}

async function logout() {
  try {
    await requestAuth("/api/auth/logout", { method: "POST", body: "{}" });
  } catch {
    showToast("로그아웃 처리 중 오류가 발생했습니다.");
  } finally {
    setCurrentUser(null);
    closeDrawer();
  }
}

function normalizeSubmissions(submissions) {
  let changed = false;

  Object.entries(submissions).forEach(([imageKey, entries]) => {
    if (!Array.isArray(entries)) {
      delete submissions[imageKey];
      changed = true;
      return;
    }

    submissions[imageKey] = entries.map((entry, index) => {
      const comments = Array.isArray(entry.comments)
        ? entry.comments.map((comment, commentIndex) => ({
            id: typeof comment.id === "string" ? comment.id : `legacy-comment-${imageKey}-${index}-${commentIndex}`,
            authorUserId: typeof comment.authorUserId === "string" ? comment.authorUserId : "",
            author: typeof comment.author === "string" && comment.author.trim() ? comment.author.trim() : "비회원",
            authorIsProfilePublic: comment.authorIsProfilePublic !== false,
            authorProfileImageUrl: typeof comment.authorProfileImageUrl === "string" ? comment.authorProfileImageUrl : "",
            text: typeof comment.text === "string" ? comment.text : "",
            createdAt: typeof comment.createdAt === "string" ? comment.createdAt : new Date().toISOString(),
          }))
        : [];

      const normalized = {
        id: typeof entry.id === "string" ? entry.id : `legacy-title-${imageKey}-${index}`,
        authorUserId: typeof entry.authorUserId === "string" ? entry.authorUserId : "",
        author: typeof entry.author === "string" && entry.author.trim() ? entry.author.trim() : "비회원",
        authorIsProfilePublic: entry.authorIsProfilePublic !== false,
        authorProfileImageUrl: typeof entry.authorProfileImageUrl === "string" ? entry.authorProfileImageUrl : "",
        title: typeof entry.title === "string" ? entry.title : "",
        createdAt: typeof entry.createdAt === "string" ? entry.createdAt : new Date().toISOString(),
        likes: Number.isFinite(entry.likes) ? entry.likes : 0,
        comments,
      };

      if (
        normalized.id !== entry.id ||
        normalized.likes !== entry.likes ||
        normalized.comments !== entry.comments
      ) {
        changed = true;
      }

      return normalized;
    });
  });

  return changed;
}

function loadSubmissions() {
  try {
    const submissions = JSON.parse(localStorage.getItem(submissionsStorageKey));
    const safeSubmissions = submissions && typeof submissions === "object" ? submissions : {};

    if (normalizeSubmissions(safeSubmissions)) {
      saveSubmissions(safeSubmissions);
    }

    return safeSubmissions;
  } catch {
    return {};
  }
}

function saveSubmissions(submissions) {
  localStorage.setItem(submissionsStorageKey, JSON.stringify(submissions));
}

function getInitials(name) {
  const cleanName = name.trim();
  return cleanName.slice(0, 2).toUpperCase() || "U";
}

function formatDate(value) {
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

function escapeSelector(value) {
  return globalThis.CSS?.escape ? CSS.escape(String(value)) : String(value).replace(/["\\]/g, "\\$&");
}

function getSelectedImage() {
  return galleryImages[selectedImageIndex];
}

function getImageKey(image, index = selectedImageIndex) {
  return image?.imageKey || String(index);
}

function getSelectedImageKey() {
  return getImageKey(getSelectedImage(), selectedImageIndex);
}

function findImageIndexByKey(imageKey) {
  return galleryImages.findIndex((image, index) => getImageKey(image, index) === imageKey);
}

function getActiveAuthor() {
  return getUserDisplayName() || currentGuestName || "비회원";
}

function isServerEntry(entry) {
  return /^\d+$/.test(String(entry?.id || ""));
}

function canDeleteLocalAuthor(author) {
  return Boolean(currentUser && author === getUserDisplayName());
}

function getSortedEntries(entries) {
  return entries.slice().sort((left, right) => {
    const likeDifference = right.likes - left.likes;

    if (likeDifference !== 0) {
      return likeDifference;
    }

    return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
  });
}

function getLatestEntries(entries) {
  return entries.slice().sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime());
}

function isMyEntry(entry) {
  return Boolean(entry?.canDelete || canDeleteLocalAuthor(entry?.author));
}

function routeToHash(state) {
  if (state.view === "upload") {
    return "#upload";
  }

  if (state.view === "title") {
    return `#title/${state.imageIndex}`;
  }

  if (state.view === "guest") {
    return `#guest/${state.imageIndex}`;
  }

  if (state.view === "ranking") {
    return `#ranking/${state.imageIndex}`;
  }

  if (state.view === "contact") {
    return "#contact";
  }

  if (state.view === "profile") {
    return "#profile";
  }

  if (state.view === "admin") {
    return "#admin";
  }

  return "#home";
}

function parseRouteFromHash(hash) {
  const cleanHash = hash.replace(/^#/, "");

  if (!cleanHash || cleanHash === "home") {
    return { view: "home" };
  }

  if (cleanHash === "contact") {
    return { view: "contact" };
  }

  if (cleanHash === "profile") {
    return { view: "profile" };
  }

  if (cleanHash === "upload") {
    return { view: "upload" };
  }

  if (cleanHash === "admin") {
    return { view: "admin" };
  }

  const [view, rawIndex] = cleanHash.split("/");
  const imageIndex = Number(rawIndex);

  if (!["title", "guest", "ranking"].includes(view) || !Number.isInteger(imageIndex)) {
    return null;
  }

  return { view, imageIndex };
}

function getValidRoute(state) {
  if (!state || typeof state !== "object") {
    return null;
  }

  if (state.view === "home") {
    return { view: "home" };
  }

  if (state.view === "contact") {
    return { view: "contact" };
  }

  if (state.view === "profile") {
    return { view: "profile" };
  }

  if (state.view === "upload") {
    return { view: "upload" };
  }

  if (state.view === "admin") {
    return { view: "admin" };
  }

  if (!["title", "guest", "ranking"].includes(state.view) || !Number.isInteger(state.imageIndex)) {
    return null;
  }

  const image = galleryImages[state.imageIndex];

  if (!image) {
    return null;
  }

  if (state.view === "guest" && !pendingTitle) {
    return null;
  }

  return {
    view: state.view,
    imageIndex: state.imageIndex,
  };
}

function showView(viewToShow) {
  [homeView, uploadView, titleView, guestView, rankingView, contactView, profileView, adminView].forEach((view) => {
    view.hidden = view !== viewToShow;
  });
  window.scrollTo({ top: 0, behavior: "auto" });
}

function applyRoute(state) {
  const route = getValidRoute(state);

  if (!route) {
    history.replaceState({ view: "home" }, "", routeToHash({ view: "home" }));
    applyRoute({ view: "home" });
    return;
  }

  if (route.view === "home") {
    selectedImageIndex = null;
    pendingTitle = "";
    titleInput.value = "";
    guestNameInput.value = "";
    showView(homeView);
    return;
  }

  if (route.view === "contact") {
    selectedImageIndex = null;
    pendingTitle = "";
    showView(contactView);
    if (currentUser?.email && !contactReplyEmailInput.value.trim()) {
      contactReplyEmailInput.value = currentUser.email;
    }
    contactTypeInput.focus();
    return;
  }

  if (route.view === "upload") {
    selectedImageIndex = null;
    pendingTitle = "";
    showView(uploadView);
    imageUploadMessage.textContent = "현재 직접 업로드는 준비 중이며, 이미지는 문의를 통해 제안할 수 있습니다.";
    imageSuggestionButton.focus();
    return;
  }

  if (route.view === "profile") {
    selectedImageIndex = null;
    pendingTitle = "";
    showView(profileView);
    hydrateProfileForm();

    if (!currentUser) {
      openAuthModal("login");
      return;
    }

    profileNameInput.focus();
    return;
  }

  if (route.view === "admin") {
    selectedImageIndex = null;
    pendingTitle = "";
    showView(adminView);
    loadAdminImages(activeAdminStatus);
    return;
  }

  selectedImageIndex = route.imageIndex;
  const image = getSelectedImage();

  if (route.view === "title") {
    selectedPhoto.src = image.src;
    selectedPhoto.alt = image.alt;
    titleInput.value = pendingTitle;
    showView(titleView);
    titleInput.focus();
    return;
  }

  if (route.view === "guest") {
    guestNameInput.value = currentGuestName;
    showView(guestView);
    guestNameInput.focus();
    return;
  }

  renderRanking();
  refreshRanking();
  showView(rankingView);
}

function navigateTo(state, options = {}) {
  const route = getValidRoute(state) || { view: "home" };
  const method = options.replace ? "replaceState" : "pushState";

  history[method](route, "", routeToHash(route));
  applyRoute(route);
}

function initializeRoute() {
  const route = getValidRoute(parseRouteFromHash(window.location.hash)) || { view: "home" };

  history.replaceState(route, "", routeToHash(route));
  applyRoute(route);
}

function goHome() {
  navigateTo({ view: "home" });
}

function goContact() {
  navigateTo({ view: "contact" });
}

function goUpload() {
  navigateTo({ view: "upload" });
}

function goImageSuggestionContact() {
  navigateTo({ view: "contact" });
  contactTypeInput.value = "이미지 제안";

  if (!contactTitleInput.value.trim()) {
    contactTitleInput.value = "이미지 제안";
  }

  contactBodyInput.focus();
}

function goAdmin() {
  navigateTo({ view: "admin" });
}

function startTitleEntry(index) {
  if (!galleryImages[index]) {
    showToast("사진이 없는 칸입니다");
    return;
  }

  pendingTitle = "";
  titleInput.value = "";
  navigateTo({ view: "title", imageIndex: index });
}

function showRanking(index) {
  if (!galleryImages[index]) {
    showToast("사진이 없는 칸입니다");
    return;
  }

  navigateTo({ view: "ranking", imageIndex: index });
}

async function fetchServerSubmissions(imageIndex) {
  const image = galleryImages[imageIndex];
  const params = new URLSearchParams({
    imageIndex: String(imageIndex),
    imageKey: getImageKey(image, imageIndex),
  });
  const data = await requestJson(`/api/submissions?${params.toString()}`, {
    method: "GET",
    headers: {},
  });
  serverSubmissionsByImage[getImageKey(image, imageIndex)] = data.submissions || [];
}

async function refreshRanking() {
  if (!Number.isInteger(selectedImageIndex)) {
    return;
  }

  try {
    await fetchServerSubmissions(selectedImageIndex);
  } catch {
    delete serverSubmissionsByImage[getSelectedImageKey()];
  }

  renderRanking();
}

async function addSubmission(author) {
  const image = getSelectedImage();

  if (!image || !pendingTitle) {
    goHome();
    return;
  }

  try {
    const data = await requestJson("/api/submissions", {
      method: "POST",
      body: JSON.stringify({
        imageIndex: selectedImageIndex,
        imageKey: getSelectedImageKey(),
        imageSrc: image.src,
        title: pendingTitle,
        guestName: currentUser ? "" : author,
      }),
    });
    const imageKey = getSelectedImageKey();
    const currentList = Array.isArray(serverSubmissionsByImage[imageKey]) ? serverSubmissionsByImage[imageKey] : [];
    serverSubmissionsByImage[imageKey] = [data.submission, ...currentList].filter(Boolean);
    pendingTitle = "";
    renderRanking();
    navigateTo({ view: "ranking", imageIndex: selectedImageIndex });
    refreshRanking();
    return;
  } catch {
    if (currentUser) {
      showToast("서버 저장소를 사용할 수 없습니다.");
      return;
    }
  }

  const submissions = loadSubmissions();
  const imageKey = getSelectedImageKey();
  const currentList = Array.isArray(submissions[imageKey]) ? submissions[imageKey] : [];

  submissions[imageKey] = [
    {
      id: createId("title"),
      authorUserId: "",
      author,
      authorIsProfilePublic: true,
      authorProfileImageUrl: "",
      title: pendingTitle,
      createdAt: new Date().toISOString(),
      likes: 0,
      comments: [],
    },
    ...currentList,
  ];

  saveSubmissions(submissions);
  pendingTitle = "";
  renderRanking();
  navigateTo({ view: "ranking", imageIndex: selectedImageIndex });
}

function updateSubmission(entryId, updater) {
  const submissions = loadSubmissions();
  const imageKey = getSelectedImageKey();
  const entries = Array.isArray(submissions[imageKey]) ? submissions[imageKey] : [];
  const target = entries.find((entry) => entry.id === entryId);

  if (!target) {
    return;
  }

  updater(target);
  submissions[imageKey] = entries;
  saveSubmissions(submissions);
  renderRanking();
}

function removeLocalSubmission(entryId) {
  const submissions = loadSubmissions();
  const imageKey = getSelectedImageKey();
  const entries = Array.isArray(submissions[imageKey]) ? submissions[imageKey] : [];
  const target = entries.find((entry) => entry.id === entryId);

  if (!target || !canDeleteLocalAuthor(target.author)) {
    showToast("본인이 작성한 제목만 삭제할 수 있습니다.");
    return;
  }

  submissions[imageKey] = entries.filter((entry) => entry.id !== entryId);
  saveSubmissions(submissions);
  expandedCommentIds.delete(entryId);
  renderRanking();
}

function removeLocalComment(entryId, commentId) {
  updateSubmission(entryId, (entry) => {
    const target = entry.comments.find((comment) => comment.id === commentId);

    if (!target || !canDeleteLocalAuthor(target.author)) {
      showToast("본인이 작성한 댓글만 삭제할 수 있습니다.");
      return;
    }

    entry.comments = entry.comments.filter((comment) => comment.id !== commentId);
  });
}

function getCurrentRankingEntries() {
  const imageKey = getSelectedImageKey();
  const cachedEntries = serverSubmissionsByImage[imageKey];
  const submissions = loadSubmissions();
  const entries = Array.isArray(cachedEntries)
    ? cachedEntries.slice()
    : Array.isArray(submissions[imageKey])
      ? submissions[imageKey].slice()
      : [];

  if (activeRankingTab === "latest") {
    return getLatestEntries(entries);
  }

  if (activeRankingTab === "mine") {
    return getLatestEntries(entries.filter(isMyEntry));
  }

  return getSortedEntries(entries);
}

function renderGallery() {
  const fragment = document.createDocumentFragment();
  const slotCount = galleryImages.length;
  const renderCount = Math.min(visibleGalleryCount, slotCount);

  for (let index = 0; index < renderCount; index += 1) {
    const card = document.createElement("article");
    const image = galleryImages[index];

    card.className = "photo-card";
    card.dataset.imageIndex = String(index);

    if (image) {
      card.dataset.photoId = image.id;

      const picture = document.createElement("picture");
      picture.className = "photo-card-picture";

      if (image.webpSrc) {
        const source = document.createElement("source");
        source.type = "image/webp";
        source.srcset = image.webpSrc;
        picture.append(source);
      }

      const photo = document.createElement("img");
      photo.className = "photo-card-image";
      photo.src = image.src;
      photo.alt = image.alt;
      photo.loading = "lazy";
      photo.decoding = "async";
      picture.append(photo);

      const actions = document.createElement("div");
      actions.className = "photo-card-actions";

      if (image.isUserUpload) {
        const badge = document.createElement("span");
        badge.className = "photo-badge";
        badge.textContent = "사용자 업로드";
        actions.append(badge);
      }

      const rankingButton = document.createElement("button");
      rankingButton.className = "photo-action";
      rankingButton.type = "button";
      rankingButton.dataset.action = "ranking";
      rankingButton.textContent = "랭킹";

      actions.append(rankingButton);

      const reportButton = document.createElement("button");
      reportButton.className = "photo-action photo-report-action";
      reportButton.type = "button";
      reportButton.dataset.action = "report";
      reportButton.textContent = "신고";
      reportButton.setAttribute("aria-label", "사진 신고");
      actions.append(reportButton);

      card.classList.add("has-image");
      card.tabIndex = 0;
      card.setAttribute("role", "button");
      card.setAttribute("aria-label", `${image.alt} 제목 입력`);
      card.append(picture, actions);
    } else {
      card.classList.add("is-empty");
      card.tabIndex = 0;
      card.setAttribute("role", "button");
      card.setAttribute("aria-label", "비어 있는 사진 칸에 사진 추가");
    }

    fragment.append(card);
  }

  galleryGrid.replaceChildren(fragment);
  if (galleryMoreButton) {
    galleryMoreButton.hidden = true;
    galleryMoreButton.textContent = "";
  }
}

function renderRanking() {
  const image = getSelectedImage();

  if (!image) {
    return;
  }

  updateRankingTabs();
  rankingPhoto.src = image.src;
  rankingPhoto.alt = image.alt;

  const entries = getCurrentRankingEntries();

  if (entries.length === 0) {
    const empty = document.createElement("li");
    empty.className = "ranking-empty";
    const emptyText = document.createElement("p");
    emptyText.textContent = activeRankingTab === "mine" ? "내가 작성한 제목이 없습니다." : "아직 등록된 제목이 없습니다.";

    const writeButton = document.createElement("button");
    writeButton.className = "auth-button solid ranking-write-button";
    writeButton.type = "button";
    writeButton.dataset.action = "write-title";
    writeButton.textContent = "제목 작성하기";

    empty.append(emptyText, writeButton);
    rankingList.replaceChildren(empty);
    return;
  }

  const fragment = document.createDocumentFragment();

  entries.forEach((entry, index) => {
    const item = document.createElement("li");
    const isExpanded = expandedCommentIds.has(entry.id);
    const isMine = Boolean(entry.canDelete || canDeleteLocalAuthor(entry.author));
    item.className = `ranking-item${isExpanded ? " is-expanded" : ""}${isMine ? " is-mine" : ""}`;
    item.dataset.entryId = entry.id;

    const rank = document.createElement("span");
    rank.className = "rank-number";
    const rankNumber = index + 1;
    const crownRanks = ["gold", "silver", "bronze"];

    if (rankNumber <= crownRanks.length) {
      rank.classList.add("rank-crown", `rank-crown-${crownRanks[index]}`);
      rank.textContent = "♛";
      rank.setAttribute("aria-label", `${rankNumber}위`);
    } else {
      rank.textContent = String(rankNumber);
    }

    const content = document.createElement("div");
    content.className = "rank-content";

    const title = document.createElement("strong");
    title.textContent = entry.title;

    const author = createAuthorButton(entry, isMine ? "내 제목" : "");
    const meta = document.createElement("span");
    meta.textContent = formatDate(entry.createdAt);

    if (isMine) {
      const mineBadge = document.createElement("span");
      mineBadge.className = "mine-badge";
      mineBadge.textContent = "내가 작성함";
      content.append(title, author, meta, mineBadge);
    } else {
      content.append(title, author, meta);
    }

    const actions = document.createElement("div");
    actions.className = "rank-actions";

    const voteGroup = document.createElement("div");
    voteGroup.className = "vote-group";

    const heartButton = document.createElement("button");
    heartButton.className = "heart-button";
    heartButton.type = "button";
    heartButton.dataset.action = "like";
    heartButton.dataset.entryId = entry.id;
    heartButton.classList.toggle("is-liked", Boolean(entry.likedByMe));
    heartButton.setAttribute("aria-label", entry.likedByMe ? "하트 취소" : "하트 누르기");
    heartButton.innerHTML = `<span class="heart-icon" aria-hidden="true"></span><span>${entry.likes}</span>`;

    const toggleButton = document.createElement("button");
    toggleButton.className = "comment-toggle";
    toggleButton.type = "button";
    toggleButton.dataset.action = "toggle-comments";
    toggleButton.dataset.entryId = entry.id;
    toggleButton.setAttribute("aria-label", isExpanded ? "댓글 접기" : "댓글 펼치기");
    toggleButton.setAttribute("aria-expanded", String(isExpanded));

    voteGroup.append(heartButton);
    actions.append(voteGroup);

    if (isMine) {
      const editButton = document.createElement("button");
      editButton.className = "delete-button";
      editButton.type = "button";
      editButton.dataset.action = "edit-submission";
      editButton.dataset.entryId = entry.id;
      editButton.textContent = "수정";
      editButton.setAttribute("aria-label", "제목 수정");
      actions.append(editButton);

      const deleteButton = document.createElement("button");
      deleteButton.className = "delete-button";
      deleteButton.type = "button";
      deleteButton.dataset.action = "delete-submission";
      deleteButton.dataset.entryId = entry.id;
      deleteButton.textContent = "삭제";
      deleteButton.setAttribute("aria-label", "제목 삭제");
      actions.append(deleteButton);
    }

    const reportButton = document.createElement("button");
    reportButton.className = "delete-button report-button";
    reportButton.type = "button";
    reportButton.dataset.action = "report-submission";
    reportButton.dataset.entryId = entry.id;
    reportButton.textContent = "신고";
    reportButton.setAttribute("aria-label", "제목 신고");
    actions.append(reportButton);

    item.append(rank, content, actions, toggleButton);

    if (isExpanded) {
      item.append(createCommentsPanel(entry));
    }

    fragment.append(item);
  });

  rankingList.replaceChildren(fragment);
  applyPendingRankingFocus();
}

function updateRankingTabs() {
  rankingTabs.forEach((tab) => {
    const isActive = tab.dataset.rankingTab === activeRankingTab;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  });
}

function createCommentsPanel(entry) {
  const panel = document.createElement("div");
  panel.className = "comments-panel";

  const list = document.createElement("ul");
  list.className = "comment-list";

  if (entry.comments.length === 0) {
    const empty = document.createElement("li");
    empty.className = "comment-empty";
    empty.textContent = "아직 댓글이 없습니다.";
    list.append(empty);
  } else {
    entry.comments.forEach((comment) => {
      const item = document.createElement("li");
      item.className = "comment-item";
      item.dataset.commentId = comment.id;

      const commentHead = document.createElement("div");
      commentHead.className = "comment-head";

      const author = createAuthorButton(comment, "", "strong");

      commentHead.append(author);

      if (comment.canDelete || canDeleteLocalAuthor(comment.author)) {
        const deleteButton = document.createElement("button");
        deleteButton.className = "comment-delete";
        deleteButton.type = "button";
        deleteButton.dataset.action = "delete-comment";
        deleteButton.dataset.entryId = entry.id;
        deleteButton.dataset.commentId = comment.id;
        deleteButton.textContent = "삭제";
        deleteButton.setAttribute("aria-label", "댓글 삭제");
        commentHead.append(deleteButton);
      }

      const reportButton = document.createElement("button");
      reportButton.className = "comment-delete report-button";
      reportButton.type = "button";
      reportButton.dataset.action = "report-comment";
      reportButton.dataset.entryId = entry.id;
      reportButton.dataset.commentId = comment.id;
      reportButton.textContent = "신고";
      reportButton.setAttribute("aria-label", "댓글 신고");
      commentHead.append(reportButton);

      const text = document.createElement("span");
      text.textContent = comment.text;

      item.append(commentHead, text);
      list.append(item);
    });
  }

  const form = document.createElement("form");
  form.className = "comment-form";
  form.dataset.entryId = entry.id;

  const input = document.createElement("input");
  input.name = "comment";
  input.type = "text";
  input.maxLength = 120;
  input.autocomplete = "off";
  input.placeholder = "댓글을 입력하세요";

  const button = document.createElement("button");
  button.className = "auth-button solid";
  button.type = "submit";
  button.textContent = "등록";

  form.append(input, button);
  panel.append(list, form);
  return panel;
}

function createAuthorButton(source, suffix = "", tagName = "span") {
  const wrapper = document.createElement(tagName);
  const button = document.createElement("button");
  button.className = "user-name-button";
  button.type = "button";
  button.dataset.action = "show-user-info";
  button.dataset.userId = source.authorUserId || "";
  button.dataset.username = source.author || "비회원";
  button.dataset.memberType = source.authorUserId ? "회원" : "비회원";
  button.dataset.isProfilePublic = source.authorIsProfilePublic === false ? "false" : "true";
  button.dataset.profileImageUrl = source.authorProfileImageUrl || "";
  button.textContent = source.author || "비회원";

  wrapper.append(button);

  if (suffix) {
    wrapper.append(document.createTextNode(` · ${suffix}`));
  }

  return wrapper;
}

function applyPendingRankingFocus() {
  if (!pendingRankingFocus || pendingRankingFocus.imageIndex !== selectedImageIndex) {
    return;
  }

  const selector = pendingRankingFocus.commentId
    ? `[data-comment-id="${escapeSelector(pendingRankingFocus.commentId)}"]`
    : `[data-entry-id="${escapeSelector(pendingRankingFocus.entryId)}"]`;
  const target = rankingList.querySelector(selector);

  if (!target) {
    return;
  }

  target.classList.add("is-focused");
  target.scrollIntoView({ block: "center", behavior: "smooth" });
  pendingRankingFocus = null;
}

function openRankingLocation(imageIndex, entryId, commentId = "") {
  if (!Number.isInteger(imageIndex)) {
    const imageKey = typeof imageIndex === "string" ? imageIndex : "";
    imageIndex = findImageIndexByKey(imageKey);
  }

  if (!Number.isInteger(imageIndex)) {
    showToast("이동할 사진 정보를 찾을 수 없습니다.");
    return;
  }

  if (entryId) {
    expandedCommentIds.add(String(entryId));
  }

  pendingRankingFocus = {
    imageIndex,
    entryId: String(entryId || ""),
    commentId: String(commentId || ""),
  };
  closeDrawer();
  navigateTo({ view: "ranking", imageIndex });
}

function scrollToMyRanking() {
  const entries = getCurrentRankingEntries();
  const target = entries.find((entry) => entry.canDelete || canDeleteLocalAuthor(entry.author));

  if (!target) {
    showToast("현재 랭킹에서 본인의 제목을 찾지 못했습니다.");
    return;
  }

  pendingRankingFocus = {
    imageIndex: selectedImageIndex,
    entryId: target.id,
    commentId: "",
  };
  renderRanking();
}

function renderUser() {
  if (!currentUser) {
    authActions.hidden = false;
    guestChip.hidden = false;
    memberActions.hidden = true;
    adminNavButton.hidden = true;
    syncGuestChipState(profileDrawer.classList.contains("is-open"));
    drawerName.textContent = "";
    renderAvatar(drawerPhoto, null);
    renderAvatar(profileEditPhoto, null);
    renderDrawerMode();
    syncDrawerEdgeState(profileDrawer.classList.contains("is-open"));
    return;
  }

  const displayName = getUserDisplayName();

  authActions.hidden = true;
  guestChip.hidden = true;
  memberActions.hidden = false;
  adminNavButton.hidden = !isCurrentAdmin();
  userName.textContent = displayName;
  renderAvatar(profilePhoto, currentUser);
  drawerName.textContent = displayName;
  renderAvatar(drawerPhoto, currentUser);
  renderAvatar(profileEditPhoto, currentUser);
  renderDrawerMode();
  syncDrawerEdgeState(profileDrawer.classList.contains("is-open"));
}

function renderAvatar(target, user) {
  if (!target) {
    return;
  }

  const displayName = user?.username || "";
  const imageUrl = user?.profileImageUrl || "";
  target.textContent = imageUrl ? "" : getInitials(displayName) || "?";
  target.style.backgroundImage = imageUrl ? `url("${imageUrl}")` : "";
}

function renderDrawerMode() {
  const isGuest = !currentUser;
  drawerTitle.textContent = isGuest ? "비회원 안내" : "회원 정보";
  drawerName.textContent = isGuest ? "비회원" : getUserDisplayName();
  guestDrawerCopy.hidden = !isGuest;
  avatarEditButton.disabled = isGuest;
  avatarEditButton.setAttribute("aria-disabled", String(isGuest));
  document.querySelectorAll(".guest-only").forEach((item) => {
    item.hidden = !isGuest;
  });
  document.querySelectorAll(".member-only").forEach((item) => {
    item.hidden = isGuest;
  });

  if (isGuest) {
    drawerStats.hidden = true;
    renderAvatar(drawerPhoto, null);
  }
}

async function openUserPopover(trigger) {
  closeNotificationPanel();

  const fallbackProfile = getProfileFromTrigger(trigger);
  activeUserProfile = fallbackProfile;
  renderUserPopover(fallbackProfile);
  positionUserPopover(trigger);

  if (!fallbackProfile.id) {
    return;
  }

  try {
    const data = await requestJson(`/api/users/${encodeURIComponent(fallbackProfile.id)}`, {
      method: "GET",
      headers: {},
    });
    activeUserProfile = data.user;
    renderUserPopover(activeUserProfile);
    positionUserPopover(trigger);
  } catch (error) {
    showToast(error.message);
  }
}

function getProfileFromTrigger(trigger) {
  return {
    id: trigger.dataset.userId || "",
    username: trigger.dataset.username || "비회원",
    memberType: trigger.dataset.memberType || (trigger.dataset.userId ? "회원" : "비회원"),
    isProfilePublic: trigger.dataset.isProfilePublic !== "false",
    bio: "",
    profileImageUrl: trigger.dataset.profileImageUrl || "",
    canReceiveMessages: Boolean(trigger.dataset.userId),
  };
}

function renderUserPopover(profile) {
  const head = document.createElement("div");
  head.className = "user-popover-head";

  const nameBlock = document.createElement("div");
  const name = document.createElement("strong");
  name.textContent = profile.username || "비회원";
  const type = document.createElement("span");
  type.textContent = profile.memberType || "비회원";
  nameBlock.append(name, type);

  const messageButton = document.createElement("button");
  messageButton.className = "auth-button solid small";
  messageButton.type = "button";
  messageButton.dataset.action = "compose-message";
  messageButton.textContent = "쪽지";

  head.append(nameBlock, messageButton);

  const details = document.createElement("div");
  details.className = "user-popover-details";

  const visibility = document.createElement("p");
  visibility.textContent = profile.id
    ? profile.isProfilePublic
      ? "공개 프로필"
      : "비공개 프로필"
    : "비회원 작성자";
  details.append(visibility);

  if (profile.id && profile.isProfilePublic) {
    const bio = document.createElement("p");
    bio.textContent = profile.bio || "공개된 자기소개가 없습니다.";
    details.append(bio);
  } else if (profile.id) {
    const privateInfo = document.createElement("p");
    privateInfo.textContent = "사용자가 공개한 정보만 표시됩니다.";
    details.append(privateInfo);
  } else {
    const guestInfo = document.createElement("p");
    guestInfo.textContent = "비회원은 공개 프로필과 쪽지를 사용할 수 없습니다.";
    details.append(guestInfo);
  }

  userInfoPopover.replaceChildren(head, details);
  userInfoPopover.hidden = false;
}

function positionUserPopover(trigger) {
  const triggerRect = trigger.getBoundingClientRect();
  const popoverWidth = Math.min(320, window.innerWidth - 24);
  const left = Math.min(Math.max(12, triggerRect.left), window.innerWidth - popoverWidth - 12);
  const top = Math.min(triggerRect.bottom + 8, window.innerHeight - 180);

  userInfoPopover.style.left = `${left}px`;
  userInfoPopover.style.top = `${Math.max(12, top)}px`;
  userInfoPopover.style.width = `${popoverWidth}px`;
}

function closeUserPopover() {
  userInfoPopover.hidden = true;
  userInfoPopover.replaceChildren();
  activeUserProfile = null;
}

function openMessageCompose(profile) {
  if (!currentUser) {
    showToast("로그인 후 쪽지를 보낼 수 있습니다.");
    openAuthModal("login");
    return;
  }

  if (!profile?.id) {
    showToast("회원에게만 쪽지를 보낼 수 있습니다.");
    return;
  }

  if (String(profile.id) === String(currentUser.id)) {
    showToast("본인에게는 쪽지를 보낼 수 없습니다.");
    return;
  }

  activeMessageRecipient = profile;
  closeUserPopover();
  messageComposeTitle.textContent = `${profile.username}님에게 쪽지`;
  messageRecipient.textContent = `받는 사람: ${profile.username}`;
  messageBodyInput.value = "";
  messageComposeMessage.textContent = "";
  messageComposeModal.hidden = false;
  messageBodyInput.focus();
}

function closeMessageCompose() {
  messageComposeModal.hidden = true;
  messageBodyInput.value = "";
  messageComposeMessage.textContent = "";
  activeMessageRecipient = null;
}

async function sendMessage() {
  if (!activeMessageRecipient) {
    return;
  }

  const body = messageBodyInput.value.trim();

  if (!body) {
    messageComposeMessage.textContent = "쪽지 내용을 입력하세요.";
    messageBodyInput.focus();
    return;
  }

  messageSendButton.disabled = true;
  messageSendButton.textContent = "전송 중";
  messageComposeMessage.textContent = "";

  try {
    await requestJson("/api/messages", {
      method: "POST",
      body: JSON.stringify({
        recipientUserId: activeMessageRecipient.id,
        body,
      }),
    });
    closeMessageCompose();
    closeUserPopover();
    showToast("쪽지를 보냈습니다.");
  } catch (error) {
    messageComposeMessage.textContent = error.message;
  } finally {
    messageSendButton.disabled = false;
    messageSendButton.textContent = "보내기";
  }
}

function renderUnreadCount(count) {
  const unreadCount = Number(count) || 0;
  notificationUnread.hidden = unreadCount <= 0;
  notificationUnread.textContent = unreadCount > 99 ? "99+" : String(unreadCount);
}

async function refreshUnreadCount() {
  if (!currentUser) {
    renderUnreadCount(0);
    return;
  }

  try {
    const data = await requestJson("/api/messages/unread-count", { method: "GET", headers: {} });
    renderUnreadCount(data.unreadCount);
  } catch {
    renderUnreadCount(0);
  }
}

async function openNotificationPanel() {
  if (!currentUser) {
    openAuthModal("login");
    return;
  }

  closeUserPopover();
  notificationPanel.hidden = false;
  notificationButton.setAttribute("aria-expanded", "true");
  await loadMessageList();
}

function closeNotificationPanel() {
  notificationPanel.hidden = true;
  notificationButton.setAttribute("aria-expanded", "false");
  messageDetail.hidden = true;
}

async function loadMessageList() {
  messageList.replaceChildren(createMessageListStatus("쪽지를 불러오는 중입니다."));
  messageDetail.hidden = true;

  try {
    const data = await requestJson("/api/messages", { method: "GET", headers: {} });
    renderMessageList(data.messages || []);
    await refreshUnreadCount();
  } catch (error) {
    messageList.replaceChildren(createMessageListStatus(error.message));
  }
}

function renderMessageList(messages) {
  if (messages.length === 0) {
    messageList.replaceChildren(createMessageListStatus("받은 쪽지가 없습니다."));
    return;
  }

  const fragment = document.createDocumentFragment();

  messages.forEach((message) => {
    const button = document.createElement("button");
    button.className = `message-list-item${message.readAt ? "" : " is-unread"}`;
    button.type = "button";
    button.dataset.messageId = message.id;

    const sender = document.createElement("strong");
    sender.textContent = message.sender?.username || "알 수 없음";

    const preview = document.createElement("span");
    preview.textContent = message.preview || "";

    const date = document.createElement("small");
    date.textContent = formatDate(message.createdAt);

    button.append(sender, preview, date);
    fragment.append(button);
  });

  messageList.replaceChildren(fragment);
}

function createMessageListStatus(text) {
  const paragraph = document.createElement("p");
  paragraph.className = "message-list-status";
  paragraph.textContent = text;
  return paragraph;
}

async function showMessageDetail(messageId) {
  try {
    const data = await requestJson(`/api/messages/${encodeURIComponent(messageId)}`, {
      method: "GET",
      headers: {},
    });
    const message = data.message;

    const title = document.createElement("h3");
    title.textContent = `${message.sender.username}님의 쪽지`;

    const meta = document.createElement("p");
    meta.className = "message-detail-meta";
    meta.textContent = formatDate(message.createdAt);

    const body = document.createElement("p");
    body.className = "message-detail-body";
    body.textContent = message.body;

    messageDetail.replaceChildren(title, meta, body);
    messageDetail.hidden = false;

    const listItem = messageList.querySelector(`[data-message-id="${escapeSelector(messageId)}"]`);
    listItem?.classList.remove("is-unread");
    await refreshUnreadCount();
  } catch (error) {
    showToast(error.message);
  }
}

function setAuthMode(mode) {
  const isSignup = mode === "signup";

  authTitle.textContent = isSignup ? "회원가입" : "로그인";
  loginForm.classList.toggle("is-active", !isSignup);
  signupForm.classList.toggle("is-active", isSignup);
  authModeButtons.forEach((button) => {
    const isActive = button.dataset.authMode === mode;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });
  loginMessage.textContent = "";
  signupMessage.textContent = "";
}

function openAuthModal(mode = "login") {
  setAuthMode(mode);
  loginPasswordInput.value = "";
  signupEmailInput.value = "";
  signupPasswordInput.value = "";
  signupPasswordConfirmInput.value = "";
  privacyAgreeInput.checked = false;
  termsAgreeInput.checked = false;
  authModal.hidden = false;
  (mode === "signup" ? signupLoginIdInput : loginIdInput).focus();
}

function closeAuthModal() {
  loginPasswordInput.value = "";
  signupEmailInput.value = "";
  signupPasswordInput.value = "";
  signupPasswordConfirmInput.value = "";
  privacyAgreeInput.checked = false;
  termsAgreeInput.checked = false;
  authModal.hidden = true;
}

async function verifyEmailFromUrl() {
  const url = new URL(window.location.href);
  const token = url.searchParams.get("verifyEmailToken");
  const authMessage = url.searchParams.get("authMessage");

  if (authMessage === "google_not_configured") {
    showToast("Google 로그인 설정이 필요합니다.");
  } else if (authMessage === "google_failed") {
    showToast("Google 로그인에 실패했습니다.");
  }

  if (!token) {
    return;
  }

  try {
    const data = await requestAuth("/api/auth/email/verify", {
      method: "POST",
      body: JSON.stringify({ token }),
    });
    showToast(data.message || "이메일 인증이 완료되었습니다.");
    await restoreSession();
  } catch (error) {
    showToast(error.message);
  } finally {
    url.searchParams.delete("verifyEmailToken");
    url.searchParams.delete("authMessage");
    history.replaceState(history.state, "", `${url.pathname}${url.search}${url.hash}`);
  }
}

function startGoogleLogin() {
  const next = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  window.location.href = `/api/auth/google?next=${encodeURIComponent(next)}`;
}

function syncGuestChipState(isOpen) {
  if (!guestChip || guestChip.hidden) {
    return;
  }

  guestChip.setAttribute("aria-expanded", String(isOpen));
  guestChip.setAttribute("aria-label", isOpen ? "비회원 메뉴 닫기" : "비회원 메뉴 열기");
}

function syncDrawerEdgeState(isOpen) {
  if (!drawerEdgeClose) {
    return;
  }

  drawerEdgeClose.classList.toggle("is-open", isOpen);
  drawerEdgeClose.setAttribute("aria-expanded", String(isOpen));
  drawerEdgeClose.setAttribute("aria-label", isOpen ? "프로필 메뉴 닫기" : "프로필 메뉴 열기");
  drawerEdgeClose.textContent = isOpen ? "›" : "‹";
}

function openDrawer() {
  pageDim.hidden = false;
  profileDrawer.classList.add("is-open");
  profileDrawer.setAttribute("aria-hidden", "false");
  document.body.classList.add("drawer-open");
  userChip?.setAttribute("aria-expanded", "true");
  syncGuestChipState(true);
  syncDrawerEdgeState(true);
  renderDrawerMode();
  showDrawerMenu();
  loadDrawerStats();
  drawerEdgeClose.focus();
}

function closeDrawer() {
  pageDim.hidden = true;
  profileDrawer.classList.remove("is-open");
  profileDrawer.setAttribute("aria-hidden", "true");
  document.body.classList.remove("drawer-open");
  userChip?.setAttribute("aria-expanded", "false");
  syncGuestChipState(false);
  syncDrawerEdgeState(false);
  closeDeleteAccountModal();
  closePasswordChangeModal();

  drawerEdgeClose.focus();
}

function showDrawerMenu() {
  drawerMenuView.hidden = false;
  myTitlesView.hidden = true;
  myCommentsView.hidden = true;
  drawerMenuView.classList.add("is-active");
  myTitlesView.classList.remove("is-active");
  myCommentsView.classList.remove("is-active");
}

async function showMyTitles() {
  drawerMenuView.hidden = true;
  myTitlesView.hidden = false;
  myCommentsView.hidden = true;
  drawerMenuView.classList.remove("is-active");
  myTitlesView.classList.add("is-active");
  myCommentsView.classList.remove("is-active");
  myTitleList.replaceChildren(createMyTitleMessage("불러오는 중입니다."));

  try {
    const data = await requestJson("/api/me/submissions", { method: "GET", headers: {} });
    renderMyTitles(data.submissions || []);
  } catch (error) {
    myTitleList.replaceChildren(createMyTitleMessage(error.message));
  }
}

async function showMyComments() {
  drawerMenuView.hidden = true;
  myTitlesView.hidden = true;
  myCommentsView.hidden = false;
  drawerMenuView.classList.remove("is-active");
  myTitlesView.classList.remove("is-active");
  myCommentsView.classList.add("is-active");
  myCommentList.replaceChildren(createMyTitleMessage("불러오는 중입니다."));

  try {
    const data = await requestJson("/api/me/comments", { method: "GET", headers: {} });
    renderMyComments(data.comments || []);
  } catch (error) {
    myCommentList.replaceChildren(createMyTitleMessage(error.message));
  }
}

function showProfileEdit() {
  if (!currentUser) {
    openAuthModal("login");
    return;
  }

  closeDrawer();
  navigateTo({ view: "profile" });
}

async function loadDrawerStats() {
  if (!currentUser) {
    return;
  }

  drawerStats.hidden = false;
  drawerStats.textContent = "활동 통계를 불러오는 중입니다.";

  try {
    const data = await requestJson("/api/me/stats", { method: "GET", headers: {} });
    renderDrawerStats(data.stats);
  } catch {
    drawerStats.textContent = "활동 통계를 불러오지 못했습니다.";
  }
}

function renderDrawerStats(stats = {}) {
  const badges = Array.isArray(stats.badges) ? stats.badges : [];
  const badgeText = badges.length ? badges.map((badge) => badge.label).join(" · ") : "획득한 뱃지가 없습니다.";
  drawerStats.replaceChildren();

  const grid = document.createElement("div");
  grid.className = "drawer-stat-grid";
  [
    ["작성한 제목", stats.titleCount || 0],
    ["작성한 댓글", stats.commentCount || 0],
    ["받은 좋아요", stats.receivedLikes || 0],
    ["최고 기록", stats.bestTitle ? `${stats.bestTitle.likes}개` : "-"],
  ].forEach(([label, value]) => {
    const item = document.createElement("div");
    const strong = document.createElement("strong");
    const span = document.createElement("span");
    strong.textContent = String(value);
    span.textContent = label;
    item.append(strong, span);
    grid.append(item);
  });

  const badge = document.createElement("p");
  badge.className = "drawer-badges";
  badge.textContent = badgeText;
  drawerStats.append(grid, badge);
}

function hydrateProfileForm() {
  const isAuthenticated = Boolean(currentUser);

  profileEditForm.toggleAttribute("aria-disabled", !isAuthenticated);
  profileNameInput.disabled = !isAuthenticated;
  profileBioInput.disabled = !isAuthenticated;
  profilePublicInput.disabled = !isAuthenticated;
  profileSaveButton.disabled = !isAuthenticated;
  passwordChangeButton.disabled = !isAuthenticated;
  accountDeleteButton.disabled = !isAuthenticated;

  if (!currentUser) {
    profileNameInput.value = "";
    profileBioInput.value = "";
    profilePublicInput.checked = true;
    profileEditMessage.textContent = "로그인 후 개인정보를 수정할 수 있습니다.";
    profileEditMessage.classList.remove("is-success");
    updateProfilePublicHint();
    renderAvatar(profileEditPhoto, null);
    return;
  }

  profileNameInput.value = currentUser.username || "";
  profileBioInput.value = currentUser.bio || "";
  profilePublicInput.checked = currentUser.isProfilePublic !== false;
  updateProfilePublicHint();
  profileEditMessage.textContent = "";
  profileEditMessage.classList.remove("is-success");
  renderAvatar(profileEditPhoto, currentUser);
  profileNameInput.focus();
}

function updateProfilePublicHint() {
  profilePublicHint.textContent = profilePublicInput.checked
    ? "공개: 사용자 이름, 나의 제목들 목록 공개"
    : "비공개: 사용자 이름을 제외한 모든 사용자 정보 비공개";
}

async function saveProfile() {
  const username = profileNameInput.value.trim();
  const bio = profileBioInput.value.trim();
  const isProfilePublic = profilePublicInput.checked;

  if (!username) {
    profileEditMessage.textContent = "프로필 이름을 입력하세요.";
    profileNameInput.focus();
    return;
  }

  profileSaveButton.disabled = true;
  profileEditMessage.textContent = "";
  profileEditMessage.classList.remove("is-success");

  try {
    const data = await requestJson("/api/profile", {
      method: "PATCH",
      body: JSON.stringify({ username, bio, isProfilePublic }),
    });
    setCurrentUser(data.user);
    profileEditMessage.textContent = "프로필 정보가 저장되었습니다.";
    profileEditMessage.classList.add("is-success");
  } catch (error) {
    profileEditMessage.textContent = error.message;
  } finally {
    profileSaveButton.disabled = false;
  }
}

function openDeleteAccountModal() {
  deleteAccountModal.hidden = false;
  deleteConfirmButton.focus();
}

function closeDeleteAccountModal() {
  deleteAccountModal.hidden = true;
}

async function deleteAccount() {
  deleteConfirmButton.disabled = true;

  try {
    await requestJson("/api/profile", { method: "DELETE", headers: {} });
    closeDeleteAccountModal();
    closeDrawer();
    setCurrentUser(null);
    navigateTo({ view: "home" }, { replace: true });
    showToast("회원 탈퇴가 완료되었습니다.");
  } catch (error) {
    showToast(error.message);
  } finally {
    deleteConfirmButton.disabled = false;
  }
}

function openPasswordChangeModal() {
  passwordChangeForm.reset();
  passwordChangeMessage.textContent = "";
  passwordChangeMessage.classList.remove("is-success");
  passwordChangeModal.hidden = false;
  currentPasswordInput.focus();
}

function closePasswordChangeModal() {
  passwordChangeModal.hidden = true;
}

async function changePassword() {
  const currentPassword = currentPasswordInput.value;
  const newPassword = newPasswordInput.value;
  const newPasswordConfirm = newPasswordConfirmInput.value;

  passwordChangeMessage.textContent = "";
  passwordChangeMessage.classList.remove("is-success");

  if (newPassword.length < 8) {
    passwordChangeMessage.textContent = "새 비밀번호는 8자리 이상이어야 합니다.";
    newPasswordInput.focus();
    return;
  }

  if (newPassword !== newPasswordConfirm) {
    passwordChangeMessage.textContent = "새 비밀번호가 일치하지 않습니다.";
    newPasswordConfirmInput.focus();
    return;
  }

  try {
    await requestJson("/api/profile/password", {
      method: "POST",
      body: JSON.stringify({ currentPassword, newPassword, newPasswordConfirm }),
    });
    passwordChangeForm.reset();
    passwordChangeMessage.textContent = "비밀번호가 변경되었습니다.";
    passwordChangeMessage.classList.add("is-success");
  } catch (error) {
    passwordChangeMessage.textContent = error.message;
  }
}

function renderMyTitles(submissions) {
  if (submissions.length === 0) {
    myTitleList.replaceChildren(createMyTitleMessage("아직 작성한 제목이 없습니다."));
    return;
  }

  const fragment = document.createDocumentFragment();

  submissions.forEach((entry) => {
    const card = document.createElement("article");
    card.className = "my-title-card";
    card.dataset.entryId = entry.id;
    card.dataset.imageIndex = String(entry.imageIndex);
    card.dataset.imageKey = entry.imageKey || String(entry.imageIndex);
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", `${entry.title} 랭킹으로 이동`);

    const image = document.createElement("img");
    image.className = "my-title-thumb";
    image.src = entry.imageSrc || galleryImages[findImageIndexByKey(entry.imageKey)]?.src || galleryImages[entry.imageIndex]?.src || "";
    image.alt = "";
    image.loading = "lazy";

    const body = document.createElement("div");
    body.className = "my-title-body";

    const title = document.createElement("strong");
    title.textContent = entry.title;

    const meta = document.createElement("p");
    meta.className = "my-title-meta";
    meta.textContent = `하트 ${entry.likes || 0}개`;

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-button drawer-delete";
    deleteButton.type = "button";
    deleteButton.dataset.action = "delete-my-submission";
    deleteButton.dataset.entryId = entry.id;
    deleteButton.textContent = "삭제";

    const comments = document.createElement("p");
    comments.className = "my-title-comments";
    comments.textContent = entry.comments?.length
      ? entry.comments.map((comment) => `${comment.author}: ${comment.text}`).join(" / ")
      : "댓글이 없습니다.";

    body.append(title, meta, comments, deleteButton);
    card.append(image, body);
    fragment.append(card);
  });

  myTitleList.replaceChildren(fragment);
}

function renderMyComments(comments) {
  if (comments.length === 0) {
    myCommentList.replaceChildren(createMyTitleMessage("아직 작성한 댓글이 없습니다."));
    return;
  }

  const fragment = document.createDocumentFragment();

  comments.forEach((comment) => {
    const card = document.createElement("article");
    card.className = "my-title-card my-comment-card";
    card.dataset.entryId = comment.submissionId;
    card.dataset.commentId = comment.id;
    card.dataset.imageIndex = String(comment.imageIndex);
    card.dataset.imageKey = comment.imageKey || String(comment.imageIndex);
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", `${comment.submissionTitle} 댓글 위치로 이동`);

    const image = document.createElement("img");
    image.className = "my-title-thumb";
    image.src = comment.imageSrc || galleryImages[findImageIndexByKey(comment.imageKey)]?.src || galleryImages[comment.imageIndex]?.src || "";
    image.alt = "";
    image.loading = "lazy";

    const body = document.createElement("div");
    body.className = "my-title-body";

    const title = document.createElement("strong");
    title.textContent = comment.submissionTitle;

    const text = document.createElement("p");
    text.className = "my-title-comments";
    text.textContent = comment.text;

    const meta = document.createElement("p");
    meta.className = "my-title-meta";
    meta.textContent = formatDate(comment.createdAt);

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-button drawer-delete";
    deleteButton.type = "button";
    deleteButton.dataset.action = "delete-my-comment";
    deleteButton.dataset.entryId = comment.submissionId;
    deleteButton.dataset.commentId = comment.id;
    deleteButton.textContent = "삭제";

    body.append(title, text, meta, deleteButton);
    card.append(image, body);
    fragment.append(card);
  });

  myCommentList.replaceChildren(fragment);
}

function createMyTitleMessage(message) {
  const paragraph = document.createElement("p");
  paragraph.className = "my-title-empty";
  paragraph.textContent = message;
  return paragraph;
}

async function uploadAvatar(file) {
  if (!file) {
    return;
  }

  if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
    showToast("PNG, JPEG, WEBP 이미지만 가능합니다.");
    return;
  }

  if (file.size > maxAvatarBytes) {
    showToast("이미지는 5MB 이하만 가능합니다.");
    return;
  }

  const previousUser = currentUser;
  const previewUrl = URL.createObjectURL(file);
  currentUser = { ...currentUser, profileImageUrl: previewUrl };
  renderUser();

  try {
    const formData = new FormData();
    formData.append("avatar", file);
    const response = await fetch("/api/profile/avatar", {
      method: "POST",
      credentials: "include",
      body: formData,
    });
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || "프로필 이미지를 저장하지 못했습니다.");
    }

    setCurrentUser(data.user);
    showToast("프로필 이미지가 변경되었습니다.");
  } catch (error) {
    setCurrentUser(previousUser);
    showToast(error.message);
  } finally {
    URL.revokeObjectURL(previewUrl);
    avatarInput.value = "";
  }
}

function openReportModal(target) {
  if (!target?.targetId) {
    return;
  }

  activeReportTarget = target;
  activeReportImage = target.image || null;
  imageReportTitle.textContent = target.title || "신고";
  imageReportForm.reset();
  imageReportMessage.textContent = "";
  imageReportModal.hidden = false;
  imageReportReasonInput.focus();
}

function closeReportModal() {
  imageReportModal.hidden = true;
  activeReportImage = null;
  activeReportTarget = null;
  imageReportForm.reset();
  imageReportMessage.textContent = "";
}

async function submitImageReport() {
  if (!activeReportTarget?.targetId) {
    return;
  }

  const reason = imageReportReasonInput.value;
  const detail = imageReportDetailInput.value.trim();

  if (!reason) {
    imageReportMessage.textContent = "신고 사유를 선택하세요.";
    imageReportReasonInput.focus();
    return;
  }

  imageReportSubmitButton.disabled = true;
  imageReportSubmitButton.textContent = "접수 중";
  imageReportMessage.textContent = "";

  try {
    const data = await requestJson("/api/reports", {
      method: "POST",
      body: JSON.stringify({
        targetType: activeReportTarget.targetType,
        targetId: activeReportTarget.targetId,
        reason,
        detail,
      }),
    });
    closeReportModal();
    showToast(data.message || "신고가 접수되었습니다.");

    if (data.hidden || data.reviewRequired) {
      await loadGalleryImages();
    }
  } catch (error) {
    imageReportMessage.textContent = error.message;
  } finally {
    imageReportSubmitButton.disabled = false;
    imageReportSubmitButton.textContent = "신고 접수";
  }
}

function loadAdminImages(status = "pending") {
  activeAdminStatus = status;
  [adminPendingTab, adminReportedTab].forEach((tab) => {
    const isActive = tab.dataset.status === status;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  });
  adminImageMessage.textContent = "";

  if (status === "reported") {
    loadAdminReports();
    return;
  }

  adminImageList.replaceChildren(createAdminMessage("유저 직접 업로드는 비활성화되어 있습니다. 이미지는 관리자가 직접 추가합니다."));
}

async function loadAdminReports() {
  adminImageList.replaceChildren(createAdminMessage("신고 목록을 불러오는 중입니다."));

  try {
    const data = await requestJson("/api/admin/reports?status=pending", { method: "GET", headers: {} });
    renderAdminReports(data.reports || []);
  } catch (error) {
    adminImageList.replaceChildren(createAdminMessage(error.message));
  }
}

function renderAdminReports(reports) {
  if (reports.length === 0) {
    adminImageList.replaceChildren(createAdminMessage("처리할 신고가 없습니다."));
    return;
  }

  const fragment = document.createDocumentFragment();
  reports.forEach((report) => {
    const card = document.createElement("article");
    card.className = "admin-image-card admin-report-card";
    card.dataset.reportId = report.id;

    const body = document.createElement("div");
    body.className = "admin-image-body";

    const title = document.createElement("h2");
    title.textContent = `${getReportTargetLabel(report.targetType)} 신고`;

    const meta = document.createElement("p");
    meta.className = "admin-image-meta";
    meta.textContent = `사유 ${getReportReasonLabel(report.reason)} · 신고자 ${report.reporter} · ${formatDate(report.createdAt)}`;

    const target = document.createElement("p");
    target.className = "admin-image-source";
    target.textContent = `대상 ID: ${report.targetId}`;

    const detail = document.createElement("p");
    detail.textContent = report.detail || "상세 내용 없음";

    const actions = document.createElement("div");
    actions.className = "admin-image-actions";
    [
      ["reviewing", "검토 중"],
      ["resolved", "처리 완료"],
      ["dismissed", "기각"],
    ].forEach(([status, label]) => {
      const button = document.createElement("button");
      button.className = status === "resolved" ? "auth-button solid" : "auth-button ghost";
      button.type = "button";
      button.dataset.action = "report-status";
      button.dataset.status = status;
      button.textContent = label;
      actions.append(button);
    });

    body.append(title, meta, target, detail, actions);
    card.append(body);
    fragment.append(card);
  });

  adminImageList.replaceChildren(fragment);
}

function getReportTargetLabel(type) {
  return { photo: "사진", title: "제목", comment: "댓글" }[type] || "콘텐츠";
}

function getReportReasonLabel(reason) {
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

function renderAdminImages(images) {
  if (images.length === 0) {
    adminImageList.replaceChildren(createAdminMessage("검수할 이미지가 없습니다."));
    return;
  }

  const fragment = document.createDocumentFragment();

  images.forEach((image) => {
    const card = document.createElement("article");
    card.className = "admin-image-card";
    card.dataset.imageId = image.id;

    const preview = document.createElement("img");
    preview.className = "admin-image-preview";
    preview.src = image.src;
    preview.alt = image.alt || "업로드 이미지";
    preview.loading = "lazy";

    const body = document.createElement("div");
    body.className = "admin-image-body";

    const title = document.createElement("h2");
    title.textContent = image.alt || "설명 없음";

    const meta = document.createElement("p");
    meta.className = "admin-image-meta";
    meta.textContent = `상태 ${image.status} · 신고 ${image.reportCount || 0}회 · 업로더 ${image.uploader || "회원"}`;

    const source = document.createElement("p");
    source.className = "admin-image-source";
    source.textContent =
      image.sourceType === "self"
        ? "출처: 직접 촬영"
        : `출처: ${image.sourceUrl || "-"} / 작가: ${image.authorName || "-"} / 라이선스: ${image.licenseName || "-"}`;

    const reasonInput = document.createElement("textarea");
    reasonInput.className = "admin-reason-input";
    reasonInput.rows = 2;
    reasonInput.maxLength = 1000;
    reasonInput.placeholder = "거절 또는 숨김 사유";
    reasonInput.setAttribute("aria-label", "검수 사유");
    reasonInput.value = image.moderationReason || "";

    const actions = document.createElement("div");
    actions.className = "admin-image-actions";

    [
      ["approve", "승인", "solid"],
      ["reject", "거절", "ghost"],
      ["hide", "숨김", "ghost"],
      ["delete", "삭제", "danger"],
    ].forEach(([action, label, style]) => {
      const button = document.createElement("button");
      button.className = `auth-button ${style}`;
      button.type = "button";
      button.dataset.action = action;
      button.textContent = label;
      actions.append(button);
    });

    body.append(title, meta, source, reasonInput, actions);
    card.append(preview, body);
    fragment.append(card);
  });

  adminImageList.replaceChildren(fragment);
}

function createAdminMessage(message) {
  const paragraph = document.createElement("p");
  paragraph.className = "my-title-empty";
  paragraph.textContent = message;
  return paragraph;
}

async function moderateImage(card, action) {
  const imageId = card.dataset.imageId;
  const reason = card.querySelector(".admin-reason-input")?.value.trim() || "";
  const options =
    action === "delete"
      ? { method: "DELETE", headers: {} }
      : {
          method: "POST",
          body: JSON.stringify({ reason }),
        };

  try {
    await requestJson(
      action === "delete"
        ? `/api/admin/images/${encodeURIComponent(imageId)}`
        : `/api/admin/images/${encodeURIComponent(imageId)}/${encodeURIComponent(action)}`,
      options
    );
    showToast("검수 상태를 변경했습니다.");
    await loadAdminImages(activeAdminStatus);
    await loadGalleryImages();
  } catch (error) {
    adminImageMessage.textContent = error.message;
  }
}

function showToast(message) {
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("is-visible");
  toastTimer = window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 1800);
}

homeLink.addEventListener("click", (event) => {
  event.preventDefault();
  goHome();
});

contactLink.addEventListener("click", (event) => {
  event.preventDefault();
  goContact();
});

uploadNavButton.addEventListener("click", goUpload);
adminNavButton.addEventListener("click", goAdmin);

galleryGrid.addEventListener("click", (event) => {
  const actionButton = event.target.closest(".photo-action");
  const card = event.target.closest(".photo-card");

  if (!card) {
    return;
  }

  const imageIndex = Number(card.dataset.imageIndex);

  if (card.classList.contains("is-empty")) {
    showToast("준비된 사진이 없습니다");
    return;
  }

  if (actionButton?.dataset.action === "report") {
    const image = galleryImages[imageIndex];
    openReportModal({
      targetType: "photo",
      targetId: getImageKey(image, imageIndex),
      title: "사진 신고",
      image,
    });
    return;
  }

  if (actionButton?.dataset.action === "ranking") {
    showRanking(imageIndex);
    return;
  }

  startTitleEntry(imageIndex);
});

galleryGrid.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" && event.key !== " ") {
    return;
  }

  if (event.target.closest(".photo-action")) {
    return;
  }

  const card = event.target.closest(".photo-card");

  if (!card) {
    return;
  }

  event.preventDefault();
  const imageIndex = Number(card.dataset.imageIndex);

  if (card.classList.contains("is-empty")) {
    showToast("준비된 사진이 없습니다");
    return;
  }

  startTitleEntry(imageIndex);
});

titleForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const title = titleInput.value.trim();

  if (!title) {
    titleInput.focus();
    return;
  }

  pendingTitle = title;

  if (currentUser) {
    await addSubmission(getUserDisplayName());
    return;
  }

  guestNameInput.value = currentGuestName;
  navigateTo({ view: "guest", imageIndex: selectedImageIndex });
});

guestForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const guestName = guestNameInput.value.trim();

  if (!guestName) {
    guestNameInput.focus();
    return;
  }

  currentGuestName = guestName;
  sessionStorage.setItem(guestStorageKey, guestName);
  await addSubmission(guestName);
});

rankingList.addEventListener("click", async (event) => {
  const button = event.target.closest("button[data-action]");

  if (!button) {
    return;
  }

  if (button.dataset.action === "show-user-info") {
    await openUserPopover(button);
    return;
  }

  const entryId = button.dataset.entryId;

  if (button.dataset.action === "write-title") {
    startTitleEntry(selectedImageIndex);
    return;
  }

  if (button.dataset.action === "like") {
    const imageKey = getSelectedImageKey();
    const serverEntries = serverSubmissionsByImage[imageKey];
    const entry = Array.isArray(serverEntries) ? serverEntries.find((item) => item.id === entryId) : null;

    if (!entry || !isServerEntry(entry)) {
      showToast("서버에 저장된 제목만 하트를 누를 수 있습니다.");
      return;
    }

    try {
      const response = await fetch(`/api/submissions/${encodeURIComponent(entryId)}/like`, {
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
        method: "POST",
        body: "{}",
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (response.status === 409 && data.dailyVoteUsed) {
          entry.likes = data.likes;
          entry.likedByMe = data.liked;
          renderRanking();
          return;
        }

        throw new Error(data.message || "요청 처리 중 오류가 발생했습니다.");
      }

      entry.likes = data.likes;
      entry.likedByMe = data.liked;
      updatePreviousLikedEntry(serverEntries, data);
      renderRanking();
    } catch (error) {
      showToast(error.message);
    }
    return;
  }

  if (button.dataset.action === "delete-submission") {
    if (!currentUser) {
      showToast("로그인이 필요합니다.");
      openAuthModal("login");
      return;
    }

    const imageKey = getSelectedImageKey();
    const serverEntries = serverSubmissionsByImage[imageKey];
    const entry = Array.isArray(serverEntries) ? serverEntries.find((item) => item.id === entryId) : null;

    if (entry && isServerEntry(entry)) {
      try {
        await requestJson(`/api/submissions/${encodeURIComponent(entryId)}`, {
          method: "DELETE",
          headers: {},
        });
        serverSubmissionsByImage[imageKey] = serverEntries.filter((item) => item.id !== entryId);
        expandedCommentIds.delete(entryId);
        renderRanking();
        showToast("제목을 삭제했습니다.");
      } catch (error) {
        showToast(error.message);
      }
      return;
    }

    removeLocalSubmission(entryId);
    return;
  }

  if (button.dataset.action === "edit-submission") {
    const imageKey = getSelectedImageKey();
    const serverEntries = serverSubmissionsByImage[imageKey];
    const entry = Array.isArray(serverEntries)
      ? serverEntries.find((item) => item.id === entryId)
      : getCurrentRankingEntries().find((item) => item.id === entryId);
    const nextTitle = window.prompt("수정할 제목을 입력하세요.", entry?.title || "");

    if (!nextTitle || !nextTitle.trim()) {
      return;
    }

    if (entry && isServerEntry(entry)) {
      try {
        const data = await requestJson(`/api/submissions/${encodeURIComponent(entryId)}`, {
          method: "PATCH",
          body: JSON.stringify({ title: nextTitle.trim() }),
        });
        entry.title = data.title;
        renderRanking();
        showToast("제목을 수정했습니다.");
      } catch (error) {
        showToast(error.message);
      }
      return;
    }

    updateSubmission(entryId, (entry) => {
      if (!canDeleteLocalAuthor(entry.author)) {
        showToast("본인이 작성한 제목만 수정할 수 있습니다.");
        return;
      }

      entry.title = nextTitle.trim().slice(0, 60);
    });
    return;
  }

  if (button.dataset.action === "report-submission") {
    if (!isServerEntry({ id: entryId })) {
      showToast("서버에 저장된 제목만 신고할 수 있습니다.");
      return;
    }

    openReportModal({
      targetType: "title",
      targetId: entryId,
      title: "제목 신고",
    });
    return;
  }

  if (button.dataset.action === "delete-comment") {
    if (!currentUser) {
      showToast("로그인이 필요합니다.");
      openAuthModal("login");
      return;
    }

    const commentId = button.dataset.commentId;
    const imageKey = getSelectedImageKey();
    const serverEntries = serverSubmissionsByImage[imageKey];
    const entry = Array.isArray(serverEntries) ? serverEntries.find((item) => item.id === entryId) : null;

    if (entry && isServerEntry(entry)) {
      try {
        await requestJson(
          `/api/submissions/${encodeURIComponent(entryId)}/comments/${encodeURIComponent(commentId)}`,
          {
            method: "DELETE",
            headers: {},
          }
        );
        entry.comments = entry.comments.filter((comment) => comment.id !== commentId);
        renderRanking();
        showToast("댓글을 삭제했습니다.");
      } catch (error) {
        showToast(error.message);
      }
      return;
    }

    removeLocalComment(entryId, commentId);
    return;
  }

  if (button.dataset.action === "report-comment") {
    if (!/^\d+$/.test(String(button.dataset.commentId || ""))) {
      showToast("서버에 저장된 댓글만 신고할 수 있습니다.");
      return;
    }

    openReportModal({
      targetType: "comment",
      targetId: button.dataset.commentId,
      title: "댓글 신고",
    });
    return;
  }

  if (button.dataset.action === "toggle-comments") {
    if (expandedCommentIds.has(entryId)) {
      expandedCommentIds.delete(entryId);
    } else {
      expandedCommentIds.add(entryId);
    }

    renderRanking();
  }
});

rankingList.addEventListener("submit", async (event) => {
  const form = event.target.closest(".comment-form");

  if (!form) {
    return;
  }

  event.preventDefault();

  const input = form.elements.comment;
  const text = input.value.trim();

  if (!text) {
    input.focus();
    return;
  }

  const entryId = form.dataset.entryId;
  expandedCommentIds.add(entryId);

  const imageKey = getSelectedImageKey();
  const serverEntries = serverSubmissionsByImage[imageKey];
  const entry = Array.isArray(serverEntries) ? serverEntries.find((item) => item.id === entryId) : null;

  if (entry && isServerEntry(entry)) {
    try {
      const data = await requestJson(`/api/submissions/${encodeURIComponent(entryId)}/comments`, {
        method: "POST",
        body: JSON.stringify({
          text,
          guestName: currentUser ? "" : getActiveAuthor(),
        }),
      });
      entry.comments.push(data.comment);
      input.value = "";
      renderRanking();
    } catch (error) {
      showToast(error.message);
    }
    return;
  }

  updateSubmission(entryId, (entry) => {
    entry.comments.push({
      id: createId("comment"),
      authorUserId: "",
      author: getActiveAuthor(),
      authorIsProfilePublic: true,
      authorProfileImageUrl: "",
      text,
      createdAt: new Date().toISOString(),
    });
  });
  input.value = "";
});

function updatePreviousLikedEntry(entries, data) {
  if (!data.previousSubmissionId || !Array.isArray(entries)) {
    return;
  }

  const previousEntry = entries.find((item) => item.id === String(data.previousSubmissionId));

  if (!previousEntry) {
    return;
  }

  previousEntry.likes = data.previousLikes;
  previousEntry.likedByMe = false;
}

backToGalleryButton.addEventListener("click", goHome);
rankingSelfLink.addEventListener("click", scrollToMyRanking);
rankingTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    activeRankingTab = tab.dataset.rankingTab || "popular";
    renderRanking();
  });
  tab.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") {
      return;
    }

    event.preventDefault();
    const tabs = Array.from(rankingTabs);
    const currentIndex = tabs.indexOf(tab);
    const nextIndex =
      event.key === "ArrowRight"
        ? (currentIndex + 1) % tabs.length
        : (currentIndex - 1 + tabs.length) % tabs.length;
    tabs[nextIndex].focus();
    tabs[nextIndex].click();
  });
});
galleryMoreButton?.addEventListener("click", () => {
  visibleGalleryCount = Math.min(visibleGalleryCount + galleryPageSize, galleryImages.length);
  renderGallery();
});

imageSuggestionButton.addEventListener("click", goImageSuggestionContact);
uploadCancelButton.addEventListener("click", () => {
  goHome();
});
imageReportCloseButton.addEventListener("click", closeReportModal);
imageReportCancelButton.addEventListener("click", closeReportModal);
imageReportModal.addEventListener("click", (event) => {
  if (event.target === imageReportModal) {
    closeReportModal();
  }
});
imageReportForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  await submitImageReport();
});
[adminPendingTab, adminReportedTab].forEach((tab) => {
  tab.addEventListener("click", () => loadAdminImages(tab.dataset.status));
});
adminImageList.addEventListener("click", async (event) => {
  const button = event.target.closest("button[data-action]");
  const card = event.target.closest(".admin-image-card");

  if (!button || !card) {
    return;
  }

  if (button.dataset.action === "report-status") {
    try {
      await requestJson(`/api/admin/reports/${encodeURIComponent(card.dataset.reportId)}`, {
        method: "PATCH",
        body: JSON.stringify({ status: button.dataset.status }),
      });
      showToast("신고 상태를 저장했습니다.");
      await loadAdminReports();
    } catch (error) {
      adminImageMessage.textContent = error.message;
    }
    return;
  }

  await moderateImage(card, button.dataset.action);
});

consentAcceptButton.addEventListener("click", () => {
  saveTrackingConsent("accepted");
});

consentRejectButton.addEventListener("click", () => {
  saveTrackingConsent("rejected");
});
cookieSettingsButton.addEventListener("click", openCookieSettings);
cookieSettingsCloseButton.addEventListener("click", closeCookieSettings);
cookieSettingsCancelButton.addEventListener("click", closeCookieSettings);
cookieSettingsModal.addEventListener("click", (event) => {
  if (event.target === cookieSettingsModal) {
    closeCookieSettings();
  }
});
cookieSettingsForm.addEventListener("submit", (event) => {
  event.preventDefault();
  saveCookieSettings({
    analytics: analyticsCookieInput.checked,
    ads: adsCookieInput.checked,
  });
  cookieSettingsMessage.textContent = "쿠키 설정이 저장되었습니다.";
  cookieSettingsMessage.classList.add("is-success");
  closeCookieSettings();
  showToast("쿠키 설정이 저장되었습니다.");
});
themeToggleButton.addEventListener("click", () => {
  setTheme(activeTheme === "light" ? "dark" : "light");
});

loginButton.addEventListener("click", () => {
  openAuthModal("login");
});

signupButton.addEventListener("click", () => {
  openAuthModal("signup");
});

modalClose.addEventListener("click", closeAuthModal);

authModal.addEventListener("click", (event) => {
  if (event.target === authModal) {
    closeAuthModal();
  }
});

authModeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setAuthMode(button.dataset.authMode);
  });
});

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  loginMessage.textContent = "";
  const loginId = loginIdInput.value.trim();
  const password = loginPasswordInput.value;

  try {
    await login(loginId, password);
  } catch (error) {
    loginMessage.textContent = error.message;
  }
});

passwordResetLink.addEventListener("click", () => {
  loginMessage.textContent = "비밀번호 재설정 기능은 준비 중입니다.";
});

loginGoogleButton.addEventListener("click", startGoogleLogin);
signupGoogleButton.addEventListener("click", startGoogleLogin);

signupForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  signupMessage.textContent = "";
  const loginId = signupLoginIdInput.value.trim();
  const email = signupEmailInput.value.trim();
  const username = signupUsernameInput.value.trim();
  const password = signupPasswordInput.value;
  const passwordConfirm = signupPasswordConfirmInput.value;

  if (loginId.length < 8) {
    signupMessage.textContent = "아이디는 8자리 이상이어야 합니다.";
    signupLoginIdInput.focus();
    return;
  }

  if (!email) {
    signupMessage.textContent = "이메일을 입력하세요.";
    signupEmailInput.focus();
    return;
  }

  if (!username) {
    signupMessage.textContent = "사용자 이름을 입력하세요.";
    signupUsernameInput.focus();
    return;
  }

  if (password.length < 8) {
    signupMessage.textContent = "비밀번호는 8자리 이상이어야 합니다.";
    signupPasswordInput.focus();
    return;
  }

  if (password !== passwordConfirm) {
    signupMessage.textContent = "비밀번호가 일치하지 않습니다.";
    signupPasswordConfirmInput.focus();
    return;
  }

  if (!privacyAgreeInput.checked || !termsAgreeInput.checked) {
    signupMessage.textContent = "개인정보 처리방침과 서비스 이용약관에 동의해주세요.";
    (privacyAgreeInput.checked ? termsAgreeInput : privacyAgreeInput).focus();
    return;
  }

  try {
    await signup(loginId, email, username, password, passwordConfirm);
  } catch (error) {
    signupMessage.textContent = error.message;
  }
});

contactForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  contactMessage.textContent = "";
  contactMessage.classList.remove("is-success");

  const type = contactTypeInput.value.trim();
  const title = contactTitleInput.value.trim();
  const replyEmail = contactReplyEmailInput.value.trim();
  const body = contactBodyInput.value.trim();

  if (!type) {
    contactMessage.textContent = "문의 유형을 선택하세요.";
    contactTypeInput.focus();
    return;
  }

  if (!title) {
    contactMessage.textContent = "문의 제목을 입력하세요.";
    contactTitleInput.focus();
    return;
  }

  if (!body) {
    contactMessage.textContent = "문의 내용을 입력하세요.";
    contactBodyInput.focus();
    return;
  }

  if (!replyEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(replyEmail)) {
    contactMessage.textContent = "답변 받을 이메일을 올바르게 입력하세요.";
    contactReplyEmailInput.focus();
    return;
  }

  contactSubmitButton.disabled = true;
  contactSubmitButton.textContent = "제출 중";

  try {
    const data = await requestJson("/api/contact", {
      method: "POST",
      body: JSON.stringify({ type, title, replyEmail, body }),
    });
    contactForm.reset();
    contactMessage.textContent = data.message || "문의가 접수되었습니다.";
    contactMessage.classList.add("is-success");
  } catch (error) {
    contactMessage.textContent = error.message;
  } finally {
    contactSubmitButton.disabled = false;
    contactSubmitButton.textContent = "문의 제출";
  }
});

notificationButton.addEventListener("click", async () => {
  if (notificationPanel.hidden) {
    await openNotificationPanel();
  } else {
    closeNotificationPanel();
  }
});
notificationCloseButton.addEventListener("click", closeNotificationPanel);
messageList.addEventListener("click", async (event) => {
  const item = event.target.closest(".message-list-item[data-message-id]");

  if (!item) {
    return;
  }

  await showMessageDetail(item.dataset.messageId);
});
userInfoPopover.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action='compose-message']");

  if (!button) {
    return;
  }

  openMessageCompose(activeUserProfile);
});
messageComposeCloseButton.addEventListener("click", closeMessageCompose);
messageComposeCancelButton.addEventListener("click", closeMessageCompose);
messageComposeModal.addEventListener("click", (event) => {
  if (event.target === messageComposeModal) {
    closeMessageCompose();
  }
});
messageComposeForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  await sendMessage();
});
document.addEventListener("click", (event) => {
  if (
    !userInfoPopover.hidden &&
    !event.target.closest("#userInfoPopover") &&
    !event.target.closest("button[data-action='show-user-info']")
  ) {
    closeUserPopover();
  }

  if (
    !notificationPanel.hidden &&
    !event.target.closest("#notificationPanel") &&
    !event.target.closest("#notificationButton")
  ) {
    closeNotificationPanel();
  }
});
userChip.addEventListener("click", openDrawer);
guestChip.addEventListener("click", openDrawer);
drawerEdgeClose.addEventListener("click", () => {
  if (profileDrawer.classList.contains("is-open")) {
    closeDrawer();
  } else {
    openDrawer();
  }
});
pageDim.addEventListener("click", closeDrawer);
logoutButton.addEventListener("click", logout);
guestLoginButton.addEventListener("click", () => {
  closeDrawer();
  openAuthModal("login");
});
guestSignupButton.addEventListener("click", () => {
  closeDrawer();
  openAuthModal("signup");
});
drawerContactButton.addEventListener("click", () => {
  closeDrawer();
  goContact();
});
profileEditButton.addEventListener("click", showProfileEdit);
myTitlesButton.addEventListener("click", showMyTitles);
myCommentsButton.addEventListener("click", showMyComments);
drawerBackButton.addEventListener("click", showDrawerMenu);
commentsBackButton.addEventListener("click", showDrawerMenu);
profileEditPhotoButton.addEventListener("click", () => {
  avatarInput.click();
});
profilePublicInput.addEventListener("change", updateProfilePublicHint);
profileEditForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  await saveProfile();
});
passwordChangeButton.addEventListener("click", openPasswordChangeModal);
accountDeleteButton.addEventListener("click", openDeleteAccountModal);
deleteCancelButton.addEventListener("click", closeDeleteAccountModal);
deleteConfirmButton.addEventListener("click", deleteAccount);
deleteAccountModal.addEventListener("click", (event) => {
  if (event.target === deleteAccountModal) {
    closeDeleteAccountModal();
  }
});
passwordCancelButton.addEventListener("click", closePasswordChangeModal);
passwordChangeModal.addEventListener("click", (event) => {
  if (event.target === passwordChangeModal) {
    closePasswordChangeModal();
  }
});
passwordChangeForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  await changePassword();
});
myTitleList.addEventListener("click", async (event) => {
  const button = event.target.closest("button[data-action='delete-my-submission']");

  if (button) {
    const entryId = button.dataset.entryId;

    try {
      await requestJson(`/api/submissions/${encodeURIComponent(entryId)}`, {
        method: "DELETE",
        headers: {},
      });
      showToast("제목을 삭제했습니다.");
      await showMyTitles();

      if (Number.isInteger(selectedImageIndex)) {
        await refreshRanking();
      }
    } catch (error) {
      showToast(error.message);
    }
    return;
  }

  const card = event.target.closest(".my-title-card[data-entry-id]");

  if (!card) {
    return;
  }

  openRankingLocation(card.dataset.imageKey || Number(card.dataset.imageIndex), card.dataset.entryId);
});
myTitleList.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" && event.key !== " ") {
    return;
  }

  const card = event.target.closest(".my-title-card[data-entry-id]");

  if (!card) {
    return;
  }

  event.preventDefault();
  openRankingLocation(card.dataset.imageKey || Number(card.dataset.imageIndex), card.dataset.entryId);
});
myCommentList.addEventListener("click", async (event) => {
  const button = event.target.closest("button[data-action='delete-my-comment']");

  if (button) {
    const entryId = button.dataset.entryId;
    const commentId = button.dataset.commentId;

    try {
      await requestJson(
        `/api/submissions/${encodeURIComponent(entryId)}/comments/${encodeURIComponent(commentId)}`,
        {
          method: "DELETE",
          headers: {},
        }
      );
      showToast("댓글을 삭제했습니다.");
      await showMyComments();

      if (Number.isInteger(selectedImageIndex)) {
        await refreshRanking();
      }
    } catch (error) {
      showToast(error.message);
    }
    return;
  }

  const card = event.target.closest(".my-comment-card[data-comment-id]");

  if (!card) {
    return;
  }

  openRankingLocation(card.dataset.imageKey || Number(card.dataset.imageIndex), card.dataset.entryId, card.dataset.commentId);
});
myCommentList.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" && event.key !== " ") {
    return;
  }

  const card = event.target.closest(".my-comment-card[data-comment-id]");

  if (!card) {
    return;
  }

  event.preventDefault();
  openRankingLocation(card.dataset.imageKey || Number(card.dataset.imageIndex), card.dataset.entryId, card.dataset.commentId);
});
avatarEditButton.addEventListener("click", () => {
  avatarInput.click();
});
avatarInput.addEventListener("change", () => {
  uploadAvatar(avatarInput.files?.[0]);
});

window.addEventListener("popstate", (event) => {
  applyRoute(getValidRoute(event.state) || parseRouteFromHash(window.location.hash) || { view: "home" });
});

window.addEventListener("keydown", (event) => {
  if (
    trapFocus(event, authModal) ||
    trapFocus(event, deleteAccountModal) ||
    trapFocus(event, passwordChangeModal) ||
    trapFocus(event, messageComposeModal) ||
    trapFocus(event, imageReportModal) ||
    trapFocus(event, cookieSettingsModal) ||
    trapFocus(event, profileDrawer, [drawerEdgeClose])
  ) {
    return;
  }

  if (event.key !== "Escape") {
    return;
  }

  if (!authModal.hidden) {
    closeAuthModal();
    return;
  }

  if (!deleteAccountModal.hidden) {
    closeDeleteAccountModal();
    return;
  }

  if (!passwordChangeModal.hidden) {
    closePasswordChangeModal();
    return;
  }

  if (!messageComposeModal.hidden) {
    closeMessageCompose();
    return;
  }

  if (!cookieSettingsModal.hidden) {
    closeCookieSettings();
    return;
  }

  if (!imageReportModal.hidden) {
    closeReportModal();
    return;
  }

  if (!userInfoPopover.hidden) {
    closeUserPopover();
    return;
  }

  if (!notificationPanel.hidden) {
    closeNotificationPanel();
    return;
  }

  if (profileDrawer.classList.contains("is-open")) {
    closeDrawer();
  }
});

async function initializeApp() {
  initializeTheme();
  initializeTrackingConsent();
  renderGallery();
  renderUser();
  await verifyEmailFromUrl();
  await restoreSession();
  await loadGalleryImages();
  initializeRoute();
}

initializeApp();
