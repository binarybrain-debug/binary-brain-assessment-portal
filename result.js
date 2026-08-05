async function checkResult() {

    const name = document.getElementById("studentName").value.trim();
const resultPassword = document.getElementById("resultPassword").value.trim();
    if (name === "") {
        alert("Enter Name");
        return;
    }
    const response = await fetch(
        "https://script.google.com/macros/s/AKfycbxYT7gDEzvxeCnlA_5vfWxzdosjC32ulBGxx18MXSMdlHQKN-pHcCrCCC3TrZRCyZc/exec?name=" + encodeURIComponent(name)
    );

    const data = await response.json();
    data.answers = JSON.parse(data.answers);
const questions = await fetch(data.questionFile);
const questionData = await questions.json();

    if (resultPassword !== data.dob) {
    alert("Wrong DOB");
    return;
}
let html = "<h3>Question Analysis</h3>";

questionData.forEach((q, i) => {

    let status = "⭕ Unattempted";

    if (data.answers[i] === q.answer) {
        status = "✅ Correct";
    } else if (data.answers[i] !== undefined) {
        status = "❌ Wrong";
    }

    html += `
        <p>
        <b>Q${i + 1}.</b> ${q.question}<br>
        ${status}<br>
        <b>Correct Answer:</b> ${q.answer}
        </p>
        <hr>
    `;
});

document.getElementById("analysis").innerHTML = html;
    document.getElementById("result").innerHTML = `
        <h2>${data.name}</h2>
        <p><b>Score:</b> ${data.score}</p>
        <p><b>Attempted:</b> ${data.attempted}</p>
        <p><b>Correct:</b> ${data.correct}</p>
        <p><b>Wrong:</b> ${data.wrong}</p>
    `;
}
