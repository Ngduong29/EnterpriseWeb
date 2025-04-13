const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const auth = require("../middleware/auth");

// Public routes
router.post("/register/student", authController.registerStudent);
router.post("/register/tutor", authController.registerTutor);
router.post("/login", authController.loginUser);

// Protected routes
router.get("/profile", auth, authController.fetchUserProfile);
router.put("/profile", auth, authController.updateUserProfile);
router.put("/password", auth, authController.updatePassword);

module.exports = router; 