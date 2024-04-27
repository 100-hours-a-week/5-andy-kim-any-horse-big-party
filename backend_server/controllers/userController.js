import * as userModel from "../models/userModel.js";

export function getUsers(req, res) {
  const data = userModel.getUsers();
  res.status(200).json(data);
  // { message: "get_userdata_success", data: data }
}

export function getImage(req, res) {
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

export async function signup(req, res) {
  const newUser = req.body;
  const data = await userModel.addUser(newUser);

  if (data) {
    res.status(201).json({ message: "register_success", data: data });
  } else {
    res.status(500).json({ message: "internal_server_error", data: null });
  }
}

export function eraseUser(req, res) {
  const userId = req.params.userId;
  userModel.deleteUser(userId);
  res.status(200).json({ message: "erase_userdata_success", data: userId });
}

export function patchUser(req, res) {
  const userId = parseInt(req.params.userId);
  const modifyData = req.body;

  userModel.modifyUser(userId, modifyData);
  res.status(201).json({ message: "patch_userinfo_success", data: modifyData });
}

export function patchImage(req, res) {
  const userId = parseInt(req.params.userId);
  const imageFile = req.file;

  if (imageFile) {
    userModel.addImage(userId, imageFile);
    res.status(200).json({ message: "image_upload_success", data: imageFile });
  } else {
    res.status(400).json({ message: "no file", data: null });
  }
}
