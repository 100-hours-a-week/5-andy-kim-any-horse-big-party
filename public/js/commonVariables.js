// url
const usersURL = `http://localhost:3000/users`;
const postsURL = `http://localhost:3000/posts`;

// 회원 모달 관련 변수
const modalUserinfo = document.getElementById("userinfo-modalContainer");
const modifyUserinfoButton = document.getElementById("modify-userinfo-button");
const modifyPasswordButton = document.getElementById("modify-password-button");
const logoutButton = document.getElementById("logout-button");
const profileImageButton = document.getElementById("profile-image");

let isUserModal = false;
// 토스트메세지
const toastContainer = document.getElementById("toast-container");

export default {
  usersURL,
  postsURL,
  modalUserinfo,
  modifyUserinfoButton,
  modifyPasswordButton,
  logoutButton,
  profileImageButton,
  isUserModal,
  toastContainer,
};
