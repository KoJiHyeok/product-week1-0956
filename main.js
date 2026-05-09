const homeLink = document.querySelector("#homeLink");
const contactLink = document.querySelector("#contactLink");
const homeView = document.querySelector("#homeView");
const titleView = document.querySelector("#titleView");
const guestView = document.querySelector("#guestView");
const rankingView = document.querySelector("#rankingView");
const contactView = document.querySelector("#contactView");
const profileView = document.querySelector("#profileView");
const galleryGrid = document.querySelector("#galleryGrid");
const selectedPhoto = document.querySelector("#selectedPhoto");
const rankingPhoto = document.querySelector("#rankingPhoto");
const titleForm = document.querySelector("#titleForm");
const titleInput = document.querySelector("#titleInput");
const guestForm = document.querySelector("#guestForm");
const guestNameInput = document.querySelector("#guestNameInput");
const rankingList = document.querySelector("#rankingList");
const backToGalleryButton = document.querySelector("#backToGalleryButton");
const rankingSelfLink = document.querySelector("#rankingSelfLink");
const authActions = document.querySelector("#authActions");
const loginButton = document.querySelector("#loginButton");
const signupButton = document.querySelector("#signupButton");
const userChip = document.querySelector("#userChip");
const userName = document.querySelector("#userName");
const profilePhoto = document.querySelector("#profilePhoto");
const pageDim = document.querySelector("#pageDim");
const profileDrawer = document.querySelector("#profileDrawer");
const drawerEdgeClose = document.querySelector("#drawerEdgeClose");
const logoutButton = document.querySelector("#logoutButton");
const drawerName = document.querySelector("#drawerName");
const drawerPhoto = document.querySelector("#drawerPhoto");
const avatarEditButton = document.querySelector("#avatarEditButton");
const avatarInput = document.querySelector("#avatarInput");
const profileEditButton = document.querySelector("#profileEditButton");
const myTitlesButton = document.querySelector("#myTitlesButton");
const myCommentsButton = document.querySelector("#myCommentsButton");
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
const contactBodyInput = document.querySelector("#contactBodyInput");
const contactMessage = document.querySelector("#contactMessage");
const contactSubmitButton = document.querySelector("#contactSubmitButton");
const toast = document.querySelector("#toast");

const legacyUserStorageKey = "title-making-google-user";
const guestStorageKey = "title-academy-guest-name";
const submissionsStorageKey = "title-academy-submissions";
const galleryImages = [
  { src: "assets/gallery/01-cat-smoke.png", alt: "Cat reaching through smoke" },
  { src: "assets/gallery/02-memorial.png", alt: "People placing flowers outside a store" },
  { src: "assets/gallery/03-alligators.jpeg", alt: "Alligators resting together" },
  { src: "assets/gallery/04-field-portrait.jpg", alt: "Person walking in a field" },
  { src: "assets/gallery/05-screaming-man.png", alt: "Man shouting in a suit" },
  { src: "assets/gallery/06-husky-bowl.jpg", alt: "Husky staring at a food bowl" },
  { src: "assets/gallery/07-puppy-oh-hi.jpg", alt: "Smiling puppy close to the camera" },
  { src: "assets/gallery/08-convenience-store.jpg", alt: "Person reaching into a convenience store cooler" },
  { src: "assets/gallery/09-reggae-singer.jpg", alt: "Reggae singer performing on stage" },
  { src: "assets/gallery/10-sparkler.jpg", alt: "Person holding a lit sparkler" },
];
const authModeButtons = [loginTabButton, signupTabButton];
const slotCount = galleryImages.length;
const maxAvatarBytes = 5 * 1024 * 1024;

localStorage.removeItem(legacyUserStorageKey);

let currentUser = null;
let currentGuestName = sessionStorage.getItem(guestStorageKey) || "";
let selectedImageIndex = null;
let pendingTitle = "";
let toastTimer;
let serverSubmissionsByImage = {};
const expandedCommentIds = new Set();
let pendingRankingFocus = null;

function createId(prefix) {
  if (globalThis.crypto?.randomUUID) {
    return `${prefix}-${globalThis.crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function getUserDisplayName() {
  return currentUser?.username || "";
}

function setCurrentUser(user) {
  currentUser = user || null;
  renderUser();

  if (!profileView.hidden) {
    hydrateProfileForm();
  }
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
            author: typeof comment.author === "string" && comment.author.trim() ? comment.author.trim() : "비회원",
            text: typeof comment.text === "string" ? comment.text : "",
            createdAt: typeof comment.createdAt === "string" ? comment.createdAt : new Date().toISOString(),
          }))
        : [];

      const normalized = {
        id: typeof entry.id === "string" ? entry.id : `legacy-title-${imageKey}-${index}`,
        author: typeof entry.author === "string" && entry.author.trim() ? entry.author.trim() : "비회원",
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

function routeToHash(state) {
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
  [homeView, titleView, guestView, rankingView, contactView, profileView].forEach((view) => {
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
    contactTypeInput.focus();
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
  const params = new URLSearchParams({
    imageIndex: String(imageIndex),
  });
  const data = await requestJson(`/api/submissions?${params.toString()}`, {
    method: "GET",
    headers: {},
  });
  serverSubmissionsByImage[String(imageIndex)] = data.submissions || [];
}

async function refreshRanking() {
  if (!Number.isInteger(selectedImageIndex)) {
    return;
  }

  try {
    await fetchServerSubmissions(selectedImageIndex);
  } catch {
    delete serverSubmissionsByImage[String(selectedImageIndex)];
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
        imageSrc: image.src,
        title: pendingTitle,
        guestName: currentUser ? "" : author,
      }),
    });
    const imageKey = String(selectedImageIndex);
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
  const imageKey = String(selectedImageIndex);
  const currentList = Array.isArray(submissions[imageKey]) ? submissions[imageKey] : [];

  submissions[imageKey] = [
    {
      id: createId("title"),
      author,
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
  const imageKey = String(selectedImageIndex);
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
  const imageKey = String(selectedImageIndex);
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
  const imageKey = String(selectedImageIndex);
  const cachedEntries = serverSubmissionsByImage[imageKey];
  const submissions = loadSubmissions();

  return Array.isArray(cachedEntries)
    ? getSortedEntries(cachedEntries)
    : Array.isArray(submissions[imageKey])
      ? getSortedEntries(submissions[imageKey])
      : [];
}

function renderGallery() {
  const fragment = document.createDocumentFragment();

  for (let index = 0; index < slotCount; index += 1) {
    const card = document.createElement("article");
    const image = galleryImages[index];

    card.className = "photo-card";
    card.dataset.imageIndex = String(index);

    if (image) {
      const photo = document.createElement("img");
      photo.className = "photo-card-image";
      photo.src = image.src;
      photo.alt = image.alt;
      photo.loading = "lazy";

      const actions = document.createElement("div");
      actions.className = "photo-card-actions";

      const rankingButton = document.createElement("button");
      rankingButton.className = "photo-action";
      rankingButton.type = "button";
      rankingButton.dataset.action = "ranking";
      rankingButton.textContent = "랭킹";

      actions.append(rankingButton);
      card.classList.add("has-image");
      card.tabIndex = 0;
      card.setAttribute("role", "button");
      card.setAttribute("aria-label", `${image.alt} 제목 입력`);
      card.append(photo, actions);
    } else {
      card.classList.add("is-empty");
      card.tabIndex = 0;
      card.setAttribute("role", "button");
      card.setAttribute("aria-label", "비어 있는 사진 칸에 사진 추가");
    }

    fragment.append(card);
  }

  galleryGrid.replaceChildren(fragment);
}

function renderRanking() {
  const image = getSelectedImage();

  if (!image) {
    return;
  }

  rankingPhoto.src = image.src;
  rankingPhoto.alt = image.alt;

  const entries = getCurrentRankingEntries();

  if (entries.length === 0) {
    const empty = document.createElement("li");
    empty.className = "ranking-empty";
    const emptyText = document.createElement("p");
    emptyText.textContent = "아직 등록된 제목이 없습니다.";

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

    const author = document.createElement("span");
    author.textContent = isMine ? `${entry.author} · 내 제목` : entry.author;

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

    const voteHint = document.createElement("span");
    voteHint.className = "vote-hint";
    voteHint.textContent = "투표는 하루에 한 번만 가능합니다.";

    const toggleButton = document.createElement("button");
    toggleButton.className = "comment-toggle";
    toggleButton.type = "button";
    toggleButton.dataset.action = "toggle-comments";
    toggleButton.dataset.entryId = entry.id;
    toggleButton.setAttribute("aria-label", isExpanded ? "댓글 접기" : "댓글 펼치기");
    toggleButton.setAttribute("aria-expanded", String(isExpanded));

    voteGroup.append(heartButton, voteHint);
    actions.append(voteGroup);

    if (isMine) {
      const deleteButton = document.createElement("button");
      deleteButton.className = "delete-button";
      deleteButton.type = "button";
      deleteButton.dataset.action = "delete-submission";
      deleteButton.dataset.entryId = entry.id;
      deleteButton.textContent = "삭제";
      deleteButton.setAttribute("aria-label", "제목 삭제");
      actions.append(deleteButton);
    }

    content.append(title, author);
    item.append(rank, content, actions, toggleButton);

    if (isExpanded) {
      item.append(createCommentsPanel(entry));
    }

    fragment.append(item);
  });

  rankingList.replaceChildren(fragment);
  applyPendingRankingFocus();
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

      const author = document.createElement("strong");
      author.textContent = comment.author;

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
    userChip.hidden = true;
    drawerName.textContent = "";
    renderAvatar(drawerPhoto, null);
    renderAvatar(profileEditPhoto, null);
    return;
  }

  const displayName = getUserDisplayName();

  authActions.hidden = true;
  userChip.hidden = false;
  userName.textContent = displayName;
  renderAvatar(profilePhoto, currentUser);
  drawerName.textContent = displayName;
  renderAvatar(drawerPhoto, currentUser);
  renderAvatar(profileEditPhoto, currentUser);
}

function renderAvatar(target, user) {
  if (!target) {
    return;
  }

  const displayName = user?.username || "";
  const imageUrl = user?.profileImageUrl || "";
  target.textContent = imageUrl ? "" : getInitials(displayName);
  target.style.backgroundImage = imageUrl ? `url("${imageUrl}")` : "";
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

function openDrawer() {
  if (!currentUser) {
    openAuthModal("login");
    return;
  }

  pageDim.hidden = false;
  profileDrawer.classList.add("is-open");
  profileDrawer.setAttribute("aria-hidden", "false");
  showDrawerMenu();
  drawerEdgeClose.focus();
}

function closeDrawer() {
  pageDim.hidden = true;
  profileDrawer.classList.remove("is-open");
  profileDrawer.setAttribute("aria-hidden", "true");
  closeDeleteAccountModal();
  closePasswordChangeModal();

  if (currentUser) {
    userChip.focus();
  }
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
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", `${entry.title} 랭킹으로 이동`);

    const image = document.createElement("img");
    image.className = "my-title-thumb";
    image.src = entry.imageSrc || galleryImages[entry.imageIndex]?.src || "";
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
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", `${comment.submissionTitle} 댓글 위치로 이동`);

    const image = document.createElement("img");
    image.className = "my-title-thumb";
    image.src = comment.imageSrc || galleryImages[comment.imageIndex]?.src || "";
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

  const entryId = button.dataset.entryId;

  if (button.dataset.action === "write-title") {
    startTitleEntry(selectedImageIndex);
    return;
  }

  if (button.dataset.action === "like") {
    const imageKey = String(selectedImageIndex);
    const serverEntries = serverSubmissionsByImage[imageKey];
    const entry = Array.isArray(serverEntries) ? serverEntries.find((item) => item.id === entryId) : null;

    if (!entry || !isServerEntry(entry)) {
      showToast("서버에 저장된 제목만 하트를 누를 수 있습니다.");
      return;
    }

    try {
      const data = await requestJson(`/api/submissions/${encodeURIComponent(entryId)}/like`, {
        method: "POST",
        body: "{}",
      });
      entry.likes = data.likes;
      entry.likedByMe = data.liked;
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

    const imageKey = String(selectedImageIndex);
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

  if (button.dataset.action === "delete-comment") {
    if (!currentUser) {
      showToast("로그인이 필요합니다.");
      openAuthModal("login");
      return;
    }

    const commentId = button.dataset.commentId;
    const imageKey = String(selectedImageIndex);
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

  const imageKey = String(selectedImageIndex);
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
      author: getActiveAuthor(),
      text,
      createdAt: new Date().toISOString(),
    });
  });
  input.value = "";
});

backToGalleryButton.addEventListener("click", goHome);
rankingSelfLink.addEventListener("click", scrollToMyRanking);

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

  contactSubmitButton.disabled = true;
  contactSubmitButton.textContent = "제출 중";

  try {
    const data = await requestJson("/api/contact", {
      method: "POST",
      body: JSON.stringify({ type, title, body }),
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

userChip.addEventListener("click", openDrawer);
drawerEdgeClose.addEventListener("click", closeDrawer);
pageDim.addEventListener("click", closeDrawer);
logoutButton.addEventListener("click", logout);
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

  openRankingLocation(Number(card.dataset.imageIndex), card.dataset.entryId);
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
  openRankingLocation(Number(card.dataset.imageIndex), card.dataset.entryId);
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

  openRankingLocation(Number(card.dataset.imageIndex), card.dataset.entryId, card.dataset.commentId);
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
  openRankingLocation(Number(card.dataset.imageIndex), card.dataset.entryId, card.dataset.commentId);
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

  if (profileDrawer.classList.contains("is-open")) {
    closeDrawer();
  }
});

async function initializeApp() {
  renderGallery();
  renderUser();
  await verifyEmailFromUrl();
  await restoreSession();
  initializeRoute();
}

initializeApp();
