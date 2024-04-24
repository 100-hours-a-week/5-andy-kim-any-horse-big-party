import cv from "./commonVariables.js";

const loginButton = document.getElementById("login-button");
const signupButton = document.getElementById("signup-button");
const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", function (event) {
  event.preventDefault(); // 폼 제출 중지
  const email = document.getElementById("email-textbox").value;
  const password = document.getElementById("password-textbox").value;

  fetch(cv.usersURL)
    .then((response) => response.json())
    .then((data) => {
      const user = data.find(
        (user) => user.email === email && user.password === password
      );
      if (user) {
        loginButton.style.backgroundColor = "#7f6aee";
        setTimeout(() => {
          window.location.href = "board.html";
        }, 3000);
      } else {
        showToast();
      }
    });
});

signupButton.addEventListener("click", () => {
  window.location.href = "signup.html";
});

function showToast() {
  cv.toastContainer.style.visibility = "visible";

  setTimeout(() => {
    cv.toastContainer.style.visibility = "hidden";
  }, 1000); // 3초 후에 토스트 메시지가 사라집니다.
}
