const postModel = require("../models/postModel.js");

function getPosts(req, res) {
  const data = postModel.getPosts();
  res.status(200).json(data);
}

function getImage(req, res) {
  const posts = postModel.getPosts();
  const postId = parseInt(req.params.postId);
  const imageFilePath = posts[postId - 1].attachFilePath;
  if (!imageFilePath) {
    res
      .status(200)
      .contentType("image/jpeg") // Content-Type 설정
      .send(postModel.getTempImage()); // 이미지 데이터를 응답
    return;
  }
  const imageFile = postModel.getImage(imageFilePath);

  if (imageFile) {
    res
      .status(200)
      .contentType("image/jpeg") // Content-Type 설정
      .send(imageFile); // 이미지 데이터를 응답
  } else {
    res.status(400).json({ message: "download failed", data: null });
  }
}

async function writePost(req, res) {
  const newPost = req.body;
  const modifyPost = await postModel.addPost(newPost);
  res.status(201).json({ message: "add_post_success", data: modifyPost });
}

function writeComment(req, res) {
  const postId = req.params.postId;
  const newComment = req.body;

  postModel.addComment(postId, newComment);
  res.status(201).json({ message: "add_comment_success", data: newComment });
}

function erasePost(req, res) {
  const postId = req.params.postId;

  postModel.deletePost(postId);
  res.status(200).json({ message: "erase_post_success", data: null });
}

function eraseComment(req, res) {
  const postId = req.params.postId;
  const commentId = req.params.commentId;

  postModel.deleteComment(postId, commentId);
  res.status(200).json({ message: "erase_comment_success", data: null });
}

function patchPost(req, res) {
  const postId = parseInt(req.params.postId);
  const modifyData = req.body;
  const modifyPost = postModel.modifyPost(postId, modifyData);
  res.status(201).json({ message: "modify_post_success", data: modifyPost });
}

function patchComment(req, res) {
  const postId = parseInt(req.params.postId);
  const commentId = parseInt(req.params.commentId);
  const modifyData = req.body;

  postModel.modifyComment(postId, commentId, modifyData);
  res.status(201).json({ message: "modify_comment_success", data: modifyData });
}

function patchImage(req, res) {
  const postId = parseInt(req.params.postId);
  const imageFile = req.file;

  if (imageFile) {
    postModel.addImage(postId, imageFile);
    res.status(200).json({ message: "image_upload_success", data: imageFile });
  } else {
    res.status(400).json({ message: "no file", data: null });
  }
}

module.exports = {
  getPosts,
  getImage,
  writePost,
  writeComment,
  erasePost,
  eraseComment,
  patchPost,
  patchComment,
  patchImage,
};
