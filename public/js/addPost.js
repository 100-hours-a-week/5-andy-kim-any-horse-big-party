const backButton = document.getElementById("back-button");
const urlParams = new URLSearchParams(window.location.search);
const titleInput = document.getElementById('title-textbox');
const mainTextInput = document.getElementById('body-textbox');
const addPostButton = document.getElementById('add-post-button');
let titleValid = false;
let bodyValid = false;
addPostButton.disabled = true;
// 회원 모달 관련 변수
const modalUserinfo = document.getElementById("userinfo-modalContainer");
const modifyUserinfoButton = document.getElementById("modify-userinfo-button");
const modifyPasswordButton = document.getElementById("modify-password-button");
const logoutButton = document.getElementById("logout-button");
const profileImageButton = document.getElementById("profile-image");

let isUserModal = false;

// 페이지 로딩 이벤트

window.onload = function() {
    console.log(titleValid);
};

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

function getCurrentDateTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}


function addButtonValid () {
    if (titleValid * bodyValid) {
        addPostButton.style.backgroundColor = '#7f6aee';
        addPostButton.style.cursor = 'pointer';
        addPostButton.disabled = false;
    }
    else {
        addPostButton.style.backgroundColor = '#aca0eb';
        addPostButton.disabled = true;
    }
}

titleInput.addEventListener('focusout', () => {
    const title = titleInput.value;
    console.log(title);
    titleValid = false;
    if (title)
        titleValid = true;
    addButtonValid();
});

mainTextInput.addEventListener('focusout', () => {
    const body = mainTextInput.value;
    bodyValid = false;
    if (body)
        bodyValid = true;
    console.log(body);
    addButtonValid();
});

document.getElementById("post-add-form").addEventListener('submit', function(event) {
    event.preventDefault(); // 폼 제출 중지
    const title = titleInput.value;
    const body = mainTextInput.value
    console.log(title);
    addPost(title, body);
    window.location.href = `board.html`
});

async function addPost(title, mainText) {
    const url = `http://localhost:3000/posts`;
    // try {
        const modifyPost = {
            id: 0,
            userId: 7,
            title: title,
            body: mainText,
            "attachFilePath": "/images/photo/photo_1.jpeg",
            likes:0,
            comments:[],
            views:0,
            date: getCurrentDateTime(),  
        }
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(modifyPost)
        });
        if (!response.ok) {
            throw new Error('Failed to modify comment');
        }
        console.log(response);
}

backButton.addEventListener('click', () => {
    window.location.href = 'board.html';
});


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
