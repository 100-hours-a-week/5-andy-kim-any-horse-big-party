import cv from "./commonVariables.js";
import utils from "./utils.js";

const backButton = document.getElementById("back-button");
const titleInput = document.getElementById("title-textbox");
const mainTextInput = document.getElementById("body-textbox");
const postModifyButton = document.getElementById("post-modify-button");
const modifyFrom = document.getElementById("post-modify-form");
const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get("postId"); // URL에서 게시글 ID 가져오기

let titleValid = true;
let bodyValid = true;

// 페이지 로딩 이벤트
window.onload = function () {
  postModifyButton.disabled = false;
  renderModifyPost();
};

// rendering
async function renderModifyPost() {
  const posts = await utils.fetchData(cv.postsURL);
  const post = posts[postId - 1];

  titleInput.value = post.title;
  mainTextInput.value = post.body;
}

async function modifyPost(title, mainText) {
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

modifyFrom.addEventListener("submit", (event) => {
  const title = titleInput.value;
  const body = mainTextInput.value;
  event.preventDefault(); // 폼 제출 중지
  modifyPost(title, body);
  window.location.href = `boardinfo.html?postId=${postId}`;
});

backButton.addEventListener("click", () => {
  window.location.href = `boardinfo.html?postId=${postId}`;
});
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
