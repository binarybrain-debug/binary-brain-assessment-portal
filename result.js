async function checkResult() {

    const name = document.getElementById("studentName").value.trim();

    if (name === "") {
        alert("Enter Name");
        return;
    }

    document.getElementById("result").innerHTML =
        "<h3>Searching result...</h3>";

}
