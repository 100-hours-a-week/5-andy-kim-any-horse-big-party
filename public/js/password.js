import cv from "./commonVariables.js";

// 비밀번호 변경
const passwordFormContainer = document.getElementById("password-form");
const passwordModifyButton = document.getElementById("password-modify-button");
const passwordInput = document.getElementById("password-textbox");
const verifyInput = document.getElementById("verify-textbox");

let passwordValid = false;
let verifyValid = false;
// 유효성 검사
const passwordHelperText = document.getElementById("password-helper-text");
const verifyHelperText = document.getElementById("verify-helper-text");

const userId = 1;

// 페이지 로딩 이벤트
window.onload = function () {
  passwordModifyButton.disabled = false;
};

// 유효성 검사
function deleteButtonValid() {
  if (passwordValid * verifyValid) {
    passwordModifyButton.style.backgroundColor = "#7f6aee";
    passwordModifyButton.style.cursor = "pointer";
    passwordModifyButton.disabled = false;
  } else {
    passwordModifyButton.style.backgroundColor = "#aca0eb";
    passwordModifyButton.disabled = true;
  }
}

function isValidPassword(password) {
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+}{:;'?/.,<>]).+$/;
  return passwordRegex.test(password);
}

// modifyPassword
async function modifyPassword(password) {
  const url = cv.usersURL + `/${userId}`;
  const modifyUser = {
    password: password,
  };
  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(modifyUser),
  });
  if (!response.ok) {
    throw new Error("Failed to modify comment");
  }
}
// 유효성 검사
passwordInput.addEventListener("focusout", () => {
  passwordValid = false;
  const password = passwordInput.value;
  if (!password) {
    passwordHelperText.textContent = "* 비밀번호를 입력해주세요.";
  } else if (password.length < 8 || password.length > 20) {
    passwordHelperText.textContent =
      "* 비밀번호는 8자 이상 20자 이하이어야 합니다.";
  } else if (!isValidPassword(password)) {
    passwordHelperText.textContent = "* 유효하지 않은 비밀번호 형식입니다.";
  } else {
    passwordHelperText.textContent = "";
    passwordValid = true;
    deleteButtonValid();
  }
});

verifyInput.addEventListener("focusout", () => {
  verifyValid = false;
  const verify = verifyInput.value;
  const password = passwordInput.value;
  if (!verify) {
    verifyHelperText.textContent = "* 비밀번호를 한 번 더 입력해주세요.";
  } else if (verify !== password) {
    verifyHelperText.textContent = "* 비밀번호가 다릅니다.";
  } else {
    verifyHelperText.textContent = "";
    verifyValid = true;
    deleteButtonValid();
  }
});

passwordFormContainer.addEventListener("submit", function (event) {
  const password = passwordInput.value;
  event.preventDefault(); // 폼 제출 중지
  modifyPassword(password);
  showToast();
});

function showToast() {
  cv.toastContainer.style.visibility = "visible";

  setTimeout(() => {
    cv.toastContainer.style.visibility = "hidden";
  }, 1000); // 1초 후에 토스트 메시지가 사라집니다.
}

//회원정보 수정 이벤트
cv.modifyUserinfoButton.addEventListener("click", () => {
  window.location.href = "userinfo.html";
});

cv.modifyPasswordButton.addEventListener("click", () => {
  window.location.href = "password.html";
});

cv.logoutButton.addEventListener("click", () => {
  window.location.href = "login.html";
});

cv.profileImageButton.addEventListener("click", () => {
  if (cv.isUserModal) {
    cv.isUserModal = false;
    cv.modalUserinfo.classList.add("hidden");
  } else {
    cv.isUserModal = true;
    cv.modalUserinfo.classList.remove("hidden");
  }
});
