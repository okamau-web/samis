const express = require("express");
const router = express.Router();

const { verifyToken } = require("../middleware/auth.middleware");

const {
   getProfile, 
  updateProfile,
  changePassword
 } = require("../controllers/user.controller");

router.get("/profile", verifyToken, getProfile);

router.put("/profile", verifyToken, updateProfile);

router.patch("/change-password", verifyToken, changePassword);



module.exports = router;
