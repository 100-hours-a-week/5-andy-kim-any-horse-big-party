const fs = require("fs");

const postsPath = "public/json/posts.json";
const uploadPath = "public/images/posts";
const tempImagePath = "public/images/white.jpg";

function getIndexFromId(json, id) {
  const index = json.findIndex((data) => data.id == id);
  return index;
}

function getPosts() {
  const postsString = fs.readFileSync(postsPath, "utf8");
  return JSON.parse(postsString);
}

function getImage(imageFilePath) {
  if (imageFilePath) return fs.readFileSync(imageFilePath);
  return null;
}

async function addPost(newPost) {
  const posts = await getPosts();
  const lastPostId = posts.length > 0 ? posts.length : 0;

  newPost.id = lastPostId + 1;
  posts.push(newPost);
  fs.writeFileSync(postsPath, JSON.stringify(posts), "utf8");
  return newPost;
}

async function addComment(postId, newComment) {
  const posts = await getPosts();
  const lastCommentId =
    posts[postId - 1].comments.length > 0
      ? posts[postId - 1].comments.length
      : 0;

  newComment.id = lastCommentId + 1;
  posts[postId - 1].comments.push(newComment);
  fs.writeFileSync(postsPath, JSON.stringify(posts), "utf8");
}

async function addImage(postId, imageFile) {
  const imageFilePath = uploadPath + `/post${postId}image.jpg`;
  const posts = await getPosts();

  posts[postId - 1].attachFilePath = imageFilePath;
  fs.writeFileSync(postsPath, JSON.stringify(posts), "utf8");
  fs.writeFileSync(imageFilePath, imageFile.buffer);
}

function getTempImage() {
  return fs.readFileSync(tempImagePath);
}

async function deletePost(postId) {
  const posts = await getPosts();
  const index = getIndexFromId(posts, postId);

  if (index == -1) {
    console.log(`Post with ID ${postId} not found.`);
    return;
  }
  posts.splice(index, 1);
  for (let i = index; i < posts.length; i++) {
    posts[i].id--;
  }
  fs.writeFileSync(postsPath, JSON.stringify(posts), "utf8");
  return posts;
}

async function deleteComment(postId, commentId) {
  const posts = await getPosts();
  const index = getIndexFromId(posts[postId - 1].comments, commentId);

  if (index == -1) {
    console.log(`Comment with ID ${commentId} not found.`);
    return;
  }
  posts[postId - 1].comments.splice(index, 1);
  for (let i = index; i < posts[postId - 1].comments.length; i++) {
    posts[postId - 1].comments[i].id--;
  }
  fs.writeFileSync(postsPath, JSON.stringify(posts), "utf8");
  return posts[postId - 1].comments;
}

async function modifyPost(postId, modifyData) {
  const posts = await getPosts();

  posts[postId - 1].title = modifyData.title;
  posts[postId - 1].body = modifyData.body;
  posts[postId - 1].date = modifyData.date;
  fs.writeFileSync(postsPath, JSON.stringify(posts), "utf8");
  return posts[postId - 1];
}

async function modifyComment(postId, commentId, modifyData) {
  const posts = await getPosts();

  posts[postId - 1].comments[commentId - 1].body = modifyData.body;
  posts[postId - 1].comments[commentId - 1].data = modifyData.date;
  fs.writeFileSync(postsPath, JSON.stringify(posts), "utf8");
  return posts[postId - 1].comments[commentId - 1];
}

module.exports = {
  getPosts,
  getImage,
  addPost,
  addComment,
  addImage,
  getTempImage,
  deletePost,
  deleteComment,
  modifyPost,
  modifyComment,
};
