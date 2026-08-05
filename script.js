const loginPage = document.getElementById("loginPage");
const testPage = document.getElementById("testPage");

const startBtn = document.getElementById("startBtn");

const studentName = document.getElementById("studentName");

startBtn.addEventListener("click",()=>{

let name=document.getElementById("name").value;

let pass=document.getElementById("password").value;

if(name=="" || pass==""){
alert("Please enter Name and Password");
return;
}

loginPage.style.display="none";
testPage.style.display="block";

studentName.innerHTML="Welcome, "+name;

});
