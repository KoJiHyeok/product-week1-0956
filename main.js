const homeLink = document.querySelector("#homeLink");
const contactLink = document.querySelector("#contactLink");
const homeView = document.querySelector("#homeView");
const titleView = document.querySelector("#titleView");
const guestView = document.querySelector("#guestView");
const rankingView = document.querySelector("#rankingView");
const contactView = document.querySelector("#contactView");
const galleryGrid = document.querySelector("#galleryGrid");
const selectedPhoto = document.querySelector("#selectedPhoto");
const rankingPhoto = document.querySelector("#rankingPhoto");
const titleForm = document.querySelector("#titleForm");
const titleInput = document.querySelector("#titleInput");
const guestForm = document.querySelector("#guestForm");
const guestNameInput = document.querySelector("#guestNameInput");
const rankingList = document.querySelector("#rankingList");
const backToGalleryButton = document.querySelector("#backToGalleryButton");
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
const drawerMenuView = document.querySelector("#drawerMenuView");
const myTitlesView = document.querySelector("#myTitlesView");
const drawerBackButton = document.querySelector("#drawerBackButton");
const myTitleList = document.querySelector("#myTitleList");
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
const signupUsernameInput = document.querySelector("#signupUsernameInput");
const signupPasswordInput = document.querySelector("#signupPasswordInput");
const signupPasswordConfirmInput = document.querySelector("#signupPasswordConfirmInput");
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

async function signup(loginId, username, password, passwordConfirm) {
  const data = await requestAuth("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ loginId, username, password, passwordConfirm }),
  });

  setCurrentUser(data.user);
  closeAuthModal();
  showToast(`${getUserDisplayName()}님으로 가입됨`);
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
  [homeView, titleView, guestView, rankingView, contactView].forEach((view) => {
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
  const data = await requestJson(`/api/submissions?imageIndex=${encodeURIComponent(imageIndex)}`, {
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

  const imageKey = String(selectedImageIndex);
  const cachedEntries = serverSubmissionsByImage[imageKey];
  const submissions = loadSubmissions();
  const entries = Array.isArray(cachedEntries)
    ? getSortedEntries(cachedEntries)
    : Array.isArray(submissions[imageKey])
      ? getSortedEntries(submissions[imageKey])
      : [];

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
    item.className = `ranking-item${isExpanded ? " is-expanded" : ""}`;
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
    author.textContent = entry.author;

    const actions = document.createElement("div");
    actions.className = "rank-actions";

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

    actions.append(heartButton);

    if (entry.canDelete || canDeleteLocalAuthor(entry.author)) {
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

function renderUser() {
  if (!currentUser) {
    authActions.hidden = false;
    userChip.hidden = true;
    return;
  }

  const displayName = getUserDisplayName();

  authActions.hidden = true;
  userChip.hidden = false;
  userName.textContent = displayName;
  renderAvatar(profilePhoto, currentUser);
  drawerName.textContent = displayName;
  renderAvatar(drawerPhoto, currentUser);
}

function renderAvatar(target, user) {
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
  signupPasswordInput.value = "";
  signupPasswordConfirmInput.value = "";
  authModal.hidden = false;
  (mode === "signup" ? signupLoginIdInput : loginIdInput).focus();
}

function closeAuthModal() {
  loginPasswordInput.value = "";
  signupPasswordInput.value = "";
  signupPasswordConfirmInput.value = "";
  authModal.hidden = true;
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

  if (currentUser) {
    userChip.focus();
  }
}

function showDrawerMenu() {
  drawerMenuView.hidden = false;
  myTitlesView.hidden = true;
  drawerMenuView.classList.add("is-active");
  myTitlesView.classList.remove("is-active");
}

async function showMyTitles() {
  drawerMenuView.hidden = true;
  myTitlesView.hidden = false;
  drawerMenuView.classList.remove("is-active");
  myTitlesView.classList.add("is-active");
  myTitleList.replaceChildren(createMyTitleMessage("불러오는 중입니다."));

  try {
    const data = await requestJson("/api/me/submissions", { method: "GET", headers: {} });
    renderMyTitles(data.submissions || []);
  } catch (error) {
    myTitleList.replaceChildren(createMyTitleMessage(error.message));
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
    if (!currentUser) {
      showToast("로그인 후 하트를 누를 수 있습니다.");
      openAuthModal("login");
      return;
    }

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

signupForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  signupMessage.textContent = "";
  const loginId = signupLoginIdInput.value.trim();
  const username = signupUsernameInput.value.trim();
  const password = signupPasswordInput.value;
  const passwordConfirm = signupPasswordConfirmInput.value;

  if (loginId.length < 8) {
    signupMessage.textContent = "아이디는 8자리 이상이어야 합니다.";
    signupLoginIdInput.focus();
    return;
  }

  if (!username) {
    signupMessage.textContent = "사용자 이름을 입력하세요.";
    signupUsernameInput.focus();
    return;
  }

  if (password.length < 8 || !/[^A-Za-z0-9]/.test(password)) {
    signupMessage.textContent = "비밀번호는 8자리 이상이며 특수문자를 1개 이상 포함해야 합니다.";
    signupPasswordInput.focus();
    return;
  }

  if (password !== passwordConfirm) {
    signupMessage.textContent = "비밀번호가 일치하지 않습니다.";
    signupPasswordConfirmInput.focus();
    return;
  }

  try {
    await signup(loginId, username, password, passwordConfirm);
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
profileEditButton.addEventListener("click", () => {
  showToast("프로필 사진은 상단 사진을 눌러 수정할 수 있습니다.");
});
myTitlesButton.addEventListener("click", showMyTitles);
drawerBackButton.addEventListener("click", showDrawerMenu);
myTitleList.addEventListener("click", async (event) => {
  const button = event.target.closest("button[data-action='delete-my-submission']");

  if (!button) {
    return;
  }

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

  if (profileDrawer.classList.contains("is-open")) {
    closeDrawer();
  }
});

renderGallery();
renderUser();
restoreSession();
initializeRoute();
