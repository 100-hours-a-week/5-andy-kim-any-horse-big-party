// 회원 모달 관련 변수
const modalUserinfo = document.getElementById("userinfo-modalContainer");
const modifyUserinfoButton = document.getElementById("modify-userinfo-button");
const modifyPasswordButton = document.getElementById("modify-password-button");
const logoutButton = document.getElementById("logout-button");
const profileImageButton = document.getElementById("profile-image");

let isUserModal = false;
//
const backButton = document.getElementById("back-button");
//
const urlParams = new URLSearchParams(window.location.search);
const postsURL = `http://localhost:3000/posts`;
const postId = urlParams.get('postId'); // URL에서 게시글 ID 가져오기
let titleValid = true;
let bodyValid = true;

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
//

window.onload = function() {
    renderModifyPost();
};

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

async function renderModifyPost() {
    const posts = await fetchData(postsURL);
    const post = posts[postId - 1];
    const titleInput = document.getElementById('title-textbox');
    const mainTextInput = document.getElementById('body-textbox');

    console.log(post.title);
    titleInput.value = post.title;
    mainTextInput.value = post.body;

    // const image = document.getElementById('writer-image');
    // image.src = post.attachFilePath;

    const postModifyButton = document.getElementById('post-modify-button');
    postModifyButton.disabled = false;

    function modifyButtonValid () {
        if (titleValid * bodyValid) {
            postModifyButton.style.backgroundColor = '#7f6aee';
            postModifyButton.style.cursor = 'pointer';
            postModifyButton.disabled = false;
        }
        else {
            postModifyButton.style.backgroundColor = '#aca0eb';
            postModifyButton.disabled = true;
        }
    }

    titleInput.addEventListener('focusout', () => {
        const title = titleInput.value;
        titleValid = false;
        if (title)
            titleValid = true;
        modifyButtonValid();
    });

    mainTextInput.addEventListener('focusout', () => {
        const body = mainTextInput.value;
        bodyValid = false;
        if (body)
            bodyValid = true;
        modifyButtonValid();
    });

    document.getElementById("post-modify-form").addEventListener('submit', function(event) {
        const title = titleInput.value;
        const body = mainTextInput.value
        event.preventDefault(); // 폼 제출 중지
        modifyPost(title, body);
        window.location.href = `boardinfo.html?postId=${postId}`
    });

    async function modifyPost(title, mainText) {
        const url = `http://localhost:3000/posts/${postId}`;
            const modifyPost = {
                title: title,
                body: mainText,
                date: getCurrentDateTime(),  
            }
            const response = await fetch(url, {
                method: 'PATCH',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(modifyPost)
            });
            if (!response.ok) {
                throw new Error('Failed to modify comment');
            }
    }
    
}

backButton.addEventListener('click', () => {
    window.location.href = `boardinfo.html?postId=${postId}`;
});
