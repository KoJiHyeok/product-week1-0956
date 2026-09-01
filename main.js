import {
  getInitials,
  formatDate,
  escapeSelector,
  decodeRouteImageKey,
  getSortedEntries,
  getLatestEntries,
  getFileExtension,
  formatFileSize,
  validateContactImage,
  getTextList,
  getImagePrompt,
  niceAxisMax,
  formatChartDay,
  getReportTargetLabel,
  getReportReasonLabel,
  getAdminContentStatusLabel,
} from "./js/utils.js";

const homeLink = document.querySelector("#homeLink");
const contactLink = document.querySelector("#contactLink");
const uploadNavButton = document.querySelector("#uploadNavButton");
const adminNavButton = document.querySelector("#adminNavButton");
const homeView = document.querySelector("#homeView");
const galleryView = document.querySelector("#galleryView");
const uploadView = document.querySelector("#uploadView");
const titleView = document.querySelector("#titleView");
const guestView = document.querySelector("#guestView");
const rankingView = document.querySelector("#rankingView");
const randomView = document.querySelector("#randomView");
const contactView = document.querySelector("#contactView");
const profileView = document.querySelector("#profileView");
const adminView = document.querySelector("#adminView");
const partyView = document.querySelector("#partyView");
const topSiteNav = document.querySelector(".top-site-nav");
const galleryGrid = document.querySelector("#galleryGrid");
const feedTabsEl = document.querySelector("#feedTabs");
const pastGalleryLink = document.querySelector("#pastGalleryLink");
const feedTitleCtaButton = document.querySelector("#feedTitleCtaButton");
const feedListEl = document.querySelector("#feedList");
const feedEmptyEl = document.querySelector("#feedEmpty");
const feedMoreButtonEl = document.querySelector("#feedMoreButton");
const sideHofButton = document.querySelector("#sideHofButton");
const selectedPhoto = document.querySelector("#selectedPhoto");
const rankingPhoto = document.querySelector("#rankingPhoto");
const randomPhoto = document.querySelector("#randomPhoto");
const selectedImageBrief = document.querySelector("#selectedImageBrief");
const rankingImageBrief = document.querySelector("#rankingImageBrief");
const randomImageBrief = document.querySelector("#randomImageBrief");
const randomEntryButton = document.querySelector("#randomEntryButton");
const randomBackButton = document.querySelector("#randomBackButton");
const randomShuffleButton = document.querySelector("#randomShuffleButton");
const randomTitleButton = document.querySelector("#randomTitleButton");
const randomRankingButton = document.querySelector("#randomRankingButton");
const titleForm = document.querySelector("#titleForm");
const titleInput = document.querySelector("#titleInput");
const titleSubmitButton = titleForm.querySelector('button[type="submit"]');
const guestForm = document.querySelector("#guestForm");
const guestNameInput = document.querySelector("#guestNameInput");
const guestSubmitButton = guestForm.querySelector('button[type="submit"]');
const rankingList = document.querySelector("#rankingList");
const rankingTabs = document.querySelectorAll(".ranking-tab");
const galleryMoreButton = document.querySelector("#galleryMoreButton");
const backToGalleryButton = document.querySelector("#backToGalleryButton");
const rankingSelfLink = document.querySelector("#rankingSelfLink");
const shareBanner = document.querySelector("#shareBanner");
const shareBannerButton = document.querySelector("#shareBannerButton");
const shareBannerClose = document.querySelector("#shareBannerClose");
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
const drawerProvider = document.querySelector("#drawerProvider");
const drawerPhoto = document.querySelector("#drawerPhoto");
const drawerProfile = document.querySelector(".drawer-profile");
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
const signupLoginIdHint = document.querySelector("#signupLoginIdHint");
const signupEmailInput = document.querySelector("#signupEmailInput");
const signupUsernameInput = document.querySelector("#signupUsernameInput");
const signupPasswordInput = document.querySelector("#signupPasswordInput");
const signupPasswordConfirmInput = document.querySelector("#signupPasswordConfirmInput");
const privacyAgreeInput = document.querySelector("#privacyAgreeInput");
const termsAgreeInput = document.querySelector("#termsAgreeInput");
const passwordResetLink = document.querySelector("#passwordResetLink");
const loginMessage = document.querySelector("#loginMessage");
const signupMessage = document.querySelector("#signupMessage");
const authSocial = document.querySelector("#authSocial");
const googleAuthButton = document.querySelector("#googleAuthButton");
const naverAuthButton = document.querySelector("#naverAuthButton");
const contactForm = document.querySelector("#contactForm");
const contactTypeInput = document.querySelector("#contactTypeInput");
const contactTitleInput = document.querySelector("#contactTitleInput");
const contactReplyEmailInput = document.querySelector("#contactReplyEmailInput");
const contactBodyInput = document.querySelector("#contactBodyInput");
const contactImageInput = document.querySelector("#contactImageInput");
const contactAttachmentDropzone = document.querySelector("#contactAttachmentDropzone");
const contactAttachmentPreview = document.querySelector("#contactAttachmentPreview");
const contactAttachmentImage = document.querySelector("#contactAttachmentImage");
const contactAttachmentName = document.querySelector("#contactAttachmentName");
const contactAttachmentSize = document.querySelector("#contactAttachmentSize");
const contactAttachmentRemoveButton = document.querySelector("#contactAttachmentRemoveButton");
const contactMessage = document.querySelector("#contactMessage");
const contactSubmitButton = document.querySelector("#contactSubmitButton");
const contactAccessNotice = document.querySelector("#contactAccessNotice");
const contactAccessMessage = document.querySelector("#contactAccessMessage");
const contactAccessLoginButton = document.querySelector("#contactAccessLoginButton");
const imageSuggestionButton = document.querySelector("#imageSuggestionButton");
const imageUploadMessage = document.querySelector("#imageUploadMessage");
const uploadCancelButton = document.querySelector("#uploadCancelButton");
const adminImageMessage = document.querySelector("#adminImageMessage");
const adminImageList = document.querySelector("#adminImageList");
const adminCurrentUser = document.querySelector("#adminCurrentUser");
const adminRoleBadge = document.querySelector("#adminRoleBadge");
const adminTabs = document.querySelectorAll("[data-admin-section]");
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
const authorProfileModal = document.querySelector("#authorProfileModal");
const authorProfileCloseButton = document.querySelector("#authorProfileCloseButton");
const authorProfileAvatar = document.querySelector("#authorProfileAvatar");
const authorProfileName = document.querySelector("#authorProfileName");
const authorProfileType = document.querySelector("#authorProfileType");
const authorProfileBio = document.querySelector("#authorProfileBio");
const authorProfileStats = document.querySelector("#authorProfileStats");
const authorProfileActions = document.querySelector("#authorProfileActions");
const authorProfileMessageButton = document.querySelector("#authorProfileMessageButton");
const authorTitleList = document.querySelector("#authorTitleList");
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

const analyticsMeasurementId = "G-0LLKZ9R1TF";
const clarityProjectId = "wme6uejz4h";
const trackingConsentStorageKey = "title-academy-tracking-consent";
const cookieSettingsStorageKey = "title-academy-cookie-settings";
const themeStorageKey = "title-academy-theme";
const visitDateStorageKey = "title-academy-visit-date";
const guestStorageKey = "title-academy-guest-name";
const submissionsStorageKey = "title-academy-submissions";
const photoSourcePresets = Object.freeze({
  curated: Object.freeze({
    sourceName: "제목 학원 운영자 검토 갤러리",
    sourceUrl: "https://jemokhakwon.com/about",
    author: "제목 학원",
    license: "사이트 내 제목 연습용으로 검토된 이미지",
    attributionRequired: false,
    commercialUseAllowed: false,
    modificationAllowed: false,
  }),
});
// 관리자가 승인한 정적 이미지는 assets/gallery에 파일을 넣고 아래 목록에 추가하면 공개됩니다.
// 예: { src: "assets/gallery/example.webp", title: "이미지 제목", description: "이미지 설명", observationPoints: [], exampleTitles: [] }
const defaultGalleryImages = [
  {
    id: "photo-001",
    imageKey: "0",
    src: "assets/gallery/01-cat-smoke.png",
    webpSrc: "assets/gallery/webp/01-cat-smoke.webp",
    title: "빛과 먼지 사이로 손을 뻗은 고양이",
    description: "창가의 빛과 공기 중 먼지가 겹치며 고양이의 움직임이 무대처럼 보이는 사진입니다. 장면의 몽환적인 분위기와 고양이의 호기심을 함께 살리면 좋은 제목을 만들 수 있습니다.",
    alt: "햇빛과 연기처럼 보이는 먼지 사이로 앞발을 뻗는 고양이",
    prompt: "빛, 먼지, 앞발의 방향을 단서로 삼아 고양이가 무엇을 잡으려는지 상상해보세요.",
    observationPoints: ["창문에서 들어오는 강한 역광", "연기처럼 퍼지는 먼지의 결", "몸을 길게 세운 고양이의 집중한 자세"],
    exampleTitles: ["오늘의 사냥감은 햇빛", "먼지를 붙잡는 방법", "창가 마법 수업"],
    ...photoSourcePresets.curated,
  },
  {
    id: "photo-003",
    imageKey: "2",
    src: "assets/gallery/03-alligators.jpeg",
    webpSrc: "assets/gallery/webp/03-alligators.webp",
    title: "나란히 쉬는 악어들의 낮은 시선",
    description: "여러 악어가 같은 방향을 바라보며 몸을 겹쳐 쉬고 있는 장면입니다. 표정이 크게 드러나지 않아도 배열, 눈높이, 질감을 이용하면 긴장감 있는 제목을 만들 수 있습니다.",
    alt: "뿌리와 흙 위에 여러 악어가 겹쳐 쉬고 있는 모습",
    prompt: "비슷한 자세로 모인 악어들의 시선과 표정을 회의나 대기 상황처럼 바꿔 생각해보세요.",
    observationPoints: ["한 방향을 향한 여러 개의 눈", "거친 피부와 나무뿌리의 질감", "가까운 거리에서 느껴지는 긴장감"],
    exampleTitles: ["습지 회의 시작 전", "누가 먼저 움직일까", "조용한 압박 면접"],
    ...photoSourcePresets.curated,
  },
  {
    id: "photo-004",
    imageKey: "3",
    src: "assets/gallery/04-field-portrait.jpg",
    webpSrc: "assets/gallery/webp/04-field-portrait.webp",
    title: "흐린 들판을 걸어오는 검은 옷의 인물",
    description: "넓은 하늘과 낮은 지평선, 어두운 옷의 인물이 대비되는 사진입니다. 공간의 여백이 크기 때문에 감정의 온도와 거리감을 제목에 담기 좋습니다.",
    alt: "흐린 하늘 아래 풀밭을 걸어오는 검은 옷의 인물",
    prompt: "넓은 빈 하늘과 작은 인물 사이의 거리감을 제목의 핵심 감정으로 잡아보세요.",
    observationPoints: ["화면 대부분을 차지하는 흐린 하늘", "검은 옷과 들판의 색 대비", "정면으로 걸어오는 느린 움직임"],
    exampleTitles: ["하늘이 먼저 도착한 날", "말수가 적은 들판", "혼자 걷는 오후"],
    ...photoSourcePresets.curated,
  },
  {
    id: "photo-007",
    imageKey: "6",
    src: "assets/gallery/07-puppy-oh-hi.jpg",
    webpSrc: "assets/gallery/webp/07-puppy-oh-hi.webp",
    title: "카메라 가까이 다가온 웃는 강아지",
    description: "강아지의 얼굴이 화면 중앙을 가득 채우고 배경은 흐릿하게 밀려난 사진입니다. 직접 말을 거는 느낌, 첫 만남의 밝은 에너지를 제목으로 표현하기 좋습니다.",
    alt: "노란 테두리 안에서 카메라를 향해 웃는 강아지",
    prompt: "가까운 얼굴과 밝은 표정을 살려 짧은 인사말이나 등장 장면처럼 제목을 만들어보세요.",
    observationPoints: ["렌즈 가까이 다가온 코와 눈", "입을 벌린 밝은 표정", "노란 테두리가 만든 사진 속 사진 효과"],
    exampleTitles: ["처음 뵙겠습니다, 간식 있나요", "친해지는 속도 2초", "오늘의 햇살 담당"],
    ...photoSourcePresets.curated,
  },
  {
    id: "photo-008",
    imageKey: "7",
    src: "assets/gallery/08-convenience-store.jpg",
    webpSrc: "assets/gallery/webp/08-convenience-store.webp",
    title: "냉장고 문 사이로 물을 고르는 순간",
    description: "한 손에는 음료를 들고 다른 손으로 생수를 고르는 장면입니다. 일상적인 선택이지만 유리문, 시선, 손의 위치가 작은 이야기의 시작점이 됩니다.",
    alt: "편의점 냉장고 문을 열고 큰 생수병을 집는 사람",
    prompt: "평범한 구매 장면을 가장 진지한 선택의 순간처럼 바꿔보세요.",
    observationPoints: ["열린 냉장고 문과 반사된 얼굴", "이미 손에 든 음료와 새로 고르는 생수", "옆사람의 어깨가 만든 관찰자 시점"],
    exampleTitles: ["수분 보충의 갈림길", "이미 골랐지만 다시 고른다", "편의점 앞 중대한 결정"],
    ...photoSourcePresets.curated,
  },
  {
    id: "photo-009",
    imageKey: "8",
    src: "assets/gallery/09-reggae-singer.jpg",
    webpSrc: "assets/gallery/webp/09-reggae-singer.webp",
    title: "노란 조명 아래 노래하는 무대 위 가수",
    description: "강한 무대 조명과 마이크를 잡은 손, 크게 열린 입이 공연의 에너지를 전달합니다. 소리의 크기와 조명의 색을 제목 안에서 함께 느끼게 만드는 연습에 좋습니다.",
    alt: "노란 무대 조명 아래 마이크를 잡고 노래하는 가수",
    prompt: "사진에 들리지 않는 소리를 제목으로 떠올려보세요. 조명 색과 표정이 좋은 단서입니다.",
    observationPoints: ["노란색으로 가득한 무대 조명", "마이크에 가까이 붙은 얼굴", "손과 표정에서 느껴지는 힘"],
    exampleTitles: ["조명이 먼저 따라 부른 밤", "목소리가 노랗게 번졌다", "마이크와의 거리 0센티"],
    ...photoSourcePresets.curated,
  },
  {
    id: "photo-010",
    imageKey: "9",
    src: "assets/gallery/10-sparkler.jpg",
    webpSrc: "assets/gallery/webp/10-sparkler.webp",
    title: "손끝에서 타오르는 작은 불꽃",
    description: "초점은 불꽃에 맞고 인물은 흐릿하게 배경으로 물러난 사진입니다. 짧게 타오르는 순간, 손의 위치, 어두운 배경을 이용해 감성적인 제목을 만들 수 있습니다.",
    alt: "손에 든 스파클러가 어두운 배경 앞에서 빛나는 장면",
    prompt: "짧게 사라지는 불꽃의 시간감을 제목에 담아보세요.",
    observationPoints: ["선명한 불꽃과 흐릿한 얼굴의 대비", "어두운 배경에 남는 작은 빛", "손끝에 집중된 화면 구성"],
    exampleTitles: ["사라지기 전 가장 밝은 말", "손끝의 작은 여름", "밤이 잠깐 웃은 순간"],
    ...photoSourcePresets.curated,
  },
  {
    id: "subject-1",
    imageKey: "10",
    src: "assets/gallery/Subject1.jpg",
    title: "눈가에 눈물이 맺힌 노인의 얼굴",
    description: "가까운 얼굴 사진에서 주름, 눈가의 물기, 아래로 향한 시선이 감정의 밀도를 만듭니다. 직접적인 판단보다 오래 머문 표정의 결을 제목으로 다듬기 좋은 이미지입니다.",
    alt: "눈가에 눈물이 맺힌 노인이 아래를 바라보는 클로즈업",
    prompt: "표정의 이유를 단정하지 말고, 눈빛과 주름이 남기는 감정만 짧게 붙잡아보세요.",
    observationPoints: ["눈가에 맺힌 작은 눈물", "깊게 잡힌 이마와 눈가의 주름", "정면이 아닌 아래로 향한 시선"],
    exampleTitles: ["말보다 먼저 고인 것", "오래된 오후의 얼굴", "삼킨 문장의 무게"],
    ...photoSourcePresets.curated,
  },
  {
    id: "subject-2",
    imageKey: "11",
    src: "assets/gallery/Subject2.png",
    title: "개구리 조각상 앞에 모인 사람들",
    description: "붉은 제복의 사람들이 개구리 조각상 앞에서 예를 갖추고, 주변 사람들은 놀란 표정으로 바라보는 익살스러운 장면입니다. 중앙 사물과 주변 반응의 차이를 제목으로 살리기 좋습니다.",
    alt: "붉은 제복을 입은 사람들이 개구리 조각상 앞에 모이고 주변 사람들이 놀라는 장면",
    prompt: "주인공처럼 앉아 있는 개구리와 주변 사람들의 과한 반응을 대비시켜보세요.",
    observationPoints: ["중앙에 앉은 개구리 조각상", "붉은 제복을 입은 사람들의 공손한 자세", "뒤쪽 관람객들의 놀란 표정"],
    exampleTitles: ["오늘의 의전 대상", "개구리 회장님 입장", "예상보다 엄숙한 행사"],
    ...photoSourcePresets.curated,
  },
  {
    id: "subject-3",
    imageKey: "12",
    src: "assets/gallery/Subject3.png",
    title: "거대한 무가 날아오는 만화풍 추격 장면",
    description: "속도선, 말풍선, 놀란 표정이 한눈에 들어오는 만화풍 이미지입니다. 과장된 크기와 빠른 움직임을 이용해 짧고 강한 제목을 만들 수 있습니다.",
    alt: "만화풍 배경에서 거대한 무가 날아오고 두 인물이 놀라 달아나는 장면",
    prompt: "무의 크기, 속도선, 말풍선의 반응을 이용해 황당한 위기 제목을 붙여보세요.",
    observationPoints: ["화면을 가로지르는 거대한 무", "속도를 강조하는 파란 선", "상반된 두 인물의 표정과 대사"],
    exampleTitles: ["채소계 최종 보스", "반찬이 아니라 재난", "오늘의 급식은 추격전"],
    ...photoSourcePresets.curated,
  },
  {
    id: "subject-4",
    imageKey: "13",
    src: "assets/gallery/Subject4.png",
    title: "카메라 속 개구리 사진을 함께 보는 사람들",
    description: "카메라 화면 속 사진을 보며 여러 사람이 동시에 웃는 장면입니다. 사진 안의 사진 구조와 사람들의 표정이 제목의 단서가 됩니다.",
    alt: "아이들과 사진가가 카메라 화면 속 웃는 개구리 사진을 보며 웃는 장면",
    prompt: "카메라 화면 안의 작은 사진과 바깥 사람들의 웃음이 어떻게 연결되는지 제목으로 표현해보세요.",
    observationPoints: ["카메라 화면에 보이는 작은 개구리 사진", "한곳으로 모인 사람들의 시선", "웃음이 번지는 얼굴들"],
    exampleTitles: ["웃음이 저장되었습니다", "오늘의 모델은 화면 안에", "사진 확인 시간 1초 만에 합격"],
    ...photoSourcePresets.curated,
  },
  {
    id: "subject-5",
    imageKey: "14",
    src: "assets/gallery/Subject5.png",
    title: "진료실 구석에서 팔짱 낀 아기와 난감한 의사",
    description: "작은 아기가 정장을 입고 팔짱을 낀 채 서 있고, 의사는 얼굴을 감싸고 있습니다. 크기와 태도의 반전이 강해 짧은 대사형 제목을 만들기 좋습니다.",
    alt: "진료실에서 정장을 입은 아기가 팔짱을 끼고 서 있고 의사가 고개를 숙인 장면",
    prompt: "아기의 작은 몸과 어른스러운 자세가 만드는 반전을 제목의 중심으로 잡아보세요.",
    observationPoints: ["팔짱을 낀 아기의 단호한 자세", "얼굴을 감싼 의사의 난감한 몸짓", "옆에 있는 눈을 가린 조각상"],
    exampleTitles: ["담당의 호출하겠습니다", "오늘 진료는 제가 봅니다", "작지만 결재권 있음"],
    ...photoSourcePresets.curated,
  },
  {
    id: "subject-6",
    imageKey: "15",
    src: "assets/gallery/Subject6.png",
    title: "개구리 심사위원 앞에서 걷는 붉은 제복들",
    description: "무대 위 패션 쇼처럼 보이는 장면에서 개구리 캐릭터가 10점 팻말을 들고 있습니다. 심사, 자세, 무대 조명이라는 단서를 묶어 유머러스한 제목을 만들 수 있습니다.",
    alt: "무대에서 붉은 제복을 입은 사람들이 걷고 개구리 심사위원이 10점 팻말을 든 장면",
    prompt: "심사위원처럼 앉은 개구리와 런웨이 분위기를 연결해보세요.",
    observationPoints: ["10점 팻말을 든 개구리", "줄지어 걷는 붉은 제복의 사람들", "무대 조명과 심사표 소품"],
    exampleTitles: ["자세 점수 만점", "개구리의 냉정한 10점", "런웨이를 지배한 심사위원"],
    ...photoSourcePresets.curated,
  },
  {
    id: "subject-7",
    imageKey: "16",
    src: "assets/gallery/Subject7.png",
    title: "사라진 감자튀김 앞에서 우는 조각상과 남자",
    description: "눈물을 폭포처럼 흘리는 조각상, 함께 우는 인물, 바닥의 감자튀김 하나가 과장된 비극을 만듭니다. 사소한 원인과 큰 반응의 대비가 제목 포인트입니다.",
    alt: "감자튀김 하나가 떨어진 테이블 앞에서 조각상과 남자가 크게 우는 만화풍 장면",
    prompt: "아주 작은 사건을 세상 끝난 일처럼 표현하는 과장법을 써보세요.",
    observationPoints: ["폭포처럼 쏟아지는 눈물", "테이블 위에 남은 감자튀김 하나", "말풍선과 안내판이 알려주는 사건의 단서"],
    exampleTitles: ["감자튀김 하나의 장례식", "소스보다 짠 눈물", "잃어버린 한 조각의 시대"],
    ...photoSourcePresets.curated,
  },
  {
    id: "subject-9",
    imageKey: "18",
    src: "assets/gallery/Subject9.png",
    title: "군복 입은 아기 교관과 의자에 앉은 개구리",
    description: "군사 훈련장처럼 꾸며진 공간에서 아기가 막대를 들고 설명하고, 개구리는 편하게 앉아 있습니다. 엄숙한 배경과 작은 교관의 반전이 유머를 만듭니다.",
    alt: "군복을 입은 아기가 지도 위에서 막대를 들고 설명하고 개구리가 의자에 앉은 장면",
    prompt: "엄숙한 훈련장과 작은 교관의 크기 차이를 제목의 반전으로 사용해보세요.",
    observationPoints: ["테이블 위에 선 작은 교관", "뒤쪽 벽의 해골 표시와 훈련 문구", "느긋하게 앉아 있는 개구리"],
    exampleTitles: ["오늘 교관님은 기저귀 사이즈", "멘붕 대비 특별 훈련", "작전명 낮잠 금지"],
    ...photoSourcePresets.curated,
  },
  {
    id: "subject-10",
    imageKey: "19",
    src: "assets/gallery/Subject10.png",
    title: "사무실 복도를 질주하는 금붕어 배달원",
    description: "금붕어 얼굴을 한 정장 차림 인물이 작은 스쿠터를 타고 복도를 달리는 초현실적인 장면입니다. 사무실의 딱딱함과 엉뚱한 속도감을 연결하면 재미있는 제목이 됩니다.",
    alt: "어항 같은 헬멧을 쓴 금붕어 얼굴의 정장 인물이 빨간 스쿠터를 타고 사무실 복도를 달리는 장면",
    prompt: "사무실 복도라는 익숙한 공간에 갑자기 등장한 속도감을 제목으로 잡아보세요.",
    observationPoints: ["금붕어 얼굴과 둥근 투명 헬멧", "빨간 스쿠터와 휘날리는 넥타이", "무심히 지나가는 사무실 사람들"],
    exampleTitles: ["5분 안에 회의실 도착", "물 밖의 긴급 결재", "복도 주행 금지 구역"],
    ...photoSourcePresets.curated,
  },
  {
    id: "subject-11",
    imageKey: "20",
    src: "assets/gallery/Subject11.png",
    title: "찜질방에서 휴대폰을 보는 고양이",
    description: "수건을 두른 고양이가 오이팩을 하고 누워 스마트폰을 보고 있습니다. 휴식 공간과 디지털 몰입의 대비가 명확해 생활형 유머 제목에 어울립니다.",
    alt: "찜질방에서 수건을 두르고 오이팩을 한 고양이가 누워 휴대폰을 보는 장면",
    prompt: "편안해야 할 휴식 시간에 휴대폰을 놓지 못하는 모습을 제목으로 표현해보세요.",
    observationPoints: ["눈 위의 오이팩과 수건", "배 위에 놓인 담요와 손에 든 휴대폰", "뒤쪽 찜질방 분위기와 음식 소품"],
    exampleTitles: ["힐링 중 알림 확인", "찜질방도 와이파이가 중요해", "오이팩 아래 실시간 검색"],
    ...photoSourcePresets.curated,
  },
  {
    id: "subject-12",
    imageKey: "21",
    src: "assets/gallery/Subject12.png",
    title: "편의점 컵라면 코너에서 장보는 알파카",
    description: "밤의 편의점에서 알파카가 장바구니를 들고 컵라면 진열대를 바라보는 장면입니다. 익숙한 쇼핑 동작과 낯선 주인공의 조합이 제목의 재미를 만듭니다.",
    alt: "편의점 컵라면 진열대 앞에서 장바구니를 든 알파카가 상품을 고르는 장면",
    prompt: "컵라면을 고르는 평범한 순간을 알파카의 취향 고민으로 바꿔보세요.",
    observationPoints: ["한 줄 가득 놓인 컵라면 진열대", "장바구니를 든 알파카의 앞발", "밤 편의점의 밝은 조명"],
    exampleTitles: ["야식 취향이 복슬복슬", "알파카의 매운맛 상담", "장바구니가 말한 오늘의 기분"],
    ...photoSourcePresets.curated,
  },

  {
    id: "imm-012",
    imageKey: "33",
    src: "assets/gallery/offended-cat.jpg",
    title: "주방 조리대 위, 서운함이 가득한 고양이",
    description: "조리대 위에 앉은 고양이가 눈을 가늘게 뜨고 귀를 살짝 젖힌 채 카메라를 바라보는 사진입니다. 표정에서 묘하게 서운함이 읽혀, 사람의 대사처럼 바꾸면 짧고 재미있는 제목을 만들 수 있습니다.",
    alt: "주방 조리대 위에서 눈을 가늘게 뜨고 서운한 표정을 짓는 주황색 고양이",
    prompt: "가늘게 뜬 눈과 젖힌 귀를 단서로, 고양이가 방금 무슨 일을 겪었는지 한 문장 대사로 상상해보세요.",
    observationPoints: ["가늘게 뜬 눈과 살짝 젖힌 귀", "정면을 향한 서운한 듯한 시선", "조리대 위로 들어온 부드러운 자연광"],
    exampleTitles: ["간식 약속, 안 지켰지", "나 방금 다 봤어", "오늘부터 말 안 해"],
    ...photoSourcePresets.curated,
  },
  {
    id: "imm-013",
    imageKey: "23",
    src: "assets/gallery/24-funny-red-polo.jpg",
    title: "빨간 셔츠를 입고 곁눈질로 웃는 남자",
    description: "회색 칠판 같은 배경 앞에서 한 남자가 시선을 옆으로 흘리며 입꼬리를 올린 사진입니다. 표정을 사실로 단정하기보다 곁눈질과 참는 듯한 미소가 만드는 장난스러운 분위기를 살리면 좋은 제목을 만들 수 있습니다.",
    alt: "회색 칠판 배경 앞에서 빨간 폴로 셔츠를 입고 옆을 곁눈질하며 웃는 남자",
    prompt: "옆으로 새는 시선과 참는 듯한 미소를 한 문장 속마음처럼 바꿔보세요.",
    observationPoints: ["옆으로 흘긋 향한 곁눈질", "입꼬리만 올린 참는 듯한 미소", "선명한 빨간 셔츠와 회색 배경의 대비"],
    exampleTitles: ["나 부른 거 다 들었어", "안 웃으려고 했는데", "방금 그 농담 말이지"],
    ...photoSourcePresets.curated,
  },
  {
    id: "imm-014",
    imageKey: "24",
    src: "assets/gallery/suit-tiny-desk-gimbap.png",
    title: "유치원 작은 의자에 앉아 김밥을 먹는 정장 청년",
    description: "어린이집 교실의 작은 책상과 의자에 정장을 입은 청년이 몸을 접고 앉아 김밥을 먹는 사진입니다. 큰 사람과 작은 가구의 크기 대비, 진지한 옷차림과 소박한 김밥의 어긋남을 제목의 중심으로 잡으면 좋습니다.",
    alt: "어린이집 교실의 노란 작은 책상과 의자에 정장을 입은 청년이 앉아 김밥을 집어 먹는 모습",
    prompt: "어른의 정장과 아이용 가구가 만드는 크기 차이를 한 장면의 상황극처럼 상상해보세요.",
    observationPoints: ["몸에 비해 한참 작은 노란 책상과 의자", "각 잡힌 검은 정장과 넥타이", "책상 위에 놓인 김밥 한 줄"],
    exampleTitles: ["첫 출근, 자리 배정 완료", "점심시간은 평등하다", "오늘부터 이 반 담임입니다"],
    ...photoSourcePresets.curated,
  },
  {
    id: "imm-015",
    imageKey: "25",
    src: "assets/gallery/pigeon-steals-fry.png",
    title: "감자튀김을 채 가는 비둘기와 놀란 남자",
    description: "야외 식당에서 한 남자가 입을 벌린 사이, 비둘기가 감자튀김 하나를 물고 날아오르는 순간을 잡은 사진입니다. 음식을 가운데 두고 사람과 새의 시선·동작이 부딪치는 찰나를 짧고 재미있게 표현하기 좋습니다.",
    alt: "야외 식당 테이블에서 남자가 입을 벌리고 놀라는 사이 비둘기가 감자튀김을 물고 날아오르는 장면",
    prompt: "사람과 새의 동작이 겹치는 찰나를 한 문장 대사로 바꿔보세요.",
    observationPoints: ["감자튀김을 문 채 날개를 편 비둘기", "크게 벌어진 남자의 입과 눈", "접시 위에 남은 햄버거와 감자튀김"],
    exampleTitles: ["그건 내 거였는데", "기습은 위에서 온다", "점심값 두 명분"],
    ...photoSourcePresets.curated,
  },
  {
    id: "imm-016",
    imageKey: "26",
    src: "assets/gallery/suit-bathtub-newspaper.png",
    title: "옷을 입은 채 욕조에 앉아 신문을 읽는 남자",
    description: "물 없는 욕조 안에 정장을 입은 남자가 신발까지 신은 채 앉아 신문을 펼친 사진입니다. 장소와 행동이 어긋나는 상황을 침착한 태도와 묶어 능청스러운 제목으로 풀면 어울립니다.",
    alt: "타일 욕실의 욕조 안에 정장과 구두 차림으로 앉아 신문을 펼쳐 읽는 남자",
    prompt: "엉뚱한 장소에서 너무 태연한 태도의 간극을 제목의 웃음 포인트로 잡아보세요.",
    observationPoints: ["옷과 구두를 갖춘 채 욕조에 앉은 자세", "양손으로 펼친 신문", "물기 없는 마른 욕조와 샤워 커튼"],
    exampleTitles: ["여기가 제일 조용해서요", "오늘자 욕조 라운지", "방해 금지 구역"],
    ...photoSourcePresets.curated,
  },
  {
    id: "imm-017",
    imageKey: "27",
    src: "assets/gallery/shocked-home-selfie.png",
    title: "두 손으로 볼을 감싸고 크게 놀란 표정의 여성",
    description: "거실에서 한 여성이 양손으로 볼을 감싸고 입을 크게 벌려 과장되게 놀라는 표정의 셀카입니다. 표정의 강도와 정면 구도를 그대로 살려 짧고 강한 한마디 제목을 붙이는 연습에 좋습니다.",
    alt: "집 거실에서 양손으로 볼을 감싸고 입을 크게 벌린 채 눈을 크게 뜬 여성의 셀카",
    prompt: "과장된 표정 하나만으로 어떤 소식을 들은 순간인지 상상해 제목으로 옮겨보세요.",
    observationPoints: ["볼을 감싼 두 손", "크게 벌어진 입과 치켜뜬 눈썹", "정면을 가득 채운 얼굴 구도"],
    exampleTitles: ["설마 진짜야?", "방금 뭐라고 했어", "이번 달 카드값"],
    ...photoSourcePresets.curated,
  },
  {
    id: "imm-018",
    imageKey: "28",
    src: "assets/gallery/laptop-in-shopping-cart.png",
    title: "마트 카트 안에 앉아 노트북으로 일하는 남자",
    description: "채소 코너 앞에서 정장을 입은 남자가 쇼핑 카트 안에 들어가 앉아 무릎에 노트북을 올리고 일하는 사진입니다. 일상 공간과 업무 자세의 어긋남을 살리면 직장인의 피로를 담은 제목을 만들기 좋습니다.",
    alt: "마트 채소 코너 앞에서 정장을 입은 남자가 쇼핑 카트 안에 앉아 노트북을 무릎에 올리고 작업하는 모습",
    prompt: "장소만 마트일 뿐 자세는 사무실인 이 간극을 한 문장으로 정리해보세요.",
    observationPoints: ["카트 안에 들어가 앉은 자세", "무릎 위에 펼친 노트북", "뒤로 늘어선 채소 진열대"],
    exampleTitles: ["재택의 끝은 어디인가", "장 보다가 회의 잡힘", "여기도 와이파이 됩니다"],
    ...photoSourcePresets.curated,
  },
  {
    id: "imm-019",
    imageKey: "29",
    src: "assets/gallery/cookbook-in-shower.png",
    title: "샤워 부스 안에 서서 요리책을 읽는 남자",
    description: "유리 샤워 부스 안에 셔츠와 넥타이 차림의 남자가 서서 두꺼운 요리책을 펼쳐 읽는 사진입니다. 장소와 행동이 맞지 않는 상황을 무표정한 태도와 함께 담담한 제목으로 풀면 어울립니다.",
    alt: "유리 샤워 부스 안에 셔츠와 넥타이 차림으로 서서 요리책을 펼쳐 읽는 남자",
    prompt: "엉뚱한 칸에 들어가 평범한 일을 하는 사람의 사정을 한 문장으로 짐작해보세요.",
    observationPoints: ["좁은 샤워 부스 안에 선 자세", "두 손으로 펼친 요리책", "셔츠·넥타이와 젖지 않은 욕실"],
    exampleTitles: ["여기서만 집중이 돼요", "오늘 저녁 메뉴 연구 중", "한 칸짜리 서재"],
    ...photoSourcePresets.curated,
  },
  {
    id: "imm-020",
    imageKey: "30",
    src: "assets/gallery/cat-steals-pizza.png",
    title: "피자를 낚아채 가는 고양이와 놀란 남자",
    description: "소파에 앉은 남자가 입을 벌린 사이, 고양이가 몸을 날려 피자 조각을 채 가는 순간을 흔들린 화면으로 잡은 사진입니다. 빠른 움직임과 놀란 표정이 겹치는 찰나를 짧고 재미있는 제목으로 옮기기 좋습니다.",
    alt: "거실 소파에서 남자가 입을 벌리고 놀라는 사이 고양이가 피자 조각을 물어 채 가는 흔들린 순간",
    prompt: "흔들린 화면이 만드는 속도감을 그대로 살려 사건의 순간을 제목으로 잡아보세요.",
    observationPoints: ["피자로 몸을 날린 고양이의 잔상", "크게 벌어진 남자의 입", "흔들려 번진 거실 배경"],
    exampleTitles: ["선빵은 고양이가", "내 피자 어디 갔어", "민첩성 만렙"],
    ...photoSourcePresets.curated,
  },
  {
    id: "imm-021",
    imageKey: "31",
    src: "assets/gallery/title-academy-cat-student.png",
    webpSrc: "assets/gallery/webp/title-academy-cat-student.webp",
    title: "교실 책상 앞에 앉아 공책을 펴 둔 고양이",
    description: "햇빛이 드는 교실에서 주황색 고양이가 책상 앞 의자에 앉아 빈 공책과 연필꽂이를 앞에 둔 사진입니다. 학생처럼 보이는 자세와 텅 빈 공책의 대비를 살리면 공부와 시작에 얽힌 제목을 만들기 좋습니다.",
    alt: "햇빛 드는 교실의 나무 책상 앞 의자에 앉아 빈 공책과 색연필꽂이를 앞에 둔 주황색 고양이",
    prompt: "사람 학생의 책상에 앉은 고양이를 무엇을 배우러 온 학생처럼 상상해보세요.",
    observationPoints: ["책상 앞에 단정히 앉은 고양이", "펼쳐진 빈 공책과 연필 한 자루", "창으로 들어오는 따뜻한 햇빛과 교실 책장"],
    exampleTitles: ["오늘 첫 수업입니다", "제목 짓기 1교시", "아직 한 글자도 못 썼다"],
    ...photoSourcePresets.curated,
  },
  {
    id: "imm-022",
    imageKey: "34",
    src: "assets/gallery/shore-crab-in-hand.jpg",
    webpSrc: "assets/gallery/webp/shore-crab-in-hand.webp",
    title: "바닷가에서 두 집게를 치켜든 게",
    description: "검은 바위가 이어진 해안에서 사람이 게의 배가 보이도록 손 위에 올려 든 사진입니다. 몸집보다 크게 벌린 두 집게와 붙잡힌 처지가 대비되어, 당당한 대사형 제목을 붙이기 좋습니다.",
    alt: "검은 바위 해안을 배경으로 사람 손 위에서 배를 보인 채 두 집게를 치켜든 게",
    prompt: "붙잡힌 상황에서도 두 집게를 높이 든 게가 어떤 말을 하고 있을지 짧은 대사로 상상해보세요.",
    observationPoints: ["좌우로 크게 치켜든 밝은색 집게", "손바닥 위로 드러난 게의 배와 여러 다리", "잔잔한 바다와 검은 바위 해안"],
    exampleTitles: ["잡힌 건 난데 항복은 네가 해", "두 집게 들었으니 덤벼", "오늘 해변의 최종 보스"],
    ...photoSourcePresets.curated,
    sourceName: "사용자 제공 이미지",
    sourceUrl: "",
    author: "사용자 제공",
    license: "사용자가 사이트 게시를 위해 제공한 이미지",
  },
  {
    id: "imm-023",
    imageKey: "35",
    src: "assets/gallery/giant-nose-side-eye.png",
    webpSrc: "assets/gallery/webp/giant-nose-side-eye.webp",
    title: "커다란 코 너머로 곁눈질하는 남자",
    description: "화면 대부분을 차지하는 커다란 코를 중심으로, 양옆 눈이 비스듬히 흐르고 입꼬리는 살짝 올라간 AI 생성 일러스트입니다. 과장된 얼굴 비율과 묘한 표정을 살려 눈치 보기나 딴생각을 담은 대사형 제목을 붙이기 좋습니다.",
    alt: "커다란 코가 화면 중앙을 가득 채우고 옆으로 곁눈질하며 살짝 웃는 남자의 AI 생성 일러스트",
    prompt: "화면을 가득 채운 코와 옆으로 흐르는 눈동자, 올라간 입꼬리를 단서로 들킨 순간의 속마음을 상상해보세요.",
    observationPoints: ["화면 중앙을 가득 채운 과장된 코", "양옆으로 비스듬히 흐르는 눈동자", "살짝 올라간 입꼬리와 턱의 짧은 수염"],
    exampleTitles: ["코앞인데 못 본 척", "나 안 봤는데", "눈치만 살짝 두고 갑니다"],
    sourceName: "사용자 제공 AI 생성 이미지",
    sourceUrl: "",
    author: "사용자 제공",
    license: "사용자가 사이트 게시를 위해 제공한 AI 생성 이미지",
    attributionRequired: false,
    commercialUseAllowed: false,
    modificationAllowed: false,
    publishedAt: "2026-07-15",
    updatedAt: "2026-07-15",
  },
  {
    id: "imm-024",
    imageKey: "36",
    src: "assets/gallery/raincoat-duck-bus-stop.png",
    title: "비 오는 버스 정류장에서 함께 기다리는 여성과 오리",
    description: "비 내리는 저녁 버스 정류장에서 투명 우산을 든 정장 차림의 여성과 노란 우비를 입은 오리가 나란히 버스를 기다리는 듯 서 있는 AI 생성 사진입니다. 익숙한 퇴근길 풍경에 자연스럽게 섞인 뜻밖의 동행을 살리면 담담하면서도 재미있는 제목을 만들기 좋습니다.",
    alt: "비 오는 저녁 버스 정류장에서 투명 우산을 든 정장 차림의 여성 옆에 노란 우비를 입은 오리가 나란히 서 있는 모습",
    prompt: "평범한 퇴근길에 너무 자연스럽게 합류한 오리를 오래 알고 지낸 동행처럼 상상해보세요.",
    observationPoints: ["투명 우산을 들고 버스를 기다리는 정장 차림의 여성", "사람처럼 노란 우비를 입고 나란히 선 오리", "빗물에 불빛이 번지는 도로와 다가오는 버스"],
    exampleTitles: ["오늘도 같은 정류장", "퇴근길 동료가 조금 노랗다", "비 오는 날의 단골 승객"],
    ...photoSourcePresets.curated,
    sourceName: "제목 학원 AI 생성 이미지",
    author: "제목 학원",
    license: "사이트 내 제목 연습용으로 생성·검토된 이미지",
    publishedAt: "2026-08-03",
    updatedAt: "2026-08-03",
  },
  {
    id: "imm-025",
    imageKey: "37",
    src: "assets/gallery/robot-vacuum-elevator.png",
    title: "수건을 싣고 엘리베이터를 기다리는 로봇청소기",
    description: "아파트 복도에서 로봇청소기가 접은 수건을 등에 올린 채 엘리베이터 문 앞에 멈춰 선 AI 생성 사진입니다. 너무 평범한 배달 업무처럼 보이는 태연함과 뜻밖의 주인공을 살리면 능청스러운 제목을 만들기 좋습니다.",
    alt: "아파트 복도 엘리베이터 앞에서 접은 흰 수건을 등에 올리고 기다리는 로봇청소기",
    prompt: "엘리베이터를 기다리는 로봇청소기가 수건을 어디로 배달하려는지 일상적인 심부름처럼 상상해보세요.",
    observationPoints: ["엘리베이터 문을 향해 반듯하게 멈춘 로봇청소기", "본체 위에 가지런히 접힌 흰 수건", "사람 없이 조용한 아파트 복도"],
    exampleTitles: ["수건 배달 왔습니다", "버튼만 좀 눌러주세요", "오늘도 층간 배송 중"],
    ...photoSourcePresets.curated,
    sourceName: "제목 학원 AI 생성 이미지",
    author: "제목 학원",
    license: "사이트 내 제목 연습용으로 생성·검토된 이미지",
    publishedAt: "2026-08-04",
    updatedAt: "2026-08-04",
  },
  {
    id: "imm-026",
    imageKey: "38",
    src: "assets/gallery/plant-rain-bench.png",
    title: "비 오는 공원 벤치 아래로 피신한 화분",
    description: "빗줄기가 내리는 공원에서 작은 화분 하나가 벤치 아래 마른 자리를 찾아 들어간 듯 놓여 있는 AI 생성 사진입니다. 비를 좋아할 것 같은 식물이 오히려 비를 피한다는 반전과 쓸쓸한 자세를 담담하게 풀면 재미있는 제목이 됩니다.",
    alt: "비가 내리는 공원의 나무 벤치 아래에서 빗줄기를 피하듯 놓여 있는 작은 화분",
    prompt: "비를 피하려 벤치 아래로 들어온 화분에게 오늘 비가 왜 부담스러운지 짧은 속마음을 붙여보세요.",
    observationPoints: ["벤치 아래의 마른 자리에 놓인 작은 화분", "바닥과 배경을 촘촘히 적시는 빗줄기", "사람 없이 비어 있는 공원 벤치"],
    exampleTitles: ["오늘은 물 충분해요", "비도 가끔은 과합니다", "잠깐만 말리고 갈게요"],
    ...photoSourcePresets.curated,
    sourceName: "제목 학원 AI 생성 이미지",
    author: "제목 학원",
    license: "사이트 내 제목 연습용으로 생성·검토된 이미지",
    publishedAt: "2026-08-04",
    updatedAt: "2026-08-04",
  },
  {
    id: "imm-027",
    imageKey: "39",
    src: "assets/gallery/wide-angle-nose-selfie.jpg",
    title: "카메라에 코부터 들이민 초근접 셀카",
    description: "카메라를 얼굴 바로 앞에 대고 찍어 코가 화면 한가운데를 가득 채우고, 두 눈은 옆쪽을 흘겨보는 초근접 사진입니다. 렌즈와의 거리 때문에 과장된 코와 딴 데를 보는 눈빛의 대비를 살리면 재치 있는 제목을 만들기 좋습니다.",
    alt: "카메라를 아주 가까이 대고 찍어 코가 화면 중앙을 가득 채운 사람의 얼굴 클로즈업. 두 눈은 옆쪽을 바라보고 있고 오른쪽 아래에 카무플라주 무늬 소매가 걸쳐 있다.",
    prompt: "코가 먼저 도착한 이 얼굴이 지금 눈으로 무엇을 보고 있을지 짧은 대사로 상상해보세요.",
    observationPoints: ["화면 중앙을 가득 채운 확대된 코", "옆쪽을 향한 두 눈과 살짝 올라간 눈썹", "오른쪽 아래로 걸친 카무플라주 무늬 소매"],
    exampleTitles: ["코 먼저 입장했습니다", "눈은 딴 데 보는 중", "거리 조절 실패한 하루"],
    ...photoSourcePresets.curated,
    sourceName: "사용자 제공 이미지",
    sourceUrl: "",
    author: "사용자 제공",
    license: "사용자가 사이트 게시를 위해 제공한 이미지",
    publishedAt: "2026-08-13",
    updatedAt: "2026-08-13",
  },
  {
    id: "imm-028",
    imageKey: "40",
    src: "assets/gallery/tug-of-war-rope-snap.png",
    title: "줄이 풀린 순간 동시에 뒤로 넘어진 두 참가자",
    description: "동네 운동회 줄다리기에서 줄이 갑자기 느슨해진 순간, 양쪽 선두 참가자가 서로 반대 방향으로 넘어지고 심판은 아직 초시계만 바라보는 AI 생성 사진입니다. 동시에 무너진 자세와 뒤늦은 주변 반응을 다른 관계나 사건으로 바꾸어 보면 재치 있는 제목을 만들기 좋습니다.",
    alt: "동네 운동회 줄다리기 도중 줄이 느슨해져 양쪽 선두 참가자가 반대 방향으로 넘어지고 뒤의 심판은 초시계를 보는 모습",
    prompt: "서로 반대편에 있던 두 사람이 정확히 같은 순간 당황한 장면을 팀이나 관계가 끊어진 순간처럼 상상해보세요.",
    observationPoints: ["반대 방향으로 동시에 기울어진 두 참가자", "바닥에 느슨하게 풀린 줄과 피어오른 흙먼지", "사건을 아직 눈치채지 못한 채 초시계를 보는 심판"],
    exampleTitles: ["단톡방에서 팀장 나간 직후", "동시에 손절하면 생기는 일", "팀워크가 먼저 결승선을 넘었다"],
    ...photoSourcePresets.curated,
    sourceName: "제목 학원 AI 생성 이미지",
    author: "제목 학원",
    license: "사이트 내 제목 연습용으로 생성·검토된 이미지",
    publishedAt: "2026-08-15",
    updatedAt: "2026-08-15",
  },
  {
    id: "imm-029",
    imageKey: "41",
    src: "assets/gallery/wedding-veil-runaway-child.png",
    title: "단체사진 중 신부 베일 아래로 달려간 아이",
    description: "야외 결혼식 단체사진을 찍는 동안 한 아이가 신부의 긴 베일 아래로 들어가 반대편으로 달려가고, 뒤늦게 알아챈 어른이 손을 뻗는 AI 생성 사진입니다. 사진을 위해 멈춘 어른들과 혼자 움직이는 아이의 속도 차이를 살리면 뜻밖의 사건을 상상하기 좋습니다.",
    alt: "야외 결혼식 단체사진을 찍는 신부와 가족 옆에서 어린아이가 긴 베일 아래로 들어가 달려가고 한 어른이 손을 뻗는 모습",
    prompt: "모두 사진을 위해 멈춘 순간 혼자 다른 목적지를 향해 달리는 아이에게 급한 사정을 붙여보세요.",
    observationPoints: ["카메라를 향해 자세를 유지하는 신부와 가족", "긴 베일 아래로 몸을 숙여 달리는 아이", "상황을 뒤늦게 발견하고 손을 뻗는 어른"],
    exampleTitles: ["막차 문 닫히기 1초 전", "사진 찍기 싫은 사람 발견", "피로연 첫 접시 선점"],
    ...photoSourcePresets.curated,
    sourceName: "제목 학원 AI 생성 이미지",
    author: "제목 학원",
    license: "사이트 내 제목 연습용으로 생성·검토된 이미지",
    publishedAt: "2026-08-15",
    updatedAt: "2026-08-15",
  },
  {
    id: "imm-030",
    imageKey: "42",
    src: "assets/gallery/dog-tows-fishing-boat.png",
    webpSrc: "assets/gallery/webp/dog-tows-fishing-boat.webp",
    title: "부두에서 밧줄을 물고 배를 끌어당기는 개",
    description: "작은 어선이 부두에 닿으려는 순간, 개가 팽팽한 밧줄을 입에 물고 뒤로 버티고 어부는 배 위에서 손을 뻗는 AI 생성 사진입니다. 밧줄 양쪽의 진지한 표정과 엇갈린 힘의 방향을 구조, 견인, 관계의 장면으로 바꾸면 여러 이야기를 만들기 좋습니다.",
    alt: "나무 부두에서 개가 어선의 밧줄을 입에 물고 뒤로 당기며 배 위의 어부가 손을 뻗는 모습",
    prompt: "밧줄 양끝에서 서로를 바라보는 개와 어부 중 누가 누구를 돕고 있는지 바꾸어 상상해보세요.",
    observationPoints: ["밧줄을 입에 물고 네 발로 버티는 개", "배 위에서 개를 향해 손을 뻗는 어부", "부두와 작은 어선 사이를 팽팽하게 잇는 밧줄"],
    exampleTitles: ["퇴근 5분 전 추가 업무", "이번 정류장은 육지입니다", "견인 서비스 도착했습니다"],
    ...photoSourcePresets.curated,
    sourceName: "제목 학원 AI 생성 이미지",
    author: "제목 학원",
    license: "사이트 내 제목 연습용으로 생성·검토된 이미지",
    publishedAt: "2026-08-19",
    updatedAt: "2026-08-19",
  },
  {
    id: "imm-031",
    imageKey: "43",
    src: "assets/gallery/overturned-wheelbarrow-garden.jpg",
    webpSrc: "assets/gallery/webp/overturned-wheelbarrow-garden.webp",
    title: "외발수레가 넘어진 텃밭에서 마주 본 두 사람",
    description: "공동 텃밭 한가운데 외발수레가 옆으로 넘어져 흙과 모종이 길에 쏟아지고, 나무판을 든 사람과 장갑 낀 사람이 서로를 바라보는 AI 생성 사진입니다. 사고 직후의 어색한 거리와 엇갈린 표정을 인수인계나 책임 공방 같은 다른 상황으로 바꾸면 여러 이야기를 만들기 좋습니다.",
    alt: "공동 텃밭 길에서 외발수레가 넘어져 흙과 모종이 쏟아진 가운데 나무판을 든 사람과 장갑 낀 사람이 서로 바라보는 모습",
    prompt: "사고 현장을 사이에 두고 서로를 바라보는 두 사람이 어떤 설명이나 변명을 주고받는 순간인지 상상해보세요.",
    observationPoints: ["길 한가운데 옆으로 넘어진 외발수레", "흙더미 사이에 흩어진 화분과 모종", "거리를 둔 채 서로를 바라보는 두 사람의 표정"],
    exampleTitles: ["제가 맡았을 땐 서 있었습니다", "분갈이 범위가 좀 넓습니다", "인수인계는 여기까지입니다"],
    ...photoSourcePresets.curated,
    sourceName: "제목 학원 AI 생성 이미지",
    author: "제목 학원",
    license: "사이트 내 제목 연습용으로 생성·검토된 이미지",
    publishedAt: "2026-09-01",
    updatedAt: "2026-09-01",
  },
];

// 정적 사진은 목록 끝에 append하는 순서를 게시 순서로 삼는다. 표시용 복사본만
// 뒤집어 기존 imageKey와 저장된 제목 연결을 그대로 유지한다.
const newestDefaultGalleryImages = defaultGalleryImages.slice().reverse();
const authModeButtons = [loginTabButton, signupTabButton];
const maxAvatarBytes = 5 * 1024 * 1024;
const imageSuggestionType = "이미지 제안";
// 서버(D1 BLOB) 보관 상한과 같은 값. 넘으면 제출 전에 축소한다.
const maxSuggestionImageBytes = 1_500_000;
const suggestionMaxImageEdge = 1600;
const galleryInitialCount = newestDefaultGalleryImages.length;
const galleryPageSize = 0;
const gallerySlugOverrides = Object.freeze({
  "photo-001": "cat-smoke",
});

let currentUser = null;
let galleryImages = newestDefaultGalleryImages.map((image, index) => ({
  ...image,
  imageKey: String(image.imageKey ?? index),
  isUserUpload: false,
}));
let currentGuestName = sessionStorage.getItem(guestStorageKey) || "";
let selectedImageIndex = null;
let pendingTitle = "";
let isTitleSubmitting = false;
let pendingShareSubmission = null;
const dismissedShareSubmissionIds = new Set();
let activeReportImage = null;
let activeAdminSection = "dashboard";
let currentAdminRole = "user";
const adminFilters = {
  images: "pending",
  submissions: "all",
  submissionsStatus: "active",
  reports: "new",
  inquiries: "new",
};
let activeReportTarget = null;
let activeRankingTab = "popular";
let activeTheme = "dark";
let toastTimer;
let selectedContactImage = null;
let selectedContactImageUrl = "";
let serverSubmissionsByImage = {};
const expandedCommentIds = new Set();
let pendingRankingFocus = null;
let activeUserProfile = null;
let activeAuthorProfile = null;
let authorProfileRequestId = 0;
let activeMessageRecipient = null;
let visibleGalleryCount = Math.min(galleryInitialCount, galleryImages.length);
let analyticsScriptsLoaded = false;

const FEED_WINDOW_ORDER = ["12h", "today", "week", "all"];
const FEED_PAGE_SIZE = 20;
let activeFeedWindow = "12h";
let feedOffset = 0;
let feedItems = [];
let feedLoading = false;

function createId(prefix) {
  if (globalThis.crypto?.randomUUID) {
    return `${prefix}-${globalThis.crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function getGalleryDetailPath(image, index) {
  const fallbackSlug = `photo-${String(index + 1).padStart(3, "0")}`;
  const rawSlug = gallerySlugOverrides[image?.id] || image?.slug || image?.id || fallbackSlug;
  const safeSlug = String(rawSlug).toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "") || fallbackSlug;
  return `/gallery/${safeSlug}/`;
}

function getSystemTheme() {
  return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

// 우선순위: 사용자가 토글로 고른 값 > 시스템 설정 > 라이트.
// 명시적 선택이 없으면 data-theme을 비워 CSS 미디어쿼리가 시스템을 따르게 한다.
function initializeTheme() {
  const storedTheme = localStorage.getItem(themeStorageKey);

  if (storedTheme === "light" || storedTheme === "dark") {
    activeTheme = storedTheme;
    document.documentElement.dataset.theme = activeTheme;
  } else {
    activeTheme = getSystemTheme();
    delete document.documentElement.dataset.theme;

    const media = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)");
    media?.addEventListener?.("change", (event) => {
      if (!localStorage.getItem(themeStorageKey)) {
        activeTheme = event.matches ? "dark" : "light";
        updateThemeToggle();
      }
    });
  }

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
      ads: false,
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
    saveCookieSettings({ analytics: true, ads: false });
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
    ads: false,
    saved: true,
  };
  localStorage.setItem(cookieSettingsStorageKey, JSON.stringify(next));
  localStorage.setItem(trackingConsentStorageKey, next.analytics || next.ads ? "accepted" : "rejected");
  consentBanner.hidden = true;

  if (next.analytics) {
    loadTrackingScripts(next);
  }
}

// 개인정보를 저장하지 않는 first-party 방문자 집계용 하루 1회 비콘. 쿠키 동의와 무관하게 항상 전송한다.
function recordDailyVisit() {
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());

  if (localStorage.getItem(visitDateStorageKey) === today) {
    return;
  }

  try {
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/visit");
    } else {
      fetch("/api/visit", { method: "POST", keepalive: true }).catch(() => {});
    }
  } catch {
    // 비콘 전송 실패는 UX에 영향을 주지 않는다.
  }

  localStorage.setItem(visitDateStorageKey, today);
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

  // AdSense is intentionally not loaded in this interactive SPA during review.
  // Reintroduce ads only on content-rich static pages with their own consent-gated loader.
}

function loadGoogleAnalytics() {
  if (document.querySelector(`script[src*="googletagmanager.com/gtag/js?id=${analyticsMeasurementId}"]`)) {
    return;
  }

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

function canSubmitContact() {
  return Boolean(currentUser && currentUser.authProvider === "password" && currentUser.emailVerified);
}

function getContactAccessMessage() {
  if (!currentUser) {
    return "문의는 이메일 가입 회원만 이용할 수 있습니다. 로그인 또는 회원가입 후 이메일 인증을 완료해주세요.";
  }

  if (currentUser.authProvider !== "password") {
    return "문의는 이메일로 가입한 회원만 이용할 수 있습니다. 이메일 가입 계정으로 로그인해주세요.";
  }

  if (!currentUser.emailVerified) {
    return "문의 제출은 이메일 인증 후 가능합니다. 가입 이메일의 인증 링크를 확인해주세요.";
  }

  return "";
}

function renderContactAccessState() {
  const allowed = canSubmitContact();

  contactAccessNotice.hidden = allowed;
  contactAccessMessage.textContent = getContactAccessMessage();
  contactSubmitButton.disabled = !allowed;
}

function setCurrentUser(user) {
  currentUser = user || null;
  renderUser();
  renderContactAccessState();
  closeUserPopover();
  closeNotificationPanel();
  syncPartyIdentityFields?.();

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
  return currentUser?.role === "admin" || currentUser?.role === "owner";
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
    const error = new Error(data.message || "요청 처리 중 오류가 발생했습니다.");
    error.status = response.status;
    error.code = data.code || "";
    throw error;
  }

  return data;
}

async function requestFormJson(path, formData, options = {}) {
  const response = await fetch(path, {
    credentials: "include",
    ...options,
    body: formData,
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
        imageKey: String(image.imageKey ?? index),
        isUserUpload: Boolean(image.isUserUpload),
      }));
      visibleGalleryCount = galleryImages.length;
      renderGallery();
    }
    renderMonthlyRanking(Array.isArray(data.monthlyRanking) ? data.monthlyRanking : []);
    renderTodayPopular(Array.isArray(data.todayPopular) ? data.todayPopular : []);
    updateSidebarLayout();
  } catch {
    galleryImages = newestDefaultGalleryImages.map((image, index) => ({
      ...image,
      imageKey: String(image.imageKey ?? index),
      isUserUpload: false,
    }));
    visibleGalleryCount = galleryImages.length;
    renderGallery();
    renderMonthlyRanking([]);
    renderTodayPopular([]);
    updateSidebarLayout();
  }
}

// 이달의 랭킹: 이번 달 하트를 가장 많이 받은 사용자. 데이터 없으면 블록을 숨긴다.
function renderMonthlyRanking(items) {
  const list = document.querySelector("#monthlyRankList");
  const block = document.querySelector("#monthlyRankBlock");
  if (!list || !block) {
    return;
  }

  list.replaceChildren();

  if (!items.length) {
    block.hidden = true;
    return;
  }
  block.hidden = false;

  const fragment = document.createDocumentFragment();
  items.forEach((item, rank) => {
    const li = document.createElement("li");
    li.className = "monthly-rank-item";

    const displayName = item.username || "사용자";
    // 이름을 누르면 프로필 + 지은 제목 목록을 연다.
    const button = document.createElement("button");
    button.type = "button";
    button.className = "rank-row monthly-rank-link";
    button.dataset.action = "show-author-profile";
    button.dataset.userId = item.userId || "";
    button.dataset.guestName = item.guestName || "";
    button.dataset.guestTag = item.guestTag || "";
    button.dataset.username = displayName;
    button.dataset.avatarUrl = item.avatarUrl || "";
    button.setAttribute("aria-label", `${displayName}님의 프로필과 지은 제목 보기 (이달 하트 ${item.monthLikes}개)`);

    const rankBadge = document.createElement("span");
    rankBadge.className = "rank-badge";
    rankBadge.textContent = String(rank + 1);

    const avatar = document.createElement("span");
    avatar.className = "rank-avatar";
    if (item.avatarUrl) {
      const img = document.createElement("img");
      img.src = item.avatarUrl;
      img.alt = "";
      img.loading = "lazy";
      img.decoding = "async";
      avatar.append(img);
    } else {
      avatar.textContent = displayName.slice(0, 1);
    }

    const name = document.createElement("span");
    name.className = "rank-name";
    name.textContent = displayName;

    const likes = document.createElement("span");
    likes.className = "rank-likes";
    likes.innerHTML = `<span class="heart-icon" aria-hidden="true"></span><span>${item.monthLikes}</span>`;

    button.append(rankBadge, avatar, name, likes);
    li.append(button);
    fragment.append(li);
  });

  list.append(fragment);
}

// 오늘의 인기 사진. 오늘 데이터가 없으면 블록 자체를 숨긴다(사진 제목/설명은 노출 안 함).
function renderTodayPopular(items) {
  const list = document.querySelector("#todayPopularList");
  const block = document.querySelector("#todayPopularBlock");
  if (!list || !block) {
    return;
  }

  list.replaceChildren();

  if (!items.length) {
    block.hidden = true;
    return;
  }
  block.hidden = false;

  const fragment = document.createDocumentFragment();
  items.forEach((item, rank) => {
    const li = document.createElement("li");
    li.className = "today-popular-item";

    const button = document.createElement("button");
    button.type = "button";
    button.className = "today-popular-link rank-row";
    button.dataset.imageKey = item.imageKey;
    // 순위·하트수로만 안내 — 사진 제목/설명은 노출하지 않는다(제목짓기 창작성 보호).
    button.setAttribute("aria-label", `오늘의 인기 ${rank + 1}위 사진으로 이동 (오늘 하트 ${item.todayLikes}개)`);

    const rankBadge = document.createElement("span");
    rankBadge.className = "rank-badge";
    rankBadge.textContent = String(rank + 1);

    const thumb = document.createElement("img");
    thumb.className = "today-popular-thumb";
    thumb.src = item.webpSrc || item.src;
    thumb.alt = "";
    thumb.loading = "lazy";
    thumb.decoding = "async";

    const likes = document.createElement("span");
    likes.className = "rank-likes";
    likes.innerHTML = `<span class="heart-icon" aria-hidden="true"></span><span>${item.todayLikes}</span>`;

    button.append(rankBadge, thumb, likes);
    li.append(button);
    fragment.append(li);
  });

  list.append(fragment);
}

// 두 블록(이달의 랭킹·오늘의 인기)이 모두 숨겨지면 지난 짤 사이드바를 감추고 갤러리를 전체 폭으로.
// 주간 랭킹은 홈 피드 사이드바(#feedSidebar)에 따로 있어 이 계산에 포함하지 않는다.
function updateSidebarLayout() {
  const monthly = document.querySelector("#monthlyRankBlock");
  const today = document.querySelector("#todayPopularBlock");
  const sidebar = document.querySelector("#gallerySidebar");
  const layout = document.querySelector("#galleryLayout");
  const allHidden = (!monthly || monthly.hidden) && (!today || today.hidden);
  if (sidebar) {
    sidebar.hidden = allHidden;
  }
  if (layout) {
    layout.classList.toggle("is-sidebar-empty", allHidden);
  }
}

// 이번 주 랭킹: 이번 주 월요일(KST) 0시 이후 하트를 가장 많이 받은 사용자. 데이터 없으면 블록을 숨긴다.
function renderWeeklyRanking(items) {
  const list = document.querySelector("#weeklyRankList");
  const block = document.querySelector("#weeklyRankBlock");
  if (!list || !block) {
    return;
  }

  list.replaceChildren();

  if (!items.length) {
    block.hidden = true;
    return;
  }
  block.hidden = false;

  const fragment = document.createDocumentFragment();
  items.forEach((item, rank) => {
    const li = document.createElement("li");
    li.className = "weekly-rank-item";

    const row = document.createElement("span");
    row.className = "rank-row";

    const rankBadge = document.createElement("span");
    rankBadge.className = "rank-badge";
    rankBadge.textContent = String(rank + 1);

    const name = document.createElement("span");
    name.className = "rank-name";
    name.textContent = item.author || "비회원";

    const likes = document.createElement("span");
    likes.className = "rank-likes";
    likes.innerHTML = `<span class="heart-icon" aria-hidden="true"></span><span>${item.likes}</span>`;

    row.append(rankBadge, name, likes);
    li.append(row);
    fragment.append(li);
  });

  list.append(fragment);
}

let dailyTodayImageKey = null;
let dailyCountdownIntervalId = null;

async function loadDaily() {
  try {
    const response = await fetch("/api/daily", { credentials: "include" });
    if (!response.ok) {
      throw new Error("daily fetch failed");
    }
    const data = await response.json();
    renderDailyHero(data.today);
    renderDailyWinner(data.yesterday);
    renderWeeklyRanking(Array.isArray(data.weekly) ? data.weekly : []);
  } catch {
    renderDailyHero(null);
    renderDailyWinner(null);
    renderWeeklyRanking([]);
  }
}

function formatMonthDay(dateString) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(dateString || ""));
  return match ? `${Number(match[2])}월 ${Number(match[3])}일` : "";
}

// 오늘의 짤 히어로: 실패하거나 갤러리에서 사진을 찾지 못하면 블록 자체를 숨긴다.
function renderDailyHero(today) {
  const hero = document.querySelector("#dailyHero");
  if (!hero) {
    return;
  }

  const imageKey = today?.imageKey != null ? String(today.imageKey) : "";
  const index = imageKey ? findImageIndexByKey(imageKey) : -1;
  const image = index >= 0 ? galleryImages[index] : null;

  if (!image) {
    hero.hidden = true;
    dailyTodayImageKey = null;
    return;
  }

  dailyTodayImageKey = imageKey;

  const imageEl = document.querySelector("#dailyHeroImage");
  const sourceEl = document.querySelector("#dailyHeroSource");
  const badgeEl = document.querySelector("#dailyHeroBadge");
  const countEl = document.querySelector("#dailyHeroCount");

  if (imageEl) {
    imageEl.src = image.src;
    imageEl.alt = image.alt || "";
  }
  if (sourceEl) {
    sourceEl.srcset = image.webpSrc || "";
  }
  if (badgeEl) {
    const dateLabel = formatMonthDay(today.date);
    badgeEl.textContent = dateLabel ? `오늘의 짤 · ${dateLabel}` : "오늘의 짤";
  }
  if (countEl) {
    countEl.textContent = `지금까지 제목 ${Number(today.submissionCount) || 0}개`;
  }

  hero.hidden = false;
  updateDailyCountdown();
}

// 어제의 1등: winner가 없으면(아직 아무도 제목을 안 남겼거나 API 실패) 블록을 숨긴다.
function renderDailyWinner(yesterday) {
  const card = document.querySelector("#dailyWinner");
  if (!card) {
    return;
  }

  const winner = yesterday?.winner;
  const imageKey = yesterday?.imageKey != null ? String(yesterday.imageKey) : "";

  if (!winner || !imageKey) {
    card.hidden = true;
    return;
  }

  const titleEl = document.querySelector("#dailyWinnerTitle");
  const metaEl = document.querySelector("#dailyWinnerMeta");
  const linkEl = document.querySelector("#dailyWinnerLink");

  if (titleEl) {
    titleEl.textContent = `"${winner.title}"`;
  }
  if (metaEl) {
    metaEl.textContent = `${winner.author || "비회원"} · 하트 ${Number(winner.likeCount) || 0}개`;
  }
  if (linkEl) {
    linkEl.href = galleryPageUrl(imageKey, winner.submissionId);
  }

  card.hidden = false;
}

// 다음 KST 자정까지 남은 시간을 1분 단위로 표시. 홈 뷰에 머무는 동안만 갱신한다.
function updateDailyCountdown() {
  const el = document.querySelector("#dailyHeroCountdown");
  if (!el || document.querySelector("#dailyHero")?.hidden) {
    return;
  }

  const kstNow = Date.now() + 9 * 60 * 60 * 1000;
  const msLeft = 24 * 60 * 60 * 1000 - (kstNow % (24 * 60 * 60 * 1000));
  const totalMinutes = Math.max(0, Math.ceil(msLeft / 60000));
  const hours = String(Math.floor(totalMinutes / 60)).padStart(2, "0");
  const minutes = String(totalMinutes % 60).padStart(2, "0");
  el.textContent = `자정 마감까지 ${hours}:${minutes}`;
}

const monthlyRankListEl = document.querySelector("#monthlyRankList");
if (monthlyRankListEl) {
  monthlyRankListEl.addEventListener("click", async (event) => {
    const trigger = event.target.closest("button[data-action='show-author-profile']");
    if (!trigger) {
      return;
    }
    await openAuthorProfile(trigger);
  });
}

const todayPopularListEl = document.querySelector("#todayPopularList");
if (todayPopularListEl) {
  todayPopularListEl.addEventListener("click", (event) => {
    const link = event.target.closest(".today-popular-link");
    if (!link) {
      return;
    }
    const index = findImageIndexByKey(link.dataset.imageKey);
    if (index < 0) {
      showToast("해당 사진을 찾지 못했습니다.");
      return;
    }
    startTitleEntry(index);
  });
}

// 오늘의 짤 사이드 카드 버튼과 상단바 "제목 달기" CTA가 공유하는 진입점.
function goToTodayTitleEntry() {
  const index = dailyTodayImageKey ? findImageIndexByKey(dailyTodayImageKey) : -1;
  if (index < 0) {
    showToast("해당 사진을 찾지 못했습니다.");
    return;
  }
  startTitleEntry(index);
}

const dailyHeroButtonEl = document.querySelector("#dailyHeroButton");
dailyHeroButtonEl?.addEventListener("click", goToTodayTitleEntry);
feedTitleCtaButton?.addEventListener("click", goToTodayTitleEntry);

// ===================== FEED (홈 "유머 피드") =====================

function parseServerTimestamp(value) {
  const text = String(value || "");
  if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(text)) {
    return Date.parse(`${text.replace(" ", "T")}Z`);
  }
  return Date.parse(text);
}

// "N분 전"/"N시간 전" 상대 시간. 일주일이 넘으면 formatDate(절대 날짜)로 넘어간다.
function formatRelativeTime(value) {
  const timestamp = parseServerTimestamp(value);
  if (!Number.isFinite(timestamp)) {
    return "";
  }

  const diffMs = Date.now() - timestamp;
  const diffMinutes = Math.floor(diffMs / 60000);

  if (diffMinutes < 1) {
    return "방금 전";
  }
  if (diffMinutes < 60) {
    return `${diffMinutes}분 전`;
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours}시간 전`;
  }

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) {
    return `${diffDays}일 전`;
  }

  return formatDate(value);
}

function setFeedTabActive(windowKey) {
  document.querySelectorAll("#feedTabs [data-feed-window]").forEach((tabButton) => {
    const isActive = tabButton.dataset.feedWindow === windowKey;
    tabButton.classList.toggle("is-active", isActive);
    tabButton.setAttribute("aria-selected", String(isActive));
  });
}

function syncFeedNavigationState(view) {
  const isFeedView = view === "home";

  document.querySelectorAll("#feedTabs [data-feed-window]").forEach((tabButton) => {
    const isActive = isFeedView && tabButton.dataset.feedWindow === activeFeedWindow;
    tabButton.classList.toggle("is-active", isActive);
    tabButton.setAttribute("aria-selected", String(isActive));
  });

  const isGalleryView = view === "gallery";
  pastGalleryLink?.classList.toggle("is-active", isGalleryView);
  pastGalleryLink?.setAttribute("aria-selected", String(isGalleryView));

  if (isGalleryView) {
    pastGalleryLink?.setAttribute("aria-current", "page");
  } else {
    pastGalleryLink?.removeAttribute("aria-current");
  }
}

function updateFeedEmptyState() {
  if (feedEmptyEl) {
    feedEmptyEl.hidden = feedItems.length > 0;
  }
}

function buildFeedRow(item, showTopBadge) {
  const li = document.createElement("li");
  li.className = "feed-row-item";

  const row = document.createElement("button");
  row.type = "button";
  row.className = "feed-row";
  row.dataset.imageKey = item.imageKey;
  row.setAttribute("aria-label", `${item.title} — ${item.author} 작성, 하트 ${item.likeCount}개`);

  const hearts = document.createElement("span");
  hearts.className = "feed-row-hearts";
  const heartIcon = document.createElement("span");
  heartIcon.className = "heart-icon";
  heartIcon.setAttribute("aria-hidden", "true");
  const heartCount = document.createElement("span");
  heartCount.className = "feed-row-heart-count";
  heartCount.textContent = String(item.likeCount);
  hearts.append(heartIcon, heartCount);

  const thumb = document.createElement("span");
  thumb.className = "feed-row-thumb";
  const thumbImage = document.createElement("img");
  thumbImage.src = item.imageWebpSrc || item.imageSrc;
  thumbImage.alt = "";
  thumbImage.loading = "lazy";
  thumbImage.decoding = "async";
  thumb.append(thumbImage);

  const body = document.createElement("span");
  body.className = "feed-row-body";

  const title = document.createElement("strong");
  title.className = "feed-row-title";
  title.textContent = item.title;

  const meta = document.createElement("span");
  meta.className = "feed-row-meta";
  const metaParts = [item.author, formatRelativeTime(item.createdAt)];
  if (item.commentCount > 0) {
    metaParts.push(`댓글 ${item.commentCount}`);
  }
  meta.textContent = metaParts.filter(Boolean).join(" · ");
  body.append(title, meta);

  if (showTopBadge && item.likeCount > 0) {
    const badge = document.createElement("span");
    badge.className = "feed-row-badge";
    badge.textContent = "1위";
    body.append(badge);
  }

  row.append(hearts, thumb, body);
  li.append(row);
  return li;
}

function renderFeedRows(items, append) {
  if (!feedListEl) {
    return;
  }

  if (!append) {
    feedListEl.replaceChildren();
  }

  const fragment = document.createDocumentFragment();
  items.forEach((item, index) => {
    fragment.append(buildFeedRow(item, !append && index === 0));
  });
  feedListEl.append(fragment);
  updateFeedEmptyState();
}

// 탭 전환·더 보기·초기 로드가 모두 이 함수를 쓴다. 선택한 창(window)이 비어 있으면
// 급상승 12h → 오늘 → 주간 → 전당 순으로 데이터가 나올 때까지 자동으로 넓혀간다.
async function loadFeed(windowKey, options = {}) {
  const append = Boolean(options.append);

  if (feedLoading) {
    return;
  }
  feedLoading = true;

  const offset = append ? feedOffset : 0;

  try {
    const data = await requestJson(`/api/feed?window=${encodeURIComponent(windowKey)}&offset=${offset}`, {
      method: "GET",
      headers: {},
    });
    const items = Array.isArray(data.items) ? data.items : [];

    // 자동 폴백은 초기 로드에서만. 사용자가 직접 누른 탭은 비어 있으면
    // 그대로 빈 상태 메시지를 보여준다 (말없이 다른 탭으로 점프하면 클릭이 무시된 것처럼 보인다).
    if (!append && items.length === 0 && options.allowFallback !== false) {
      const nextWindow = FEED_WINDOW_ORDER[FEED_WINDOW_ORDER.indexOf(windowKey) + 1];
      if (nextWindow) {
        feedLoading = false;
        await loadFeed(nextWindow);
        return;
      }
    }

    activeFeedWindow = windowKey;
    setFeedTabActive(windowKey);

    if (append) {
      feedItems = feedItems.concat(items);
      feedOffset += items.length;
      renderFeedRows(items, true);
    } else {
      feedItems = items;
      feedOffset = items.length;
      renderFeedRows(items, false);
    }

    if (feedMoreButtonEl) {
      feedMoreButtonEl.hidden = items.length < FEED_PAGE_SIZE;
    }
  } catch {
    if (!append) {
      feedItems = [];
      renderFeedRows([], false);
    }
    showToast("피드를 불러오지 못했습니다.");
  } finally {
    feedLoading = false;
  }
}

feedTabsEl?.addEventListener("click", (event) => {
  const tabButton = event.target.closest("[data-feed-window]");
  if (!tabButton) {
    return;
  }
  // 지난 짤 등 다른 뷰에서 탭을 누르면 홈(피드)으로 돌아온 뒤 해당 창을 로드한다.
  if (homeView?.hidden) {
    navigateTo({ view: "home" });
  }
  loadFeed(tabButton.dataset.feedWindow, { allowFallback: false });
});

feedListEl?.addEventListener("click", (event) => {
  const row = event.target.closest(".feed-row");
  if (!row) {
    return;
  }
  const index = findImageIndexByKey(row.dataset.imageKey);
  if (index < 0) {
    showToast("해당 사진을 찾지 못했습니다.");
    return;
  }
  showRanking(index);
});

feedMoreButtonEl?.addEventListener("click", () => {
  loadFeed(activeFeedWindow, { append: true });
});

sideHofButton?.addEventListener("click", () => {
  loadFeed("all");
});

pastGalleryLink?.addEventListener("click", (event) => {
  event.preventDefault();
  goGallery();
});

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

  setAuthMode("login");
  signupPasswordInput.value = "";
  signupPasswordConfirmInput.value = "";
  loginMessage.textContent = data.message || "가입이 완료되었습니다. 이메일의 인증 링크를 확인한 뒤 로그인해주세요.";
  showToast(data.emailVerificationSent ? "가입 완료. 인증 메일을 확인해주세요." : "가입 완료. 인증 메일 발송에 실패했습니다. 로그인 후 다시 시도해주세요.");
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

function getSelectedImage() {
  return galleryImages[selectedImageIndex];
}

function getImageKey(image, index = selectedImageIndex) {
  return String(image?.imageKey ?? index);
}

function getSelectedImageKey() {
  return getImageKey(getSelectedImage(), selectedImageIndex);
}

function findImageIndexByKey(imageKey) {
  return galleryImages.findIndex((image, index) => getImageKey(image, index) === imageKey);
}

// 사진 한 장의 정식 URL. /gallery/<slug>/ 가 해설과 제목 랭킹을 함께 보여준다.
// slug 규칙은 functions/api/images/_gallery-slug.js의 사본이다 — 한쪽만 고치지 말 것.
// 목록에서 사진을 못 찾으면 /titles/<key>/ 로 두고, 서버가 같은 페이지로 301한다.
const GALLERY_SLUG_OVERRIDES = { "photo-001": "cat-smoke" };

function galleryPageUrl(imageKey, submissionId) {
  const image = galleryImages[findImageIndexByKey(imageKey)];
  const slug = image ? GALLERY_SLUG_OVERRIDES[image.id] || image.id : "";
  const base = slug
    ? `/gallery/${encodeURIComponent(slug)}/`
    : `/titles/${encodeURIComponent(imageKey)}/`;

  return submissionId ? `${base}?t=${encodeURIComponent(submissionId)}` : base;
}

function findLegacyImageIndex(rawIndex) {
  const legacyIndex = Number(rawIndex);

  if (!Number.isInteger(legacyIndex)) {
    return -1;
  }

  const legacyImage = defaultGalleryImages[legacyIndex];
  return legacyImage ? findImageIndexByKey(getImageKey(legacyImage, legacyIndex)) : legacyIndex;
}

function getActiveAuthor() {
  return getUserDisplayName() || currentGuestName || "비회원";
}

function setTitleSubmitting(isSubmitting) {
  titleSubmitButton.disabled = isSubmitting;
  guestSubmitButton.disabled = isSubmitting;
}

function isServerEntry(entry) {
  return /^\d+$/.test(String(entry?.id || ""));
}

// 비회원 이름 자체가 거부된 경우(회원 사칭·# 포함)는 로컬 저장 폴백 대신 다시 입력받는다.
function isGuestNameError(error) {
  return error?.code === "guest_name_taken" || error?.code === "guest_name_invalid";
}

function canDeleteLocalAuthor(author) {
  return Boolean(currentUser && author === getUserDisplayName());
}

function isMyEntry(entry) {
  return Boolean(entry?.canDelete || canDeleteLocalAuthor(entry?.author));
}

function routeToHash(state) {
  if (state.view === "upload") {
    return "#upload";
  }

  if (state.view === "gallery") {
    return "#gallery";
  }

  if (["title", "guest", "ranking", "random"].includes(state.view)) {
    const image = galleryImages[state.imageIndex];
    return `#${state.view}/key/${encodeURIComponent(getImageKey(image, state.imageIndex))}`;
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

  if (state.view === "party") {
    return state.partyCode ? `#party/${encodeURIComponent(state.partyCode)}` : "#party";
  }

  return "#feed";
}

function routeToUrl(state) {
  if (state.view === "admin") {
    return "/admin";
  }

  if (state.view === "gallery") {
    return "/";
  }

  return `/${routeToHash(state)}`;
}

function parseRouteFromLocation() {
  const pathname = window.location.pathname.replace(/\/+$/, "") || "/";

  if (pathname === "/admin") {
    return { view: "admin" };
  }

  return parseRouteFromHash(window.location.hash);
}

function parseRouteFromHash(hash) {
  const cleanHash = hash.replace(/^#/, "");

  if (!cleanHash) {
    return { view: "gallery" };
  }

  if (cleanHash === "home" || cleanHash === "feed") {
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

  if (cleanHash === "gallery") {
    return { view: "gallery" };
  }

  if (cleanHash === "admin") {
    return { view: "admin" };
  }

  if (cleanHash === "party") {
    return { view: "party" };
  }

  if (cleanHash.startsWith("party/")) {
    return { view: "party", partyCode: decodeURIComponent(cleanHash.slice("party/".length)) };
  }

  const [view, locator, rawValue] = cleanHash.split("/");
  const imageIndex = locator === "key"
    ? findImageIndexByKey(decodeRouteImageKey(rawValue))
    : findLegacyImageIndex(locator);

  if (!["title", "guest", "ranking", "random"].includes(view) || !Number.isInteger(imageIndex)) {
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

  if (state.view === "gallery") {
    return { view: "gallery" };
  }

  if (state.view === "admin") {
    return { view: "admin" };
  }

  if (state.view === "party") {
    return { view: "party", partyCode: typeof state.partyCode === "string" ? state.partyCode : "" };
  }

  if (!["title", "guest", "ranking", "random"].includes(state.view) || !Number.isInteger(state.imageIndex)) {
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
  [homeView, galleryView, uploadView, titleView, guestView, rankingView, randomView, contactView, profileView, adminView, partyView].forEach((view) => {
    view.hidden = view !== viewToShow;
  });
  window.scrollTo({ top: 0, behavior: "auto" });

  if (viewToShow === homeView) {
    updateDailyCountdown();
    if (!dailyCountdownIntervalId) {
      dailyCountdownIntervalId = setInterval(updateDailyCountdown, 60000);
    }
  } else if (dailyCountdownIntervalId) {
    clearInterval(dailyCountdownIntervalId);
    dailyCountdownIntervalId = null;
  }

  if (viewToShow !== partyView) {
    stopPartyPolling();
    stopPartyCountdown();
    stopPublicRoomsPolling();
    stopPartyRevealActivity();
  }
}

function updateShareBanner() {
  if (!shareBanner) {
    return;
  }

  const imageKey = getSelectedImageKey();
  const shouldShow =
    pendingShareSubmission &&
    pendingShareSubmission.imageKey === imageKey &&
    !dismissedShareSubmissionIds.has(pendingShareSubmission.submission.id);

  shareBanner.hidden = !shouldShow;
}

function applyRoute(state) {
  const route = getValidRoute(state);

  if (!route) {
    history.replaceState({ view: "gallery" }, "", routeToUrl({ view: "gallery" }));
    applyRoute({ view: "gallery" });
    return;
  }

  syncFeedNavigationState(route.view);

  // 사진 작업 흐름(제목 입력·댓글·랭킹·랜덤·파티 모드)에서는 상단 칼럼 메뉴를 숨겨 집중을 돕는다.
  if (topSiteNav) {
    topSiteNav.hidden = ["title", "guest", "ranking", "random", "party"].includes(route.view);
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
    renderContactAccessState();
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
    imageUploadMessage.textContent = "이미지는 문의를 통해 제안할 수 있습니다. 관리자가 확인한 뒤 갤러리 게시 여부를 검토합니다.";
    imageSuggestionButton.focus();
    return;
  }

  if (route.view === "gallery") {
    selectedImageIndex = null;
    pendingTitle = "";
    showView(galleryView);
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
    loadAdminImages();
    return;
  }

  if (route.view === "party") {
    selectedImageIndex = null;
    pendingTitle = "";
    showView(partyView);
    enterPartyView(route.partyCode || "");
    return;
  }

  selectedImageIndex = route.imageIndex;
  const image = getSelectedImage();

  if (route.view === "title") {
    setPreviewImage(selectedPhoto, image);
    renderImageBrief(selectedImageBrief, image);
    titleInput.value = pendingTitle;
    showView(titleView);
    titleInput.focus();
    return;
  }

  if (route.view === "random") {
    pendingTitle = "";
    setPreviewImage(randomPhoto, image);
    renderImageBrief(randomImageBrief, image);
    showView(randomView);
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
  updateShareBanner();
}

function navigateTo(state, options = {}) {
  const route = getValidRoute(state) || { view: "gallery" };
  const method = options.replace ? "replaceState" : "pushState";

  history[method](route, "", routeToUrl(route));
  applyRoute(route);
}

function initializeRoute() {
  const route = getValidRoute(parseRouteFromLocation()) || { view: "gallery" };

  history.replaceState(route, "", routeToUrl(route));
  applyRoute(route);
}

function goHome() {
  navigateTo({ view: "gallery" });
}

function goContact() {
  navigateTo({ view: "contact" });
}

function goUpload() {
  navigateTo({ view: "upload" });
}

function goGallery() {
  navigateTo({ view: "gallery" });
}

function goParty(code) {
  navigateTo({ view: "party", partyCode: code || "" });
}

function goImageSuggestionContact() {
  navigateTo({ view: "contact" });
  contactTypeInput.value = "이미지 제안";

  if (!contactTitleInput.value.trim()) {
    contactTitleInput.value = "이미지 제안";
  }

  contactBodyInput.focus();
}

// 제안 이미지는 D1에 보관돼 행 크기 상한이 있다. 큰 사진은 긴 변 1600px JPEG로 줄인다.
async function shrinkImageForSuggestion(file) {
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, suggestionMaxImageEdge / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));

    const context = canvas.getContext("2d");
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close?.();

    for (const quality of [0.85, 0.7, 0.55, 0.4]) {
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));

      if (blob && blob.size <= maxSuggestionImageBytes) {
        const baseName = String(file.name || "image").replace(/\.[^.]+$/, "") || "image";
        return new File([blob], `${baseName}.jpg`, { type: "image/jpeg" });
      }
    }

    return null;
  } catch {
    return null;
  }
}

function clearContactAttachment(resetInput = true) {
  selectedContactImage = null;

  if (selectedContactImageUrl) {
    URL.revokeObjectURL(selectedContactImageUrl);
    selectedContactImageUrl = "";
  }

  if (resetInput && contactImageInput) {
    contactImageInput.value = "";
  }

  contactAttachmentPreview.hidden = true;
  contactAttachmentImage.removeAttribute("src");
  contactAttachmentName.textContent = "";
  contactAttachmentSize.textContent = "";
}

function setContactAttachment(file) {
  const error = validateContactImage(file);

  if (error) {
    clearContactAttachment();
    contactMessage.textContent = error;
    contactMessage.classList.remove("is-success");
    return;
  }

  if (selectedContactImageUrl) {
    URL.revokeObjectURL(selectedContactImageUrl);
  }

  selectedContactImage = file;
  selectedContactImageUrl = URL.createObjectURL(file);
  contactAttachmentImage.src = selectedContactImageUrl;
  contactAttachmentName.textContent = file.name || "첨부 이미지";
  contactAttachmentSize.textContent = formatFileSize(file.size);
  contactAttachmentPreview.hidden = false;
  contactMessage.textContent = "";
  contactMessage.classList.remove("is-success");
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

function pickRandomImageIndex(excludeIndex) {
  const candidates = galleryImages
    .map((image, index) => (image ? index : null))
    .filter((index) => index !== null);

  if (candidates.length === 0) {
    return null;
  }

  const pool = candidates.length > 1 ? candidates.filter((index) => index !== excludeIndex) : candidates;
  const chooseFrom = pool.length > 0 ? pool : candidates;

  return chooseFrom[Math.floor(Math.random() * chooseFrom.length)];
}

function goRandom(excludeIndex) {
  const index = pickRandomImageIndex(excludeIndex);

  if (index === null) {
    showToast("표시할 사진이 없습니다");
    return;
  }

  navigateTo({ view: "random", imageIndex: index }, { replace: Number.isInteger(excludeIndex) });
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

function prependServerSubmission(imageKey, submission) {
  if (!submission) {
    return;
  }

  const currentList = Array.isArray(serverSubmissionsByImage[imageKey]) ? serverSubmissionsByImage[imageKey] : [];
  serverSubmissionsByImage[imageKey] = [submission, ...currentList.filter((entry) => entry.id !== submission.id)];
}

async function addSubmission(author) {
  if (isTitleSubmitting) {
    return;
  }

  const image = getSelectedImage();

  if (!image || !pendingTitle) {
    goHome();
    return;
  }

  isTitleSubmitting = true;
  setTitleSubmitting(true);

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
    prependServerSubmission(imageKey, data.submission);
    pendingTitle = "";
    if (data.submission) {
      pendingShareSubmission = { imageKey, submission: data.submission };
    }
    renderRanking();
    navigateTo({ view: "ranking", imageIndex: selectedImageIndex });
    refreshRanking();
    return;
  } catch (error) {
    if (currentUser || isGuestNameError(error)) {
      showToast(error.message || "제목을 저장하지 못했습니다.");

      if (isGuestNameError(error)) {
        guestNameInput.focus();
        guestNameInput.select();
      }

      return;
    }
  } finally {
    isTitleSubmitting = false;
    setTitleSubmitting(false);
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

function setPreviewImage(photo, image) {
  const frame = photo.parentElement;
  frame?.classList.remove("is-image-missing");
  photo.hidden = false;
  photo.onerror = () => {
    frame?.classList.add("is-image-missing");
    photo.hidden = true;
  };
  photo.onload = () => {
    frame?.classList.remove("is-image-missing");
    photo.hidden = false;
  };
  photo.src = image.src;
  photo.alt = image.alt;
}

function createImageBriefGroup(label, items) {
  if (items.length === 0) {
    return null;
  }

  const group = document.createElement("div");
  group.className = "image-brief-group";

  const heading = document.createElement("strong");
  heading.textContent = label;

  const list = document.createElement("ul");
  list.className = "image-brief-list";

  items.slice(0, 3).forEach((item) => {
    const listItem = document.createElement("li");
    listItem.textContent = item;
    list.append(listItem);
  });

  group.append(heading, list);
  return group;
}

function renderImageBrief(container, image) {
  if (!container) {
    return;
  }

  if (!image) {
    container.hidden = true;
    container.replaceChildren();
    return;
  }

  container.replaceChildren();
  container.hidden = true;
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

      const media = document.createElement("div");
      media.className = "photo-card-media";

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
      photo.addEventListener("error", () => {
        card.classList.add("is-image-missing");
      }, { once: true });
      picture.append(photo);
      media.append(picture);

      const placeholder = document.createElement("span");
      placeholder.className = "photo-card-placeholder";
      placeholder.textContent = "이미지를 불러올 수 없습니다";

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

      // 승인 직후 게시되는 제안 이미지는 정적 해설 페이지가 없어 링크를 걸지 않는다.
      if (image.hasDetailPage !== false) {
        const guideLink = document.createElement("a");
        guideLink.className = "photo-action photo-guide-action";
        guideLink.dataset.action = "guide";
        guideLink.href = getGalleryDetailPath(image, index);
        guideLink.textContent = "해설 보기";
        guideLink.setAttribute("aria-label", `${image.title || image.alt} 사진 해설 보기`);
        actions.append(guideLink);
      }

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
      card.setAttribute("aria-label", `${image.alt}. 제목 입력`);
      card.append(media, placeholder, actions);
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
  setPreviewImage(rankingPhoto, image);
  renderImageBrief(rankingImageBrief, image);

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
    } else if (isCurrentAdmin()) {
      const adminDeleteButton = document.createElement("button");
      adminDeleteButton.className = "delete-button";
      adminDeleteButton.type = "button";
      adminDeleteButton.dataset.action = "admin-delete-submission";
      adminDeleteButton.dataset.entryId = entry.id;
      adminDeleteButton.textContent = "삭제";
      adminDeleteButton.setAttribute("aria-label", "제목 관리자 삭제");
      actions.append(adminDeleteButton);
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
  drawerTitle.textContent = "프로필 메뉴";
  drawerName.textContent = isGuest ? "" : getUserDisplayName();
  drawerProvider.textContent = isGuest ? "" : currentUser.email || "이메일 정보 없음";
  guestDrawerCopy.hidden = !isGuest;
  drawerProfile.hidden = isGuest;
  avatarEditButton.disabled = isGuest;
  avatarEditButton.setAttribute("aria-disabled", String(isGuest));
  avatarEditButton.hidden = isGuest;
  document.querySelectorAll(".guest-only").forEach((item) => {
    item.hidden = !isGuest;
  });
  document.querySelectorAll(".member-only").forEach((item) => {
    item.hidden = isGuest;
  });

  drawerStats.hidden = true;

  if (isGuest) {
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

// 이달의 랭킹에서 이름을 누르면 공개 프로필 + 지은 제목 목록을 모달로 보여준다.
// 회원은 userId로, 비회원은 이름+태그로 조회한다(랭킹 집계 키와 동일).
async function openAuthorProfile(trigger) {
  const userId = trigger.dataset.userId || "";
  const guestName = trigger.dataset.guestName || "";
  const guestTag = trigger.dataset.guestTag || "";
  const username = trigger.dataset.username || "비회원";

  if (!userId && !guestName) {
    showToast("작성자 정보를 찾을 수 없습니다.");
    return;
  }

  closeUserPopover();
  activeAuthorProfile = null;
  authorProfileRequestId += 1;
  const requestId = authorProfileRequestId;

  renderAuthorProfileHead(
    {
      id: userId,
      username,
      memberType: userId ? "회원" : "비회원",
      isGuest: !userId,
      isProfilePublic: true,
      bio: "",
      avatarUrl: trigger.dataset.avatarUrl || "",
      canReceiveMessages: Boolean(userId),
    },
    null
  );
  authorTitleList.replaceChildren(createMyTitleMessage("불러오는 중입니다."));
  authorProfileModal.hidden = false;
  authorProfileCloseButton.focus();

  const params = new URLSearchParams();

  if (userId) {
    params.set("userId", userId);
  } else {
    params.set("guestName", guestName);
    params.set("guestTag", guestTag);
  }

  try {
    const data = await requestJson(`/api/authors?${params.toString()}`, { method: "GET", headers: {} });

    // 응답 도착 전에 닫았거나 다른 사람을 눌렀으면 무시한다.
    if (requestId !== authorProfileRequestId || authorProfileModal.hidden) {
      return;
    }

    activeAuthorProfile = data.author || null;
    renderAuthorProfileHead(data.author, data.stats);
    renderAuthorTitles(data.titles || [], data.hasMore);
  } catch (error) {
    if (requestId !== authorProfileRequestId || authorProfileModal.hidden) {
      return;
    }

    authorTitleList.replaceChildren(createMyTitleMessage(error.message));
  }
}

function renderAuthorProfileHead(author, stats) {
  if (!author) {
    return;
  }

  const displayName = author.username || "비회원";
  authorProfileAvatar.textContent = author.avatarUrl ? "" : displayName.slice(0, 1);
  authorProfileAvatar.style.backgroundImage = author.avatarUrl ? `url("${author.avatarUrl}")` : "";
  authorProfileName.textContent = displayName;
  authorProfileType.textContent = author.isGuest
    ? "비회원 작성자"
    : author.isProfilePublic === false
      ? "회원 · 비공개 프로필"
      : "회원 · 공개 프로필";

  authorProfileBio.textContent = author.bio || "";
  authorProfileBio.hidden = !author.bio;

  if (stats) {
    authorProfileStats.textContent = `제목 ${stats.titleCount}개 · 이달 하트 ${stats.monthLikes}개 · 누적 하트 ${stats.totalLikes}개`;
    authorProfileStats.hidden = false;
  } else {
    authorProfileStats.textContent = "";
    authorProfileStats.hidden = true;
  }

  const canMessage =
    Boolean(author.id) && author.canReceiveMessages !== false && String(author.id) !== String(currentUser?.id || "");
  authorProfileActions.hidden = !canMessage;
}

function renderAuthorTitles(titles, hasMore) {
  if (!titles.length) {
    authorTitleList.replaceChildren(createMyTitleMessage("아직 공개된 제목이 없습니다."));
    return;
  }

  const fragment = document.createDocumentFragment();

  titles.forEach((entry) => {
    const card = document.createElement("article");
    card.className = "my-title-card author-title-card";
    card.dataset.entryId = entry.id;
    card.dataset.imageKey = entry.imageKey || String(entry.imageIndex);
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", `${entry.title} 랭킹으로 이동`);

    const image = document.createElement("img");
    image.className = "my-title-thumb";
    image.src =
      entry.imageSrc ||
      galleryImages[findImageIndexByKey(entry.imageKey)]?.src ||
      galleryImages[entry.imageIndex]?.src ||
      "";
    image.alt = "";
    image.loading = "lazy";

    const body = document.createElement("div");
    body.className = "my-title-body";

    const title = document.createElement("strong");
    title.textContent = entry.title;

    const meta = document.createElement("p");
    meta.className = "my-title-meta";
    meta.textContent = `하트 ${entry.likes || 0}개`;

    body.append(title, meta);
    card.append(image, body);
    fragment.append(card);
  });

  if (hasMore) {
    fragment.append(createMyTitleMessage("하트를 많이 받은 제목 20개만 표시됩니다."));
  }

  authorTitleList.replaceChildren(fragment);
}

function openAuthorTitleLocation(card) {
  const imageKey = card.dataset.imageKey || "";
  const entryId = card.dataset.entryId || "";

  if (findImageIndexByKey(imageKey) < 0) {
    showToast("해당 사진을 찾지 못했습니다.");
    return;
  }

  closeAuthorProfile();
  openRankingLocation(imageKey, entryId);
}

function closeAuthorProfile() {
  authorProfileRequestId += 1;
  authorProfileModal.hidden = true;
  authorTitleList.replaceChildren();
  authorProfileStats.hidden = true;
  authorProfileActions.hidden = true;
  activeAuthorProfile = null;
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

async function initializeAuthProviders() {
  try {
    const data = await requestAuth("/api/auth/providers", { method: "GET", headers: {} });
    const googleEnabled = Boolean(data.google);
    const naverEnabled = Boolean(data.naver);
    googleAuthButton.hidden = !googleEnabled;
    naverAuthButton.hidden = !naverEnabled;
    authSocial.hidden = !(googleEnabled || naverEnabled);
  } catch (error) {
    console.warn("소셜 로그인 제공자 정보를 불러오지 못했습니다.", error);
  }
}

const AUTH_ERROR_MESSAGES = {
  google_state: "구글 로그인 요청이 만료되었습니다. 다시 시도해주세요.",
  google_failed: "구글 로그인에 실패했습니다. 다시 시도해주세요.",
  naver_state: "네이버 로그인 요청이 만료되었습니다. 다시 시도해주세요.",
  naver_failed: "네이버 로그인에 실패했습니다. 다시 시도해주세요.",
  account_blocked: "차단된 계정입니다.",
};

function handleAuthErrorFromUrl() {
  const url = new URL(window.location.href);
  const code = url.searchParams.get("auth_error");

  if (!code) {
    return;
  }

  showToast(AUTH_ERROR_MESSAGES[code] || "로그인에 실패했습니다. 다시 시도해주세요.");
  url.searchParams.delete("auth_error");
  history.replaceState(history.state, "", `${url.pathname}${url.search}${url.hash}`);
}

async function verifyEmailFromUrl() {
  const url = new URL(window.location.href);
  const token = url.searchParams.get("verifyEmailToken");
  const hasAuthMessage = url.searchParams.has("authMessage");

  if (!token) {
    if (hasAuthMessage) {
      url.searchParams.delete("authMessage");
      history.replaceState(history.state, "", `${url.pathname}${url.search}${url.hash}`);
    }

    return;
  }

  try {
    await requestAuth("/api/auth/email/verify", {
      method: "POST",
      body: JSON.stringify({ token }),
    });
    showToast("이메일 인증이 완료되었습니다. 이제 로그인할 수 있습니다.");
    await restoreSession();
    if (!currentUser) {
      openAuthModal("login");
    }
  } catch (error) {
    showToast(error.message);
  } finally {
    url.searchParams.delete("verifyEmailToken");
    if (hasAuthMessage) {
      url.searchParams.delete("authMessage");
    }
    history.replaceState(history.state, "", `${url.pathname}${url.search}${url.hash}`);
  }
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
  drawerEdgeClose.textContent = isOpen ? ">" : "<";
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

function showImageRequestHistory() {
  drawerMenuView.hidden = true;
  myTitlesView.hidden = false;
  myCommentsView.hidden = true;
  drawerMenuView.classList.remove("is-active");
  myTitlesView.classList.add("is-active");
  myCommentsView.classList.remove("is-active");
  myTitlesView.querySelector("h3").textContent = "내 이미지 제안 내역";
  myTitleList.replaceChildren(createMyTitleMessage("아직 표시할 이미지 제안 내역이 없습니다."));
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

async function loadAdminImages() {
  adminImageMessage.textContent = "관리자 권한을 확인하는 중입니다.";
  adminCurrentUser.textContent = "확인 중";
  adminRoleBadge.textContent = "role 확인 중";

  try {
    const data = await requestJson("/api/admin/me", { method: "GET", headers: {} });
    const adminUser = data.user || {};
    adminCurrentUser.textContent = `${adminUser.username || "관리자"}${adminUser.email ? ` (${adminUser.email})` : ""}`;
    adminRoleBadge.textContent = `role: ${adminUser.role || "user"}`;
    currentAdminRole = adminUser.role || "user";
    adminImageMessage.textContent = "";

    if (currentUser && String(currentUser.id) === String(adminUser.id)) {
      currentUser = { ...currentUser, role: adminUser.role };
      renderUser();
    }

    await loadAdminSection(activeAdminSection);
  } catch (error) {
    adminImageMessage.textContent = error.message;
    goHome();

    if (!currentUser) {
      openAuthModal("login");
    }

    showToast(error.message);
  }
}

async function loadAdminSection(section) {
  activeAdminSection = section;
  renderAdminTabs();

  if (section === "dashboard") {
    renderAdminDashboard();
    return;
  }

  if (section === "submissions") {
    await loadAdminSubmissions();
    return;
  }

  if (section === "images") {
    await loadAdminImageSuggestions();
    return;
  }

  if (section === "reports") {
    await loadAdminReports();
    return;
  }

  if (section === "users") {
    await loadAdminUsers();
    return;
  }

  if (section === "inquiries") {
    await loadAdminInquiries();
    return;
  }

  await loadAdminLogs();
}

function renderAdminTabs() {
  adminTabs.forEach((tab) => {
    const isActive = tab.dataset.adminSection === activeAdminSection;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  });
}

function renderAdminDashboard() {
  const fragment = document.createDocumentFragment();

  const statsPanel = document.createElement("section");
  statsPanel.className = "admin-stats-panel";

  const statsHead = document.createElement("div");
  statsHead.className = "admin-stats-head";
  const statsTitle = document.createElement("h2");
  statsTitle.textContent = "최근 7일 누적 추이";
  const statsHint = document.createElement("p");
  statsHint.textContent = "일별 제목/댓글/회원 누적 수 (KST 기준)";
  statsHead.append(statsTitle, statsHint);

  const statsBody = document.createElement("div");
  statsBody.className = "admin-stats-body";
  statsBody.append(createAdminMessage("통계를 불러오는 중입니다."));

  statsPanel.append(statsHead, statsBody);
  fragment.append(statsPanel);

  const sections = [
    ["submissions", "제목/댓글 관리", "제출된 제목과 댓글을 숨김, 삭제, 랭킹 제외 처리합니다."],
    ["users", "회원 관리", "회원 정지 상태와 admin 권한을 관리합니다."],
    ["reports", "신고 관리", "제목, 댓글, 사진 신고의 처리 상태를 변경합니다."],
    ["inquiries", "문의 관리", "문의 접수 상태를 검토하고 저장합니다."],
    ["images", "이미지 제안", "문의로 접수된 제안 이미지를 미리 보고, 승인하면 갤러리에 바로 게시합니다."],
    ["logs", "활동 로그", "관리자 작업 이력을 확인합니다."],
  ];
  const grid = document.createElement("div");
  grid.className = "admin-section-grid";

  sections.forEach(([section, titleText, descriptionText]) => {
    const card = document.createElement("button");
    card.className = "admin-section-card";
    card.type = "button";
    card.dataset.action = "admin-dashboard-section";
    card.dataset.section = section;

    const title = document.createElement("h2");
    title.textContent = titleText;

    const description = document.createElement("p");
    description.textContent = descriptionText;

    card.append(title, description);
    grid.append(card);
  });

  fragment.append(grid);
  adminImageList.replaceChildren(fragment);

  loadAdminDashboardStats(statsBody);
}

async function loadAdminDashboardStats(body) {
  try {
    const data = await requestJson("/api/admin/stats", { method: "GET", headers: {} });
    renderAdminStatsChart(body, data);
  } catch (error) {
    body.replaceChildren(createAdminMessage(error.message));
  }
}

const ADMIN_CHART_SVG_NS = "http://www.w3.org/2000/svg";
const ADMIN_CHART_COLORS = {
  titles: "var(--primary)",
  comments: "var(--link)",
  members: "var(--success)",
};

function svgEl(name, attrs) {
  const el = document.createElementNS(ADMIN_CHART_SVG_NS, name);
  for (const [key, value] of Object.entries(attrs || {})) {
    el.setAttribute(key, value);
  }
  return el;
}

function renderAdminStatsChart(container, data) {
  const days = (data && data.days) || [];
  const series = (data && data.series) || [];

  if (!days.length || !series.length) {
    container.replaceChildren(createAdminMessage("표시할 통계가 없습니다."));
    return;
  }

  const wrap = document.createElement("div");
  wrap.className = "admin-chart";

  const legend = document.createElement("div");
  legend.className = "admin-chart-legend";
  series.forEach((entry) => {
    const item = document.createElement("span");
    item.className = "admin-chart-legend-item";

    const dot = document.createElement("span");
    dot.className = "admin-chart-dot";
    dot.style.background = ADMIN_CHART_COLORS[entry.key] || "var(--text-muted)";

    const label = document.createElement("span");
    const latest = entry.cumulative[entry.cumulative.length - 1] || 0;
    label.textContent = `${entry.label} ${latest.toLocaleString()}`;

    item.append(dot, label);
    legend.append(item);
  });

  const W = 720;
  const H = 320;
  const padL = 48;
  const padR = 16;
  const padT = 20;
  const padB = 40;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;
  const n = days.length;
  const steps = 4;

  let maxVal = 0;
  series.forEach((entry) => {
    entry.cumulative.forEach((value) => {
      if (value > maxVal) maxVal = value;
    });
  });
  const axisMax = niceAxisMax(maxVal, steps);

  const xAt = (i) => padL + (n === 1 ? plotW / 2 : (i / (n - 1)) * plotW);
  const yAt = (value) => padT + plotH - (value / axisMax) * plotH;

  const svg = svgEl("svg", {
    viewBox: `0 0 ${W} ${H}`,
    class: "admin-chart-svg",
    role: "img",
    "aria-label": "최근 7일 누적 추이 그래프",
    preserveAspectRatio: "xMidYMid meet",
  });

  for (let i = 0; i <= steps; i++) {
    const value = (axisMax / steps) * i;
    const y = yAt(value);
    svg.append(svgEl("line", { x1: padL, y1: y, x2: W - padR, y2: y, class: "admin-chart-grid" }));
    const text = svgEl("text", { x: padL - 8, y: y + 4, class: "admin-chart-axis", "text-anchor": "end" });
    text.textContent = Math.round(value).toLocaleString();
    svg.append(text);
  }

  days.forEach((day, i) => {
    const text = svgEl("text", { x: xAt(i), y: H - padB + 22, class: "admin-chart-axis", "text-anchor": "middle" });
    text.textContent = formatChartDay(day);
    svg.append(text);
  });

  series.forEach((entry) => {
    const color = ADMIN_CHART_COLORS[entry.key] || "var(--text-muted)";
    const points = entry.cumulative.map((value, i) => `${xAt(i)},${yAt(value)}`).join(" ");
    svg.append(
      svgEl("polyline", {
        points,
        fill: "none",
        stroke: color,
        "stroke-width": 2.5,
        "stroke-linejoin": "round",
        "stroke-linecap": "round",
      })
    );
    entry.cumulative.forEach((value, i) => {
      const circle = svgEl("circle", { cx: xAt(i), cy: yAt(value), r: 3.5, fill: color });
      const title = svgEl("title", {});
      title.textContent = `${formatChartDay(days[i])} · ${entry.label} 누적 ${value.toLocaleString()} (당일 +${entry.daily[i] || 0})`;
      circle.append(title);
      svg.append(circle);
    });
  });

  wrap.append(legend, svg);
  container.replaceChildren(wrap);
}

async function loadAdminSubmissions() {
  adminImageList.replaceChildren(createAdminMessage("제목/댓글 목록을 불러오는 중입니다."));

  try {
    const data = await requestJson(`/api/admin/submissions?type=${encodeURIComponent(adminFilters.submissions)}&status=${encodeURIComponent(adminFilters.submissionsStatus)}`, { method: "GET", headers: {} });
    renderAdminSubmissions(data.items || []);
  } catch (error) {
    adminImageList.replaceChildren(createAdminMessage(error.message));
  }
}

function renderAdminSubmissions(items) {
  const fragment = document.createDocumentFragment();
  fragment.append(
    createAdminStatusFilter("submissions", [
      ["all", "전체"],
      ["submission", "제목"],
      ["comment", "댓글"],
    ])
  );
  fragment.append(
    createAdminStatusFilter(
      "submissionsStatus",
      [
        ["active", "활성"],
        ["deleted", "삭제됨"],
      ],
      "submissions"
    )
  );

  if (items.length === 0) {
    fragment.append(
      createAdminMessage(
        adminFilters.submissionsStatus === "deleted"
          ? "삭제된 제목/댓글이 없습니다."
          : "표시할 제목/댓글이 없습니다."
      )
    );
    adminImageList.replaceChildren(fragment);
    return;
  }

  const tableWrap = createAdminTable(
    [
      "유형/ID",
      "이미지/부모",
      "내용",
      "작성자",
      "작성일",
      "상태",
      "수치",
      "관리",
    ],
    ["8%", "10%", "22%", "11%", "10%", "11%", "8%", "20%"]
  );
  const tbody = tableWrap.querySelector("tbody");

  items.forEach((item) => {
    const row = document.createElement("tr");
    row.dataset.adminRow = "content";
    row.dataset.itemId = item.id;
    row.dataset.itemType = item.type;
    row.dataset.imageId = item.imageId || "";
    row.dataset.parentId = item.parentSubmissionId || "";

    const actions = [["content-open", "이동", "ghost"]];

    if (item.deletedAt) {
      actions.push(["content-undelete", "삭제 복구", "solid"]);
    } else {
      actions.push([item.hiddenAt ? "content-unhide" : "content-hide", item.hiddenAt ? "숨김 해제" : "숨김 처리", "ghost"]);
      actions.push(["content-delete", "삭제 처리", "danger"]);
      actions.push([
        item.excludedFromRanking ? "content-include-ranking" : "content-exclude-ranking",
        item.excludedFromRanking ? "랭킹 제외 해제" : "랭킹 제외",
        "ghost",
      ]);
    }

    row.append(
      createAdminCell(`${item.type === "comment" ? "댓글" : "제목"} #${item.id}`),
      createAdminCell(`이미지 ${item.imageId || "-"}${item.parentSubmissionId ? ` · 제목 #${item.parentSubmissionId}` : ""}`),
      createAdminCell(item.type === "comment" && item.parentTitle ? `${item.parentTitle} / ${item.content}` : item.content),
      createAdminCell(`${item.author}${item.authorEmail ? ` (${item.authorEmail})` : item.authorLoginId ? ` (${item.authorLoginId})` : ""}`),
      createAdminCell(formatDate(item.createdAt)),
      createAdminCell(getAdminContentStatusLabel(item)),
      createAdminCell(item.type === "submission" ? `좋아요 ${item.likes || 0} · 댓글 ${item.comments || 0}` : "-"),
      createAdminActionsCell(actions)
    );
    tbody.append(row);
  });

  fragment.append(tableWrap);
  adminImageList.replaceChildren(fragment);
}

async function loadAdminImageSuggestions() {
  adminImageList.replaceChildren(createAdminMessage("이미지 제안 목록을 불러오는 중입니다."));

  try {
    const status = adminFilters.images;
    const data = await requestJson(`/api/admin/image-suggestions?status=${encodeURIComponent(status)}`, {
      method: "GET",
      headers: {},
    });
    renderAdminImageSuggestions(data.suggestions || []);
  } catch (error) {
    adminImageList.replaceChildren(createAdminMessage(error.message));
  }
}

async function loadAdminReports() {
  adminImageList.replaceChildren(createAdminMessage("신고 목록을 불러오는 중입니다."));

  try {
    const data = await requestJson(`/api/admin/reports?status=${encodeURIComponent(adminFilters.reports)}`, { method: "GET", headers: {} });
    renderAdminReports(data.reports || []);
  } catch (error) {
    adminImageList.replaceChildren(createAdminMessage(error.message));
  }
}

function renderAdminReports(reports) {
  const fragment = document.createDocumentFragment();
  fragment.append(
    createAdminStatusFilter("reports", [
      ["new", "신규"],
      ["reviewing", "검토 중"],
      ["resolved", "처리 완료"],
      ["rejected", "기각"],
    ])
  );

  if (reports.length === 0) {
    fragment.append(createAdminMessage("해당 상태의 신고가 없습니다."));
    adminImageList.replaceChildren(fragment);
    return;
  }

  reports.forEach((report) => {
    const card = document.createElement("article");
    card.className = "admin-image-card admin-report-card";
    card.dataset.reportId = report.id;
    card.dataset.uploadedImageId = report.targetUploadedImageId || "";

    if (report.targetImageSrc) {
      const preview = document.createElement("img");
      preview.className = "admin-image-preview";
      preview.src = report.targetImageSrc;
      preview.alt = report.targetTitle || "신고 대상 이미지";
      preview.loading = "lazy";
      card.append(preview);
    }

    const body = document.createElement("div");
    body.className = "admin-image-body";

    const title = document.createElement("h2");
    title.textContent = `${getReportTargetLabel(report.targetType)} 신고: ${report.targetTitle || report.targetId}`;

    const meta = document.createElement("p");
    meta.className = "admin-image-meta";
    meta.textContent = `상태 ${report.status} · 사유 ${getReportReasonLabel(report.reason)} · 신고자 ${report.reporter}${report.reporterEmail ? ` (${report.reporterEmail})` : ""} · ${formatDate(report.createdAt)}`;

    const target = document.createElement("p");
    target.className = "admin-image-source";
    target.textContent = `대상 ID: ${report.targetId}${report.targetSummary ? ` · 대상 내용: ${report.targetSummary}` : ""}`;

    const detail = document.createElement("p");
    detail.textContent = report.detail || "상세 내용 없음";

    const actions = document.createElement("div");
    actions.className = "admin-image-actions";
    [
      ["new", "신규"],
      ["reviewing", "검토 중"],
      ["resolved", "처리 완료"],
      ["rejected", "기각"],
    ].forEach(([status, label]) => {
      const button = document.createElement("button");
      button.className = status === report.status ? "auth-button solid" : "auth-button ghost";
      button.type = "button";
      button.dataset.action = "report-status";
      button.dataset.status = status;
      button.textContent = label;
      actions.append(button);
    });

    if (report.targetUploadedImageId) {
      const hideButton = document.createElement("button");
      hideButton.className = "auth-button danger";
      hideButton.type = "button";
      hideButton.dataset.action = "report-hide-image";
      hideButton.textContent = "신고 이미지 숨김";
      actions.append(hideButton);
    }

    body.append(title, meta, target, detail, actions);
    card.append(body);
    fragment.append(card);
  });

  adminImageList.replaceChildren(fragment);
}

// 갤러리 문구 입력칸. 여러 줄 입력은 줄바꿈 하나가 항목 하나다.
function createSuggestionField(label, field, options = {}) {
  const wrap = document.createElement("label");
  wrap.className = "admin-caption-field";

  const caption = document.createElement("span");
  caption.className = "admin-caption-label";
  caption.textContent = label;

  const input = options.rows ? document.createElement("textarea") : document.createElement("input");

  if (options.rows) {
    input.rows = options.rows;
  } else {
    input.type = "text";
  }

  input.className = "admin-caption-input";
  input.dataset.field = field;
  input.maxLength = options.maxLength || 200;
  input.placeholder = options.placeholder || "";
  input.value = options.value || "";

  wrap.append(caption, input);
  return wrap;
}

function readSuggestionGalleryInput(card) {
  const readValue = (field) => card.querySelector(`[data-field="${field}"]`)?.value.trim() || "";
  const readLines = (field) =>
    readValue(field)
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .slice(0, 5);

  return {
    title: readValue("title"),
    alt: readValue("alt"),
    description: readValue("description"),
    prompt: readValue("prompt"),
    observationPoints: readLines("observationPoints"),
    exampleTitles: readLines("exampleTitles"),
  };
}

function renderAdminImageSuggestions(suggestions) {
  const fragment = document.createDocumentFragment();
  fragment.append(
    createAdminStatusFilter("images", [
      ["pending", "대기"],
      ["approved", "게시 중"],
      ["rejected", "거절"],
      ["deleted", "삭제"],
      ["all", "전체"],
    ])
  );

  if (suggestions.length === 0) {
    fragment.append(createAdminMessage("해당 상태의 이미지 제안이 없습니다."));
    adminImageList.replaceChildren(fragment);
    return;
  }

  const grid = document.createElement("div");
  grid.className = "admin-card-grid";

  suggestions.forEach((suggestion) => {
    const card = document.createElement("article");
    card.className = "admin-image-card";
    card.dataset.suggestionId = suggestion.id;

    const body = document.createElement("div");
    body.className = "admin-image-body";

    const title = document.createElement("h2");
    title.textContent = suggestion.inquiryTitle || "이미지 제안";

    const meta = document.createElement("p");
    meta.className = "admin-image-meta";
    meta.textContent = `상태 ${getSuggestionStatusLabel(suggestion.status)} · 제안자 ${suggestion.submitter}${suggestion.submitterEmail ? ` (${suggestion.submitterEmail})` : ""} · ${formatDate(suggestion.createdAt)}`;

    const source = document.createElement("p");
    source.className = "admin-image-source";
    source.textContent = suggestion.hasImage
      ? `첨부 파일: ${suggestion.fileName || "이미지"} · ${Math.max(1, Math.round(suggestion.byteSize / 1024))}KB · ${suggestion.contentType || "-"}`
      : "첨부 이미지가 저장되지 않은 제안입니다. 제안자에게 이미지 재제출을 요청하세요.";

    const bodyText = document.createElement("p");
    bodyText.className = "admin-suggestion-body";
    bodyText.textContent = suggestion.inquiryBody || "문의 내용 없음";

    const captions = document.createElement("div");
    captions.className = "admin-caption-grid";
    captions.append(
      createSuggestionField("카드 제목", "title", {
        value: suggestion.title,
        maxLength: 80,
        placeholder: "비워두면 문의 제목을 사용합니다",
      }),
      createSuggestionField("대체 텍스트(alt)", "alt", {
        value: suggestion.alt,
        maxLength: 200,
        placeholder: "비워두면 카드 제목을 사용합니다",
      }),
      createSuggestionField("장면 설명", "description", {
        value: suggestion.description,
        rows: 3,
        maxLength: 800,
        placeholder: "비워두면 문의 내용을 사용합니다",
      }),
      createSuggestionField("제목짓기 힌트", "prompt", {
        value: suggestion.prompt,
        rows: 2,
        maxLength: 300,
      }),
      createSuggestionField("관찰 포인트 (한 줄에 하나)", "observationPoints", {
        value: suggestion.observationPoints.join("\n"),
        rows: 3,
        maxLength: 400,
      }),
      createSuggestionField("예시 제목 (한 줄에 하나)", "exampleTitles", {
        value: suggestion.exampleTitles.join("\n"),
        rows: 3,
        maxLength: 400,
      })
    );

    const reasonInput = document.createElement("textarea");
    reasonInput.className = "admin-reason-input";
    reasonInput.rows = 2;
    reasonInput.maxLength = 1000;
    reasonInput.placeholder = "거절 사유";
    reasonInput.setAttribute("aria-label", "검수 사유");
    reasonInput.value = suggestion.moderationReason || "";

    const actions = document.createElement("div");
    actions.className = "admin-image-actions";

    const actionList = [];

    if (suggestion.status !== "approved" && suggestion.hasImage) {
      actionList.push(["suggestion-approve", "승인 후 바로 게시", "solid"]);
    }

    actionList.push(["suggestion-save", "문구만 저장", "ghost"]);

    if (suggestion.status === "approved") {
      actionList.push(["suggestion-approve", "문구 반영해 다시 게시", "solid"]);
      actionList.push(["suggestion-unpublish", "갤러리에서 내리기", "ghost"]);
    }

    if (suggestion.status !== "rejected") {
      actionList.push(["suggestion-reject", "거절", "ghost"]);
    }

    actionList.push(["suggestion-delete", "삭제", "danger"]);

    actionList.forEach(([action, label, style]) => {
      const button = document.createElement("button");
      button.className = `auth-button ${style}`;
      button.type = "button";
      button.dataset.action = action;
      button.textContent = label;
      actions.append(button);
    });

    body.append(title, meta, source, bodyText, captions, reasonInput, actions);

    if (suggestion.hasImage) {
      const preview = document.createElement("img");
      preview.className = "admin-image-preview";
      preview.src = suggestion.src;
      preview.alt = suggestion.alt || suggestion.inquiryTitle || "제안 이미지";
      preview.loading = "lazy";
      card.append(preview);
    }

    card.append(body);
    grid.append(card);
  });

  fragment.append(grid);
  adminImageList.replaceChildren(fragment);
}

function getSuggestionStatusLabel(status) {
  if (status === "approved") {
    return "게시 중";
  }

  if (status === "rejected") {
    return "거절";
  }

  if (status === "deleted") {
    return "삭제";
  }

  return "대기";
}

async function handleImageSuggestionAction(card, action) {
  const suggestionId = card.dataset.suggestionId;
  const endpoint = `/api/admin/image-suggestions/${encodeURIComponent(suggestionId)}`;
  const gallery = readSuggestionGalleryInput(card);
  const reason = card.querySelector(".admin-reason-input")?.value.trim() || "";

  try {
    if (action === "suggestion-approve") {
      if (!window.confirm("이 이미지를 승인해 갤러리에 바로 게시할까요?")) {
        return;
      }

      const data = await requestJson(`${endpoint}/approve`, { method: "POST", body: JSON.stringify(gallery) });
      showToast(`갤러리에 게시했습니다: ${data.title || "이미지 제안"}`);
    } else if (action === "suggestion-save") {
      await requestJson(endpoint, { method: "PATCH", body: JSON.stringify(gallery) });
      showToast("갤러리 문구를 저장했습니다.");
    } else if (action === "suggestion-unpublish") {
      if (!window.confirm("갤러리에서 내리고 대기 상태로 되돌릴까요?")) {
        return;
      }

      await requestJson(endpoint, { method: "PATCH", body: JSON.stringify({ ...gallery, status: "pending" }) });
      showToast("갤러리에서 내렸습니다.");
    } else if (action === "suggestion-reject") {
      if (!window.confirm("이 이미지 제안을 거절할까요?")) {
        return;
      }

      await requestJson(`${endpoint}/reject`, { method: "POST", body: JSON.stringify({ reason }) });
      showToast("이미지 제안을 거절했습니다.");
    } else if (action === "suggestion-delete") {
      if (!window.confirm("이미지 제안을 삭제할까요? 저장된 이미지도 함께 지워집니다.")) {
        return;
      }

      await requestJson(endpoint, { method: "DELETE", headers: {} });
      showToast("이미지 제안을 삭제했습니다.");
    } else {
      return;
    }

    await loadAdminImageSuggestions();
    await loadGalleryImages();
  } catch (error) {
    adminImageMessage.textContent = error.message;
  }
}

async function loadAdminUsers() {
  adminImageList.replaceChildren(createAdminMessage("회원 목록을 불러오는 중입니다."));

  try {
    const data = await requestJson("/api/admin/users", { method: "GET", headers: {} });
    currentAdminRole = data.currentAdminRole || currentAdminRole;
    renderAdminUsers(data.users || []);
  } catch (error) {
    adminImageList.replaceChildren(createAdminMessage(error.message));
  }
}

function renderAdminUsers(users) {
  if (users.length === 0) {
    adminImageList.replaceChildren(createAdminMessage("회원이 없습니다."));
    return;
  }

  const tableWrap = createAdminTable(
    ["ID", "이메일", "로그인 ID", "닉네임", "role", "status", "가입/최근", "관리"],
    ["5%", "20%", "12%", "12%", "8%", "9%", "14%", "20%"]
  );
  const tbody = tableWrap.querySelector("tbody");

  users.forEach((user) => {
    const row = document.createElement("tr");
    row.dataset.adminRow = "user";
    row.dataset.userId = user.id;
    row.dataset.userRole = user.role;
    row.dataset.userStatus = user.status;

    const actions = [];

    if (user.role !== "owner") {
      actions.push([
        "user-status",
        user.status === "suspended" ? "정지 해제" : "정지",
        user.status === "suspended" ? "solid" : "danger",
      ]);
    }

    if (currentAdminRole === "owner" && user.role !== "owner") {
      actions.push(["user-role", user.role === "admin" ? "admin 해제" : "admin 지정", "ghost"]);
    }

    row.append(
      createAdminCell(`#${user.id}`),
      createAdminCell(user.email || "-"),
      createAdminCell(user.loginId || "-"),
      createAdminCell(user.username || "-"),
      createAdminCell(user.role || "user"),
      createAdminCell(`${user.status || "active"}${user.blockedReason ? ` · ${user.blockedReason}` : ""}`),
      createAdminCell(`가입 ${formatDate(user.createdAt)}${user.lastSessionAt ? ` · 최근 ${formatDate(user.lastSessionAt)}` : ""}`),
      user.role === "owner"
        ? createAdminCell("owner 보호")
        : createAdminActionsCell(actions)
    );
    tbody.append(row);
  });

  adminImageList.replaceChildren(tableWrap);
}

async function loadAdminInquiries() {
  adminImageList.replaceChildren(createAdminMessage("문의 목록을 불러오는 중입니다."));

  try {
    const data = await requestJson(`/api/admin/inquiries?status=${encodeURIComponent(adminFilters.inquiries)}`, { method: "GET", headers: {} });
    renderAdminInquiries(data.inquiries || []);
  } catch (error) {
    adminImageList.replaceChildren(createAdminMessage(error.message));
  }
}

function renderAdminInquiries(inquiries) {
  const fragment = document.createDocumentFragment();
  fragment.append(
    createAdminStatusFilter("inquiries", [
      ["new", "신규"],
      ["reviewing", "검토 중"],
      ["resolved", "처리 완료"],
      ["ignored", "무시"],
      ["all", "전체"],
    ])
  );

  if (inquiries.length === 0) {
    fragment.append(createAdminMessage("해당 상태의 문의가 없습니다."));
    adminImageList.replaceChildren(fragment);
    return;
  }

  inquiries.forEach((inquiry) => {
    const card = document.createElement("article");
    card.className = "admin-image-card admin-report-card";
    card.dataset.inquiryId = inquiry.id;

    const body = document.createElement("div");
    body.className = "admin-image-body";

    const title = document.createElement("h2");
    title.textContent = inquiry.title || "문의";

    const meta = document.createElement("p");
    meta.className = "admin-image-meta";
    meta.textContent = `유형 ${inquiry.type} · 상태 ${inquiry.status} · 작성자 ${inquiry.user}${inquiry.replyEmail ? ` · 답변 이메일 ${inquiry.replyEmail}` : ""} · ${formatDate(inquiry.createdAt)}`;

    const bodyText = document.createElement("p");
    bodyText.textContent = inquiry.body || "내용 없음";

    const actions = document.createElement("div");
    actions.className = "admin-image-actions";
    [
      ["new", "신규"],
      ["reviewing", "검토 중"],
      ["resolved", "처리 완료"],
      ["ignored", "무시"],
    ].forEach(([status, label]) => {
      const button = document.createElement("button");
      button.className = status === inquiry.status ? "auth-button solid" : "auth-button ghost";
      button.type = "button";
      button.dataset.action = "inquiry-status";
      button.dataset.status = status;
      button.textContent = label;
      actions.append(button);
    });

    body.append(title, meta, bodyText, actions);
    card.append(body);
    fragment.append(card);
  });

  adminImageList.replaceChildren(fragment);
}

async function loadAdminLogs() {
  adminImageList.replaceChildren(createAdminMessage("관리자 활동 로그를 불러오는 중입니다."));

  try {
    const data = await requestJson("/api/admin/activity", { method: "GET", headers: {} });
    renderAdminLogs(data.logs || []);
  } catch (error) {
    adminImageList.replaceChildren(createAdminMessage(error.message));
  }
}

function renderAdminLogs(logs) {
  if (logs.length === 0) {
    adminImageList.replaceChildren(createAdminMessage("관리자 활동 로그가 없습니다."));
    return;
  }

  const fragment = document.createDocumentFragment();

  logs.forEach((log) => {
    const card = document.createElement("article");
    card.className = "admin-image-card admin-report-card";

    const body = document.createElement("div");
    body.className = "admin-image-body";

    const title = document.createElement("h2");
    title.textContent = `${log.actionType} · ${log.targetType}`;

    const meta = document.createElement("p");
    meta.className = "admin-image-meta";
    meta.textContent = `관리자 ${log.adminEmail || log.adminUserId || "-"} · 대상 ${log.targetId} · ${formatDate(log.createdAt)}`;

    const description = document.createElement("p");
    description.textContent = log.description || "설명 없음";

    body.append(title, meta, description);
    card.append(body);
    fragment.append(card);
  });

  adminImageList.replaceChildren(fragment);
}

function createAdminStatusFilter(section, options, reloadSection = section) {
  const toolbar = document.createElement("div");
  toolbar.className = "admin-filter-row";

  options.forEach(([status, label]) => {
    const button = document.createElement("button");
    button.className = status === adminFilters[section] ? "admin-tab is-active" : "admin-tab";
    button.type = "button";
    button.dataset.action = "admin-filter";
    button.dataset.section = section;
    button.dataset.reloadSection = reloadSection;
    button.dataset.status = status;
    button.textContent = label;
    toolbar.append(button);
  });

  return toolbar;
}

function createAdminTable(headers, widths) {
  const wrap = document.createElement("div");
  wrap.className = "admin-table-wrap";

  const table = document.createElement("table");
  table.className = "admin-table";

  if (Array.isArray(widths) && widths.length) {
    const colgroup = document.createElement("colgroup");
    widths.forEach((width) => {
      const col = document.createElement("col");
      col.style.width = width;
      colgroup.append(col);
    });
    table.append(colgroup);
  }

  const thead = document.createElement("thead");
  const headRow = document.createElement("tr");
  headers.forEach((header) => {
    const th = document.createElement("th");
    th.scope = "col";
    th.textContent = header;
    headRow.append(th);
  });
  thead.append(headRow);

  const tbody = document.createElement("tbody");
  table.append(thead, tbody);
  wrap.append(table);
  return wrap;
}

function createAdminCell(text) {
  const cell = document.createElement("td");
  cell.textContent = text || "-";
  return cell;
}

function createAdminActionsCell(actions) {
  const cell = document.createElement("td");
  const group = document.createElement("div");
  group.className = "admin-image-actions";

  actions.forEach(([action, label, style]) => {
    const button = document.createElement("button");
    button.className = `auth-button ${style || "ghost"}`;
    button.type = "button";
    button.dataset.action = action;
    button.textContent = label;
    group.append(button);
  });

  cell.append(group);
  return cell;
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

  if (!window.confirm("이미지 검수 상태를 변경할까요?")) {
    return;
  }

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
    await loadAdminImageSuggestions();
    await loadGalleryImages();
  } catch (error) {
    adminImageMessage.textContent = error.message;
  }
}

async function updateAdminUser(card, body) {
  const userId = card.dataset.userId;
  const endpoint = body.role
    ? `/api/admin/users/${encodeURIComponent(userId)}/role`
    : `/api/admin/users/${encodeURIComponent(userId)}/status`;

  try {
    await requestJson(endpoint, {
      method: "PATCH",
      body: JSON.stringify(body),
    });
    showToast("회원 정보를 저장했습니다.");
    await loadAdminUsers();
  } catch (error) {
    adminImageMessage.textContent = error.message;
  }
}

async function updateAdminInquiry(card, status) {
  try {
    await requestJson(`/api/admin/inquiries/${encodeURIComponent(card.dataset.inquiryId)}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    showToast("문의 상태를 저장했습니다.");
    await loadAdminInquiries();
  } catch (error) {
    adminImageMessage.textContent = error.message;
  }
}

async function updateAdminContent(row, action, reason = "") {
  const actionMap = {
    "content-hide": "hide",
    "content-unhide": "unhide",
    "content-delete": "delete",
    "content-undelete": "undelete",
    "content-exclude-ranking": "exclude_ranking",
    "content-include-ranking": "include_ranking",
  };
  const apiAction = actionMap[action];

  if (!apiAction) {
    return;
  }

  try {
    await requestJson(`/api/admin/submissions/${encodeURIComponent(row.dataset.itemId)}/moderation`, {
      method: "PATCH",
      body: JSON.stringify({
        targetType: row.dataset.itemType,
        action: apiAction,
        reason,
      }),
    });
    showToast("콘텐츠 관리 상태를 저장했습니다.");
    if (action === "content-delete") {
      row.remove();
    } else {
      await loadAdminSubmissions();
    }
  } catch (error) {
    adminImageMessage.textContent = error.message;
  }
}

function openAdminContentLocation(row) {
  const imageId = row.dataset.imageId || "";

  if (!imageId) {
    showToast("이동할 사진 정보를 찾을 수 없습니다.");
    return;
  }

  if (row.dataset.itemType === "comment") {
    openRankingLocation(imageId, row.dataset.parentId || "", row.dataset.itemId || "");
  } else {
    openRankingLocation(imageId, row.dataset.itemId || "");
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

async function shareSubmission(imageKey, submission) {
  const url = `${location.origin}${galleryPageUrl(imageKey, submission.id)}`;
  const text = `"${submission.title}" — 내가 지은 제목인데 평가 좀. 더 웃기게 지을 수 있으면 도전`;

  if (navigator.share) {
    try {
      await navigator.share({ title: "제목 학원", text, url });
      return;
    } catch (error) {
      if (error?.name === "AbortError") {
        return;
      }
    }
  }

  try {
    await navigator.clipboard.writeText(url);
    showToast("공유 링크를 복사했어요. 카톡에 붙여넣어 보세요!");
  } catch {
    showToast(url);
  }
}

shareBannerButton?.addEventListener("click", () => {
  if (!pendingShareSubmission) {
    return;
  }
  shareSubmission(pendingShareSubmission.imageKey, pendingShareSubmission.submission);
});

shareBannerClose?.addEventListener("click", () => {
  if (pendingShareSubmission) {
    dismissedShareSubmissionIds.add(pendingShareSubmission.submission.id);
  }
  updateShareBanner();
});

homeLink.addEventListener("click", (event) => {
  event.preventDefault();
  goHome();
});

contactLink.addEventListener("click", (event) => {
  event.preventDefault();
  goContact();
});

uploadNavButton.addEventListener("click", goImageSuggestionContact);
adminNavButton.addEventListener("click", goAdmin);
adminTabs.forEach((tab) => {
  tab.addEventListener("click", async () => {
    await loadAdminSection(tab.dataset.adminSection || "images");
  });
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

  if (actionButton?.dataset.action === "guide") {
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

  if (isTitleSubmitting) {
    return;
  }

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

  if (isTitleSubmitting) {
    return;
  }

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
        throw new Error(data.message || "요청 처리 중 오류가 발생했습니다.");
      }

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

  if (button.dataset.action === "admin-delete-submission") {
    if (!isCurrentAdmin()) return;
    if (!window.confirm("이 제목을 삭제할까요?")) return;

    const imageKey = getSelectedImageKey();
    const serverEntries = serverSubmissionsByImage[imageKey];

    try {
      await requestJson(`/api/admin/submissions/${encodeURIComponent(entryId)}/moderation`, {
        method: "PATCH",
        body: JSON.stringify({ targetType: "submission", action: "delete", reason: "" }),
      });
      if (Array.isArray(serverEntries)) {
        serverSubmissionsByImage[imageKey] = serverEntries.filter((item) => item.id !== entryId);
      }
      expandedCommentIds.delete(entryId);
      renderRanking();
      showToast("제목을 삭제했습니다.");
    } catch (error) {
      showToast(error.message);
    }
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

backToGalleryButton.addEventListener("click", goHome);
rankingSelfLink.addEventListener("click", scrollToMyRanking);

randomEntryButton?.addEventListener("click", () => goRandom());
randomBackButton?.addEventListener("click", goHome);
randomShuffleButton?.addEventListener("click", () => goRandom(selectedImageIndex));
randomTitleButton?.addEventListener("click", () => {
  if (Number.isInteger(selectedImageIndex)) {
    startTitleEntry(selectedImageIndex);
  }
});
randomRankingButton?.addEventListener("click", () => {
  if (Number.isInteger(selectedImageIndex)) {
    showRanking(selectedImageIndex);
  }
});
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

// 모달 안에서 드래그를 시작해 배경 위에서 마우스를 놓으면 click 대상이 배경으로 잡혀
// 모달이 닫히는 문제가 있어, 누름(pointerdown)과 놓음(click)이 모두 배경일 때만 닫는다.
function bindModalBackdropClose(modal, close) {
  let pressedOnBackdrop = false;
  modal.addEventListener("pointerdown", (event) => {
    pressedOnBackdrop = event.target === modal;
  });
  modal.addEventListener("click", (event) => {
    if (pressedOnBackdrop && event.target === modal) {
      close();
    }
    pressedOnBackdrop = false;
  });
}

bindModalBackdropClose(imageReportModal, closeReportModal);
imageReportForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  await submitImageReport();
});
adminImageList.addEventListener("click", async (event) => {
  const button = event.target.closest("button[data-action]");

  if (!button) {
    return;
  }

  if (button.dataset.action === "admin-filter") {
    adminFilters[button.dataset.section] = button.dataset.status;
    await loadAdminSection(button.dataset.reloadSection || button.dataset.section || activeAdminSection);
    return;
  }

  if (button.dataset.action === "admin-dashboard-section") {
    await loadAdminSection(button.dataset.section || "dashboard");
    return;
  }

  const row = event.target.closest("[data-admin-row]");

  if (row?.dataset.adminRow === "content") {
    const action = button.dataset.action;

    if (action === "content-open") {
      openAdminContentLocation(row);
      return;
    }

    if (!window.confirm("해당 관리 작업을 적용할까요?")) {
      return;
    }

    await updateAdminContent(row, action);
    return;
  }

  if (row?.dataset.adminRow === "user") {
    if (button.dataset.action === "user-status") {
      const nextStatus = row.dataset.userStatus === "suspended" ? "active" : "suspended";

      if (nextStatus === "suspended") {
        const reason = window.prompt("회원 정지 사유를 입력하세요.", "") || "";

        if (!reason.trim()) {
          return;
        }

        await updateAdminUser(row, { status: nextStatus, reason: reason.trim() });
        return;
      }

      if (window.confirm("회원 정지를 해제할까요?")) {
        await updateAdminUser(row, { status: nextStatus });
      }
      return;
    }

    if (button.dataset.action === "user-role") {
      const nextRole = row.dataset.userRole === "admin" ? "user" : "admin";

      if (window.confirm(`회원 role을 ${nextRole}(으)로 변경할까요?`)) {
        await updateAdminUser(row, { role: nextRole });
      }
      return;
    }
  }

  const card = event.target.closest(".admin-image-card");

  if (!card) {
    return;
  }

  if (button.dataset.action === "report-status") {
    if (!window.confirm("신고 처리 상태를 변경할까요?")) {
      return;
    }

    try {
      await requestJson(`/api/admin/reports/${encodeURIComponent(card.dataset.reportId)}/status`, {
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

  if (button.dataset.action === "report-hide-image") {
    const uploadedImageId = card.dataset.uploadedImageId;

    if (!uploadedImageId) {
      return;
    }

    if (!window.confirm("신고된 이미지를 숨김 처리할까요?")) {
      return;
    }

    try {
      await requestJson(`/api/admin/images/${encodeURIComponent(uploadedImageId)}/hide`, {
        method: "POST",
        body: JSON.stringify({ reason: "신고 관리에서 숨김 처리" }),
      });
      showToast("신고 이미지를 숨김 처리했습니다.");
      await loadAdminReports();
      await loadGalleryImages();
    } catch (error) {
      adminImageMessage.textContent = error.message;
    }
    return;
  }

  if (button.dataset.action === "inquiry-status") {
    if (!window.confirm("문의 처리 상태를 변경할까요?")) {
      return;
    }

    await updateAdminInquiry(card, button.dataset.status);
    return;
  }

  if (card.dataset.suggestionId) {
    await handleImageSuggestionAction(card, button.dataset.action);
    return;
  }

  if (card.dataset.imageId) {
    await moderateImage(card, button.dataset.action);
  }
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
bindModalBackdropClose(cookieSettingsModal, closeCookieSettings);
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

contactAccessLoginButton.addEventListener("click", () => {
  openAuthModal("login");
});

googleAuthButton.addEventListener("click", () => {
  window.location.href = "/api/auth/google";
});

naverAuthButton.addEventListener("click", () => {
  window.location.href = "/api/auth/naver";
});

modalClose.addEventListener("click", closeAuthModal);

bindModalBackdropClose(authModal, closeAuthModal);

authModeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setAuthMode(button.dataset.authMode);
  });
});

// 브라우저 암묵 제출에만 의존하면 IME 조합 확정·자동완성 선택이 Enter를 소비해
// 제출이 안 되는 환경이 있어, 입력칸에서의 Enter를 명시적으로 제출로 연결한다.
function bindEnterSubmit(form) {
  form.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" || event.target.tagName !== "INPUT" || event.target.type === "checkbox") {
      return;
    }
    // 한글 등 조합 중 Enter는 확정용이므로 통과시키되, 비밀번호 칸은 ASCII 전용이라 바로 제출.
    if ((event.isComposing || event.keyCode === 229) && event.target.type !== "password") {
      return;
    }
    event.preventDefault();
    if (typeof form.requestSubmit === "function") {
      form.requestSubmit();
    } else {
      form.querySelector('button[type="submit"]')?.click();
    }
  });
}

bindEnterSubmit(loginForm);
bindEnterSubmit(signupForm);

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
  loginMessage.textContent = "비밀번호 재설정이 필요하면 문의 페이지로 계정 이메일과 함께 요청해주세요.";
});

let signupLoginIdTaken = false;
let signupLoginIdCheckTimer;

function setSignupLoginIdHint(text, tone) {
  signupLoginIdHint.textContent = text;
  signupLoginIdHint.classList.toggle("error", tone === "error");
  signupLoginIdHint.classList.toggle("ok", tone === "ok");
  signupLoginIdHint.hidden = !text;
}

async function checkSignupLoginIdAvailability(loginId) {
  try {
    const response = await fetch(`/api/auth/check-login-id?loginId=${encodeURIComponent(loginId)}`, {
      credentials: "include",
    });
    const data = await response.json().catch(() => ({}));

    if (signupLoginIdInput.value.trim() !== loginId) {
      return;
    }

    if (data.available) {
      signupLoginIdTaken = false;
      setSignupLoginIdHint("사용 가능한 아이디입니다.", "ok");
      return;
    }

    if (data.reason === "taken" || data.reason === "invalid") {
      signupLoginIdTaken = true;
      setSignupLoginIdHint(data.message || "이미 사용 중인 아이디입니다.", "error");
      return;
    }

    setSignupLoginIdHint(data.message || "확인에 실패했습니다. 잠시 후 다시 시도해주세요.", "error");
  } catch {
    if (signupLoginIdInput.value.trim() !== loginId) {
      return;
    }
    setSignupLoginIdHint("확인에 실패했습니다. 잠시 후 다시 시도해주세요.", "error");
  }
}

signupLoginIdInput.addEventListener("input", () => {
  const loginId = signupLoginIdInput.value.trim();
  window.clearTimeout(signupLoginIdCheckTimer);

  if (!loginId) {
    signupLoginIdTaken = false;
    setSignupLoginIdHint("", null);
    return;
  }

  signupLoginIdCheckTimer = window.setTimeout(() => {
    checkSignupLoginIdAvailability(loginId);
  }, 400);
});

signupForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  signupMessage.textContent = "";

  if (signupLoginIdTaken) {
    signupMessage.textContent = "이미 사용 중인 아이디입니다. 다른 아이디를 입력해주세요.";
    signupLoginIdInput.focus();
    return;
  }

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

contactImageInput.addEventListener("change", () => {
  const [file] = contactImageInput.files || [];

  if (file) {
    setContactAttachment(file);
  } else {
    clearContactAttachment(false);
  }
});

["dragenter", "dragover"].forEach((eventName) => {
  contactAttachmentDropzone.addEventListener(eventName, (event) => {
    event.preventDefault();
    contactAttachmentDropzone.classList.add("is-dragging");
  });
});

["dragleave", "drop"].forEach((eventName) => {
  contactAttachmentDropzone.addEventListener(eventName, (event) => {
    event.preventDefault();
    contactAttachmentDropzone.classList.remove("is-dragging");
  });
});

contactAttachmentDropzone.addEventListener("drop", (event) => {
  const [file] = event.dataTransfer?.files || [];

  if (file) {
    setContactAttachment(file);
  }
});

contactAttachmentRemoveButton.addEventListener("click", () => {
  clearContactAttachment();
  contactMessage.textContent = "";
  contactMessage.classList.remove("is-success");
});

contactForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  contactMessage.textContent = "";
  contactMessage.classList.remove("is-success");

  if (!canSubmitContact()) {
    renderContactAccessState();
    contactAccessLoginButton.focus();
    return;
  }

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

  const imageError = validateContactImage(selectedContactImage);

  if (imageError) {
    contactMessage.textContent = imageError;
    contactMessage.classList.remove("is-success");
    contactImageInput.focus();
    return;
  }

  contactSubmitButton.disabled = true;
  contactSubmitButton.textContent = "제출 중...";

  try {
    let attachment = selectedContactImage;

    // 제안 이미지는 서버에 보관되므로 상한을 넘으면 먼저 축소해서 보낸다.
    if (attachment && type === imageSuggestionType && attachment.size > maxSuggestionImageBytes) {
      contactSubmitButton.textContent = "이미지 준비 중...";
      attachment = await shrinkImageForSuggestion(attachment);

      if (!attachment) {
        contactMessage.textContent = "이미지 크기를 줄이지 못했습니다. 1.5MB 이하 이미지를 첨부해주세요.";
        return;
      }
    }

    contactSubmitButton.textContent = "제출 중...";

    const formData = new FormData();
    formData.append("type", type);
    formData.append("title", title);
    formData.append("replyEmail", replyEmail);
    formData.append("body", body);

    if (attachment) {
      formData.append("image", attachment);
    }

    const data = await requestFormJson("/api/contact", formData, { method: "POST" });
    contactForm.reset();
    clearContactAttachment(false);
    contactMessage.textContent = data.message || "문의가 접수되었습니다.";
    contactMessage.classList.add("is-success");
  } catch (error) {
    contactMessage.textContent = error.message;
  } finally {
    contactSubmitButton.disabled = !canSubmitContact();
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
authorProfileCloseButton.addEventListener("click", closeAuthorProfile);
bindModalBackdropClose(authorProfileModal, closeAuthorProfile);
authorProfileMessageButton.addEventListener("click", () => {
  const profile = activeAuthorProfile;
  closeAuthorProfile();
  openMessageCompose(profile);
});
authorTitleList.addEventListener("click", (event) => {
  const card = event.target.closest(".author-title-card[data-entry-id]");

  if (!card) {
    return;
  }

  openAuthorTitleLocation(card);
});
authorTitleList.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" && event.key !== " ") {
    return;
  }

  const card = event.target.closest(".author-title-card[data-entry-id]");

  if (!card) {
    return;
  }

  event.preventDefault();
  openAuthorTitleLocation(card);
});
messageComposeCloseButton.addEventListener("click", closeMessageCompose);
messageComposeCancelButton.addEventListener("click", closeMessageCompose);
bindModalBackdropClose(messageComposeModal, closeMessageCompose);
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
myTitlesButton.addEventListener("click", showImageRequestHistory);
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
bindModalBackdropClose(deleteAccountModal, closeDeleteAccountModal);
passwordCancelButton.addEventListener("click", closePasswordChangeModal);
bindModalBackdropClose(passwordChangeModal, closePasswordChangeModal);
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

/* ===================== 파티 모드 ===================== */

const partyPromoCard = document.querySelector("#partyPromoCard");
const galleryPartyPromoCard = document.querySelector("#galleryPartyPromoCard");
const partyConnectionBadge = document.querySelector("#partyConnectionBadge");
const partyEntryPanel = document.querySelector("#partyEntryPanel");
const partyCreateForm = document.querySelector("#partyCreateForm");
const partyCreateNicknameField = document.querySelector("#partyCreateNicknameField");
const partyCreateNicknameInput = document.querySelector("#partyCreateNickname");
const partyCreateMemberNote = document.querySelector("#partyCreateMemberNote");
const partyTotalRoundsSelect = document.querySelector("#partyTotalRounds");
const partyRoundSecondsSelect = document.querySelector("#partyRoundSeconds");
const partyCreateVoteSecondsSelect = document.querySelector("#partyCreateVoteSeconds");
const partyPublicInput = document.querySelector("#partyPublicInput");
const partyPublicHint = document.querySelector("#partyPublicHint");
const partyCreateMessage = document.querySelector("#partyCreateMessage");
const partyJoinForm = document.querySelector("#partyJoinForm");
const partyJoinNicknameField = document.querySelector("#partyJoinNicknameField");
const partyJoinNicknameInput = document.querySelector("#partyJoinNickname");
const partyJoinMemberNote = document.querySelector("#partyJoinMemberNote");
const partyJoinCodeInput = document.querySelector("#partyJoinCode");
const partyJoinMessage = document.querySelector("#partyJoinMessage");
const partyPublicRoomsSection = document.querySelector("#partyPublicRoomsSection");
const partyPublicRoomsRefreshButton = document.querySelector("#partyPublicRoomsRefreshButton");
const partyPublicRoomList = document.querySelector("#partyPublicRoomList");
const partyPublicRoomsEmpty = document.querySelector("#partyPublicRoomsEmpty");
const partyLobbyPanel = document.querySelector("#partyLobbyPanel");
const partyLobbyCode = document.querySelector("#partyLobbyCode");
const partyPlayerCount = document.querySelector("#partyPlayerCount");
const partyLobbyPlayerList = document.querySelector("#partyLobbyPlayerList");
const partyStartButton = document.querySelector("#partyStartButton");
const partyWaitMessage = document.querySelector("#partyWaitMessage");
const partyCopyCodeButton = document.querySelector("#partyCopyCodeButton");
const partyCopyLinkButton = document.querySelector("#partyCopyLinkButton");
const partySettingsHost = document.querySelector("#partySettingsHost");
const partySettingsReadonly = document.querySelector("#partySettingsReadonly");
const partyLobbyTotalRoundsSelect = document.querySelector("#partyLobbyTotalRounds");
const partyLobbyRoundSecondsSelect = document.querySelector("#partyLobbyRoundSeconds");
const partyLobbyVoteSecondsSelect = document.querySelector("#partyLobbyVoteSeconds");
const partySettingsMessage = document.querySelector("#partySettingsMessage");
const partyPhotoUploadSection = document.querySelector("#partyPhotoUploadSection");
const partyPhotoInput = document.querySelector("#partyPhotoInput");
const partyPhotoUploadMessage = document.querySelector("#partyPhotoUploadMessage");
const partyPhotoCount = document.querySelector("#partyPhotoCount");
const partyPhotoThumbHeading = document.querySelector("#partyPhotoThumbHeading");
const partyPhotoThumbList = document.querySelector("#partyPhotoThumbList");
const partyRoundPanel = document.querySelector("#partyRoundPanel");
const partyRoundProgress = document.querySelector("#partyRoundProgress");
const partyRoundTimer = document.querySelector("#partyRoundTimer");
const partyRoundPhoto = document.querySelector("#partyRoundPhoto");
const partyTitleForm = document.querySelector("#partyTitleForm");
const partyTitleInput = document.querySelector("#partyTitleInput");
const partyTitleSubmitButton = document.querySelector("#partyTitleSubmitButton");
const partySubmitHint = document.querySelector("#partySubmitHint");
const partySubmitCount = document.querySelector("#partySubmitCount");
const partyRevealPanel = document.querySelector("#partyRevealPanel");
const partyRevealProgress = document.querySelector("#partyRevealProgress");
const partyRevealPhoto = document.querySelector("#partyRevealPhoto");
const partyStage = document.querySelector("#partyStage");
const partyStageCounter = document.querySelector("#partyStageCounter");
const partyStageIdle = document.querySelector("#partyStageIdle");
const partyStageBubbleWrap = document.querySelector("#partyStageBubbleWrap");
const partyRevealNextButton = document.querySelector("#partyRevealNextButton");
const partyRevealWaitNote = document.querySelector("#partyRevealWaitNote");
const partyVoteSection = document.querySelector("#partyVoteSection");
const partyVoteHeading = document.querySelector("#partyVoteHeading");
const partyVoteTimer = document.querySelector("#partyVoteTimer");
const partyVoteGrid = document.querySelector("#partyVoteGrid");
const partyResultSection = document.querySelector("#partyResultSection");
const partyResultWinner = document.querySelector("#partyResultWinner");
const partySuggestBlock = document.querySelector("#partySuggestBlock");
const partySuggestButton = document.querySelector("#partySuggestButton");
const partySuggestPicker = document.querySelector("#partySuggestPicker");
const partySuggestOptions = document.querySelector("#partySuggestOptions");
const partySuggestSendButton = document.querySelector("#partySuggestSendButton");
const partySuggestCancelButton = document.querySelector("#partySuggestCancelButton");
const partyFinalSection = document.querySelector("#partyFinalSection");
const partyFinalWinner = document.querySelector("#partyFinalWinner");
const partyFinalRanking = document.querySelector("#partyFinalRanking");
const partyFinalBest = document.querySelector("#partyFinalBest");
const partyFinalSummary = document.querySelector("#partyFinalSummary");
const partyAdvanceButton = document.querySelector("#partyAdvanceButton");
const partyRevealWaitMessage = document.querySelector("#partyRevealWaitMessage");
const partyNewGameButton = document.querySelector("#partyNewGameButton");

const partyStorageKey = "title-academy-party";
const partyPollMs = 2000;
const partyRevealPollMs = 1000; // status='reveal'일 때는 방장이 넘긴 걸 더 빨리 반영
const partyCountdownTickMs = 250;
const partyTypeMs = 100; // 말풍선 타이핑 속도(글자당)

let partyPollIntervalId = null;
let partyPollCurrentMs = null;
let partyCountdownIntervalId = null;
let partyPublicRoomsIntervalId = null;
let partyVoteTimerIntervalId = null;
let partyServerOffsetMs = 0;
let partyCurrentRoundKey = "";
let partyRevealedRoundKey = "";
let partyTypedRevealKey = ""; // 이미 타이핑을 재생한 "code:round:revealIndex" — 폴링마다 재생 방지
let partyFinalStampedKey = ""; // 이미 우승 도장을 재생한 방 코드 — 종료 화면 폴링마다 재생 방지
let partyResultRenderedKey = ""; // 이미 그린 라운드 결과 "code:round:status" — 도장 재생 방지
let partyTypingTimeoutId = null;
let partyStageTypingActive = false;
let partyLastIsHost = false;
const partyPublicRoomsPollMs = 8000;
let partySuggestPickerOpen = false;
let partyLastRoom = null;
// 설정을 방금 바꾼 직후엔 그 이전에 날아간(레이스 상태) 폴링 응답이 값을 덮어쓰지 않게 잠깐 억제한다.
let partySettingsSuppressUntil = 0;

const partyState = {
  code: "",
  playerToken: "",
  nickname: "",
};

// 로그인 회원은 닉네임을 입력하지 않고 자기 회원 이름으로 참가한다.
// 로그인/로그아웃 즉시(setCurrentUser)와 파티 뷰 진입 시(enterPartyView) 호출해 입력 필드를 동기화한다.
function syncPartyIdentityFields() {
  const isMember = Boolean(currentUser);
  const memberName = getUserDisplayName() || currentUser?.loginId || "회원";

  [
    { field: partyCreateNicknameField, input: partyCreateNicknameInput, note: partyCreateMemberNote },
    { field: partyJoinNicknameField, input: partyJoinNicknameInput, note: partyJoinMemberNote },
  ].forEach(({ field, input, note }) => {
    if (field) {
      field.hidden = isMember;
    }
    if (input) {
      input.required = !isMember;
      input.disabled = isMember;
    }
    if (note) {
      note.hidden = !isMember;
      note.textContent = isMember ? `${memberName} 님으로 참가합니다` : "";
    }
  });
}

function loadPartyStorage() {
  try {
    const parsed = JSON.parse(localStorage.getItem(partyStorageKey) || "null");
    if (!parsed || typeof parsed !== "object" || !parsed.code || !parsed.playerToken) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function savePartyStorage() {
  try {
    localStorage.setItem(
      partyStorageKey,
      JSON.stringify({ code: partyState.code, playerToken: partyState.playerToken, nickname: partyState.nickname })
    );
  } catch {
    // localStorage를 쓸 수 없어도 게임 진행 자체엔 지장 없음(새로고침 복귀만 안 됨)
  }
}

function clearPartyStorage() {
  try {
    localStorage.removeItem(partyStorageKey);
  } catch {
    // ignore
  }
}

function setPartyUrl(code) {
  const route = { view: "party", partyCode: code || "" };
  history.replaceState(route, "", routeToUrl(route));
}

async function partyApi(path, body) {
  return requestAuth(path, { method: "POST", body: JSON.stringify(body) });
}

async function fetchPartyState() {
  const url = `/api/party/state?code=${encodeURIComponent(partyState.code)}&token=${encodeURIComponent(partyState.playerToken)}`;
  return requestAuth(url);
}

function showPartyPanel(panelName) {
  const panels = {
    entry: partyEntryPanel,
    lobby: partyLobbyPanel,
    round: partyRoundPanel,
    reveal: partyRevealPanel,
  };
  Object.entries(panels).forEach(([name, panel]) => {
    if (panel) {
      panel.hidden = name !== panelName;
    }
  });

  if (panelName === "entry") {
    refreshPublicRooms();
    startPublicRoomsPolling();
  } else {
    stopPublicRoomsPolling();
  }

  if (panelName !== "reveal") {
    stopPartyRevealActivity();
  }
}

function partyPhotoUrl(photoId) {
  return `/api/party/photo?code=${encodeURIComponent(partyState.code)}&token=${encodeURIComponent(partyState.playerToken)}&id=${encodeURIComponent(photoId)}`;
}

function applyPartyPhoto(imgEl, room) {
  // 라운드 사진은 방에서 올린 사진이 있으면 그것을, 없으면 서버가 고른 우리 갤러리 이미지를 쓴다.
  // 업로드 사진이 실패하면(만료된 세션 등) 갤러리 사진으로 자동 대체된다.
  const fallbackImage = room?.fallbackImage;
  imgEl.alt = fallbackImage?.alt || "파티 라운드 사진";

  if (room?.roundPhotoId) {
    imgEl.dataset.fallbackSrc = fallbackImage?.src || "";
    imgEl.dataset.fallbackApplied = "";
    imgEl.src = partyPhotoUrl(room.roundPhotoId);
  } else {
    imgEl.dataset.fallbackSrc = "";
    imgEl.dataset.fallbackApplied = "";
    imgEl.src = fallbackImage?.src || "";
  }
}

function setupPartyImageFallback(imgEl) {
  imgEl.addEventListener("error", () => {
    const fallback = imgEl.dataset.fallbackSrc || "";
    if (!fallback || imgEl.dataset.fallbackApplied === "1") {
      return;
    }
    imgEl.dataset.fallbackApplied = "1";
    imgEl.src = fallback;
  });
}

setupPartyImageFallback(partyRoundPhoto);
setupPartyImageFallback(partyRevealPhoto);

function stopPartyCountdown() {
  if (partyCountdownIntervalId) {
    window.clearInterval(partyCountdownIntervalId);
    partyCountdownIntervalId = null;
  }
}

function startPartyCountdown(deadlineAt) {
  stopPartyCountdown();

  if (!deadlineAt) {
    partyRoundTimer.textContent = "";
    return;
  }

  const tick = () => {
    const remainingMs = deadlineAt - (Date.now() + partyServerOffsetMs);
    const remainingSeconds = Math.max(0, Math.ceil(remainingMs / 1000));
    partyRoundTimer.textContent = `${remainingSeconds}초`;
    partyRoundTimer.classList.toggle("is-urgent", remainingSeconds <= 10);
  };

  tick();
  partyCountdownIntervalId = window.setInterval(tick, partyCountdownTickMs);
}

function renderPartyLobby(room, players, isHost) {
  partyLobbyCode.textContent = room.code;
  partyPlayerCount.textContent = `(${players.length}/12)`;
  partyLobbyPlayerList.innerHTML = "";

  players.forEach((player) => {
    const item = document.createElement("li");
    item.className = "party-player-item";
    if (!player.isActive) {
      item.classList.add("is-inactive");
    }

    const nameSpan = document.createElement("span");
    nameSpan.className = "party-player-name";
    nameSpan.textContent = player.nickname;
    item.appendChild(nameSpan);

    if (player.isHost) {
      const hostBadge = document.createElement("span");
      hostBadge.className = "party-player-badge";
      hostBadge.textContent = "호스트";
      item.appendChild(hostBadge);
    }

    if (player.isMember) {
      const memberBadge = document.createElement("span");
      memberBadge.className = "party-player-badge";
      memberBadge.textContent = "회원";
      item.appendChild(memberBadge);
    }

    if (player.isMe) {
      const meBadge = document.createElement("span");
      meBadge.className = "party-player-badge party-player-badge-me";
      meBadge.textContent = "나";
      item.appendChild(meBadge);
    }

    partyLobbyPlayerList.appendChild(item);
  });

  partyStartButton.hidden = !isHost;
  partyWaitMessage.hidden = isHost;

  renderPartySettings(room, isHost);
}

// 방장에게는 조작 가능한 select 3개, 비방장에게는 읽기 전용 한 줄을 보여준다.
// 방장이 select를 조작 중이거나(포커스 중) 방금 변경한 직후에는 폴링으로 값을 덮어쓰지 않는다.
function renderPartySettings(room, isHost) {
  partySettingsHost.hidden = !isHost;
  partySettingsReadonly.hidden = isHost;

  if (!isHost) {
    partySettingsReadonly.textContent = `${room.totalRounds}라운드 · 제목 ${room.roundSeconds}초 · 투표 ${room.voteSeconds}초`;
    return;
  }

  const settingsSelects = [partyLobbyTotalRoundsSelect, partyLobbyRoundSecondsSelect, partyLobbyVoteSecondsSelect];
  const isEditingSettings = settingsSelects.includes(document.activeElement);
  if (isEditingSettings || Date.now() < partySettingsSuppressUntil) {
    return;
  }

  partyLobbyTotalRoundsSelect.value = String(room.totalRounds);
  partyLobbyRoundSecondsSelect.value = String(room.roundSeconds);
  partyLobbyVoteSecondsSelect.value = String(room.voteSeconds);
}

async function submitPartySettings() {
  if (!partyState.code || !partyState.playerToken) {
    return;
  }
  partySettingsMessage.textContent = "";
  try {
    const data = await partyApi("/api/party/settings", {
      code: partyState.code,
      token: partyState.playerToken,
      totalRounds: Number(partyLobbyTotalRoundsSelect.value),
      roundSeconds: Number(partyLobbyRoundSecondsSelect.value),
      voteSeconds: Number(partyLobbyVoteSecondsSelect.value),
    });
    partySettingsSuppressUntil = Date.now() + 3000;
    renderPartyState(data.state);
  } catch (error) {
    partySettingsMessage.textContent = error?.message || "설정을 바꾸지 못했습니다.";
  }
}

[partyLobbyTotalRoundsSelect, partyLobbyRoundSecondsSelect, partyLobbyVoteSecondsSelect].forEach((select) => {
  select?.addEventListener("change", submitPartySettings);
});

function renderPartyRound(room, players, me) {
  const roundKey = `${room.code}:${room.roundNumber}`;
  if (roundKey !== partyCurrentRoundKey) {
    partyCurrentRoundKey = roundKey;
    partyTitleInput.value = "";
    applyPartyPhoto(partyRoundPhoto, room);
  }

  partyRoundProgress.textContent = `라운드 ${room.roundNumber} / ${room.totalRounds}`;

  const submittedCount = players.filter((player) => player.hasSubmitted).length;
  partySubmitCount.textContent = `제출 ${submittedCount}/${players.length}`;
  partySubmitHint.textContent = me?.hasSubmitted ? "제출 완료! 마감 전까지 수정할 수 있어요." : "";
  partyTitleSubmitButton.textContent = me?.hasSubmitted ? "수정" : "제출";

  startPartyCountdown(room.roundDeadlineAt);
}

function renderPartySuggestBlock(room, titles) {
  if (!room.roundPhotoId) {
    partySuggestBlock.hidden = true;
    partySuggestPicker.hidden = true;
    return;
  }

  partySuggestBlock.hidden = false;

  if (room.roundPhotoSuggested) {
    partySuggestButton.textContent = "제안 완료";
    partySuggestButton.disabled = true;
    partySuggestPicker.hidden = true;
    partySuggestPickerOpen = false;
    return;
  }

  partySuggestButton.textContent = "이 사진 갤러리에 제안하기";
  partySuggestButton.disabled = false;
  partySuggestPicker.hidden = !partySuggestPickerOpen;

  if (!partySuggestPickerOpen) {
    return;
  }

  const uniqueTitles = [...new Set(titles.map((entry) => entry.title))];
  partySuggestOptions.innerHTML = "";
  uniqueTitles.forEach((title, index) => {
    const item = document.createElement("li");
    const label = document.createElement("label");
    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = "partySuggestTitle";
    radio.value = title;
    radio.checked = index === 0;
    label.appendChild(radio);
    label.appendChild(document.createTextNode(` ${title}`));
    item.appendChild(label);
    partySuggestOptions.appendChild(item);
  });
}

// 게임 종료 화면의 최종 결과(우승 발표 + 순위표 + 베스트 제목 + 요약)를 그린다.
// 종료 화면은 폴링(1~2초)마다 다시 응답이 오지만 결과는 더 이상 바뀌지 않으므로,
// 타이핑 애니메이션과 같은 방식으로 방 코드당 최초 1회만 실제로 그리고 이후 폴링은 건너뛴다
// (그렇지 않으면 우승 도장 애니메이션이 폴링마다 재생된다).
function renderPartyFinal(room, finalStats) {
  if (room.status !== "ended" || !finalStats) {
    partyFinalSection.hidden = true;
    partyFinalStampedKey = "";
    return;
  }

  partyFinalSection.hidden = false;

  if (room.code === partyFinalStampedKey) {
    return;
  }
  partyFinalStampedKey = room.code;

  const { ranking, bestTitle, roundsPlayed, totalVotes } = finalStats;

  // 우승 발표 — 공동 우승이면 전원 나열. 표가 하나도 없으면 도장 없이 안내 문구만.
  partyFinalWinner.innerHTML = "";
  const winners = ranking.filter((entry) => entry.rank === 1);
  const hasAnyVotes = winners.some((entry) => entry.totalVotes > 0);

  if (!winners.length || !hasAnyVotes) {
    const empty = document.createElement("p");
    empty.className = "party-final-empty";
    empty.textContent = "이번 판은 표가 없었어요.";
    partyFinalWinner.appendChild(empty);
  } else {
    const stamp = document.createElement("span");
    stamp.className = "party-final-stamp";
    stamp.textContent = "우승";
    partyFinalWinner.appendChild(stamp);

    winners.forEach((winner) => {
      const row = document.createElement("div");
      row.className = "party-final-winner-row";

      const nameEl = document.createElement("p");
      nameEl.className = "party-final-winner-name";
      nameEl.textContent = winner.nickname;

      const metaEl = document.createElement("p");
      metaEl.className = "party-final-winner-meta";
      metaEl.textContent = `총 ${winner.totalVotes}표`;

      row.appendChild(nameEl);
      row.appendChild(metaEl);
      partyFinalWinner.appendChild(row);
    });
  }

  // 순위표 — 득표 0인 참가자도 전원 포함, 이모지 대신 "N위" 텍스트.
  partyFinalRanking.innerHTML = "";
  ranking.forEach((entry) => {
    const item = document.createElement("li");
    item.className = "party-final-rank-item";
    if (entry.rank === 1) {
      item.classList.add("is-first");
    }
    if (entry.isMe) {
      item.classList.add("is-me");
    }

    const rankSpan = document.createElement("span");
    rankSpan.className = "party-final-rank-num";
    rankSpan.textContent = `${entry.rank}위`;
    item.appendChild(rankSpan);

    const nameSpan = document.createElement("span");
    nameSpan.className = "party-final-rank-name";
    nameSpan.textContent = entry.nickname;
    item.appendChild(nameSpan);

    if (entry.isMember) {
      const memberBadge = document.createElement("span");
      memberBadge.className = "party-player-badge";
      memberBadge.textContent = "회원";
      item.appendChild(memberBadge);
    }

    if (entry.isMe) {
      const meBadge = document.createElement("span");
      meBadge.className = "party-player-badge party-player-badge-me";
      meBadge.textContent = "나";
      item.appendChild(meBadge);
    }

    const statsSpan = document.createElement("span");
    statsSpan.className = "party-final-rank-stats";
    statsSpan.textContent = `총 ${entry.totalVotes}표 · 라운드 우승 ${entry.roundWins}회`;
    item.appendChild(statsSpan);

    partyFinalRanking.appendChild(item);
  });

  // 베스트 제목 — 없으면(투표가 전혀 없던 게임) 블록 자체를 숨긴다.
  partyFinalBest.innerHTML = "";
  if (bestTitle) {
    partyFinalBest.hidden = false;

    const heading = document.createElement("p");
    heading.className = "party-final-best-heading";
    heading.textContent = "이번 판 베스트 제목";

    const titleEl = document.createElement("p");
    titleEl.className = "party-final-best-title";
    titleEl.textContent = bestTitle.title;

    const metaEl = document.createElement("p");
    metaEl.className = "party-final-best-meta";
    metaEl.textContent = `${bestTitle.nickname} · ${bestTitle.roundNumber}라운드 · ${bestTitle.voteCount}표`;

    partyFinalBest.appendChild(heading);
    partyFinalBest.appendChild(titleEl);
    partyFinalBest.appendChild(metaEl);
  } else {
    partyFinalBest.hidden = true;
  }

  partyFinalSummary.textContent = `${roundsPlayed}라운드 · 총 ${totalVotes}표`;
}

// 남이 올린 사진은 서버가 애초에 내려주지 않는다(비공개) — 여기 오는 photos는 항상 내가 올린 것.
function renderPartyPhotoThumbs(photos) {
  partyPhotoThumbList.innerHTML = "";
  partyPhotoThumbHeading.hidden = photos.length === 0;

  photos.forEach((photo) => {
    const item = document.createElement("li");
    item.className = "party-photo-thumb";

    const img = document.createElement("img");
    img.src = partyPhotoUrl(photo.id);
    img.alt = "내가 올린 사진";
    img.loading = "lazy";
    item.appendChild(img);

    if (photo.usedInRound != null) {
      const used = document.createElement("span");
      used.className = "party-photo-thumb-used";
      used.textContent = `라운드 ${photo.usedInRound}에 사용됨`;
      item.appendChild(used);
    }

    partyPhotoThumbList.appendChild(item);
  });
}

// 말풍선 타이핑 타이머 정리(라운드/패널 이탈 시 호출).
function clearPartyStageTyping() {
  if (partyTypingTimeoutId) {
    window.clearTimeout(partyTypingTimeoutId);
    partyTypingTimeoutId = null;
  }
  partyStageTypingActive = false;
}

function typePartyBubbleText(textEl, caretEl, text, onDone) {
  let index = 0;

  const step = () => {
    index += 1;
    textEl.textContent = text.slice(0, index);

    if (index >= text.length) {
      caretEl.classList.add("is-done");
      partyTypingTimeoutId = null;
      onDone?.();
      return;
    }

    partyTypingTimeoutId = window.setTimeout(step, partyTypeMs);
  };

  step();
}

// 말풍선을 새로 띄우고 제목을 한 글자씩 타이핑한다. 완료되면 방장 버튼을 다시 활성화한다.
function mountPartyBubble(entry) {
  clearPartyStageTyping();
  partyStageBubbleWrap.innerHTML = "";

  const bubble = document.createElement("div");
  bubble.className = "party-bubble party-bubble-pop";

  const titleEl = document.createElement("p");
  titleEl.className = "party-bubble-title";

  const textSpan = document.createElement("span");
  textSpan.className = "party-bubble-text";

  const caret = document.createElement("span");
  caret.className = "party-bubble-caret";

  titleEl.appendChild(textSpan);
  titleEl.appendChild(caret);
  bubble.appendChild(titleEl);

  const nameEl = document.createElement("p");
  nameEl.className = "party-bubble-name";
  nameEl.textContent = entry.nickname;
  bubble.appendChild(nameEl);

  partyStageBubbleWrap.appendChild(bubble);

  partyStageTypingActive = true;
  refreshPartyHostControlDisabled();

  typePartyBubbleText(textSpan, caret, entry.title, () => {
    partyStageTypingActive = false;
    refreshPartyHostControlDisabled();
  });
}

// 무대: 사진 아래에 마지막으로 공개된 제목 1개만 말풍선으로 띄운다.
// 폴링마다 다시 타이핑되지 않도록 이미 재생한 revealIndex를 partyTypedRevealKey로 기억한다.
function renderPartyStage(room, titles) {
  if (room.titlesTotal > 0) {
    partyStageCounter.hidden = false;
    partyStageCounter.textContent = `${room.revealIndex} / ${room.titlesTotal}`;
  } else {
    partyStageCounter.hidden = true;
    partyStageCounter.textContent = "";
  }

  if (room.revealIndex <= 0 || !titles.length) {
    partyStageIdle.hidden = false;
    partyStageBubbleWrap.innerHTML = "";
    clearPartyStageTyping();
    return;
  }

  partyStageIdle.hidden = true;

  const revealKey = `${room.code}:${room.roundNumber}:${room.revealIndex}`;
  if (revealKey === partyTypedRevealKey) {
    // 이미 이 revealIndex를 타이핑했음 — 완성된 상태 그대로 두고 재생하지 않는다.
    return;
  }
  partyTypedRevealKey = revealKey;

  const latest = titles[titles.length - 1];
  mountPartyBubble(latest);
}

// 방장 컨트롤: revealing 단계에서만 노출한다. 타이핑 중에는 disabled.
function renderPartyHostControl(room, isHost) {
  if (room.votePhase !== "revealing") {
    partyRevealNextButton.hidden = true;
    partyRevealWaitNote.hidden = true;
    return;
  }

  if (!isHost) {
    partyRevealNextButton.hidden = true;
    partyRevealWaitNote.hidden = false;
    return;
  }

  partyRevealWaitNote.hidden = true;
  partyRevealNextButton.hidden = false;
  partyRevealNextButton.disabled = partyStageTypingActive;
  partyRevealNextButton.textContent =
    room.revealIndex === 0 ? "첫 제목 공개" : `다음 제목 (${room.revealIndex + 1}/${room.titlesTotal})`;
}

// 타이핑 완료 콜백 등에서 버튼 텍스트를 다시 계산할 필요 없이 disabled만 갱신할 때 사용.
function refreshPartyHostControlDisabled() {
  if (partyLastRoom) {
    renderPartyHostControl(partyLastRoom, partyLastIsHost);
  }
}

// 투표 카드 하나(투표 중엔 클릭 가능한 버튼, 결과 단계엔 득표 배지가 붙는 읽기 전용 카드).
function buildPartyVoteCard(entry, room, me, votePhase) {
  const item = document.createElement("li");
  item.className = "party-vote-card-item";

  const isSelf = Boolean(me) && entry.playerId === me.id;
  const isSelected = room.myVoteTargetPlayerId === entry.playerId;

  const card = document.createElement("button");
  card.type = "button";
  card.className = "party-vote-card";
  card.dataset.targetPlayerId = String(entry.playerId);
  card.disabled = isSelf || votePhase !== "voting";
  card.classList.toggle("is-self", isSelf);
  card.classList.toggle("is-voted", isSelected);
  if (votePhase === "results" && entry.isWinner) {
    card.classList.add("is-winner");
  }

  const titleEl = document.createElement("p");
  titleEl.className = "party-vote-card-title";
  titleEl.textContent = entry.title;
  card.appendChild(titleEl);

  const nameEl = document.createElement("span");
  nameEl.className = "party-vote-card-name";
  nameEl.textContent = isSelf ? "내 제목" : entry.nickname;
  card.appendChild(nameEl);

  if (votePhase === "results") {
    const badge = document.createElement("span");
    badge.className = "party-vote-card-badge";
    badge.textContent = `${entry.voteCount || 0}표`;
    card.appendChild(badge);
  }

  item.appendChild(card);
  return item;
}

function renderPartyVoteGrid(room, titles, me, votePhase) {
  partyVoteGrid.innerHTML = "";

  let maxVotes = 0;
  if (votePhase === "results") {
    titles.forEach((entry) => {
      maxVotes = Math.max(maxVotes, entry.voteCount || 0);
    });
  }

  titles.forEach((entry) => {
    const isWinner = votePhase === "results" && maxVotes > 0 && (entry.voteCount || 0) === maxVotes;
    partyVoteGrid.appendChild(buildPartyVoteCard({ ...entry, isWinner }, room, me, votePhase));
  });
}

function stopPartyVoteTimer() {
  if (partyVoteTimerIntervalId) {
    window.clearInterval(partyVoteTimerIntervalId);
    partyVoteTimerIntervalId = null;
  }
}

function startPartyVoteTimer(deadlineAt) {
  stopPartyVoteTimer();

  if (!deadlineAt) {
    partyVoteTimer.textContent = "";
    return;
  }

  const tick = () => {
    const remainingMs = deadlineAt - (Date.now() + partyServerOffsetMs);
    const remainingSeconds = Math.max(0, Math.ceil(remainingMs / 1000));
    partyVoteTimer.textContent = `${remainingSeconds}초`;
  };

  tick();
  partyVoteTimerIntervalId = window.setInterval(tick, partyCountdownTickMs);
}

// 라운드/패널 이탈 시 정리(투표 타이머 + 말풍선 타이핑).
function stopPartyRevealActivity() {
  stopPartyVoteTimer();
  clearPartyStageTyping();
}

// 결과 단계의 내용은 투표가 마감된 뒤라 더 바뀌지 않는다. 폴링마다 다시 그리면
// 도장 애니메이션이 1초마다 재생되므로, 같은 라운드에 대해서는 한 번만 그린다.
function renderPartyResultWinner(titles, room) {
  const resultKey = `${room.code}:${room.roundNumber}:${room.status}`;
  if (resultKey === partyResultRenderedKey) {
    return;
  }
  partyResultRenderedKey = resultKey;

  partyResultWinner.innerHTML = "";

  const maxVotes = titles.reduce((max, entry) => Math.max(max, entry.voteCount || 0), 0);

  if (!titles.length || maxVotes <= 0) {
    const empty = document.createElement("p");
    empty.className = "party-result-empty";
    empty.textContent = "이번 라운드는 표가 없네요.";
    partyResultWinner.appendChild(empty);
    return;
  }

  // 채점 도장이 비스듬히 찍히는 연출(이모지 대신). 발표 카드 위에 겹쳐 얹는다.
  const stamp = document.createElement("span");
  stamp.className = "party-result-stamp";
  stamp.textContent = "1등";
  partyResultWinner.appendChild(stamp);

  // 동점이면 공동 1등 전원을 표시한다.
  titles
    .filter((entry) => (entry.voteCount || 0) === maxVotes)
    .forEach((winner) => {
      const row = document.createElement("div");
      row.className = "party-result-row";

      const titleEl = document.createElement("p");
      titleEl.className = "party-result-title";
      titleEl.textContent = winner.title;

      const metaEl = document.createElement("p");
      metaEl.className = "party-result-meta";
      metaEl.textContent = `${winner.nickname} · ${winner.voteCount}표`;

      row.appendChild(titleEl);
      row.appendChild(metaEl);
      partyResultWinner.appendChild(row);
    });
}

function renderPartyReveal(room, players, titles, me, isHost, finalStats) {
  stopPartyCountdown();

  const roundKey = `${room.code}:${room.roundNumber}:${room.status}`;
  const isNewRound = roundKey !== partyRevealedRoundKey;
  partyRevealedRoundKey = roundKey;

  partyRevealProgress.textContent =
    room.status === "ended" ? "게임 종료" : `라운드 ${room.roundNumber} / ${room.totalRounds} 공개`;

  if (isNewRound) {
    applyPartyPhoto(partyRevealPhoto, room);
    partySuggestPickerOpen = false;
    stopPartyRevealActivity();
    partyTypedRevealKey = "";
    partyResultRenderedKey = "";
  }

  partyLastIsHost = isHost;

  renderPartyStage(room, titles);
  renderPartyHostControl(room, isHost);

  const votePhase = room.votePhase;
  const showVoteSection = votePhase === "voting" || votePhase === "results";
  partyVoteSection.hidden = !showVoteSection;

  if (showVoteSection) {
    partyVoteHeading.textContent = votePhase === "results" ? "투표 결과" : "가장 웃긴 제목은?";
    renderPartyVoteGrid(room, titles, me, votePhase);
  }

  if (votePhase === "voting") {
    startPartyVoteTimer(room.voteDeadlineAt);
  } else {
    stopPartyVoteTimer();
    partyVoteTimer.textContent = "";
  }

  const showResultSection = votePhase === "results";
  partyResultSection.hidden = !showResultSection;
  if (showResultSection) {
    renderPartyResultWinner(titles, room);
  }

  if (showResultSection) {
    // 갤러리 제안은 스포일러 걱정이 없는 결과 단계에서만 노출한다.
    renderPartySuggestBlock(room, titles);
  } else {
    partySuggestBlock.hidden = true;
    partySuggestPicker.hidden = true;
  }

  renderPartyFinal(room, finalStats);

  const isLastRound = room.roundNumber >= room.totalRounds;

  if (room.status === "ended") {
    partyAdvanceButton.hidden = true;
    partyRevealWaitMessage.hidden = true;
    partyNewGameButton.hidden = false;
  } else if (showResultSection) {
    partyNewGameButton.hidden = true;
    partyAdvanceButton.hidden = !isHost;
    partyAdvanceButton.textContent = isLastRound ? "게임 종료" : "다음 라운드";
    partyRevealWaitMessage.hidden = isHost;
  } else {
    // 공개 중·투표 중에는 다음 라운드로 넘어갈 수 없다(서버도 409로 막는다).
    partyNewGameButton.hidden = true;
    partyAdvanceButton.hidden = true;
    partyRevealWaitMessage.hidden = true;
  }
}

function renderPartyState(state) {
  if (!state?.room) {
    return;
  }

  const { room, players = [], titles = [], photos = [], finalStats = null } = state;
  partyServerOffsetMs = room.serverNow - Date.now();
  partyLastRoom = room;

  const me = players.find((player) => player.isMe);
  const isHost = Boolean(me?.isHost);

  // 방장이 다음 제목을 넘기면 다른 참가자가 최대 2초 뒤에야 보는 건 굼뜨다 —
  // status='reveal'인 동안에는 폴링 간격을 좁힌다. 상태 변화 시에만 재설정한다.
  ensurePartyPollInterval(room.status === "reveal" ? partyRevealPollMs : partyPollMs);

  partyPhotoUploadSection.hidden = room.isPublic || (room.status !== "lobby" && room.status !== "reveal");
  partyPhotoCount.textContent = room.isPublic
    ? ""
    : `우리 사진 ${room.photoCountTotal || 0}장이 모였어요. 누가 올렸는지는 라운드에서도 공개되지 않아요.`;
  renderPartyPhotoThumbs(photos);

  if (room.status === "lobby") {
    renderPartyLobby(room, players, isHost);
    showPartyPanel("lobby");
  } else if (room.status === "round") {
    renderPartyRound(room, players, me);
    showPartyPanel("round");
  } else {
    renderPartyReveal(room, players, titles, me, isHost, finalStats);
    showPartyPanel("reveal");
  }
}

async function refreshPartyState({ silent = false } = {}) {
  if (!partyState.code || !partyState.playerToken) {
    return false;
  }

  try {
    const state = await fetchPartyState();
    partyConnectionBadge.hidden = true;
    renderPartyState(state);
    return true;
  } catch {
    if (!silent) {
      partyConnectionBadge.hidden = false;
    }
    return false;
  }
}

function stopPartyPolling() {
  if (partyPollIntervalId) {
    window.clearInterval(partyPollIntervalId);
    partyPollIntervalId = null;
  }
  partyPollCurrentMs = null;
}

function startPartyPolling(intervalMs = partyPollMs) {
  stopPartyPolling();
  partyPollCurrentMs = intervalMs;
  partyPollIntervalId = window.setInterval(() => {
    refreshPartyState();
  }, intervalMs);
}

// 이미 같은 간격으로 폴링 중이면 그대로 두고, 다르면(또는 아직 시작 전이면) 다시 시작한다.
// 매 렌더마다 clear/set을 반복하지 않기 위한 헬퍼.
function ensurePartyPollInterval(intervalMs) {
  if (!partyPollIntervalId || partyPollCurrentMs !== intervalMs) {
    startPartyPolling(intervalMs);
  }
}

function stopPublicRoomsPolling() {
  if (partyPublicRoomsIntervalId) {
    window.clearInterval(partyPublicRoomsIntervalId);
    partyPublicRoomsIntervalId = null;
  }
}

function startPublicRoomsPolling() {
  stopPublicRoomsPolling();
  partyPublicRoomsIntervalId = window.setInterval(refreshPublicRooms, partyPublicRoomsPollMs);
}

function renderPublicRooms(rooms) {
  partyPublicRoomList.innerHTML = "";
  partyPublicRoomsEmpty.hidden = rooms.length > 0;

  rooms.forEach((room) => {
    const item = document.createElement("li");
    item.className = "party-public-room-item";

    const info = document.createElement("div");
    info.className = "party-public-room-info";

    const title = document.createElement("strong");
    title.textContent = `${room.hostNickname}님의 방`;

    const meta = document.createElement("span");
    meta.textContent = `${room.playerCount}/${room.maxPlayers}명 · ${room.status === "lobby" ? "대기 중" : "진행 중"}`;

    info.appendChild(title);
    info.appendChild(meta);

    const joinButton = document.createElement("button");
    joinButton.type = "button";
    joinButton.className = "auth-button solid small";
    joinButton.textContent = "참가";
    joinButton.addEventListener("click", () => joinPublicRoom(room.code));

    item.appendChild(info);
    item.appendChild(joinButton);
    partyPublicRoomList.appendChild(item);
  });
}

async function refreshPublicRooms() {
  try {
    const data = await requestAuth("/api/party/rooms");
    renderPublicRooms(data.rooms || []);
  } catch {
    // 공개 방 목록은 부가 기능이라 실패해도 토스트로 방해하지 않는다.
  }
}

async function joinPublicRoom(code) {
  const nickname = currentUser ? "" : partyJoinNicknameInput.value.trim();

  if (!currentUser && !nickname) {
    partyJoinMessage.textContent = "참가할 닉네임을 먼저 입력해주세요.";
    partyJoinNicknameInput.focus();
    return;
  }

  partyJoinMessage.textContent = "";

  try {
    const data = await partyApi("/api/party/join", currentUser ? { code } : { code, nickname });
    partyState.code = data.code;
    partyState.playerToken = data.playerToken;
    partyState.nickname = nickname;
    savePartyStorage();
    setPartyUrl(data.code);
    renderPartyState(data.state);
  } catch (error) {
    partyJoinMessage.textContent = error?.message || "참가에 실패했습니다.";
  }
}

// 방 안 사진 업로드 전, 최대 1280px로 리사이즈하고 JPEG 0.8로 인코딩해 용량을 줄인다.
async function resizePartyPhoto(file) {
  const bitmap = await createImageBitmap(file);
  const maxEdge = 1280;
  const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));

  const context = canvas.getContext("2d");
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close?.();

  const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
  const base64 = dataUrl.split(",")[1] || "";
  return { dataBase64: base64, mimeType: "image/jpeg" };
}

async function enterPartyView(routeCode) {
  syncPartyIdentityFields();
  const saved = loadPartyStorage();

  if (saved && (!routeCode || routeCode === saved.code)) {
    partyState.code = saved.code;
    partyState.playerToken = saved.playerToken;
    partyState.nickname = saved.nickname || "";

    const resumed = await refreshPartyState({ silent: true });
    if (resumed) {
      return;
    }

    clearPartyStorage();
  }

  stopPartyPolling();
  stopPartyCountdown();
  stopPartyRevealActivity();
  partyState.code = "";
  partyState.playerToken = "";
  partyState.nickname = "";
  partyCreateMessage.textContent = "";
  partyJoinMessage.textContent = "";
  partyJoinCodeInput.value = routeCode || "";
  // 해시 이동은 페이지 리로드가 없으므로, 이전 방 화면에서 켜진 요소들을 여기서 직접 리셋한다.
  partyPhotoUploadSection.hidden = true;
  partyPhotoThumbList.innerHTML = "";
  partyPhotoThumbHeading.hidden = true;
  partyPhotoCount.textContent = "";
  partyConnectionBadge.hidden = true;
  showPartyPanel("entry");
}

async function runPartyAdvance(button) {
  if (!partyState.code || !partyState.playerToken) {
    return;
  }

  button.disabled = true;
  try {
    const data = await partyApi("/api/party/advance", { code: partyState.code, token: partyState.playerToken });
    renderPartyState(data.state);
  } catch (error) {
    showToast(error?.message || "라운드를 진행하지 못했습니다.");
  } finally {
    button.disabled = false;
  }
}

partyPromoCard?.addEventListener("click", (event) => {
  event.preventDefault();
  goParty();
});

galleryPartyPromoCard?.addEventListener("click", (event) => {
  event.preventDefault();
  goParty();
});

partyPublicInput?.addEventListener("change", () => {
  partyPublicHint.hidden = !partyPublicInput.checked;
});

partyPublicRoomsRefreshButton?.addEventListener("click", () => refreshPublicRooms());

partyCreateForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const nickname = currentUser ? "" : partyCreateNicknameInput.value.trim();

  if (!currentUser && !nickname) {
    partyCreateMessage.textContent = "닉네임을 입력해주세요.";
    return;
  }

  partyCreateMessage.textContent = "";
  const submitButton = partyCreateForm.querySelector('button[type="submit"]');
  submitButton.disabled = true;

  try {
    const data = await partyApi("/api/party/create", {
      ...(currentUser ? {} : { nickname }),
      totalRounds: Number(partyTotalRoundsSelect.value),
      roundSeconds: Number(partyRoundSecondsSelect.value),
      voteSeconds: Number(partyCreateVoteSecondsSelect.value),
      isPublic: Boolean(partyPublicInput?.checked),
    });
    partyState.code = data.code;
    partyState.playerToken = data.playerToken;
    partyState.nickname = nickname;
    savePartyStorage();
    setPartyUrl(data.code);
    renderPartyState(data.state);
  } catch (error) {
    partyCreateMessage.textContent = error?.message || "방을 만들지 못했습니다.";
  } finally {
    submitButton.disabled = false;
  }
});

partyJoinForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const nickname = currentUser ? "" : partyJoinNicknameInput.value.trim();
  const code = partyJoinCodeInput.value.trim().toUpperCase();

  if (!currentUser && !nickname) {
    partyJoinMessage.textContent = "닉네임을 입력해주세요.";
    return;
  }
  if (!code) {
    partyJoinMessage.textContent = "초대 코드를 입력해주세요.";
    return;
  }

  partyJoinMessage.textContent = "";
  const submitButton = partyJoinForm.querySelector('button[type="submit"]');
  submitButton.disabled = true;

  try {
    const data = await partyApi("/api/party/join", currentUser ? { code } : { code, nickname });
    partyState.code = data.code;
    partyState.playerToken = data.playerToken;
    partyState.nickname = nickname;
    savePartyStorage();
    setPartyUrl(data.code);
    renderPartyState(data.state);
  } catch (error) {
    partyJoinMessage.textContent = error?.message || "참가에 실패했습니다.";
  } finally {
    submitButton.disabled = false;
  }
});

partyStartButton.addEventListener("click", () => runPartyAdvance(partyStartButton));
partyAdvanceButton.addEventListener("click", () => runPartyAdvance(partyAdvanceButton));

partyTitleForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const title = partyTitleInput.value.trim();

  if (!title || !partyState.code || !partyState.playerToken) {
    return;
  }

  partyTitleSubmitButton.disabled = true;
  try {
    const data = await partyApi("/api/party/submit", {
      code: partyState.code,
      token: partyState.playerToken,
      title,
    });
    renderPartyState(data.state);
    showToast("제목을 제출했어요!");
  } catch (error) {
    showToast(error?.message || "제출에 실패했습니다.");
  } finally {
    partyTitleSubmitButton.disabled = false;
  }
});

partyPhotoInput?.addEventListener("change", async () => {
  const file = partyPhotoInput.files?.[0];
  partyPhotoInput.value = "";

  if (!file || !partyState.code || !partyState.playerToken) {
    return;
  }

  partyPhotoUploadMessage.textContent = "";

  let payload;
  try {
    payload = await resizePartyPhoto(file);
  } catch {
    partyPhotoUploadMessage.textContent = "이미지를 불러오지 못했습니다. 다른 사진으로 시도해주세요.";
    return;
  }

  try {
    const data = await partyApi("/api/party/upload", {
      code: partyState.code,
      token: partyState.playerToken,
      dataBase64: payload.dataBase64,
      mimeType: payload.mimeType,
    });
    renderPartyState(data.state);
    showToast("사진을 올렸어요!");
  } catch (error) {
    partyPhotoUploadMessage.textContent = error?.message || "사진 업로드에 실패했습니다.";
  }
});

partyVoteGrid?.addEventListener("click", async (event) => {
  const button = event.target.closest(".party-vote-card");
  if (!button || button.disabled || !partyState.code || !partyState.playerToken) {
    return;
  }

  const targetPlayerId = Number(button.dataset.targetPlayerId);
  button.disabled = true;

  try {
    const data = await partyApi("/api/party/vote", {
      code: partyState.code,
      token: partyState.playerToken,
      targetPlayerId,
    });
    renderPartyState(data.state);
  } catch (error) {
    showToast(error?.message || "투표에 실패했습니다.");
    button.disabled = false;
  }
});

partyRevealNextButton?.addEventListener("click", async () => {
  if (!partyState.code || !partyState.playerToken) {
    return;
  }

  partyRevealNextButton.disabled = true;
  try {
    const data = await partyApi("/api/party/reveal-next", {
      code: partyState.code,
      token: partyState.playerToken,
    });
    renderPartyState(data.state);
  } catch (error) {
    showToast(error?.message || "제목 공개에 실패했습니다.");
    if (!partyStageTypingActive) {
      partyRevealNextButton.disabled = false;
    }
  }
});

partySuggestButton?.addEventListener("click", () => {
  partySuggestPickerOpen = !partySuggestPickerOpen;
  partySuggestPicker.hidden = !partySuggestPickerOpen;
});

partySuggestCancelButton?.addEventListener("click", () => {
  partySuggestPickerOpen = false;
  partySuggestPicker.hidden = true;
});

partySuggestSendButton?.addEventListener("click", async () => {
  const selected = partySuggestOptions.querySelector('input[name="partySuggestTitle"]:checked');

  if (!selected) {
    showToast("제안할 제목을 선택해주세요.");
    return;
  }
  if (!partyState.code || !partyState.playerToken || !partyLastRoom) {
    return;
  }

  partySuggestSendButton.disabled = true;
  try {
    const data = await partyApi("/api/party/suggest", {
      code: partyState.code,
      token: partyState.playerToken,
      roundNumber: partyLastRoom.roundNumber,
      titleText: selected.value,
    });
    partySuggestPickerOpen = false;
    renderPartyState(data.state);
    showToast(data.alreadySuggested ? "이미 제안된 사진이에요." : "갤러리 제안을 보냈어요! 관리자 확인 후 실릴 수 있어요.");
  } catch (error) {
    showToast(error?.message || "갤러리 제안에 실패했습니다.");
  } finally {
    partySuggestSendButton.disabled = false;
  }
});

partyNewGameButton.addEventListener("click", () => {
  stopPartyPolling();
  stopPartyCountdown();
  stopPartyRevealActivity();
  clearPartyStorage();
  partyState.code = "";
  partyState.playerToken = "";
  partyState.nickname = "";
  partyCurrentRoundKey = "";
  partyRevealedRoundKey = "";
  partyTypedRevealKey = "";
  partyFinalStampedKey = "";
  partyResultRenderedKey = "";
  partySuggestPickerOpen = false;
  partyLastRoom = null;
  partyCreateNicknameInput.value = "";
  partyJoinNicknameInput.value = "";
  partyJoinCodeInput.value = "";
  navigateTo({ view: "party" });
});

partyCopyCodeButton.addEventListener("click", async () => {
  if (!partyState.code) {
    return;
  }
  try {
    await navigator.clipboard.writeText(partyState.code);
    showToast("초대 코드를 복사했어요.");
  } catch {
    showToast(partyState.code);
  }
});

partyCopyLinkButton.addEventListener("click", async () => {
  if (!partyState.code) {
    return;
  }
  const url = `${location.origin}${routeToUrl({ view: "party", partyCode: partyState.code })}`;
  try {
    await navigator.clipboard.writeText(url);
    showToast("초대 링크를 복사했어요.");
  } catch {
    showToast(url);
  }
});

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    stopPartyPolling();
    stopPublicRoomsPolling();
    return;
  }

  if (partyView && !partyView.hidden && partyState.code && partyState.playerToken) {
    refreshPartyState();
  } else if (partyView && !partyView.hidden && partyEntryPanel && !partyEntryPanel.hidden) {
    refreshPublicRooms();
    startPublicRoomsPolling();
  }
});

window.addEventListener("popstate", (event) => {
  applyRoute(getValidRoute(event.state) || parseRouteFromLocation() || { view: "home" });
});

window.addEventListener("keydown", (event) => {
  if (
    trapFocus(event, authModal) ||
    trapFocus(event, deleteAccountModal) ||
    trapFocus(event, passwordChangeModal) ||
    trapFocus(event, messageComposeModal) ||
    trapFocus(event, authorProfileModal) ||
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

  if (!authorProfileModal.hidden) {
    closeAuthorProfile();
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
  recordDailyVisit();
  renderGallery();
  renderUser();
  handleAuthErrorFromUrl();
  await verifyEmailFromUrl();
  await restoreSession();
  await loadGalleryImages();
  await loadDaily();
  await loadFeed(activeFeedWindow);
  await initializeAuthProviders();
  initializeRoute();
}

initializeApp();
