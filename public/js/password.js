// JSON 파일 경로
const modalUserinfo = document.getElementById("userinfo-modalContainer");
// 회원 모달 관련 변수
const modifyUserinfoButton = document.getElementById("modify-userinfo-button");
const modifyPasswordButton = document.getElementById("modify-password-button");
const logoutButton = document.getElementById("logout-button");
const profileImageButton = document.getElementById("profile-image");

let isUserModal = false;

// 비밀번호 변경
const passwordFormContainer = document.getElementById("password-form");
const passwordModifyButton = document.getElementById('password-modify-button');
const passwordInput = document.getElementById("password-textbox");
const verifyInput = document.getElementById("verify-textbox");

let passwordValid = false;
let verifyValid = false;
// 유효성 검사
const passwordHelperText = document.getElementById('password-helper-text');
const verifyHelperText = document.getElementById('verify-helper-text');

// 토스트메세지 변수
const toastContainer = document.getElementById('toast-container');

// id를 전역에서 선언할 때와 렌더할 때 선언했을 때 비교하기
const userId = 1;


// fetchData
async function fetchData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// 페이지 로딩 이벤트
window.onload = function() {
    passwordModifyButton.disabled = false;
};

//회원정보 수정 이벤트
modifyUserinfoButton.addEventListener('mouseover', () => {
    modifyUserinfoButton.style.cursor = 'pointer';
    modifyUserinfoButton.style.backgroundColor = "#e9e9e9";
});
modifyUserinfoButton.addEventListener('mouseout', () => {
    modifyUserinfoButton.style.backgroundColor = "#d9d9d9";
});
modifyUserinfoButton.addEventListener('click', () => {
    window.location.href = 'userinfo.html';
});

modifyPasswordButton.addEventListener('mouseover', () => {
    modifyPasswordButton.style.cursor = 'pointer';
    modifyPasswordButton.style.backgroundColor = "#e9e9e9";
});
modifyPasswordButton.addEventListener('mouseout', () => {
    modifyPasswordButton.style.backgroundColor = "#d9d9d9";
});
modifyPasswordButton.addEventListener('click', () => {
    window.location.href = 'password.html';
});

logoutButton.addEventListener('mouseover', () => {
    logoutButton.style.cursor = 'pointer';
    logoutButton.style.backgroundColor = "#e9e9e9";
});
logoutButton.addEventListener('mouseout', () => {
    logoutButton.style.backgroundColor = "#d9d9d9";
});
logoutButton.addEventListener('click', () => {
    window.location.href = 'login.html';
});

profileImageButton.addEventListener('click', () => {
    if (isUserModal) {
        isUserModal = false;
        modalUserinfo.classList.add('hidden');
    }
    else {
        isUserModal = true;
        modalUserinfo.classList.remove('hidden');
    }
});

// 유효성 검사
function deleteButtonValid () {
    if (passwordValid * verifyValid) {
        passwordModifyButton.style.backgroundColor = '#7f6aee';
        passwordModifyButton.style.cursor = 'pointer';
        passwordModifyButton.disabled = false;
    }
    else {
        passwordModifyButton.style.backgroundColor = '#aca0eb';
        passwordModifyButton.disabled = true;
    }
}

function isValidPassword(password) {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+}{:;'?/.,<>]).+$/;
    return passwordRegex.test(password);
}

// modifyPassword
async function modifyPassword(password) {
    const url = `http://localhost:3000/users/${userId}`;
    const modifyUser = {
        password: password
    }
    const response = await fetch(url, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(modifyUser)
    });
    if (!response.ok) {
        throw new Error('Failed to modify comment');
    }
}
// 유효성 검사
passwordInput.addEventListener('focusout', () => {
    passwordValid = false;
    const password = passwordInput.value;
    if (!password) {
        passwordHelperText.textContent = "* 비밀번호를 입력해주세요.";
    } else if (password.length < 8 || password.length > 20) {
        passwordHelperText.textContent = "* 비밀번호는 8자 이상 20자 이하이어야 합니다.";
    } else if (!isValidPassword(password)) {
        passwordHelperText.textContent = "* 유효하지 않은 비밀번호 형식입니다.";
    } else {
        passwordHelperText.textContent = "";
        passwordValid = true;
        deleteButtonValid()
    }
});
verifyInput.addEventListener('focusout', () => {
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
        deleteButtonValid()
    }
});

passwordFormContainer.addEventListener('submit', function(event) {
    const password = passwordInput.value;
    event.preventDefault(); // 폼 제출 중지
    modifyPassword(password);
    showToast();
});

function showToast() {
    toastContainer.style.visibility = 'visible';
  
    setTimeout(() => {
      toastContainer.style.visibility = 'hidden';
    }, 1000); // 3초 후에 토스트 메시지가 사라집니다.
}
  
