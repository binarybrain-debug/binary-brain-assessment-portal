async function checkResult() {

    const name = document.getElementById("studentName").value.trim();

    if (name === "") {
        alert("Enter Name");
        return;
    }

    const response = await fetch(
        "https://script.google.com/macros/s/AKfycbxYT7gDEzvxeCnlA_5vfWxzdosjC32ulBGxx18MXSMdlHQKN-pHcCrCCC3TrZRCyZc/exec?name=" + encodeURIComponent(name)
    );

    const data = await response.json();

    document.getElementById("result").innerHTML = `
        <h2>${data.name}</h2>
        <p><b>Score:</b> ${data.score}</p>
        <p><b>Attempted:</b> ${data.attempted}</p>
        <p><b>Correct:</b> ${data.correct}</p>
        <p><b>Wrong:</b> ${data.wrong}</p>
    `;
}
