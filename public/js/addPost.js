import cv from "./commonVariables.js";
import utils from "./utils.js";

const backButton = document.getElementById("back-button");
const titleInput = document.getElementById("title-textbox");
const mainTextInput = document.getElementById("body-textbox");
const addPostButton = document.getElementById("add-post-button");

let titleValid = false;
let bodyValid = false;

addPostButton.disabled = true;
// 페이지 로딩 이벤트

window.onload = function () {};

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

document
  .getElementById("post-add-form")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // 폼 제출 중지
    const title = titleInput.value;
    const body = mainTextInput.value;
    console.log(title);
    addPost(title, body);
    window.location.href = `board.html`;
  });

async function addPost(title, mainText) {
  const modifyPost = {
    id: 0,
    userId: 7,
    title: title,
    body: mainText,
    attachFilePath: "/images/photo/photo_1.jpeg",
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
  });
  if (!response.ok) {
    throw new Error("Failed to modify comment");
  }
  console.log(response);
}

backButton.addEventListener("click", () => {
  window.location.href = "board.html";
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
