import cv from "./commonVariables.js";

const loginButton = document.getElementById("login-button");
const signupButton = document.getElementById("signup-button");
const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById(`email-textbox`);
const passwordInput = document.getElementById(`password-textbox`);

window.onload = function () {};

loginForm.addEventListener("submit", function (event) {
  event.preventDefault(); // 폼 제출 중지
  const email = emailInput.value;
  const password = passwordInput.value;

  login(email, password);
});

async function login(email, password) {
  const url = cv.usersURL + `/login`;
  const loginData = {
    email: email,
    password: password,
  };
  await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginData),
    credentials: "include",
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      if (data.redirectTo) {
        window.location.href = data.redirectTo; // 페이지 이동
      } else {
        showToast();
      }
    });
  await fetch(cv.usersURL + `/currentUserId`)
    .then((response) => response.json())
    .then((data) => {
      const nowUserId = data.userId;
      // 이제 nowUserId를 사용하여 작업 수행
      console.log(nowUserId);
    });
}

signupButton.addEventListener("click", () => {
  window.location.href = "../html/signup.html";
});

function showToast() {
  cv.toastContainer.style.visibility = "visible";

  setTimeout(() => {
    cv.toastContainer.style.visibility = "hidden";
  }, 1000); // 3초 후에 토스트 메시지가 사라집니다.
}
