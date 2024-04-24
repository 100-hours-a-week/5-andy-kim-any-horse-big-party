import cv from "./commonVariables.js";
import utils from "./utils.js";

const writeboardButton = document.getElementById("writeboard-button");

function createPostArticle(post) {
  const article = document.createElement("article");
  article.classList.add("container-board");
  article.dataset.postId = post.id; // 데이터 세트 postId를 추가

  const title = document.createElement("description");
  title.classList.add("name");
  title.textContent = post.title;

  const info = document.createElement("div");
  info.classList.add("info");

  const state1 = document.createElement("p");
  state1.classList.add("state");
  state1.textContent = `좋아요 ${post.likes} 댓글 ${post.comments.length} 조회수 ${post.views}`;

  const state2 = document.createElement("p");
  state2.classList.add("state");
  state2.textContent = post.date;

  const line = document.createElement("div");
  line.classList.add("line");

  const writer = document.createElement("div");
  writer.classList.add("writer");
  const image = document.createElement("img");
  image.classList.add("image");
  image.src = post.attachFilePath;
  const writerName = document.createElement("p");
  writerName.classList.add("state");
  writerName.textContent = post.userId;

  info.appendChild(state1);
  info.appendChild(state2);
  writer.appendChild(image);
  writer.appendChild(writerName);
  article.appendChild(title);
  article.appendChild(info);
  article.appendChild(line);
  article.appendChild(writer);
  return article;
}

async function renderPostLists() {
  const postsData = await utils.fetchData(cv.postsURL);
  const container = document.getElementById("wrap");

  postsData.forEach((post) => {
    const article = createPostArticle(post);
    container.appendChild(article);
  });
}

// 페이지 로드 시 실행
window.onload = function () {
  renderPostLists();
};

writeboardButton.addEventListener("click", () => {
  window.location.href = "addPost.html";
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

// container-board class 및 자식 요소를 클릭하면 이벤트 발생
document.addEventListener("click", (event) => {
  const containerBoard = event.target.closest(".container-board");
  if (containerBoard) {
    const postId = containerBoard.dataset.postId; // 클릭된 게시글의 ID 가져오기
    window.location.href = `boardinfo.html?postId=${postId}`; // 게시글 ID를 쿼리 문자열로 전달하여 페이지 이동
  }
});
