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
