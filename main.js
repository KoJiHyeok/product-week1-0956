const homeLink = document.querySelector("#homeLink");
const homeView = document.querySelector("#homeView");
const titleView = document.querySelector("#titleView");
const guestView = document.querySelector("#guestView");
const rankingView = document.querySelector("#rankingView");
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
const googleAuthButton = document.querySelector("#googleAuthButton");
const userChip = document.querySelector("#userChip");
const userName = document.querySelector("#userName");
const profilePhoto = document.querySelector("#profilePhoto");
const pageDim = document.querySelector("#pageDim");
const profileDrawer = document.querySelector("#profileDrawer");
const drawerClose = document.querySelector("#drawerClose");
const drawerName = document.querySelector("#drawerName");
const drawerPhoto = document.querySelector("#drawerPhoto");
const authModal = document.querySelector("#authModal");
const authTitle = document.querySelector("#authTitle");
const modalClose = document.querySelector("#modalClose");
const googleStep = document.querySelector("#googleStep");
const nameStep = document.querySelector("#nameStep");
const googleConnectButton = document.querySelector("#googleConnectButton");
const displayNameInput = document.querySelector("#displayNameInput");
const toast = document.querySelector("#toast");

const userStorageKey = "title-making-google-user";
const guestStorageKey = "title-academy-guest-name";
const submissionsStorageKey = "title-academy-submissions";
const galleryImagesStorageKey = "title-academy-gallery-images";
const slotCount = 20;
const maxStoredImageSize = 1200;
const storedImageQuality = 0.82;
const galleryImages = loadGalleryImages();
const imageUploadInput = document.createElement("input");

imageUploadInput.type = "file";
imageUploadInput.accept = "image/*";
imageUploadInput.hidden = true;
document.body.append(imageUploadInput);

let currentUser = loadUser();
let currentGuestName = sessionStorage.getItem(guestStorageKey) || "";
let selectedImageIndex = null;
let pendingUploadIndex = null;
let pendingTitle = "";
let toastTimer;
const expandedCommentIds = new Set();

function createId(prefix) {
  if (globalThis.crypto?.randomUUID) {
    return `${prefix}-${globalThis.crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function loadUser() {
  try {
    const user = JSON.parse(localStorage.getItem(userStorageKey));
    return user && typeof user.name === "string" ? user : null;
  } catch {
    return null;
  }
}

function saveUser(user) {
  localStorage.setItem(userStorageKey, JSON.stringify(user));
  currentUser = user;
}

function clearUser() {
  localStorage.removeItem(userStorageKey);
  currentUser = null;
}

function getFirebaseAuth() {
  if (!globalThis.firebase?.auth) {
    return null;
  }

  try {
    return globalThis.firebase.auth();
  } catch {
    return null;
  }
}

function userFromFirebase(firebaseUser) {
  const name = firebaseUser.displayName || firebaseUser.email || "Google 사용자";

  return {
    uid: firebaseUser.uid,
    name,
    email: firebaseUser.email || "",
    photoURL: firebaseUser.photoURL || "",
    provider: "google",
  };
}

async function signInWithGoogle() {
  const auth = getFirebaseAuth();

  if (!auth || !globalThis.firebase.auth.GoogleAuthProvider) {
    showToast("Firebase 로그인을 불러오지 못했습니다");
    return;
  }

  const provider = new globalThis.firebase.auth.GoogleAuthProvider();
  provider.setCustomParameters({
    prompt: "select_account",
  });

  googleConnectButton.disabled = true;

  try {
    const credential = await auth.signInWithPopup(provider);
    const firebaseUser = credential.user;

    if (!firebaseUser) {
      showToast("Google 로그인 정보를 가져오지 못했습니다");
      return;
    }

    const signedInUser = userFromFirebase(firebaseUser);
    saveUser(signedInUser);
    closeAuthModal();
    renderUser();
    showToast(`${signedInUser.name}님으로 로그인됨`);
  } catch (error) {
    if (error.code === "auth/popup-closed-by-user") {
      showToast("Google 로그인이 취소되었습니다");
      return;
    }

    showToast("Google 로그인에 실패했습니다");
  } finally {
    googleConnectButton.disabled = false;
  }
}

function watchFirebaseAuth() {
  const auth = getFirebaseAuth();

  if (!auth) {
    renderUser();
    return;
  }

  auth.onAuthStateChanged((firebaseUser) => {
    if (firebaseUser) {
      saveUser(userFromFirebase(firebaseUser));
    } else if (currentUser?.provider === "google" && currentUser.uid) {
      clearUser();
    }

    renderUser();
  });
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

function loadGalleryImages() {
  try {
    const savedImages = JSON.parse(localStorage.getItem(galleryImagesStorageKey));

    if (!Array.isArray(savedImages)) {
      return Array.from({ length: slotCount }, () => null);
    }

    return Array.from({ length: slotCount }, (_, index) => {
      const image = savedImages[index];

      if (!image || typeof image.src !== "string") {
        return null;
      }

      return {
        src: image.src,
        alt: typeof image.alt === "string" ? image.alt : `사용자 이미지 ${index + 1}`,
      };
    });
  } catch {
    return Array.from({ length: slotCount }, () => null);
  }
}

function saveGalleryImages() {
  localStorage.setItem(galleryImagesStorageKey, JSON.stringify(galleryImages));
}

function openImagePicker(index) {
  pendingUploadIndex = index;
  imageUploadInput.value = "";
  imageUploadInput.click();
}

function saveUploadedImage(index, file) {
  if (!file.type.startsWith("image/")) {
    showToast("이미지 파일만 선택할 수 있습니다");
    return;
  }

  const image = new Image();
  const objectUrl = URL.createObjectURL(file);

  image.addEventListener("load", () => {
    const scale = Math.min(1, maxStoredImageSize / Math.max(image.naturalWidth, image.naturalHeight));
    const width = Math.max(1, Math.round(image.naturalWidth * scale));
    const height = Math.max(1, Math.round(image.naturalHeight * scale));
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (!context) {
      URL.revokeObjectURL(objectUrl);
      showToast("사진을 처리하지 못했습니다");
      return;
    }

    canvas.width = width;
    canvas.height = height;
    context.drawImage(image, 0, 0, width, height);

    galleryImages[index] = {
      src: canvas.toDataURL("image/jpeg", storedImageQuality),
      alt: file.name ? file.name.replace(/\.[^.]+$/, "") : `사용자 이미지 ${index + 1}`,
    };

    try {
      saveGalleryImages();
      renderGallery();
      showToast("사진이 추가되었습니다");
    } catch (error) {
      galleryImages[index] = null;
      showToast("사진 용량이 커서 저장하지 못했습니다");
    } finally {
      URL.revokeObjectURL(objectUrl);
    }
  });

  image.addEventListener("error", () => {
    URL.revokeObjectURL(objectUrl);
    showToast("사진을 불러오지 못했습니다");
  });

  image.src = objectUrl;
}

function getInitials(name) {
  const cleanName = name.trim();
  return cleanName.slice(0, 2).toUpperCase() || "U";
}

function getSelectedImage() {
  return galleryImages[selectedImageIndex];
}

function getActiveAuthor() {
  return currentUser?.name || currentGuestName || "비회원";
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

  return "#home";
}

function parseRouteFromHash(hash) {
  const cleanHash = hash.replace(/^#/, "");

  if (!cleanHash || cleanHash === "home") {
    return { view: "home" };
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
  [homeView, titleView, guestView, rankingView].forEach((view) => {
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

function addSubmission(author) {
  const image = getSelectedImage();

  if (!image || !pendingTitle) {
    goHome();
    return;
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

      const challengeButton = document.createElement("button");
      challengeButton.className = "photo-action";
      challengeButton.type = "button";
      challengeButton.dataset.action = "challenge";
      challengeButton.textContent = "도전";

      const rankingButton = document.createElement("button");
      rankingButton.className = "photo-action";
      rankingButton.type = "button";
      rankingButton.dataset.action = "ranking";
      rankingButton.textContent = "랭킹";

      actions.append(challengeButton, rankingButton);
      card.classList.add("has-image");
      card.tabIndex = 0;
      card.setAttribute("role", "button");
      card.setAttribute("aria-label", `${image.alt} 도전`);
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

  const submissions = loadSubmissions();
  const entries = Array.isArray(submissions[String(selectedImageIndex)])
    ? getSortedEntries(submissions[String(selectedImageIndex)])
    : [];

  if (entries.length === 0) {
    const empty = document.createElement("li");
    empty.className = "ranking-empty";
    empty.textContent = "아직 등록된 제목이 없습니다.";
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
    rank.textContent = String(index + 1);

    const content = document.createElement("div");
    content.className = "rank-content";

    const title = document.createElement("strong");
    title.textContent = entry.title;

    const author = document.createElement("span");
    author.textContent = entry.author;

    const heartButton = document.createElement("button");
    heartButton.className = "heart-button";
    heartButton.type = "button";
    heartButton.dataset.action = "like";
    heartButton.dataset.entryId = entry.id;
    heartButton.setAttribute("aria-label", "하트 누르기");
    heartButton.innerHTML = `<span class="heart-icon" aria-hidden="true"></span><span>${entry.likes}</span>`;

    const toggleButton = document.createElement("button");
    toggleButton.className = "comment-toggle";
    toggleButton.type = "button";
    toggleButton.dataset.action = "toggle-comments";
    toggleButton.dataset.entryId = entry.id;
    toggleButton.setAttribute("aria-label", isExpanded ? "댓글 접기" : "댓글 펼치기");
    toggleButton.setAttribute("aria-expanded", String(isExpanded));

    content.append(title, author);
    item.append(rank, content, heartButton, toggleButton);

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

      const author = document.createElement("strong");
      author.textContent = comment.author;

      const text = document.createElement("span");
      text.textContent = comment.text;

      item.append(author, text);
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

  authActions.hidden = true;
  userChip.hidden = false;
  userName.textContent = currentUser.name;
  profilePhoto.textContent = getInitials(currentUser.name);
  drawerName.textContent = currentUser.name;
  drawerPhoto.textContent = getInitials(currentUser.name);
}

function openAuthModal() {
  authTitle.textContent = "Google 계정 연동";
  authModal.hidden = false;
  googleStep.classList.add("is-active");
  nameStep.classList.remove("is-active");
  displayNameInput.value = "";
  googleConnectButton.focus();
}

function closeAuthModal() {
  authModal.hidden = true;
}

function openDrawer() {
  if (!currentUser) {
    openAuthModal();
    return;
  }

  pageDim.hidden = false;
  profileDrawer.classList.add("is-open");
  profileDrawer.setAttribute("aria-hidden", "false");
  drawerClose.focus();
}

function closeDrawer() {
  pageDim.hidden = true;
  profileDrawer.classList.remove("is-open");
  profileDrawer.setAttribute("aria-hidden", "true");
  userChip.focus();
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

galleryGrid.addEventListener("click", (event) => {
  const actionButton = event.target.closest(".photo-action");
  const card = event.target.closest(".photo-card");

  if (!card) {
    return;
  }

  const imageIndex = Number(card.dataset.imageIndex);

  if (card.classList.contains("is-empty")) {
    openImagePicker(imageIndex);
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

  const card = event.target.closest(".photo-card");

  if (!card) {
    return;
  }

  event.preventDefault();
  const imageIndex = Number(card.dataset.imageIndex);

  if (card.classList.contains("is-empty")) {
    openImagePicker(imageIndex);
    return;
  }

  startTitleEntry(imageIndex);
});

imageUploadInput.addEventListener("change", () => {
  const file = imageUploadInput.files?.[0];

  if (pendingUploadIndex === null || !file) {
    pendingUploadIndex = null;
    return;
  }

  saveUploadedImage(pendingUploadIndex, file);
  pendingUploadIndex = null;
});

titleForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const title = titleInput.value.trim();

  if (!title) {
    titleInput.focus();
    return;
  }

  pendingTitle = title;

  if (currentUser) {
    addSubmission(currentUser.name);
    return;
  }

  guestNameInput.value = currentGuestName;
  navigateTo({ view: "guest", imageIndex: selectedImageIndex });
});

guestForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const guestName = guestNameInput.value.trim();

  if (!guestName) {
    guestNameInput.focus();
    return;
  }

  currentGuestName = guestName;
  sessionStorage.setItem(guestStorageKey, guestName);
  addSubmission(guestName);
});

rankingList.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");

  if (!button) {
    return;
  }

  const entryId = button.dataset.entryId;

  if (button.dataset.action === "like") {
    updateSubmission(entryId, (entry) => {
      entry.likes += 1;
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

rankingList.addEventListener("submit", (event) => {
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

  updateSubmission(entryId, (entry) => {
    entry.comments.push({
      id: createId("comment"),
      author: getActiveAuthor(),
      text,
      createdAt: new Date().toISOString(),
    });
  });
});

backToGalleryButton.addEventListener("click", goHome);

googleAuthButton.addEventListener("click", (event) => {
  event.preventDefault();
  signInWithGoogle();
});

modalClose.addEventListener("click", closeAuthModal);

authModal.addEventListener("click", (event) => {
  if (event.target === authModal) {
    closeAuthModal();
  }
});

googleConnectButton.addEventListener("click", () => {
  if (currentUser) {
    closeAuthModal();
    renderUser();
    showToast(`${currentUser.name}님으로 로그인됨`);
    return;
  }

  signInWithGoogle();
});

nameStep.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = displayNameInput.value.trim();

  if (!name) {
    displayNameInput.focus();
    return;
  }

  saveUser({
    name,
    provider: "google",
  });

  closeAuthModal();
  renderUser();
  showToast(`${name}님으로 시작합니다`);
});

userChip.addEventListener("click", openDrawer);
drawerClose.addEventListener("click", closeDrawer);
pageDim.addEventListener("click", closeDrawer);

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
watchFirebaseAuth();
initializeRoute();
