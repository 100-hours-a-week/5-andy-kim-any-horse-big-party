import cv from "./commonVariables.js";
import utils from "./utils.js";

const profileImage = document.getElementById("profile-image");
// 탈퇴 모달 관련 변수
const modalUserDelete = document.getElementById("modalContainer");
const deleteUserButton = document.getElementById("delete-user-button");
const modalAcceptButton = document.getElementById("user-accept-button");
const modalCancleButton = document.getElementById("user-cancle-button");
// 회원정보 폼 관련 변수
const userinfoFormContainer = document.getElementById("userinfo-form");
const imageInput = document.getElementById("imageUpload");
const userinfoImage = document.getElementById("image");
// 변수 이름 레전드
const userinfoModifyButton = document.getElementById("userinfo-modify-button");
const userMail = document.getElementById("mail-address");
const nicknameInput = document.getElementById("nickname-textbox");
const loading_page = document.getElementById("load");
let nowUserId = 1;

let selectedFile = null;

let nicknameValid = true;

//페이지 로딩 이벤트
window.onload = async function () {
  loading_page.style.display = "none";
  await utils.checkAuth();
  userinfoModifyButton.disabled = false;
  nowUserId = await fetch(cv.usersURL + `/currentUserId`, {
    credentials: "include",
  })
    .then((response) => response.json())
    .then((data) => {
      return data.userId;
    });
  console.log(nowUserId);
  fetch(cv.usersURL + `/${nowUserId}/image`, {
    method: "GET",
    credentials: "include",
  })
    .then((response) => {
      if (!response.ok) {
        console.log("fetch error");
      }
      console.log(response);
      return response.blob(); // 이미지 데이터를 Blob 형식으로 변환
    })
    .then((blob) => {
      console.log(blob);
      const imageUrl = URL.createObjectURL(blob); // Blob URL 생성
      console.log(imageUrl);
      profileImage.src = imageUrl; // 이미지의 src 속성에 Blob URL 설정
    });
  renderUserinfo();
};

// 회원 탈퇴 이벤트
modalAcceptButton.addEventListener("click", () => {
  // alert("해당 기능은 현재 지원하지 않습니다.");
  // window.location.href = "../html/userinfo.html";
  deleteUser();
  window.location.href = "../html/login.html";
});

modalCancleButton.addEventListener("click", () => {
  modalUserDelete.classList.add("hidden");
});

deleteUserButton.addEventListener("click", () => {
  modalUserDelete.classList.remove("hidden");
});

// modifyUserinfo
async function modifyUserinfo(nickname, imageFile) {
  const url = cv.usersURL + `/${nowUserId}`;
  // try {
  const modifyUser = {
    nickname: nickname,
  };
  const nicknameResponse = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(modifyUser),
    credentials: "include",
  });
  if (!nicknameResponse.ok) {
    throw new Error("Failed to modify comment");
  }
  if (imageFile) {
    const formData = new FormData();
    formData.append("image", imageFile);
    const imageResponse = await fetch(url + `/image`, {
      method: "PATCH",
      body: formData,
      credentials: "include",
    });
    if (!imageResponse.ok) {
      throw new Error("Failed to upload image");
    }
  }
}

// deleteUser
async function deleteUser() {
  const url = cv.usersURL + `/${nowUserId}`;
  const response = await fetch(url, {
    method: "DELETE",
    credentials: "include",
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
  const url = cv.usersURL + `/${nowUserId}/image`;
  const users = await utils.fetchData(cv.usersURL);
  const user = users[nowUserId - 1];

  nicknameInput.value = user.nickname;
  userMail.textContent = user.email;

  await fetch(url, {
    method: "GET",
    credentials: "include",
  })
    .then((response) => {
      if (!response.ok) {
        console.log("fetch error");
      }
      console.log(response);
      return response.blob(); // 이미지 데이터를 Blob 형식으로 변환
    })
    .then((blob) => {
      console.log(blob);
      const imageUrl = URL.createObjectURL(blob); // Blob URL 생성
      console.log(imageUrl);
      userinfoImage.src = imageUrl; // 이미지의 src 속성에 Blob URL 설정
    });

  nicknameInput.addEventListener("focusout", () => {
    const nickname = nicknameInput.value;
    nicknameValid = false;
    if (nickname) nicknameValid = true;
    modifyButtonValid();
  });

  userinfoFormContainer.addEventListener("submit", function (event) {
    const nickname = nicknameInput.value;
    event.preventDefault(); // 폼 제출 중지
    modifyUserinfo(nickname, selectedFile);
    showToast();
  });
}
// 이미지 업로드 이벤트

imageInput.addEventListener("change", () => {
  selectedFile = imageInput.files[0];
  const fileReader = new FileReader();

  fileReader.readAsDataURL(selectedFile);
  fileReader.onload = function () {
    userinfoImage.src = fileReader.result;
  };
});

imageInput.onchange = () => {
  selectedFile = imageInput.files[0];
  console.log(selectedFile);
};

//showToast
function showToast() {
  cv.toastContainer.style.visibility = "visible";

  setTimeout(() => {
    cv.toastContainer.style.visibility = "hidden";
  }, 1000); // 3초 후에 토스트 메시지가 사라집니다.
}

//회원정보 수정 이벤트
cv.modifyUserinfoButton.addEventListener("click", () => {
  window.location.href = "../html/userinfo.html";
});

cv.modifyPasswordButton.addEventListener("click", () => {
  window.location.href = "../html/password.html";
});

cv.logoutButton.addEventListener("click", () => {
  fetch(cv.usersURL + `/logout`);
  window.location.href = "../html/login.html";
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
