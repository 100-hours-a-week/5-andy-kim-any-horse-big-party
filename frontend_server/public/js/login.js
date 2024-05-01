import cv from "./commonVariables.js";

const signupButton = document.getElementById("signup-button");
const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById(`email-textbox`);
const passwordInput = document.getElementById(`password-textbox`);

const loading_page = document.getElementById("load");

window.onload = function () {
  loading_page.style.display = "none";
};

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
}

signupButton.addEventListener("click", () => {
  window.location.href = "../html/signup.html";
});

function showToast() {
  cv.toastContainer.style.visibility = "visible";

  setTimeout(() => {
    cv.toastContainer.style.visibility = "hidden";
  }, 1000); // 1초 후에 토스트 메시지가 사라집니다.
}
