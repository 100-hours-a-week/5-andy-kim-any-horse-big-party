const express = require("express");
const postController = require("../controllers/postController.js");
const multer = require("multer");
const auth = require("./auth.js");

const router = express.Router();
const multerStorage = multer.memoryStorage();
const upload = multer({ storage: multerStorage });

router.get("", postController.getPosts);
router.get("/:postId/image", postController.getImage);
router.post("", postController.writePost);
router.post("/:postId/comments", postController.writeComment);
router.delete("/:postId", auth.authPost, postController.erasePost);
router.delete(
  "/:postId/:commentId",
  auth.authComment,
  postController.eraseComment
);
router.patch("/:postId", auth.authPost, postController.patchPost);
router.patch(
  "/:postId/image",
  auth.authPost,
  upload.single("image"),
  postController.patchImage
);
router.patch(
  "/:postId/:commentId",
  auth.authComment,
  postController.patchComment
);

module.exports = router;
