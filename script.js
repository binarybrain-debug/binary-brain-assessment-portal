// Login System
let config = {};

fetch("config.json")
.then(res => res.json())
.then(data => {

    config = data;

    if (config.siteOpen === false) {

        document.getElementById("siteClosedPage").style.display = "flex";

        document.querySelector(".container").style.display = "none";

        document.getElementById("closedTitle").innerText =
            "EXAMINATION WINDOW NOT YET OPEN";

        document.getElementById("closedMessage").innerText =
            "The examination window is currently closed.";

        document.getElementById("closedInstruction").innerText =
            "Please wait for the official opening of the examination.";

        const waitMessage =
            document.getElementById("waitMessage");

        const text = "PLEASE WAIT...";

        let i = 0;

        function typeWaitMessage() {

            if (i < text.length) {

                waitMessage.innerText += text.charAt(i);

                i++;

                setTimeout(typeWaitMessage, 100);

            } else {

                setTimeout(() => {

                    waitMessage.innerText = "";

                    i = 0;

                    typeWaitMessage();

                }, 1200);

            }
        }

        typeWaitMessage();

        return;
    }

    document.getElementById("testTitle").innerText =
        config.tests.SET1.name;

});
let questionFile = "";
const loginBtn = document.getElementById("loginBtn");

loginBtn.addEventListener("click", () => {

   const name = document.getElementById("studentName").value.trim();
const dob = document.getElementById("studentDob").value.trim();
const testCode = document.getElementById("studentTestCode").value.trim().toUpperCase();
    const password = document.getElementById("studentPassword").value.trim();
const selectedTest = config.tests[testCode];

if (!selectedTest) {
    alert("Wrong Test Code");
    return;
}
if (password !== selectedTest.password) {
    alert("Wrong Password");
    return;
}
questionFile = selectedTest.file;

// Login page par selected test ka naam dikhao
document.getElementById("testTitle").innerText = selectedTest.name;
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
document.querySelector(".exam-watermark").classList.add("show");
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
// ===============================
// PROFESSIONAL SUBMIT SYSTEM
// ===============================

const submitBtn = document.getElementById("submitBtn");
const submitPopup = document.getElementById("submitPopup");
const cancelSubmit = document.getElementById("cancelSubmit");
const confirmSubmit = document.getElementById("confirmSubmit");

// Open confirmation popup
submitBtn.addEventListener("click", () => {

    saveAnswer();

    // Calculate attempted questions
    let attempted = 0;

    window.answers.forEach(ans => {
        if (ans !== undefined) {
            attempted++;
        }
    });

    // Calculate unattempted questions
    let unattempted =
        window.questions.length - attempted;

    // Show numbers in confirmation popup
    document.getElementById("popupAttempted").innerText =
        attempted;

    document.getElementById("popupUnattempted").innerText =
        unattempted;

    // Open popup
    if (submitPopup) {
        submitPopup.style.display = "flex";
    }

});

// Cancel submission
if (cancelSubmit) {

    cancelSubmit.addEventListener("click", () => {

        submitPopup.style.display = "none";

    });

}


// Final submission
if (confirmSubmit) {

    confirmSubmit.addEventListener("click", () => {

        submitPopup.style.display = "none";

        submitTest();

    });

}


// ===============================
// ACTUAL TEST SUBMISSION
// ===============================

function submitTest() {

    saveAnswer();

    let score = 0;

    // Calculate score
    window.questions.forEach((q, index) => {

        if (window.answers[index] === q.answer) {

            score += 4;

        } else if (
            window.answers[index] !== undefined
        ) {

            score -= 1;

        }

    });


    localStorage.setItem("finalScore", score);


    // Attempted
    let attempted = 0;

    window.answers.forEach(ans => {

        if (ans !== undefined) {

            attempted++;

        }

    });


    // Correct & Wrong
    let correct = 0;
    let wrong = 0;

    window.questions.forEach((q, index) => {

        if (window.answers[index] === q.answer) {

            correct++;

        } else if (
            window.answers[index] !== undefined
        ) {

            wrong++;

        }

    });


    // Stop timer
    clearInterval(timerInterval);


    // Send result to Google Sheets
    fetch(
        "https://script.google.com/macros/s/AKfycbxYT7gDEzvxeCnlA_5vfWxzdosjC32ulBGxx18MXSMdlHQKN-pHcCrCCC3TrZRCyZc/exec",
        {
            method: "POST",

            body: JSON.stringify({

                name: localStorage.getItem("studentName"),

                dob: localStorage.getItem("studentDob"),

                score: score,

                attempted: attempted,

                correct: correct,

                wrong: wrong,

                answers: window.answers,

                questionFile:
                    localStorage.getItem("questionFile")

            })

        }
    );


    // Result page
    document.getElementById("resultName").innerText =
        "Candidate : " +
        localStorage.getItem("studentName");


    document.getElementById("attemptedCount").innerText =
        "Attempted Questions : " +
        attempted +
        " / " +
        window.questions.length;


    document.getElementById("examPage").style.display =
        "none";

    document.getElementById("thankYouPage").style.display =
        "block";

}
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

    submitTest();

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
// Show / Hide Password

const togglePassword = document.getElementById("togglePassword");
const passwordInput = document.getElementById("studentPassword");

togglePassword.addEventListener("click", () => {

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        togglePassword.innerText = "🙈";
    } else {
        passwordInput.type = "password";
        togglePassword.innerText = "👁️";
    }

});
