import cv from "./commonVariables.js";
import utils from "./utils.js";

// 탈퇴 모달 관련 변수
const modalUserDelete = document.getElementById("modalContainer");
const deleteUserButton = document.getElementById("delete-user-button");
const modalAcceptButton = document.getElementById("user-accept-button");
const modalCancleButton = document.getElementById("user-cancle-button");
// 토스트메세지 변수
const toastContainer = document.getElementById("toast-container");
// 회원정보 폼 관련 변수
const userinfoFormContainer = document.getElementById("userinfo-form");
// 변수 이름 레전드
const userinfoModifyButton = document.getElementById("userinfo-modify-button");
const userMail = document.getElementById("mail-address");
const nicknameInput = document.getElementById("nickname-textbox");
const userId = 1;

let nicknameValid = true;

//페이지 로딩 이벤트
window.onload = function () {
  userinfoModifyButton.disabled = false;
  renderUserinfo();
};

// 회원 탈퇴 이벤트
modalAcceptButton.addEventListener("click", () => {
  deleteUser();
  window.location.href = "login.html";
});

modalCancleButton.addEventListener("click", () => {
  modalUserDelete.classList.add("hidden");
});

deleteUserButton.addEventListener("click", () => {
  modalUserDelete.classList.remove("hidden");
});

// modifyUserinfo
async function modifyUserinfo(nickname) {
  const url = cv.usersURL + `/${userId}`;
  // try {
  const modifyUser = {
    nickname: nickname,
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

// deleteUser
async function deleteUser() {
  const url = cv.usersURL + `/${userId}`;
  const response = await fetch(url, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to modify comment");
  }
}

// modiftButtonValid
function modifyButtonValid() {
  if (nicknameValid) {
    userinfoModifyButton.style.backgroundColor = "#7f6aee";
    userinfoModifyButton.style.cursor = "pointer";
    userinfoModifyButton.disabled = false;
  } else {
    userinfoModifyButton.style.backgroundColor = "#aca0eb";
    userinfoModifyButton.disabled = true;
  }
}

// renderUserinfo
async function renderUserinfo() {
  const users = await utils.fetchData(cv.usersURL);
  const user = users[userId - 1];

  nicknameInput.value = user.nickname;
  userMail.textContent = user.email;

  nicknameInput.addEventListener("focusout", () => {
    const nickname = nicknameInput.value;
    nicknameValid = false;
    if (nickname) nicknameValid = true;
    modifyButtonValid();
  });

  userinfoFormContainer.addEventListener("submit", function (event) {
    const nickname = nicknameInput.value;
    event.preventDefault(); // 폼 제출 중지
    modifyUserinfo(nickname);
    showToast();
  });
}
//showToast
function showToast() {
  cv.toastContainer.style.visibility = "visible";

  setTimeout(() => {
    cv.toastContainer.style.visibility = "hidden";
  }, 1000); // 3초 후에 토스트 메시지가 사라집니다.
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
