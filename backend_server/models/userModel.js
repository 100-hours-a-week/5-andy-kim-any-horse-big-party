import fs from "fs";

const usersPath = "public/json/users.json";
const uploadPath = "public/images/users";
const tempImagePath = "public/images/profile_img.webp";

function getIndexFromId(json, id) {
  const index = json.findIndex((data) => data.id == id);
  return index;
}

export function getUsers() {
  const usersString = fs.readFileSync(usersPath, "utf8");
  return JSON.parse(usersString);
}

export function getImage(imageFilePath) {
  if (imageFilePath) return fs.readFileSync(imageFilePath);
  return null;
}

export function getTempImage() {
  return fs.readFileSync(tempImagePath);
}

export async function addUser(newUser) {
  const users = await getUsers();
  const lastUserId = users.length > 0 ? users[users.length - 1].id : 0;
  newUser.id = lastUserId + 1;
  users.push(newUser);
  fs.writeFileSync(usersPath, JSON.stringify(users), "utf8");
  return newUser;
}

export async function addImage(userId, imageFile) {
  const imageFilePath = uploadPath + `/user${userId}image.jpg`;
  const users = await getUsers();

  users[userId - 1].profileImagePath = imageFilePath;
  fs.writeFileSync(usersPath, JSON.stringify(users), "utf8");
  fs.writeFileSync(imageFilePath, imageFile.buffer);
}

export async function deleteUser(userId) {
  const users = await getUsers();
  const index = getIndexFromId(users, userId);

  if (index == -1) {
    console.log(`User with ID ${userId} not found.`);
    return;
  }
  users.splice(index, 1);
  for (let i = index; i < users.length; i++) {
    users[i].id--;
  }
  fs.writeFileSync(usersPath, JSON.stringify(users), "utf8");
  return users;
}

export async function modifyUser(userId, modifyData) {
  const users = await getUsers();
  const modifyNickname = modifyData.nickname;
  const modifyPassword = modifyData.password;
  const modifyImage = modifyData.imageFile;

  if (modifyNickname) users[userId - 1].nickname = modifyNickname;
  if (modifyPassword) users[userId - 1].password = modifyPassword;
  if (modifyImage) {
    const imageFilePath = await addImage(userId, modifyImage);
    users[userId - 1].profileImagePath = imageFilePath;
  }
  fs.writeFileSync(usersPath, JSON.stringify(users), "utf8");
  return users[userId - 1];
}
