
let captchaCode = "";

function generateCaptcha() {
    const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
    captchaCode = "";

    for (let i = 0; i < 5; i++) {
        captchaCode += chars[Math.floor(Math.random() * chars.length)];
    }

    document.getElementById("captchaText").innerText = captchaCode;
}

generateCaptcha();fetch("config.json")
  .then(response => response.json())
  .then(config => {
      document.getElementById("testName").innerText =
          config.tests.SET1.name;
  });
async function checkResult() {
    const name = document.getElementById("studentName").value.trim();
const resultPassword = document.getElementById("resultPassword").value.trim();
    if (name === "") {
        alert("Enter Name");
        return;
}
  if (resultPassword === "") {
    alert("Enter DOB");
    return;
}
    const captchaInput = document.getElementById("captchaInput").value.trim().toUpperCase();

if (captchaInput === "") {
    alert("Enter CAPTCHA");
    return;
}

if (captchaInput !== captchaCode) {
    alert("Incorrect CAPTCHA");
    generateCaptcha();
    document.getElementById("captchaInput").value = "";
    return;
}
      document.getElementById("loading").style.display = "block";
await new Promise(resolve => setTimeout(resolve, 2000));
    
   const response = await fetch(
    "https://script.google.com/macros/s/AKfycbxYT7gDEzvxeCnlA_5vfWxzdosjC32ulBGxx18MXSMdlHQKN-pHcCrCCC3TrZRCyZc/exec?name=" +
    encodeURIComponent(name) +
    "&dob=" +
    encodeURIComponent(resultPassword)
);

    const data = await response.json();
  if (data.success === false) {
    document.getElementById("loading").style.display = "none";
    alert("❌ " + data.message);
    return;
}
  if (!data || !data.name) {
    document.getElementById("loading").style.display = "none";
    alert("❌ Invalid Name or DOB");
    return;
}
    data.answers = JSON.parse(data.answers);
const questions = await fetch(
    "https://binarybrain-debug.github.io/binary-brain-assessment-portal/" + data.questionFile
);
const questionData = await questions.json();

 
let html = "<h3>Question Analysis</h3>";

questionData.forEach((q, i) => {

    let status = "⭕ Unattempted";
    let yourAnswer = data.answers[i];

    if (yourAnswer === q.answer) {
        status = "✅ Correct";
    } else if (yourAnswer !== undefined && yourAnswer !== null) {
        status = "❌ Wrong";
    }

    let optionsHtml = "";

    q.options.forEach(option => {

        let color = "#333";
        let weight = "normal";

        if (option === q.answer) {
            color = "green";
            weight = "bold";
        }

        if (option === yourAnswer && yourAnswer !== q.answer) {
            color = "red";
            weight = "bold";
        }

        optionsHtml += `
            <div style="margin:6px 0;color:${color};font-weight:${weight};">
                ○ ${option}
            </div>
        `;
    });

    html += `
        <div style="
            background:#f8f9ff;
            padding:18px;
            margin-bottom:20px;
            border-radius:12px;
            border-left:6px solid #4f46e5;
        ">

            <h3>Q${i+1}. ${q.question}</h3>

            ${optionsHtml}

            <br>

            <b>👤 Your Answer :</b>
            ${yourAnswer ? yourAnswer : "Not Attempted"}

            <br><br>

            <b style="color:green;">✅ Correct Answer :</b>
            ${q.answer}

            <br><br>

            <b>Status :</b> ${status}

        </div>
    `;
});
document.getElementById("analysis").innerHTML = html;
    document.getElementById("loading").style.display = "none";
    document.getElementById("result").innerHTML = `
  
    <div class="score-card">

        <div class="candidate-name">
            ${data.name}
        </div>

        <div class="score-label">SCORE</div>

        <div class="main-score">
            ${data.score}
        </div>

        <div class="result-stats">

            <div class="stat-box">
                <strong>${data.attempted}</strong>
                <span>Attempted</span>
            </div>

            <div class="stat-box correct">
                <strong>${data.correct}</strong>
                <span>Correct</span>
            </div>

            <div class="stat-box wrong">
                <strong>${data.wrong}</strong>
                <span>Wrong</span>
            </div>

        </div>

    </div>
`;
}
