const loginButton = document.getElementById("login-button");
const signupButton = document.getElementById("signup-button");

// 토스트메세지 변수
const toastContainer = document.getElementById("toast-container");

document
  .getElementById("loginForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // 폼 제출 중지
    const email = document.getElementById("email-textbox").value;
    const password = document.getElementById("password-textbox").value;

    fetch("http://localhost:3000/users")
      .then((response) => response.json())
      .then((data) => {
        const user = data.find(
          (user) => user.email === email && user.password === password
        );
        if (user) {
          // 로그인 성공
          loginButton.style.backgroundColor = "#7f6aee";
          setTimeout(() => {
            window.location.href = "board.html";
          }, 3000);
        } else {
          showToast();
        }
      });
  });

signupButton.addEventListener("click", () => {
  window.location.href = "signup.html";
});

function showToast() {
  toastContainer.style.visibility = "visible";

  setTimeout(() => {
    toastContainer.style.visibility = "hidden";
  }, 1000); // 3초 후에 토스트 메시지가 사라집니다.
}
