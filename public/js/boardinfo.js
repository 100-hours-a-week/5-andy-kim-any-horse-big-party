// 회원 모달 관련 변수
const modalUserinfo = document.getElementById("userinfo-modalContainer");
const modifyUserinfoButton = document.getElementById("modify-userinfo-button");
const modifyPasswordButton = document.getElementById("modify-password-button");
const logoutButton = document.getElementById("logout-button");
const profileImageButton = document.getElementById("profile-image");

let isUserModal = false;
//
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

let isModifyComment = false;
let tempCommentId = -1;

// JSON 파일 경로
const postsURL = `http://localhost:3000/posts`;

// JSON 파일을 가져오고 처리하는 함수
async function fetchData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

//회원정보 수정 이벤트
modifyUserinfoButton.addEventListener("mouseover", () => {
  modifyUserinfoButton.style.cursor = "pointer";
  modifyUserinfoButton.style.backgroundColor = "#e9e9e9";
});
modifyUserinfoButton.addEventListener("mouseout", () => {
  modifyUserinfoButton.style.backgroundColor = "#d9d9d9";
});
modifyUserinfoButton.addEventListener("click", () => {
  window.location.href = "userinfo.html";
});

modifyPasswordButton.addEventListener("mouseover", () => {
  modifyPasswordButton.style.cursor = "pointer";
  modifyPasswordButton.style.backgroundColor = "#e9e9e9";
});
modifyPasswordButton.addEventListener("mouseout", () => {
  modifyPasswordButton.style.backgroundColor = "#d9d9d9";
});
modifyPasswordButton.addEventListener("click", () => {
  window.location.href = "password.html";
});

logoutButton.addEventListener("mouseover", () => {
  logoutButton.style.cursor = "pointer";
  logoutButton.style.backgroundColor = "#e9e9e9";
});
logoutButton.addEventListener("mouseout", () => {
  logoutButton.style.backgroundColor = "#d9d9d9";
});
logoutButton.addEventListener("click", () => {
  window.location.href = "login.html";
});

profileImageButton.addEventListener("click", () => {
  if (isUserModal) {
    isUserModal = false;
    modalUserinfo.classList.add("hidden");
  } else {
    isUserModal = true;
    modalUserinfo.classList.remove("hidden");
  }
});

async function renderPost() {
  //fetch요청으로 조회수 더해주는 로직 작성
  const posts = await fetchData(postsURL);

  const post = posts[postId - 1];
  const comments = post.comments;

  const title = document.getElementById("boardinfo-header");
  title.textContent = post.title;

  const image = document.getElementById("writer-image");
  image.src = post.attachFilePath;

  const postWriter = document.getElementById("post-writer");
  postWriter.textContent = post.userId;

  const postDate = document.getElementById("post-date");
  postDate.textContent = post.date;

  const mainText = document.getElementById("board-main");
  mainText.textContent = post.body;

  const spanLikes = document.getElementById("likes");
  spanLikes.textContent = post.likes;

  const spanComments = document.getElementById("comments");
  spanComments.textContent = post.comments.length;

  const commentInput = document.getElementById("textbox");
  const commentPostButton = document.getElementById("comment-post-button");
  commentPostButton.disabled = true;
  let commentValid = false;

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

  commentInput.addEventListener("focusout", () => {
    const comment = commentInput.value;
    commentValid = false;
    if (comment) commentValid = true;
    console.log(commentValid);
    commentButtonValid();
  });

  document
    .getElementById("comment-post-form")
    .addEventListener("submit", function (event) {
      event.preventDefault(); // 폼 제출 중지
      const comment = commentInput.value;
      if (isModifyComment) modifyComment(comment, tempCommentId);
      else addComment(comment);
      window.location.href = `boardinfo.html?postId=${postId}`;
    });

  function getCurrentDateTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  async function addComment(comment) {
    const url = `http://localhost:3000/posts/${postId}/comments`;
    console.log(url);
    // try {
    const newComment = {
      id: 0,
      userId: 7,
      body: comment,
      date: getCurrentDateTime(),
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
    // }
    //  catch (error) {
    //     console.error('Error adding user:', error.message);
    // }
  }

  async function modifyComment(comment) {
    const url = `http://localhost:3000/posts/${postId}/${tempCommentId}`;
    console.log(url);
    // try {
    const modifyComment = {
      body: comment,
      date: getCurrentDateTime(),
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
    // 응답이 modify json data를 반환하도록 수정하면 사용
    // const responseData = await response.json();
    // console.log('Comment modified:', responseData);
    // }
    //  catch (error) {
    //     console.error('Error adding user:', error.message);
    // }
  }

  comments.forEach((comment) => {
    const container = document.getElementById("container-boardinfo");
    const wrap = document.createElement("wrap");
    wrap.classList.add("comment-box");

    const article = document.createElement("article");
    article.classList.add("writer");
    article.dataset.commentId = comment.id; // 데이터 세트 commentId를 추가

    const image = document.createElement("img");
    image.classList.add("image");
    // image.src = 유저 찾아가서 프로필 이미지 띄우기
    image.src = "../images/profile_img.webp";

    const user = document.createElement("p");
    user.classList.add("user");
    user.textContent = "더미 사용자 " + comment.userId;
    // user.textContent = 유저 찾아가서 닉네임 띄우기

    const date = document.createElement("p");
    date.classList.add("date");
    date.textContent = comment.date;

    const body = document.createElement("p");
    body.classList.add("comment");

    const modifyButton = document.createElement("a");
    modifyButton.classList.add("modify-button");
    modifyButton.textContent = "수정";

    const deleteButton = document.createElement("a");
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
  console.log(commentId);
  deleteComment(commentId);
  commentModal.classList.add("hidden");
  window.location.href = `boardinfo.html?postId=${postId}`;
});

commentCancleButton.addEventListener("click", () => {
  commentModal.classList.add("hidden");
});

window.onload = function () {
  renderPost();
};

async function deletePost() {
  const url = `http://localhost:3000/posts/${postId}`;
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

async function deleteComment(commentId) {
  const url = `http://localhost:3000/posts/${postId}/${commentId}`;
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
