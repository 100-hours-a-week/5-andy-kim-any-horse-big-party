const postModel = require("../models/postModel.js");

const authenticate = (req, res, next) => {
  if (req.session.userId) {
    // 세션에 사용자 ID가 있으면 다음 미들웨어로 이동
    next();
  } else {
    // 인증되지 않은 사용자는 로그인 페이지로 리다이렉트
    res
      .status(401)
      .json({ message: "unauthorized", redirectTo: "../html/login.html" });
  }
};

const checkAuth = (req, res, next) => {
  if (req.session.userId) {
    res.status(200).send("200 OK");
  } else {
    // 인증되지 않은 사용자는 로그인 페이지로 리다이렉트
    res.status(401).send("unauthorized");
  }
};

const authPost = (req, res, next) => {
  const postId = parseInt(req.params.postId);
  if (!postId)
    return res.status(400).json({ message: "invalid_postId", data: null });

  const posts = postModel.getPosts();
  const post = posts[postId - 1];

  if (!post) {
    return res
      .status(404)
      .json({ message: "cannot_access_to_post", data: null });
  }
  if (!req.session || req.session.userId != post.userId) {
    return res.status(403).json({
      status: 403,
      message: "Unauthorized to modify this post",
      data: null,
    });
  }
  next();
};

const authComment = async (req, res, next) => {
  const postId = parseInt(req.params.postId);
  const commentId = parseInt(req.params.commentId);

  if (!postId)
    return res.status(400).json({ message: "invalid_postId", data: null });
  if (!commentId)
    return res.status(400).json({ message: "invalid_commentId", data: null });

  const posts = await postModel.getPosts();
  const post = posts[postId - 1];
  if (!post) {
    return res
      .status(404)
      .json({ message: "cannot_access_to_post", data: null });
  }

  const comment = post.comments[commentId - 1];
  if (!comment) {
    return res
      .status(404)
      .json({ message: "cannot_access_to_comment", data: null });
  }

  if (!req.session || req.session.userId != comment.userId) {
    return res.status(403).json({
      status: 403,
      message: "Unauthorized to modify this comment",
      data: null,
    });
  }
  next();
};

module.exports = {
  authenticate,
  checkAuth,
  authPost,
  authComment,
};
