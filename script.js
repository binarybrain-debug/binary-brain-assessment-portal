// Login System

const loginBtn = document.getElementById("loginBtn");

loginBtn.addEventListener("click", () => {

    const name = document.getElementById("studentName").value.trim();
    const password = document.getElementById("studentPassword").value.trim();

    if(name === "" || password === ""){
        alert("Please enter Name and Password");
        return;
    }

    localStorage.setItem("studentName", name);

    document.getElementById("loginPage").style.display="none";
    document.getElementById("instructionPage").style.display="block";

});
// Begin Test Button

const beginExam = document.getElementById("beginExam");

beginExam.addEventListener("click", async () => {

    document.getElementById("instructionPage").style.display = "none";
    document.getElementById("examPage").style.display = "block";

    document.getElementById("candidateName").innerText =
        localStorage.getItem("studentName");

    const response = await fetch("questions.json");
    const questions = await response.json();

    window.questions = questions;
    window.currentQuestion = 0;

    showQuestion();

});

function showQuestion() {

    const q = window.questions[window.currentQuestion];

    let html = `
        <h2>Question ${window.currentQuestion + 1} / ${window.questions.length}</h2>

        <p>${q.question}</p>
    `;

    q.options.forEach((option, index) => {

        html += `
        <label>
            <input type="radio"
                   name="answer"
                   value="${option}">
            ${option}
        </label>
        <br><br>
        `;

    });

    document.getElementById("questionArea").innerHTML = html;
// Restore selected answer
if (window.answers[window.currentQuestion]) {

    const radios = document.querySelectorAll('input[name="answer"]');

    radios.forEach(radio => {

        if (radio.value === window.answers[window.currentQuestion]) {
            radio.checked = true;
        }

    });

}
}
// Student Answers
window.answers = [];

// Next Button
document.getElementById("nextBtn").addEventListener("click", () => {

    saveAnswer();

    if (window.currentQuestion < window.questions.length - 1) {
        window.currentQuestion++;
        showQuestion();
    }

});

// Previous Button
document.getElementById("prevBtn").addEventListener("click", () => {

    saveAnswer();

    if (window.currentQuestion > 0) {
        window.currentQuestion--;
        showQuestion();
    }

});

// Save Selected Answer
function saveAnswer() {

    const selected = document.querySelector('input[name="answer"]:checked');

    if (selected) {
        window.answers[window.currentQuestion] = selected.value;
    }

}
// Submit Test

document.getElementById("submitBtn").addEventListener("click", () => {

    saveAnswer();

    let score = 0;

    window.questions.forEach((q, index) => {

        if (window.answers[index] === q.answer) {
            score += 4;
        }
        else if (window.answers[index] !== undefined) {
            score -= 1;
        }

    });

    localStorage.setItem("finalScore", score);

    document.getElementById("examPage").style.display = "none";
    document.getElementById("thankYouPage").style.display = "block";

});
