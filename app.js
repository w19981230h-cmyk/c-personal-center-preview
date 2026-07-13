const shell = document.querySelector(".preview-shell");
const healthScreen = document.querySelector("[data-screen='health']");
const navButtons = document.querySelectorAll("[data-target]");
const patientButtons = document.querySelectorAll("[data-patient-gender]");
const patientPortrait = document.querySelector("[data-patient-portrait]");
const healthProfileButton = document.querySelector("[data-open-health-profile]");
const backProfileButton = document.querySelector("[data-back-profile]");
const summaryAvatar = document.querySelector("[data-summary-avatar]");
const summaryName = document.querySelector("[data-summary-name]");
const summaryGender = document.querySelector("[data-summary-gender]");
const summaryAge = document.querySelector("[data-summary-age]");
const bodyFigure = document.querySelector("[data-body-figure]");
const analysisCard = document.querySelector(".analysis-card");
const metricGrid = document.querySelector(".analysis-card .metric-grid");
const metricValues = document.querySelectorAll(".metric-grid strong");
const detailButtons = document.querySelectorAll("[data-detail-toggle]");

const patients = {
  female: {
    name: "张女士",
    genderLabel: "女",
    age: "35岁",
    avatar: "./assets/avatar-female.png",
    body: "./assets/body-female.png?v=body-visible-1",
    analysis: { watch: 0, abnormal: 0 },
    bodyAlt: "女性人体健康画像",
  },
  male: {
    name: "李先生",
    genderLabel: "男",
    age: "42岁",
    avatar: "./assets/avatar-male.png",
    body: "./assets/body-male.png?v=male-body-photo-1",
    analysis: { watch: 7, abnormal: 3 },
    bodyAlt: "男性人体健康画像",
  },
};

const getInitialGender = () => {
  const gender = new URLSearchParams(window.location.search).get("gender");
  return patients[gender] ? gender : "female";
};

const getInitialScreen = () => {
  const screen = new URLSearchParams(window.location.search).get("screen");
  return screen === "health" || screen === "home" ? screen : "profile";
};

let currentGender = getInitialGender();
let analysisEmptyState = null;

const setScreen = (screen) => {
  shell.classList.toggle("show-profile", screen === "profile");
  shell.classList.toggle("show-health", screen === "health");
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
};

const getAnalysisEmptyState = () => {
  if (analysisEmptyState || !analysisCard) return analysisEmptyState;

  analysisEmptyState = document.createElement("div");
  analysisEmptyState.className = "analysis-empty";
  analysisEmptyState.dataset.analysisEmpty = "";
  analysisEmptyState.textContent = "\u6682\u65e0\u6570\u636e";
  analysisEmptyState.hidden = true;
  analysisCard.appendChild(analysisEmptyState);

  return analysisEmptyState;
};

const updateAnalysisView = (analysis) => {
  if (!metricGrid) return;

  const values = [analysis?.watch || 0, analysis?.abnormal || 0];
  const isEmpty = values.every((value) => value === 0);
  const emptyState = getAnalysisEmptyState();

  metricGrid.hidden = isEmpty;
  if (emptyState) emptyState.hidden = !isEmpty;
  if (analysisCard) analysisCard.classList.toggle("is-empty", isEmpty);

  if (!isEmpty) {
    metricValues.forEach((item, index) => {
      item.textContent = `${values[index]}\u9879`;
    });
  }
};

const updatePatientView = (gender) => {
  const patient = patients[gender];

  if (!patient) return;

  currentGender = gender;
  patientButtons.forEach((item) => item.classList.toggle("active", item.dataset.patientGender === gender));

  if (patientPortrait) {
    patientPortrait.style.opacity = "0";
    patientPortrait.style.transform = "translateY(4px)";
    patientPortrait.src = patient.avatar;
    patientPortrait.alt = `${patient.name}头像`;

    window.setTimeout(() => {
      patientPortrait.src = patient.avatar;
      patientPortrait.alt = `${patient.name}头像`;
      patientPortrait.style.opacity = "1";
      patientPortrait.style.transform = "translateY(0)";
    }, 120);
  }

  if (summaryAvatar) {
    summaryAvatar.src = patient.avatar;
    summaryAvatar.alt = `${patient.name}头像`;
  }

  if (summaryName) summaryName.textContent = patient.name;
  if (summaryGender) summaryGender.textContent = patient.genderLabel;
  if (summaryAge) summaryAge.textContent = patient.age;
  updateAnalysisView(patient.analysis);

  if (bodyFigure) {
    bodyFigure.src = patient.body;
    bodyFigure.alt = patient.bodyAlt;
  }

  if (healthScreen) healthScreen.dataset.gender = gender;
};

navButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const target = button.dataset.target;
    setScreen(target === "profile" ? "profile" : "home");
  });
});

patientButtons.forEach((button) => {
  button.addEventListener("click", () => {
    updatePatientView(button.dataset.patientGender);
  });
});

if (healthProfileButton) {
  healthProfileButton.addEventListener("click", () => {
    updatePatientView(currentGender);
    setScreen("health");
  });
}

if (backProfileButton) {
  backProfileButton.addEventListener("click", () => setScreen("profile"));
}

detailButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const card = button.closest(".organ-card");

    if (card) {
      card.classList.toggle("is-open");
    }
  });
});

updatePatientView(currentGender);
setScreen(getInitialScreen());
