const userModel = require("../models/userModel.js");

function getUsers(req, res) {
  const userData = userModel.getUsers();
  res.status(200).json(userData);
  // { message: "get_userdata_success", data: data }
}

function getCurrentUserId(req, res) {
  const userId = req.session.userId; // 세션에서 사용자 ID 가져오기
  console.log(req.session);
  res.status(200).json({ userId });
}

function getImage(req, res) {
  const users = userModel.getUsers();
  const userId = parseInt(req.params.userId);
  const imageFilePath = users[userId - 1].profileImagePath;

  if (!imageFilePath) {
    res
      .status(200)
      .contentType("image/jpeg") // Content-Type 설정
      .send(userModel.getTempImage()); // 이미지 데이터를 응답
    return;
  }
  const imageFile = userModel.getImage(imageFilePath);
  if (imageFile) {
    res
      .status(200)
      .contentType("image/jpeg") // Content-Type 설정
      .send(imageFile); // 이미지 데이터를 응답
  } else {
    res.status(400).json({ message: "download failed", data: null });
  }
}

async function login(req, res) {
  const loginData = req.body;
  const userData = await userModel.getUsers();
  const user = userData.find(
    (user) =>
      user.email === loginData.email && user.password === loginData.password
  );

  if (user) {
    req.session.userId = user.id; // 세션에 사용자 정보 저장
    res
      .status(200)
      .json({ message: "Login successful", redirectTo: "../html/board.html" });
  } else {
    res.status(200).json({ message: "Login failed" });
  }
}

function logout(req, res) {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      res.status(500).send("Internal Server Error");
    } else {
      res.clearCookie("connect.sid");
      res.send("Logged out successfully");
    }
  });
}

async function signup(req, res) {
  const newUser = req.body;
  const newUserData = await userModel.addUser(newUser);

  if (newUserData) {
    res.status(201).json({ message: "register_success", data: newUserData });
  } else {
    res.status(500).json({ message: "internal_server_error", data: null });
  }
}

function eraseUser(req, res) {
  const userId = req.params.userId;
  userModel.deleteUser(userId);
  res.status(200).json({ message: "erase_userdata_success", data: userId });
}

function patchUser(req, res) {
  const userId = parseInt(req.params.userId);
  const modifyData = req.body;

  userModel.modifyUser(userId, modifyData);
  res.status(201).json({ message: "patch_userinfo_success", data: modifyData });
}

function patchImage(req, res) {
  const userId = parseInt(req.params.userId);
  const imageFile = req.file;

  if (imageFile) {
    userModel.addImage(userId, imageFile);
    res.status(200).json({ message: "image_upload_success", data: imageFile });
  } else {
    res.status(400).json({ message: "no file", data: null });
  }
}

module.exports = {
  getUsers,
  getImage,
  getCurrentUserId,
  logout,
  login,
  signup,
  eraseUser,
  patchUser,
  patchImage,
};
