import express from "express";
import * as userController from "../controllers/userController.js";
import multer from "multer";

const router = express.Router();
const multerStorage = multer.memoryStorage();
const upload = multer({ storage: multerStorage });

router.get("", userController.getUsers);
router.get("/:userId/image", userController.getImage);
router.post("/signup", userController.signup);
router.delete("/:userId", userController.eraseUser);
router.patch("/:userId", userController.patchUser);
router.patch(
  "/:userId/image",
  upload.single("image"),
  userController.patchImage
);

export default router;
