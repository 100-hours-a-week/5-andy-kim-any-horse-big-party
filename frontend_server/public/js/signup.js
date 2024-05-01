import cv from "./commonVariables.js";

const backButton = document.getElementById("back-button");
const loginButton = document.getElementById("login-button");
const signupButton = document.getElementById("signup-button");
const emailInput = document.getElementById("email-textbox");
const emailHelperText = document.getElementById("email-helper-text");
const passwordInput = document.getElementById("password-textbox");
const passwordHelperText = document.getElementById("password-helper-text");
const verifyInput = document.getElementById("verify-textbox");
const verifyHelperText = document.getElementById("verify-helper-text");
const nicknameInput = document.getElementById("nickname-textbox");
const nicknameHelperText = document.getElementById("nickname-helper-text");
const signupForm = document.getElementById("signup-form");

let emailValid = false;
let passwordValid = false;
let verifyValid = false;
let nicknameValid = false;

const imageInput = document.getElementById("imageUpload");
const userinfoImage = document.getElementById("image-temp");
const loading_page = document.getElementById("load");
let selectedFile = null;

signupButton.disabled = true;

window.onload = function () {
  loading_page.style.display = "none";
};

emailInput.addEventListener("focusout", () => {
  emailValid = false;
  const email = emailInput.value;
  if (!email) {
    emailHelperText.textContent = "* 이메일을 입력해주세요.";
  } else if (email.length < 8) {
    emailHelperText.textContent = "* 이메일은 8자 이상이어야 합니다.";
  } else if (!isValidEmail(email)) {
    emailHelperText.textContent = "* 유효하지 않은 이메일 형식입니다.";
  } else {
    fetch(cv.usersURL)
      .then((response) => response.json())
      .then((data) => {
        const user = data.find((user) => user.email === email);
        if (user) {
          emailHelperText.textContent = "* 중복된 이메일입니다.";
        } else {
          emailHelperText.textContent = "";
          emailValid = true;
          buttonValid();
        }
      });
  }
});

passwordInput.addEventListener("focusout", () => {
  passwordValid = false;
  const password = passwordInput.value;
  if (!password) {
    passwordHelperText.textContent = "* 비밀번호를 입력해주세요.";
  } else if (password.length < 8 || password.length > 20) {
    passwordHelperText.textContent =
      "* 비밀번호는 8자 이상 20자 이하이어야 합니다.";
  } else if (!isValidPassword(password)) {
    passwordHelperText.textContent = "* 유효하지 않은 비밀번호 형식입니다.";
  } else {
    passwordHelperText.textContent = "";
    passwordValid = true;
    buttonValid();
  }
});

verifyInput.addEventListener("focusout", () => {
  verifyValid = false;
  const verify = verifyInput.value;
  const password = passwordInput.value;
  if (!verify) {
    verifyHelperText.textContent = "* 비밀번호를 한 번 더 입력해주세요.";
  } else if (verify !== password) {
    verifyHelperText.textContent = "* 비밀번호가 다릅니다.";
  } else {
    verifyHelperText.textContent = "";
    verifyValid = true;
    buttonValid();
  }
});

nicknameInput.addEventListener("focusout", () => {
  const nickname = nicknameInput.value;
  nicknameValid = false;
  if (!nickname) {
    nicknameHelperText.textContent = "* 닉네임을 입력하세요.";
  } else if (nickname.length > 10) {
    nicknameHelperText.textContent = "* 닉네임은 10자 이하이어야 합니다.";
  } else if (!isValidNickname(nickname)) {
    nicknameHelperText.textContent = "* 유효하지 않은 닉네임 형식입니다.";
  } else {
    fetch(cv.usersURL)
      .then((response) => response.json())
      .then((data) => {
        const user = data.find((user) => user.nickname === nickname);
        if (user) {
          nicknameHelperText.textContent = "* 중복된 닉네임입니다.";
        } else {
          nicknameHelperText.textContent = "";
          nicknameValid = true;
          buttonValid();
        }
      });
  }
});

function buttonValid() {
  if (emailValid * passwordValid * verifyValid * nicknameValid) {
    signupButton.style.backgroundColor = "#7f6aee";
    signupButton.style.cursor = "pointer";
    signupButton.disabled = false;
  } else {
    signupButton.style.backgroundColor = "#aca0eb";
    signupButton.disabled = true;
  }
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPassword(password) {
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+}{:;'?/.,<>]).+$/;
  return passwordRegex.test(password);
}

function isValidNickname(nickname) {
  const nicknameRegex = /^\S*$/;
  return nicknameRegex.test(nickname);
}
// 이미지 업로드 이벤트

imageInput.addEventListener("change", () => {
  selectedFile = imageInput.files[0];
  const fileReader = new FileReader();

  fileReader.readAsDataURL(selectedFile);
  fileReader.onload = function () {
    userinfoImage.src = fileReader.result;
  };
});

signupForm.addEventListener("submit", function (event) {
  const email = emailInput.value;
  const password = passwordInput.value;
  const nickname = nicknameInput.value;

  event.preventDefault(); // 폼 제출 중지
  addUser(email, password, selectedFile, nickname);
  window.location.href = `../html/login.html`;
});

loginButton.addEventListener(`click`, (event) => {
  event.preventDefault(); // 폼 제출 중지
  window.location.href = `../html/login.html`;
});

async function addUser(email, password, imageFile, nickname) {
  const url = cv.usersURL + `/signup`;
  try {
    // 새로운 사용자 객체 생성
    const newUser = {
      id: 0,
      email: email,
      password: password,
      nickname: nickname,
    };
    // 서버에 새로운 사용자 정보 추가하기
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    });
    if (!response.ok) {
      throw new Error("Failed to add user");
    }
    const jsonData = await response.json();
    if (imageFile) {
      const formData = new FormData();
      formData.append("image", imageFile);
      const imageResponse = await fetch(
        cv.usersURL + `/${jsonData.data.id}/image`,
        {
          method: "PATCH",
          body: formData,
        }
      );
      if (!imageResponse.ok) {
        throw new Error("Failed to upload image");
      }
    }
    console.log("New user added:", jsonData);
  } catch (error) {
    console.error("Error adding user:", error.message);
  }
}

backButton.addEventListener("click", () => {
  window.location.href = "login.html";
});
