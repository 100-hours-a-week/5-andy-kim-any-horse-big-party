import cv from "./commonVariables.js";
import utils from "./utils.js";

const writeboardButton = document.getElementById("writeboard-button");
const profileImage = document.getElementById("profile-image");

const maxLength = 26; // 최대 길이

function createPostArticle(post) {
  const article = document.createElement("article");
  const title = document.createElement("description");
  const info = document.createElement("div");
  const state1 = document.createElement("p");
  const state2 = document.createElement("p");
  const line = document.createElement("div");
  const writer = document.createElement("div");
  const image = document.createElement("img");
  const writerName = document.createElement("p");

  article.classList.add("container-board");
  article.dataset.postId = post.id; // 데이터 세트 postId를 추가
  title.classList.add("name");
  if (post.title.length > maxLength)
    title.textContent = post.title.substring(0, maxLength) + `...`;
  else title.textContent = post.title;
  info.classList.add("info");
  state1.classList.add("state");
  state1.textContent = `좋아요 ${post.likes} 댓글 ${post.comments.length} 조회수 ${post.views}`;
  state2.classList.add("state");
  state2.textContent = post.date;
  line.classList.add("line");
  writer.classList.add("writer");
  image.classList.add("image");
  fetch(cv.usersURL + `/${post.userId}/image`, {
    method: "GET",
  })
    .then((response) => {
      console.log(response);
      return response.blob(); // 이미지 데이터를 Blob 형식으로 변환
    })
    .then((blob) => {
      const imageUrl = URL.createObjectURL(blob); // Blob URL 생성
      if (imageUrl) image.src = imageUrl; // 이미지의 src 속성에 Blob URL 설정
    });
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
  renderPostLists();
};

writeboardButton.addEventListener("click", () => {
  window.location.href = "../html/addPost.html";
});

// container-board class 및 자식 요소를 클릭하면 이벤트 발생
document.addEventListener("click", (event) => {
  const containerBoard = event.target.closest(".container-board");
  if (containerBoard) {
    const postId = containerBoard.dataset.postId; // 클릭된 게시글의 ID 가져오기
    window.location.href = `../html/boardinfo.html?postId=${postId}`; // 게시글 ID를 쿼리 문자열로 전달하여 페이지 이동
  }
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
