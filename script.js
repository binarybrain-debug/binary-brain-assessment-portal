// Login System

let questionFile = "";
const loginBtn = document.getElementById("loginBtn");

loginBtn.addEventListener("click", () => {

   const name = document.getElementById("studentName").value.trim();
const dob = document.getElementById("studentDob").value.trim();
const testCode = document.getElementById("studentTestCode").value.trim().toUpperCase();
if (testCode === "SET1") {
    questionFile = "questions1.json";
}
else if (testCode === "SET2") {
    questionFile = "questions2.json";
}
else {
   alert("Wrong Test Code");
    return;
}

    if(name === "" || dob === "" || testCode === ""){
        alert("Please enter Name, DOB and Test Code");
        return;
    }

    localStorage.setItem("studentName", name);
    localStorage.setItem("studentDob", dob);
localStorage.setItem("questionFile", questionFile);
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

   const response = await fetch(questionFile);
    const questions = await response.json();

    window.questions = questions;
    localStorage.setItem("questionFile", questionFile);
    window.currentQuestion = 0;

    showQuestion();
startTimer();
});

function showQuestion() {

    const q = window.questions[window.currentQuestion];

    let html = `
        <h2>Question ${window.currentQuestion + 1} / ${window.questions.length}</h2>

        <p>${q.question}</p>
    `;

    q.options.forEach((option, index) => {

       html += `
<div class="option">
    <label>
        <input type="radio"
               name="answer"
               value="${option}">
        ${option}
    </label>
</div>
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
updatePalette();
   updateProgress();
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
function updateProgress() {

    let answered = 0;

    window.answers.forEach(ans => {
        if (ans !== undefined) {
            answered++;
        }
    });

    let percent = (answered / window.questions.length) * 100;

    document.getElementById("progressBar").style.width = percent + "%";

    document.getElementById("progressText").innerText =
        answered + " / " + window.questions.length + " Answered";
}
document.getElementById("clearBtn").addEventListener("click", () => {

    const radios = document.querySelectorAll('input[name="answer"]');

    radios.forEach(radio => radio.checked = false);

    window.answers[window.currentQuestion] = undefined;

    updatePalette();
updateProgress();
});
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
let attempted = 0;

window.answers.forEach(ans => {
    if (ans !== undefined) {
        attempted++;
    }
});
let correct = 0;
let wrong = 0;

window.questions.forEach((q, index) => {
    if (window.answers[index] === q.answer) {
        correct++;
    } else if (window.answers[index] !== undefined) {
        wrong++;
    }
});

fetch("https://script.google.com/macros/s/AKfycbxYT7gDEzvxeCnlA_5vfWxzdosjC32ulBGxx18MXSMdlHQKN-pHcCrCCC3TrZRCyZc/exec", {
    method: "POST",
  body: JSON.stringify({
    name: localStorage.getItem("studentName"),
     dob: localStorage.getItem("studentDob"),
    score: score,
    attempted: attempted,
    correct: correct,
    wrong: wrong,
    answers: window.answers,
    questionFile: localStorage.getItem("questionFile")
})
});
document.getElementById("resultName").innerText =
    "Candidate : " + localStorage.getItem("studentName");

document.getElementById("attemptedCount").innerText =
    "Attempted Questions : " + attempted + " / " + window.questions.length;
    document.getElementById("examPage").style.display = "none";
    document.getElementById("thankYouPage").style.display = "block";

});
let totalTime = 180 * 60;
let timerInterval;
function startTimer() {

    timerInterval = setInterval(() => {

        let minutes = Math.floor(totalTime / 60);
        let seconds = totalTime % 60;

        document.getElementById("timer").innerText =
            `${minutes}:${seconds.toString().padStart(2, "0")}`;

        totalTime--;

        if (totalTime < 0) {

            clearInterval(timerInterval);

            document.getElementById("submitBtn").click();

        }

    }, 1000);

}
function updatePalette() {
    const palette = document.getElementById("palette");

    if (!palette) return;

    palette.innerHTML = "";

    window.questions.forEach((q, index) => {
        const btn = document.createElement("button");

        btn.innerText = index + 1;

        if (window.answers[index]) {
            btn.classList.add("answered");
        }

        if (index === window.currentQuestion) {
            btn.classList.add("current");
        }

        btn.onclick = () => {
            saveAnswer();
            window.currentQuestion = index;
            showQuestion();
        };

        palette.appendChild(btn);
    });
}
// Prevent Browser Back
history.pushState(null, null, location.href);

window.addEventListener("popstate", function () {
    alert("⚠️ Warning! You cannot leave the test.");
    history.pushState(null, null, location.href);
});
// Premium Welcome Message
setTimeout(() => {

    let msg = document.createElement("div");

    msg.innerHTML = `
    <div style="font-size:22px;font-weight:bold;">🧠 Binary Brain Assessment Portal</div>
    <div style="margin-top:10px;">Excellence is a Habit,<br>Success is a Choice.</div>
    <div style="margin-top:10px;">Stay Focused.<br>Trust Yourself.<br>Give Your Best.</div>
    <div style="margin-top:15px;font-size:18px;">🌟 Best Wishes for Your Examination 🌟</div>
    `;

    msg.style.position = "fixed";
    msg.style.top = "25px";
    msg.style.left = "50%";
    msg.style.transform = "translateX(-50%)";
    msg.style.background = "linear-gradient(135deg,#2563eb,#1e3a8a)";
    msg.style.color = "white";
    msg.style.padding = "20px 30px";
    msg.style.borderRadius = "15px";
    msg.style.textAlign = "center";
    msg.style.boxShadow = "0 10px 30px rgba(0,0,0,.35)";
    msg.style.zIndex = "99999";

    document.body.appendChild(msg);

    setTimeout(() => {
        msg.remove();
    }, 5000);

}, 500);
// ===== Premium Glass Welcome =====
setTimeout(() => {

    const popup = document.createElement("div");

    popup.innerHTML = `
    <h2 style="margin:0;color:#fff;">🧠 Binary Brain Assessment Portal</h2>
    <p style="margin:15px 0 5px;color:#fff;font-size:18px;">
        Excellence is a Habit,<br>
        Success is a Choice.
    </p>
    <p style="color:#dbeafe;">
        Stay Focused • Trust Yourself • Give Your Best
    </p>
    <h3 style="color:#fde68a;margin-top:15px;">
        🌟 Best Wishes for Your Examination 🌟
    </h3>
    `;

    popup.style.position = "fixed";
    popup.style.top = "50%";
    popup.style.left = "50%";
    popup.style.transform = "translate(-50%,-50%)";
    popup.style.width = "420px";
    popup.style.maxWidth = "90%";
    popup.style.padding = "30px";
    popup.style.borderRadius = "20px";
    popup.style.background = "rgba(255,255,255,0.15)";
    popup.style.backdropFilter = "blur(15px)";
    popup.style.border = "1px solid rgba(255,255,255,0.3)";
    popup.style.boxShadow = "0 15px 40px rgba(0,0,0,.35)";
    popup.style.textAlign = "center";
    popup.style.zIndex = "999999";

    document.body.appendChild(popup);

    setTimeout(() => {
        popup.style.transition = "0.6s";
        popup.style.opacity = "0";
        popup.style.transform = "translate(-50%,-60%)";

        setTimeout(() => popup.remove(), 600);
    }, 5000);

}, 500);
