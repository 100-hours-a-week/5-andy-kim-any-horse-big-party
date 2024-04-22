// JSON 파일 경로
const usersURL = `http://localhost:3000/users`;
// 회원 모달 관련 변수
const modalUserinfo = document.getElementById("userinfo-modalContainer");
const modifyUserinfoButton = document.getElementById("modify-userinfo-button");
const modifyPasswordButton = document.getElementById("modify-password-button");
const logoutButton = document.getElementById("logout-button");
const profileImageButton = document.getElementById("profile-image");

let isUserModal = false;
// 탈퇴 모달 관련 변수
const modalUserDelete = document.getElementById("modalContainer");
const deleteUserButton = document.getElementById("delete-user-button");
const modalAcceptButton = document.getElementById("user-accept-button");
const modalCancleButton = document.getElementById("user-cancle-button");
// 토스트메세지 변수
const toastContainer = document.getElementById('toast-container');
// 회원정보 폼 관련 변수
const userinfoFormContainer = document.getElementById("userinfo-form");
// 변수 이름 레전드
const userinfoModifyButton = document.getElementById('userinfo-modify-button');
const userMail = document.getElementById("mail-address");
let nicknameValid = true;
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

//페이지 로딩 이벤트

window.onload = function() {
    userinfoModifyButton.disabled = false;
    renderUserinfo();
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

// 회원 탈퇴 이벤트
modalAcceptButton.addEventListener('click', () => {
    deleteUser()
    window.location.href = 'login.html';
});

modalCancleButton.addEventListener('click', () => {
    modalUserDelete.classList.add('hidden');
});

deleteUserButton.addEventListener('click', () => {
    modalUserDelete.classList.remove('hidden');
});

// buttonValid
function deleButtonValid () {
    if (nicknameValid) {
        userinfoModifyButton.style.backgroundColor = '#7f6aee';
        userinfoModifyButton.style.cursor = 'pointer';
        userinfoModifyButton.disabled = false;
    }
    else {
        userinfoModifyButton.style.backgroundColor = '#aca0eb';
        userinfoModifyButton.disabled = true;
    }
}

// modifyUserinfo
async function modifyUserinfo(nickname) {
    const url = `http://localhost:3000/users/${userId}`;
    // try {
        const modifyUser = {
            nickname: nickname
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

// deleteUser
async function deleteUser() {
    const url = `http://localhost:3000/users/${userId}`;
    const response = await fetch(url, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Failed to modify comment');
    }
}

// modiftButtonValid
function modifyButtonValid () {
    if (nicknameValid) {
        userinfoModifyButton.style.backgroundColor = '#7f6aee';
        userinfoModifyButton.style.cursor = 'pointer';
        userinfoModifyButton.disabled = false;
    }
    else {
        userinfoModifyButton.style.backgroundColor = '#aca0eb';
        userinfoModifyButton.disabled = true;
    }
}

// renderUserinfo
async function renderUserinfo() {

    const users = await fetchData(usersURL);
    const user = users[userId - 1];
    const nicknameInput = document.getElementById('nickname-textbox');

    nicknameInput.value = user.nickname;
    userMail.textContent = user.email;
    // const image = document.getElementById('writer-image');
    // image.src = post.attachFilePath;

    nicknameInput.addEventListener('focusout', () => {
        const nickname = nicknameInput.value;
        nicknameValid = false;
        if (nickname)
            nicknameValid = true;
        modifyButtonValid();
    });

    userinfoFormContainer.addEventListener('submit', function(event) {
        const nickname = nicknameInput.value;
        event.preventDefault(); // 폼 제출 중지
        modifyUserinfo(nickname);
        showToast();
    });
}

//showToast

function showToast() {
    toastContainer.style.visibility = 'visible';
  
    setTimeout(() => {
      toastContainer.style.visibility = 'hidden';
    }, 1000); // 3초 후에 토스트 메시지가 사라집니다.
  }
  