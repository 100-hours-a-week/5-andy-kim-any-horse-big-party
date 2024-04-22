// JSON 파일 경로
const postsURL = `http://localhost:3000/posts`;
const modalUserinfo = document.getElementById("userinfo-modalContainer");
//회원정보 수정 관련 변수
const modifyUserinfoButton = document.getElementById("modify-userinfo-button");
const modifyPasswordButton = document.getElementById("modify-password-button");
const logoutButton = document.getElementById("logout-button");
const profileImageButton = document.getElementById("profile-image");

let isModal = false;

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

const writeboardButton = document.getElementById("writeboard-button");

async function renderPostLists() {
  const postsData = await fetchData(postsURL);

  const container = document.getElementById("wrap");

  postsData.forEach((post) => {
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

    container.appendChild(article);
  });
}

// 페이지 로드 시 실행
window.onload = function () {
  renderPostLists();
};

// 마우스 호버 이벤트
writeboardButton.addEventListener("mouseover", () => {
  writeboardButton.style.cursor = "pointer";
  writeboardButton.style.backgroundColor = "#7f6aee";
});
writeboardButton.addEventListener("mouseout", () => {
  writeboardButton.style.backgroundColor = "#aca0eb";
});
writeboardButton.addEventListener("click", () => {
  window.location.href = "addPost.html";
});

// 회원정보 수정 관련 이벤트
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
  window.location.href = "signup.html";
});

profileImageButton.addEventListener("click", () => {
  if (isModal) {
    isModal = false;
    modalUserinfo.classList.add("hidden");
  } else {
    isModal = true;
    modalUserinfo.classList.remove("hidden");
  }
});

document.addEventListener("click", (event) => {
  if (event.target.classList.contains("container-board")) {
    const postId = event.target.dataset.postId; // 클릭된 게시글의 ID 가져오기
    window.location.href = `boardinfo.html?postId=${postId}`; // 게시글 ID를 쿼리 문자열로 전달하여 페이지 이동
  }
});
