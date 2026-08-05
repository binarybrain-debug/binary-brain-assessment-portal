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

}
