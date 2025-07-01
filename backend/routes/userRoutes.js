const express = require("express");
const router = express.Router();

const { upload } = require("../utils/cloudinary")
// Configuration du middleware d'upload (réutilisable)
const uploadImage = upload.single('image');
const {
  createUser,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser, 
  getMe,
  updateMe,
  getUserProfile
  
 
} = require("../Controller/userController");
const { signup ,login , protectionMW, howCanDo , logout ,forgotPassword,resetPassword} = require("../Controller/authController");
router.post("/logout", logout);
router.route("/signup").post(signup);
router.route("/login").post(login);
router.post('/forgot-password', forgotPassword);
router.post("/reset-password/",resetPassword);
router.get('/me', protectionMW, getMe);
router.patch("/updateMe", protectionMW, upload.single("profilePic"), updateMe);
router.route("/").post(protectionMW, createUser).get(protectionMW, getAllUsers);
router.get('/condidat/:id', getUserProfile);
router
  .route("/:id")
  .get(protectionMW, howCanDo("admin"), getUserById)
  .patch(protectionMW, updateUser , howCanDo("admin") )
  .delete(protectionMW, howCanDo("admin"), deleteUser);
module.exports = router;