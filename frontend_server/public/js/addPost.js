import cv from "./commonVariables.js";
import utils from "./utils.js";

const profileImage = document.getElementById("profile-image");

const backButton = document.getElementById("back-button");
const titleInput = document.getElementById("title-textbox");
const mainTextInput = document.getElementById("body-textbox");
const addPostButton = document.getElementById("add-post-button");
const addPostForm = document.getElementById("post-add-form");
const imageInput = document.getElementById("imageUpload");
const loading_page = document.getElementById("load");

let titleValid = false;
let bodyValid = false;

let nowUserId = 0;

addPostButton.disabled = true;
let selectedFile = null;
// 페이지 로딩 이벤트

window.onload = async function () {
  loading_page.style.display = "none";
  await utils.checkAuth();
  nowUserId = await fetch(cv.usersURL + `/currentUserId`, {
    credentials: "include",
  })
    .then((response) => response.json())
    .then((data) => {
      return data.userId;
    });

  fetch(cv.usersURL + `/${nowUserId}/image`, {
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
};

function addButtonValid() {
  if (titleValid * bodyValid) {
    addPostButton.style.backgroundColor = "#7f6aee";
    addPostButton.style.cursor = "pointer";
    addPostButton.disabled = false;
  } else {
    addPostButton.style.backgroundColor = "#aca0eb";
    addPostButton.disabled = true;
  }
}

titleInput.addEventListener("focusout", () => {
  const title = titleInput.value;
  titleValid = false;
  if (title) titleValid = true;
  addButtonValid();
});

mainTextInput.addEventListener("focusout", () => {
  const body = mainTextInput.value;
  bodyValid = false;
  if (body) bodyValid = true;
  addButtonValid();
});

addPostForm.addEventListener("submit", function (event) {
  event.preventDefault(); // 폼 제출 중지
  const title = titleInput.value;
  const body = mainTextInput.value;
  addPost(title, body, selectedFile);
  window.location.href = `../html/board.html`;
});

async function addPost(title, mainText, imageFile) {
  const modifyPost = {
    id: 0,
    userId: nowUserId,
    title: title,
    body: mainText,
    attachFilePath: null,
    likes: 0,
    comments: [],
    views: 0,
    date: utils.getCurrentDateTime(),
  };
  const response = await fetch(cv.postsURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(modifyPost),
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Failed to modify comment");
  }
  const jsondata = await response.json();
  if (imageFile) {
    const formData = new FormData();
    formData.append("image", imageFile);
    const imageResponse = await fetch(
      cv.postsURL + `/${jsondata.data.id}/image`,
      {
        method: "PATCH",
        body: formData,
      }
    );
    if (!imageResponse.ok) {
      throw new Error("Failed to upload image");
    }
  }
}

backButton.addEventListener("click", () => {
  window.location.href = "../html/board.html";
});

// 이미지 업로드 이벤트

imageInput.addEventListener("change", () => {
  selectedFile = imageInput.files[0];
  const fileReader = new FileReader();

  fileReader.readAsDataURL(selectedFile);
});

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
