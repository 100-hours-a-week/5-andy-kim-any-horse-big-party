import cv from "./commonVariables.js";
import utils from "./utils.js";

const profileImage = document.getElementById("profile-image");

const backButton = document.getElementById("back-button");
const titleInput = document.getElementById("title-textbox");
const mainTextInput = document.getElementById("body-textbox");
const postModifyButton = document.getElementById("post-modify-button");
const modifyFrom = document.getElementById("post-modify-form");
const imageInput = document.getElementById("imageUpload");
const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get("postId"); // URL에서 게시글 ID 가져오기

let titleValid = true;
let bodyValid = true;
let selectedFile = null;

// 페이지 로딩 이벤트
window.onload = function () {
  postModifyButton.disabled = false;
  const nowUserId = 1;

  fetch(cv.usersURL + `/${nowUserId}/image`, {
    method: "GET",
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
  renderModifyPost();
};

// rendering
async function renderModifyPost() {
  const posts = await utils.fetchData(cv.postsURL);
  const post = posts[postId - 1];

  titleInput.value = post.title;
  mainTextInput.value = post.body;
}

async function modifyPost(title, mainText, imageFile) {
  const url = cv.postsURL + `/${postId}`;
  const modifyPost = {
    title: title,
    body: mainText,
    date: utils.getCurrentDateTime(),
  };
  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(modifyPost),
  });
  if (!response.ok) {
    throw new Error("Failed to modify comment");
  }
  if (imageFile) {
    const formData = new FormData();
    formData.append("image", imageFile);
    const imageResponse = await fetch(cv.postsURL + `/${postId}/image`, {
      method: "PATCH",
      body: formData,
    });
    if (!imageResponse.ok) {
      throw new Error("Failed to upload image");
    }
  }
}

function modifyButtonValid() {
  if (titleValid * bodyValid) {
    postModifyButton.style.backgroundColor = "#7f6aee";
    postModifyButton.style.cursor = "pointer";
    postModifyButton.disabled = false;
  } else {
    postModifyButton.style.backgroundColor = "#aca0eb";
    postModifyButton.disabled = true;
  }
}
//eventListener
titleInput.addEventListener("focusout", () => {
  const title = titleInput.value;
  titleValid = false;
  if (title) titleValid = true;
  modifyButtonValid();
});

mainTextInput.addEventListener("focusout", () => {
  const body = mainTextInput.value;
  bodyValid = false;
  if (body) bodyValid = true;
  modifyButtonValid();
});

modifyFrom.addEventListener("submit", async (event) => {
  const title = titleInput.value;
  const body = mainTextInput.value;
  event.preventDefault(); // 폼 제출 중지
  await modifyPost(title, body, selectedFile);
  window.location.href = `../html/boardinfo.html?postId=${postId}`;
});

backButton.addEventListener("click", () => {
  window.location.href = `../html/boardinfo.html?postId=${postId}`;
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
