import cv from "./commonVariables.js";
import utils from "./utils.js";

const backButton = document.getElementById("back-button");
const postModifyButton = document.getElementById("post-modify-button");
const postDeleteButton = document.getElementById("post-delete-button");
const postModal = document.getElementById("modalContainer");
const commentModal = document.getElementById("comment-modalContainer");
const modalAcceptButton = document.getElementById("post-accept-button");
const modalCancleButton = document.getElementById("post-cancle-button");
const commentAcceptButton = document.getElementById("comment-accept-button");
const commentCancleButton = document.getElementById("comment-cancle-button");

const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get("postId"); // URL에서 게시글 ID 가져오기
//comment
const commentForm = document.getElementById("comment-post-form");
const container = document.getElementById("container-boardinfo");

//renderPost
const title = document.getElementById("boardinfo-header");
const image = document.getElementById("writer-image");
const postWriter = document.getElementById("post-writer");
const postDate = document.getElementById("post-date");
const mainText = document.getElementById("board-main");
const spanLikes = document.getElementById("likes");
const spanComments = document.getElementById("comments");
const commentPostButton = document.getElementById("comment-post-button");

let isModifyComment = false;
let tempCommentId = -1;
//renderComment
const commentInput = document.getElementById("textbox");

let commentValid = false;

// 페이지 로딩 이벤트
window.onload = function () {
  renderBoardinfo();
};

// renderBoardinfo
async function renderBoardinfo() {
  const posts = await utils.fetchData(cv.postsURL);
  const post = posts[postId - 1];
  const comments = post.comments;

  renderPost(post);

  commentInput.addEventListener("focusout", () => {
    const comment = commentInput.value;
    commentValid = false;
    if (comment) commentValid = true;
    commentButtonValid();
  });

  comments.forEach((comment) => {
    renderComment(comment);
  });
}

commentForm.addEventListener("submit", (event) => {
  event.preventDefault(); // 폼 제출 중지
  const comment = commentInput.value;
  if (isModifyComment) modifyComment(comment, tempCommentId);
  else addComment(comment);
  window.location.href = `boardinfo.html?postId=${postId}`;
});

function renderPost(post) {
  title.textContent = post.title;
  image.src = post.attachFilePath;
  postWriter.textContent = post.userId;
  postDate.textContent = post.date;
  mainText.textContent = post.body;
  spanLikes.textContent = post.likes;
  spanComments.textContent = post.comments.length;
  commentPostButton.disabled = true;
}

function renderComment(comment) {
  const wrap = document.createElement("wrap");
  const article = document.createElement("article");
  const image = document.createElement("img");
  const user = document.createElement("p");
  const date = document.createElement("p");
  const body = document.createElement("p");
  const modifyButton = document.createElement("a");
  const deleteButton = document.createElement("a");

  wrap.classList.add("comment-box");
  article.classList.add("writer");
  article.dataset.commentId = comment.id; // 데이터 세트 commentId를 추가
  image.classList.add("image");
  image.src = "../images/profile_img.webp"; // 수정 요망
  user.classList.add("user");
  user.textContent = "더미 사용자 " + comment.userId;
  date.classList.add("date");
  date.textContent = comment.date;
  body.classList.add("comment");
  modifyButton.classList.add("modify-button");
  modifyButton.textContent = "수정";
  deleteButton.classList.add("delete-button");
  deleteButton.textContent = "삭제";
  body.textContent = comment.body;

  article.appendChild(image);
  article.appendChild(user);
  article.appendChild(date);
  article.appendChild(modifyButton);
  article.appendChild(deleteButton);
  wrap.appendChild(article);
  wrap.appendChild(body);
  container.appendChild(wrap);

  modifyButton.addEventListener("click", () => {
    if (isModifyComment) {
      commentPostButton.textContent = "댓글 작성";
      commentInput.value = "";
      isModifyComment = false;
    } else {
      commentPostButton.textContent = "댓글 수정";
      commentInput.value = comment.body;
      tempCommentId = comment.id;
      isModifyComment = true;
    }
  });
  deleteButton.addEventListener("click", () => {
    commentModal.classList.remove("hidden");
    commentAcceptButton.dataset.commentId = comment.id; // 데이터 세트 commentId를 추가
  });
}

backButton.addEventListener("click", () => {
  window.location.href = "board.html";
});

postModifyButton.addEventListener("click", () => {
  window.location.href = `modify.html?postId=${postId}`;
});

postDeleteButton.addEventListener("click", () => {
  postModal.classList.remove("hidden");
});

modalAcceptButton.addEventListener("click", () => {
  postModal.classList.add("hidden");
  deletePost();
  window.location.href = "board.html";
});

modalCancleButton.addEventListener("click", () => {
  postModal.classList.add("hidden");
});

commentAcceptButton.addEventListener("click", (event) => {
  const commentId = event.target.dataset.commentId; // 클릭된 게시글의 ID 가져오기
  deleteComment(commentId);
  commentModal.classList.add("hidden");
  window.location.href = `boardinfo.html?postId=${postId}`;
});

commentCancleButton.addEventListener("click", () => {
  commentModal.classList.add("hidden");
});

async function deletePost() {
  const url = cv.postsURL + `/${postId}`;
  try {
    const response = await fetch(url, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete post");
    }
  } catch (error) {
    console.error("Error deleting post:", error.message);
  }
}

async function addComment(comment) {
  const url = cv.postsURL + `/${postId}/comments`;
  const newComment = {
    id: 0,
    userId: 7,
    body: comment,
    date: utils.getCurrentDateTime(),
  };
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newComment),
  });
  if (!response.ok) {
    throw new Error("Failed to add comment");
  }
  const responseData = await response.json();
  console.log("New comment added:", responseData);
}

async function modifyComment(comment, tempCommentId) {
  const url = cv.postsURL + `/${postId}/${tempCommentId}`;
  const modifyComment = {
    body: comment,
    date: utils.getCurrentDateTime(),
  };
  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(modifyComment),
  });
  if (!response.ok) {
    throw new Error("Failed to modify comment");
  }
}

async function deleteComment(commentId) {
  const url = cv.postsURL + `/${postId}/${commentId}`;
  try {
    const response = await fetch(url, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete comment");
    }
  } catch (error) {
    console.error("Error deleting comment:", error.message);
  }
}

function commentButtonValid() {
  if (commentValid) {
    commentPostButton.style.backgroundColor = "#7f6aee";
    commentPostButton.style.cursor = "pointer";
    commentPostButton.disabled = false;
  } else {
    commentPostButton.style.backgroundColor = "#aca0eb";
    commentPostButton.disabled = true;
  }
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
