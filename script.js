const tabs = document.querySelectorAll(".speedrun-tab");
const panels = document.querySelectorAll(".tab-panel");

const speedrunType = document.querySelector("#speedrun-type");
const speedrunDescription = document.querySelector("#speedrun-description");
const minecraftVersion = document.querySelector("#minecraft-version");
const experienceInput = document.querySelector("#experience");

const feedbackForm = document.querySelector("#feedback-form");
const emailInput = document.querySelector("#email");
const opinionInput = document.querySelector("#opinion");
const opinionCount = document.querySelector("#opinion-count");
const feedbackMessage = document.querySelector("#feedback-message");
const submitButton = document.querySelector("#submit-button");

const flowStart = document.querySelector("#flow-start");
const flowSelect = document.querySelector("#flow-select");
const flowConfirm = document.querySelector("#flow-confirm");
const flowComplete = document.querySelector("#flow-complete");
const flowError = document.querySelector("#flow-error");

const typeNames = {
    "rsg-any": "RSG Any%",
    "ssg-any": "SSG Any%",
    "ssg-inventory": "SSG Full Inventory",
    "ssg-wool": "SSG All Wool",
    "rsg-advancements": "RSG All Advancements"
};

const versionOptions = {
    "rsg-any": ["1.16.1"],
    "ssg-any": ["1.16.1", "1.16.4", "1.21.1"],
    "ssg-inventory": ["1.16.1", "1.21.10", "26.1"],
    "ssg-wool": ["1.16.1"],
    "rsg-advancements": ["1.16.1", "1.21.1"]
};

const descriptions = {
    "rsg-any": "무작위 시드에서 엔더 드래곤을 처치하고 엔딩 크레딧을 띄우는 종목입니다.",
    "ssg-any": "정해진 시드에서 엔더 드래곤을 처치하고 엔딩 크레딧을 띄우는 종목입니다.",
    "ssg-inventory": "정해진 시드에서 인벤토리를 빠르게 채우는 종목입니다.",
    "ssg-wool": "정해진 시드에서 모든 색상의 양털을 모으는 종목입니다.",
    "rsg-advancements": "무작위 시드에서 모든 발전 과제를 달성하는 종목입니다."
};

// 탭 전환
tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
        const selectedTab = tab.dataset.tab;

        tabs.forEach(function (item) {
            const isSelected = item === tab;

            item.classList.toggle("active", isSelected);
            item.setAttribute("aria-selected", String(isSelected));
            item.tabIndex = isSelected ? 0 : -1;
        });

        panels.forEach(function (panel) {
            panel.hidden = panel.id !== "panel-" + selectedTab;
        });
    });
});

// 버전 선택 목록 변경
function updateVersions() {
    const versions = versionOptions[speedrunType.value] || [];

    minecraftVersion.innerHTML = "";

    const firstOption = document.createElement("option");
    firstOption.value = "";
    firstOption.textContent = versions.length
        ? "버전을 선택하세요"
        : "먼저 종목을 선택하세요";
    firstOption.disabled = true;
    firstOption.selected = true;

    minecraftVersion.appendChild(firstOption);

    versions.forEach(function (version) {
        const option = document.createElement("option");
        option.value = version;
        option.textContent = version;
        minecraftVersion.appendChild(option);
    });

    minecraftVersion.disabled = versions.length === 0;
}

// 종목 선택 변경
speedrunType.addEventListener("change", function () {
    updateVersions();

    speedrunDescription.textContent =
        descriptions[speedrunType.value] || "스피드런 종목을 선택해 주세요.";

    flowError.textContent = "";
});

// 이용 흐름 화면 전환
function showFlowStep(step) {
    flowStart.hidden = step !== "start";
    flowSelect.hidden = step !== "select";
    flowConfirm.hidden = step !== "confirm";
    flowComplete.hidden = step !== "complete";
}

// 연습 시작
document.querySelector("#flow-start-button").addEventListener("click", function () {
    showFlowStep("select");
});

// 처음으로
document.querySelector("#flow-cancel-button").addEventListener("click", function () {
    speedrunType.value = "";
    updateVersions();

    experienceInput.value = "";
    speedrunDescription.textContent = "스피드런 종목을 선택해 주세요.";
    flowError.textContent = "";

    showFlowStep("start");
});

// 선택 확인
document.querySelector("#flow-next-button").addEventListener("click", function () {
    const type = speedrunType.value;
    const version = minecraftVersion.value;
    const experience = experienceInput.value;

    if (type === "" || version === "" || experience === "") {
        flowError.textContent = "종목, 버전, 숙련도를 모두 선택해 주세요.";
        return;
    }

    const experienceName = experience === "beginner"
        ? "처음 시작함"
        : "기본적인 플레이 경험이 있음";

    document.querySelector("#confirm-type").textContent =
        "선택한 종목: " + typeNames[type];

    document.querySelector("#confirm-experience").textContent =
        "현재 숙련도: " + experienceName;

    document.querySelector("#confirm-version").textContent =
        "마인크래프트 버전: " + version;

    flowError.textContent = "";
    showFlowStep("confirm");
});

// 이전 단계
document.querySelector("#flow-back-button").addEventListener("click", function () {
    showFlowStep("select");
});

// 선택 완료
document.querySelector("#flow-complete-button").addEventListener("click", function () {
    const type = speedrunType.value;
    const version = minecraftVersion.value;
    const experience = experienceInput.value;

    document.querySelector("#complete-result").textContent =
        "선택한 종목: " + typeNames[type] +
        " / 버전: " + version +
        " / 연습 준비 완료";

    let guide;

    if (type === "rsg-any" && experience === "beginner") {
        guide = "오버월드에서 재료 모으기와 네더 진입 방법부터 연습해 보세요.";
    } else if (type === "rsg-any") {
        guide = "바스티온 거래와 포트리스에서 블레이즈 막대 얻기를 연습해 보세요.";
    } else if (type === "ssg-any" && experience === "beginner") {
        guide = "정해진 시드의 진행 경로를 익히고 엔더 드래곤 처치까지 연습해 보세요.";
    } else if (type === "ssg-any") {
        guide = "정해진 시드에서 이동 경로와 엔더 드래곤 처치 시간을 줄여 보세요.";
    } else if (type === "ssg-inventory") {
        guide = "필요한 아이템과 제작법을 익히고 인벤토리를 채우는 순서를 연습해 보세요.";
    } else if (type === "ssg-wool") {
        guide = "양털 색상별 획득 방법과 아이템을 모으는 순서를 연습해 보세요.";
    } else {
        guide = "발전 과제의 조건을 확인하고 필요한 아이템과 진행 경로를 연습해 보세요.";
    }

    document.querySelector("#complete-guide").textContent = guide;

    showFlowStep("complete");
});

// 다시 시작
document.querySelector("#flow-restart-button").addEventListener("click", function () {
    speedrunType.value = "";
    updateVersions();

    experienceInput.value = "";
    speedrunDescription.textContent = "스피드런 종목을 선택해 주세요.";
    flowError.textContent = "";

    document.querySelector("#confirm-type").textContent = "";
    document.querySelector("#confirm-version").textContent = "";
    document.querySelector("#confirm-experience").textContent = "";
    document.querySelector("#complete-result").textContent = "";
    document.querySelector("#complete-guide").textContent = "";

    showFlowStep("start");
});

// 의견 입력 상태 초기화
function resetFeedback() {
    feedbackMessage.textContent = "";
    feedbackMessage.className = "";
    submitButton.textContent = "제출";
    submitButton.disabled = false;
}

// 이메일 입력
emailInput.addEventListener("input", function () {
    resetFeedback();
});

// 의견 입력 및 글자 수 표시
opinionInput.addEventListener("input", function () {
    opinionCount.textContent = opinionInput.value.length + "자 입력";
    resetFeedback();
});

// 의견 제출
feedbackForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const email = emailInput.value.trim();
    const opinion = opinionInput.value.trim();

    if (email === "") {
        feedbackMessage.textContent = "이메일을 입력해 주세요.";
        feedbackMessage.className = "feedback-error";
        emailInput.focus();
        return;
    }

    if (!emailInput.validity.valid) {
        feedbackMessage.textContent =
            "이메일 형식이 올바르지 않습니다. 이메일 주소를 확인해 주세요.";
        feedbackMessage.className = "feedback-error";
        emailInput.focus();
        return;
    }

    if (opinion === "") {
        feedbackMessage.textContent = "의견을 입력해 주세요.";
        feedbackMessage.className = "feedback-error";
        opinionInput.focus();
        return;
    }

    feedbackMessage.textContent =
        "입력이 완료되었습니다. 실제로 저장되지는 않습니다.";
    feedbackMessage.className = "feedback-success";

    submitButton.textContent = "입력 완료";
    submitButton.disabled = true;
});