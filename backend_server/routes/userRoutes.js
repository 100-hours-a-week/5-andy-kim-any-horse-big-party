const express = require("express");
const userController = require("../controllers/userController.js");
const multer = require("multer");
const auth = require("./auth.js");

const router = express.Router();
const multerStorage = multer.memoryStorage();
const upload = multer({ storage: multerStorage });

router.get("", auth.authenticate, userController.getUsers);
router.get(
  "/currentUserId",
  auth.authenticate,
  userController.getCurrentUserId
);
router.get("/:userId/image", auth.authenticate, userController.getImage);
router.get("/logout", auth.authenticate, userController.logout);
router.post(`/login`, userController.login);
router.post("/signup", auth.authenticate, userController.signup);
router.delete("/:userId", auth.authenticate, userController.eraseUser);
router.patch("/:userId", auth.authenticate, userController.patchUser);
router.patch(
  "/:userId/image",
  auth.authenticate,
  upload.single("image"),
  userController.patchImage
);

module.exports = router;
