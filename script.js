const feedbackForm = document.querySelector("#feedback-form");
const emailInput = document.querySelector("#email");
const opinionInput = document.querySelector("#opinion");
const feedbackMessage = document.querySelector("#feedback-message");
const submitButton = document.querySelector("#submit-button");

feedbackForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const email = emailInput.value.trim();
    const opinion = opinionInput.value.trim();

    if (email === "" || opinion === "") {
        feedbackMessage.textContent = "이메일과 의견을 모두 입력해 주세요.";
        feedbackMessage.className = "feedback-error";
        return;
    }

    if (!emailInput.validity.valid) {
        feedbackMessage.textContent = "올바른 이메일 주소를 입력해 주세요.";
        feedbackMessage.className = "feedback-error";
        return;
    }

    feedbackMessage.textContent =
        "입력이 완료되었습니다. 실제로 저장되지는 않습니다.";
    feedbackMessage.className = "feedback-success";

    submitButton.textContent = "입력 완료";
    submitButton.disabled = true;
});

feedbackForm.addEventListener("input", function () {
    feedbackMessage.textContent = "";
    feedbackMessage.className = "";
    submitButton.textContent = "제출";
    submitButton.disabled = false;
});