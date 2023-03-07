const express = require("express");
const {
  getData,
  signUp,
  getAllData,
  login,
  verifyToken,
  updateUser,
  deleteUser,
  emailSend,
  verifyEmail,
  forgotPasword,
  passlink,
  updatePassword,
  resendVerfiEmail,
  getProfileImage,
  updateProfileImg
} = require("../Controllers/userControllers");
const router = express.Router();

const upload = require('../multer')


router.get("/", verifyToken, getData);
router.get("/profile-img",verifyToken,getProfileImage)

router.get("/alldata", verifyToken, getAllData);
router.get("/verify-email/:token", verifyEmail);
router.get("/reset-password/:token", passlink);
router.get("/:token?", passlink);
router.get('/resend-verify-email/:email',resendVerfiEmail)


router.post("/signup", signUp);
router.post("/login", login);
router.post("/forgot-password", forgotPasword); // body email , RESET LINK SEND EMAIL

router.put("/update-profile",verifyToken,updateProfileImg); // body baseUrl , UPDATE PROFILE IMAGE IN DB
router.put("/update", verifyToken, updateUser);
router.put("/reset-password", updatePassword); // body {token & newPassword} , UPDATE DB PASSWORD

router.delete("/delete", verifyToken, deleteUser);
// router.get("/email-send", emailSend);

module.exports = router;
