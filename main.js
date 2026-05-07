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
const slotCount = 20;
const galleryImages = [
  {
    src: "assets/images/25ra4.png",
    alt: "연기 속에서 손을 뻗는 고양이",
  },
  {
    src: "assets/images/25ra3.png",
    alt: "가게 앞 추모 꽃다발",
  },
  {
    src: "assets/images/kyaw-tun-BYQejz-foZk-unsplash.jpeg",
    alt: "나란히 있는 악어 세 마리",
  },
  {
    src: "assets/images/celine-cao-TOvJ9JYQdTE-unsplash.jpg",
    alt: "들판을 걷는 검은 옷의 사람",
  },
  {
    src: "assets/images/cage-screaming-edited.png",
    alt: "양팔을 벌리고 소리치는 남자",
  },
  {
    src: "assets/images/40-completely-normal-objects-the-canine-community-says-turn-their-brave-doggos-into-big-babies.jpg",
    alt: "밥그릇 앞에서 놀란 표정의 강아지",
  },
  {
    src: "assets/images/26-snuggly-springtime-sweethearts-for-a-sunny-pet-filled-scroll.jpg",
    alt: "노란 테두리 안의 웃는 강아지",
  },
  {
    src: "assets/images/retail-convenience-store-employees-horrible-bosses-workplace-story-employment-employment-45281285.jpg",
    alt: "냉장고에서 물병을 꺼내는 사람",
  },
  {
    src: "assets/images/alwayswrite-reggae-10264258_1920.jpg",
    alt: "무대에서 노래하는 레게 가수",
  },
  {
    src: "assets/images/moroznaya_photo-woman-7999748_1920.jpg",
    alt: "손에 폭죽을 들고 있는 사람",
  },
];

let currentUser = loadUser();
let currentGuestName = sessionStorage.getItem(guestStorageKey) || "";
let selectedImageIndex = null;
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

function showView(viewToShow) {
  [homeView, titleView, guestView, rankingView].forEach((view) => {
    view.hidden = view !== viewToShow;
  });
  window.scrollTo({ top: 0, behavior: "auto" });
}

function goHome() {
  selectedImageIndex = null;
  pendingTitle = "";
  titleInput.value = "";
  guestNameInput.value = "";
  showView(homeView);
}

function startTitleEntry(index) {
  const image = galleryImages[index];

  if (!image) {
    showToast("사진이 없는 칸입니다");
    return;
  }

  selectedImageIndex = index;
  pendingTitle = "";
  selectedPhoto.src = image.src;
  selectedPhoto.alt = image.alt;
  titleInput.value = "";
  showView(titleView);
  titleInput.focus();
}

function showRanking(index) {
  const image = galleryImages[index];

  if (!image) {
    showToast("사진이 없는 칸입니다");
    return;
  }

  selectedImageIndex = index;
  pendingTitle = "";
  renderRanking();
  showView(rankingView);
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
  pendingTitle = "";
  renderRanking();
  showView(rankingView);
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
      card.setAttribute("aria-label", "비어 있는 사진 칸");
    }

    fragment.append(card);
  }

  galleryGrid.replaceChildren(fragment);
}

function renderRanking() {
  const image = getSelectedImage();

  if (!image) {
    goHome();
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

  if (!card || card.classList.contains("is-empty")) {
    return;
  }

  const imageIndex = Number(card.dataset.imageIndex);

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

  if (!card || card.classList.contains("is-empty")) {
    return;
  }

  event.preventDefault();
  startTitleEntry(Number(card.dataset.imageIndex));
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
  showView(guestView);
  guestNameInput.focus();
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
  openAuthModal();
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

  googleStep.classList.remove("is-active");
  nameStep.classList.add("is-active");
  displayNameInput.focus();
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
showView(homeView);
