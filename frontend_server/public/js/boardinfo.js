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

//
const profileImage = document.getElementById("profile-image");
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
const imageBox = document.getElementById("image-box");

const loading_page = document.getElementById("load");

let commentValid = false;
let nowUserId = 0;
// 페이지 로딩 이벤트
window.onload = async function () {
  loading_page.style.display = "none";
  await utils.checkAuth();
  renderBoardinfo();
};

// renderBoardinfo
async function renderBoardinfo() {
  const posts = await utils.fetchData(cv.postsURL);
  const post = posts[postId - 1];
  const comments = post.comments;

  nowUserId = await fetch(cv.usersURL + `/currentUserId`, {
    credentials: "include",
  })
    .then((response) => response.json())
    .then((data) => {
      return data.userId;
    });

  await fetch(cv.usersURL + `/${nowUserId}/image`, {
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

  if (nowUserId != post.userId) {
    postModifyButton.style.display = "none";
    postDeleteButton.style.display = "none";
  }
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
  window.location.href = `../html/boardinfo.html?postId=${postId}`;
});

async function renderPost(post) {
  await fetch(cv.usersURL + `/${post.userId}/image`, {
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
      image.src = imageUrl; // 이미지의 src 속성에 Blob URL 설정
    });
  title.textContent = post.title;
  postWriter.textContent = post.userId;
  postDate.textContent = post.date;
  await fetch(cv.postsURL + `/${postId}/image`, {
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
      const imageUrl = URL.createObjectURL(blob); // Blob URL 생성
      console.log(imageUrl);
      imageBox.src = imageUrl; // 이미지의 src 속성에 Blob URL 설정
    });
  mainText.textContent = post.body;
  spanLikes.textContent = post.likes;
  spanComments.textContent = post.comments.length;
  commentPostButton.disabled = true;
}

async function renderComment(comment) {
  const wrap = document.createElement("wrap");
  const article = document.createElement("article");
  const image = document.createElement("img");
  const user = document.createElement("p");
  const date = document.createElement("p");
  const body = document.createElement("p");
  const modifyButton = document.createElement("a");
  const deleteButton = document.createElement("a");
  const users = await utils.fetchData(cv.usersURL);

  wrap.classList.add("comment-box");
  article.classList.add("writer");
  article.dataset.commentId = comment.id; // 데이터 세트 commentId를 추가
  image.classList.add("image");
  fetch(cv.usersURL + `/${comment.userId}/image`, {
    credentials: "include",
  })
    .then((response) => {
      if (!response.ok) {
        console.log("fetch error");
      }
      return response.blob(); // 이미지 데이터를 Blob 형식으로 변환
    })
    .then((blob) => {
      const imageUrl = URL.createObjectURL(blob); // Blob URL 생성
      image.src = imageUrl; // 이미지의 src 속성에 Blob URL 설정
    });
  user.classList.add("user");
  user.textContent = users[comment.userId - 1].nickname;
  date.classList.add("date");
  date.textContent = comment.date;
  body.classList.add("comment");
  if (nowUserId == comment.userId) {
    modifyButton.classList.add("modify-button");
    modifyButton.id = `comment-modify-button`;
    modifyButton.textContent = "수정";
    deleteButton.classList.add("delete-button");
    deleteButton.id = `comment-delete-button`;
    deleteButton.textContent = "삭제";
  }
  body.textContent = comment.body;

  article.appendChild(image);
  article.appendChild(user);
  article.appendChild(date);
  if (nowUserId == comment.userId) {
    article.appendChild(modifyButton);
    article.appendChild(deleteButton);
  }
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
  window.location.href = "../html/board.html";
});

postModifyButton.addEventListener("click", () => {
  window.location.href = `../html/modify.html?postId=${postId}`;
});

postDeleteButton.addEventListener("click", () => {
  postModal.classList.remove("hidden");
});

modalAcceptButton.addEventListener("click", () => {
  postModal.classList.add("hidden");
  deletePost();
  window.location.href = "../html/board.html";
});

modalCancleButton.addEventListener("click", () => {
  postModal.classList.add("hidden");
});

commentAcceptButton.addEventListener("click", (event) => {
  const commentId = event.target.dataset.commentId; // 클릭된 게시글의 ID 가져오기
  deleteComment(commentId);
  commentModal.classList.add("hidden");
  window.location.href = `../html/boardinfo.html?postId=${postId}`;
});

commentCancleButton.addEventListener("click", () => {
  commentModal.classList.add("hidden");
});

async function deletePost() {
  const url = cv.postsURL + `/${postId}`;
  const response = await fetch(url, {
    method: "DELETE",
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Failed to delete post");
  }
  console.log(response);
}

async function addComment(comment) {
  const url = cv.postsURL + `/${postId}/comments`;
  const newComment = {
    id: 0,
    userId: nowUserId,
    body: comment,
    date: utils.getCurrentDateTime(),
  };
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newComment),
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Failed to add comment");
  }
  console.log(response);
  // const responseData = await response.json();
  // console.log("New comment added:", responseData);
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
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Failed to modify comment");
  }
  console.log(response);
}

async function deleteComment(commentId) {
  const url = cv.postsURL + `/${postId}/${commentId}`;
  const response = await fetch(url, {
    method: "DELETE",
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Failed to delete comment");
  }
  console.log(response);
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
  window.location.href = "../html/userinfo.html";
});

cv.modifyPasswordButton.addEventListener("click", () => {
  window.location.href = "../html/password.html";
});

cv.logoutButton.addEventListener("click", () => {
  fetch(cv.usersURL + `/logout`, {
    credentials: "include",
  });
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
