const totalQuestions = 12;
const intro = document.getElementById("intro");
const homeContent = document.getElementById("homeContent");
const quiz = document.getElementById("quiz");
const resultPage = document.getElementById("resultPage");
const startButton = document.getElementById("start-button");
const retryButton = document.getElementById("retryButton");
const form = document.getElementById("quizForm");
const questions = Array.from(form.querySelectorAll(".question"));
const answeredCount = document.getElementById("answeredCount");
const message = document.getElementById("message");
const prevButton = document.getElementById("prevButton");
const nextButton = document.getElementById("nextButton");
const submitButton = document.getElementById("submitButton");
const result = document.getElementById("result");
const resultType = document.getElementById("resultType");
const resultTitle = document.getElementById("resultTitle");
const resultText = document.getElementById("resultText");
const scores = document.getElementById("scores");
const themeToggle = document.getElementById("themeToggle");
const feedbackToggle = document.getElementById("feedbackToggle");
const feedbackPanel = document.getElementById("feedbackPanel");
const feedbackStatus = document.getElementById("feedbackStatus");
const headerLinks = document.querySelectorAll(".site-header a[href^='#']");
const savedTheme = localStorage.getItem("theme");
const initialTheme = savedTheme || "light";
let currentQuestionIndex = 0;

const typeDescriptions = {
  ISTJ: ["책임감 있는 현실주의자", "차분하게 기준을 세우고 맡은 일을 안정적으로 끝내는 성향입니다. 구체적인 정보와 약속을 중요하게 여기며, 신뢰를 쌓는 방식이 꾸준합니다."],
  ISFJ: ["따뜻한 수호자", "세심하게 주변을 살피고 필요한 일을 묵묵히 챙기는 성향입니다. 안정적인 관계와 배려를 중요하게 생각합니다."],
  INFJ: ["통찰력 있는 조언자", "사람과 상황의 의미를 깊게 읽고 장기적인 방향을 고민하는 성향입니다. 조용하지만 분명한 가치관을 가지고 있습니다."],
  INTJ: ["전략적인 설계자", "큰 그림을 보고 효율적인 구조를 만드는 데 강한 성향입니다. 독립적으로 사고하며 목표를 향해 체계적으로 움직입니다."],
  ISTP: ["침착한 문제 해결가", "상황을 빠르게 파악하고 실용적인 해결책을 찾는 성향입니다. 필요할 때 집중해서 움직이고 자유로운 방식을 선호합니다."],
  ISFP: ["섬세한 감각형", "현재의 감정과 분위기를 잘 느끼며 자기만의 취향을 중요하게 여기는 성향입니다. 부드럽지만 내면의 기준이 뚜렷합니다."],
  INFP: ["가치 중심의 이상가", "자신이 믿는 가치와 진정성을 중요하게 여기는 성향입니다. 상상력과 공감 능력이 풍부하고 깊은 관계를 선호합니다."],
  INTP: ["논리적인 탐구자", "궁금한 것을 끝까지 파고들며 원리와 구조를 이해하려는 성향입니다. 독창적인 생각과 분석에 강합니다."],
  ESTP: ["활동적인 실행가", "현장에서 빠르게 판단하고 행동하는 성향입니다. 변화를 즐기며 사람들과 어울리는 순간에 에너지를 얻습니다."],
  ESFP: ["밝은 분위기 메이커", "현재의 즐거움과 사람들과의 생생한 교류를 중요하게 여기는 성향입니다. 표현이 자연스럽고 적응력이 좋습니다."],
  ENFP: ["상상력 풍부한 촉진자", "새로운 가능성과 사람 사이의 연결을 잘 발견하는 성향입니다. 호기심이 많고 분위기에 활력을 불어넣습니다."],
  ENTP: ["아이디어형 토론가", "새로운 관점과 도전을 즐기는 성향입니다. 고정된 방식보다 가능성을 실험하며 생각을 확장합니다."],
  ESTJ: ["체계적인 관리자", "목표와 기준을 분명히 세우고 일을 추진하는 성향입니다. 현실적인 판단과 실행력이 강합니다."],
  ESFJ: ["사교적인 조율자", "사람들의 필요와 분위기를 살피며 함께 움직이는 데 능한 성향입니다. 책임감 있고 관계를 소중히 여깁니다."],
  ENFJ: ["공감하는 리더", "사람의 가능성을 보고 함께 성장하는 방향을 만드는 성향입니다. 표현력이 좋고 공동체의 흐름을 잘 읽습니다."],
  ENTJ: ["목표 지향적 지휘관", "비전을 세우고 빠르게 실행으로 옮기는 성향입니다. 구조화, 결정, 추진에 강하며 성과를 중시합니다."]
};

function setTheme(theme) {
  const isDark = theme === "dark";

  document.body.dataset.theme = theme;
  themeToggle.textContent = isDark ? "화이트 모드" : "다크 모드";
  themeToggle.setAttribute("aria-label", isDark ? "화이트 모드로 변경" : "다크 모드로 변경");
  themeToggle.setAttribute("aria-pressed", String(isDark));
  localStorage.setItem("theme", theme);
}

function updateAnsweredCount() {
  const formData = new FormData(form);
  let count = 0;

  for (let i = 1; i <= totalQuestions; i += 1) {
    if (formData.has(`q${i}`)) {
      count += 1;
    }
  }

  answeredCount.textContent = `${count}/${totalQuestions}`;
  return count;
}

function hasAnswer(index) {
  return new FormData(form).has(`q${index + 1}`);
}

function updateNavigation() {
  prevButton.disabled = currentQuestionIndex === 0;
  nextButton.classList.toggle("hidden", currentQuestionIndex === totalQuestions - 1);
  submitButton.classList.toggle("hidden", currentQuestionIndex !== totalQuestions - 1);
}

function showQuestion(index) {
  currentQuestionIndex = Math.min(Math.max(index, 0), totalQuestions - 1);

  questions.forEach((question, questionIndex) => {
    const isCurrent = questionIndex === currentQuestionIndex;

    question.hidden = !isCurrent;
    question.classList.toggle("active", isCurrent);
  });

  answeredCount.textContent = `${currentQuestionIndex + 1}/${totalQuestions}`;
  updateNavigation();
}

function getScores(formData) {
  const score = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };

  for (let i = 1; i <= totalQuestions; i += 1) {
    const value = formData.get(`q${i}`);
    if (value) {
      score[value] += 1;
    }
  }

  return score;
}

function pickType(score) {
  return [
    score.E >= score.I ? "E" : "I",
    score.S >= score.N ? "S" : "N",
    score.T >= score.F ? "T" : "F",
    score.J >= score.P ? "J" : "P"
  ].join("");
}

function renderScores(score) {
  const pairs = [
    ["E", "I"],
    ["S", "N"],
    ["T", "F"],
    ["J", "P"]
  ];

  scores.innerHTML = pairs.map(([left, right]) => `
    <div class="score">
      <strong>${left} ${score[left]} : ${score[right]} ${right}</strong>
      <span>${score[left] >= score[right] ? left : right} 성향 우세</span>
    </div>
  `).join("");
}

function showHome() {
  intro.classList.remove("hidden");
  homeContent.classList.remove("hidden");
  quiz.classList.add("hidden");
  resultPage.classList.add("hidden");
  result.classList.remove("show");
}

function setFeedbackOpen(isOpen) {
  feedbackPanel.classList.toggle("hidden", !isOpen);
  feedbackToggle.setAttribute("aria-expanded", String(isOpen));
  feedbackToggle.textContent = isOpen ? "Feedback 접기" : "Feedback";

  if (!isOpen) {
    feedbackStatus.textContent = "";
  }
}

setTheme(initialTheme);

themeToggle.addEventListener("click", () => {
  setTheme(document.body.dataset.theme === "dark" ? "light" : "dark");
});

headerLinks.forEach((link) => {
  link.addEventListener("click", () => {
    showHome();
  });
});

startButton.addEventListener("click", () => {
  intro.classList.add("hidden");
  homeContent.classList.add("hidden");
  quiz.classList.remove("hidden");
  resultPage.classList.add("hidden");
  showQuestion(0);
  quiz.scrollIntoView({ behavior: "smooth", block: "start" });
});

retryButton.addEventListener("click", () => {
  resultPage.classList.add("hidden");
  quiz.classList.remove("hidden");
  form.reset();
  setFeedbackOpen(false);
  showQuestion(0);
  message.textContent = "";
  result.classList.remove("show");
  quiz.scrollIntoView({ behavior: "smooth", block: "start" });
});

prevButton.addEventListener("click", () => {
  message.textContent = "";
  showQuestion(currentQuestionIndex - 1);
  quiz.scrollIntoView({ behavior: "smooth", block: "start" });
});

nextButton.addEventListener("click", () => {
  if (!hasAnswer(currentQuestionIndex)) {
    message.textContent = "답을 선택한 뒤 다음으로 이동해주세요.";
    return;
  }

  message.textContent = "";
  showQuestion(currentQuestionIndex + 1);
  quiz.scrollIntoView({ behavior: "smooth", block: "start" });
});

form.addEventListener("change", () => {
  message.textContent = "";
  updateNavigation();
});

form.addEventListener("reset", () => {
  setTimeout(() => {
    showQuestion(0);
    message.textContent = "";
    result.classList.remove("show");
  }, 0);
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const answered = updateAnsweredCount();

  if (answered < totalQuestions) {
    const firstUnansweredIndex = questions.findIndex((question, index) => !formData.has(`q${index + 1}`));

    message.textContent = `아직 ${totalQuestions - answered}개 문항이 남았습니다.`;
    result.classList.remove("show");
    showQuestion(firstUnansweredIndex);
    return;
  }

  const score = getScores(formData);
  const type = pickType(score);
  const description = typeDescriptions[type];

  resultType.textContent = type;
  resultTitle.textContent = description[0];
  resultText.textContent = description[1];
  renderScores(score);
  quiz.classList.add("hidden");
  resultPage.classList.remove("hidden");
  result.classList.add("show");
  setFeedbackOpen(false);
  resultPage.scrollIntoView({ behavior: "smooth", block: "start" });
});

showQuestion(0);

feedbackToggle.addEventListener("click", () => {
  setFeedbackOpen(feedbackPanel.classList.contains("hidden"));
});

feedbackPanel.addEventListener("submit", async (event) => {
  event.preventDefault();

  const submitButton = feedbackPanel.querySelector("button[type='submit']");
  const formData = new FormData(feedbackPanel);

  feedbackStatus.textContent = "전송 중입니다.";
  submitButton.disabled = true;

  try {
    const response = await fetch(feedbackPanel.action, {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json"
      }
    });

    if (!response.ok) {
      throw new Error("Formspree submission failed");
    }

    feedbackPanel.reset();
    feedbackStatus.textContent = "Feedback이 접수되었습니다.";
  } catch (error) {
    feedbackStatus.textContent = "전송에 실패했습니다. 잠시 후 다시 시도해주세요.";
  } finally {
    submitButton.disabled = false;
  }
});
