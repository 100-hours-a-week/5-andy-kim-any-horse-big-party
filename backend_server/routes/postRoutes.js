import express from "express";
import * as postController from "../controllers/postController.js";
import multer from "multer";

const router = express.Router();
const multerStorage = multer.memoryStorage();
const upload = multer({ storage: multerStorage });

router.get("", postController.getPosts);
router.get("/:postId/image", postController.getImage);
router.post("", postController.writePost);
router.post("/:postId/comments", postController.writeComment);
router.delete("/:postId", postController.erasePost);
router.delete("/:postId/:commentId", postController.eraseComment);
router.patch("/:postId", postController.patchPost);
router.patch(
  "/:postId/image",
  upload.single("image"),
  postController.patchImage
);
router.patch("/:postId/:commentId", postController.patchComment);

export default router;
