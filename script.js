const PASSWORD = "1234";

function startTest() {
    const name = document.getElementById("name").value.trim();
    const pass = document.getElementById("password").value.trim();

    if (name === "") {
        alert("Enter your name");
        return;
    }

    if (pass !== PASSWORD) {
        alert("Wrong Password");
        return;
    }

    alert("Welcome " + name + "!\nTest system will be added in next step.");
}
