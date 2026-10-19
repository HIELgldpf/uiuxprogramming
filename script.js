const tabs = document.querySelectorAll(".speedrun-tab");
const panels = document.querySelectorAll(".tab-panel");

const speedrunType = document.querySelector("#speedrun-type");
const speedrunDescription = document.querySelector("#speedrun-description");

const feedbackForm = document.querySelector("#feedback-form");
const emailInput = document.querySelector("#email");
const opinionInput = document.querySelector("#opinion");
const opinionCount = document.querySelector("#opinion-count");
const feedbackMessage = document.querySelector("#feedback-message");
const submitButton = document.querySelector("#submit-button");

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

// 종목 선택 변경
speedrunType.addEventListener("change", function () {
    if (speedrunType.value === "rsg") {
        speedrunDescription.textContent =
            "무작위로 생성된 시드에서 엔더 드래곤을 처치하고 엔딩 크레딧을 띄우는 종목입니다.";
    } else {
        speedrunDescription.textContent =
            "정해둔 시드에서 보관함 칸을 빠르게 채우는 종목입니다.";
    }
});

// 입력 내용이 바뀌면 제출 상태 초기화
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