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

const savePlanButton = document.querySelector("#save-plan-button");
const savePlanMessage = document.querySelector("#save-plan-message");
const planList = document.querySelector("#plan-list");
const planCount = document.querySelector("#plan-count");
const planEmpty = document.querySelector("#plan-empty");
const planMessage = document.querySelector("#plan-message");

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

const experienceNames = {
    beginner: "처음 시작함",
    practice: "기본적인 플레이 경험이 있음"
};

const STORAGE_KEY = "minecraftSpeedrunPracticePlans";

// 저장된 계획 불러오기
function loadPlans() {
    try {
        const savedPlans = localStorage.getItem(STORAGE_KEY);

        if (!savedPlans) {
            return [];
        }

        const plans = JSON.parse(savedPlans);

        if (!Array.isArray(plans)) {
            return [];
        }

        return plans.filter(function (plan) {
            return plan &&
                typeof plan.id === "string" &&
                typeNames[plan.type] &&
                typeof plan.version === "string" &&
                (versionOptions[plan.type] || []).includes(plan.version) &&
                experienceNames[plan.experience];
        });
    } catch (error) {
        return [];
    }
}

let practicePlans = loadPlans();

// 저장된 계획을 브라우저에 기록
function savePlans() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(practicePlans));
        return true;
    } catch (error) {
        return false;
    }
}

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

    document.querySelector("#confirm-type").textContent =
        "선택한 종목: " + typeNames[type];

    document.querySelector("#confirm-experience").textContent =
        "현재 숙련도: " + experienceNames[experience];

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
    savePlanMessage.textContent = "";
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

    savePlanMessage.textContent = "";

    showFlowStep("start");
});

// 연습 계획 목록 표시
function renderPlans() {
    planList.replaceChildren();

    planCount.textContent = "저장된 계획: " + practicePlans.length + "개";
    planEmpty.hidden = practicePlans.length !== 0;

    practicePlans.forEach(function (plan) {
        const card = document.createElement("article");
        card.className = "plan-card";

        const title = document.createElement("h4");
        title.textContent = typeNames[plan.type];

        const version = document.createElement("p");
        version.textContent = "마인크래프트 버전: " + plan.version;

        const experience = document.createElement("p");
        experience.textContent = "숙련도: " + experienceNames[plan.experience];

        const actions = document.createElement("div");
        actions.className = "plan-actions";

        const loadButton = document.createElement("button");
        loadButton.type = "button";
        loadButton.textContent = "불러오기";
        loadButton.className = "load-plan-button";
        loadButton.dataset.id = plan.id;

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.textContent = "삭제";
        deleteButton.className = "delete-plan-button";
        deleteButton.dataset.id = plan.id;

        actions.append(loadButton, deleteButton);
        card.append(title, version, experience, actions);
        planList.appendChild(card);
    });
}

// 연습 계획 저장
savePlanButton.addEventListener("click", function () {
    const type = speedrunType.value;
    const version = minecraftVersion.value;
    const experience = experienceInput.value;

    if (!type || !version || !experience) {
        savePlanMessage.textContent = "저장할 연습 정보를 먼저 선택해 주세요.";
        savePlanMessage.className = "feedback-error";
        return;
    }

    const duplicate = practicePlans.some(function (plan) {
        return plan.type === type &&
            plan.version === version &&
            plan.experience === experience;
    });

    if (duplicate) {
        savePlanMessage.textContent = "같은 종목, 버전, 숙련도의 계획이 이미 저장되어 있습니다.";
        savePlanMessage.className = "feedback-error";
        return;
    }

    const newPlan = {
        id: Date.now().toString() + "-" + Math.random().toString(36).slice(2),
        type: type,
        version: version,
        experience: experience
    };

    practicePlans.push(newPlan);

    if (!savePlans()) {
        practicePlans.pop();
        savePlanMessage.textContent =
            "저장에 실패했습니다. 브라우저의 저장 공간을 확인해 주세요.";
        savePlanMessage.className = "feedback-error";
        return;
    }

    renderPlans();

    savePlanMessage.textContent = "연습 계획을 목록에 저장했습니다.";
    savePlanMessage.className = "feedback-success";
    planMessage.textContent = "";
});

// 목록에서 불러오기 및 삭제
planList.addEventListener("click", function (event) {
    const button = event.target.closest("button");

    if (!button) {
        return;
    }

    const planId = button.dataset.id;
    const plan = practicePlans.find(function (item) {
        return item.id === planId;
    });

    if (!plan) {
        planMessage.textContent = "해당 계획을 찾을 수 없습니다. 목록을 확인해 주세요.";
        planMessage.className = "feedback-error";
        return;
    }

    // 계획 불러오기
    if (button.classList.contains("load-plan-button")) {
        speedrunType.value = plan.type;
        updateVersions();

        minecraftVersion.value = plan.version;
        experienceInput.value = plan.experience;

        speedrunDescription.textContent = descriptions[plan.type];
        flowError.textContent = "";
        savePlanMessage.textContent = "";

        showFlowStep("select");

        document.querySelector("#steps").scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

        planMessage.textContent = "저장한 계획을 불러왔습니다. 내용을 확인하거나 수정할 수 있습니다.";
        planMessage.className = "feedback-success";
        return;
    }

    // 계획 삭제
    if (button.classList.contains("delete-plan-button")) {
        const index = practicePlans.findIndex(function (item) {
            return item.id === planId;
        });

        const deletedPlan = practicePlans[index];

        practicePlans.splice(index, 1);

        if (!savePlans()) {
            practicePlans.splice(index, 0, deletedPlan);
            planMessage.textContent =
                "삭제 내용을 저장하지 못했습니다. 다시 시도해 주세요.";
            planMessage.className = "feedback-error";
            return;
        }

        renderPlans();

        planMessage.textContent = "연습 계획을 삭제했습니다.";
        planMessage.className = "feedback-success";
        savePlanMessage.textContent = "";
    }
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

// 페이지를 열 때 저장된 계획 표시
renderPlans();