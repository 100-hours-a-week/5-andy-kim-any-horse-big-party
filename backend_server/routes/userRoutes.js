const express = require("express");
const userController = require("../controllers/userController.js");
const multer = require("multer");

const router = express.Router();
const multerStorage = multer.memoryStorage();
const upload = multer({ storage: multerStorage });

router.get("", userController.getUsers);
router.get("/currentUserId", userController.getCurrentUserId);
router.get("/:userId/image", (req, res, next) => {
  // console.log("요청 URL:", req.url);
  // console.log("요청 파라미터:", req.params);
  // console.log("Cookies: ", req.cookies);
  // console.log("Signed Cookies, ", req.signedCookies);
  userController.getImage(req, res, next);
});
router.get("/logout", userController.logout);
router.post(`/login`, userController.login);
router.post("/signup", userController.signup);
router.delete("/:userId", userController.eraseUser);
router.patch("/:userId", userController.patchUser);
router.patch(
  "/:userId/image",
  upload.single("image"),
  userController.patchImage
);

module.exports = router;
