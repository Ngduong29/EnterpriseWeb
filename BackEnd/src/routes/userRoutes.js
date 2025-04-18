const express = require("express");
const multer = require("multer");

const userController = require("../controllers/userController");
const classController = require("../controllers/classController");
const tutorController = require("../controllers/tutorController");
const messageController = require("../controllers/messageController");
const authenticateToken = require('../middleware/auth');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const router = express.Router();
router.use(authenticateToken('Student', 'Tutor'));

// Get
router.get("/getClass/:id?", classController.getClass);
router.get("/getAllClass", classController.getAllClass);
router.get("/getTutor/:id", tutorController.getTutor);
router.get("/getClassByUserID", classController.getClassByUserID);
router.get("/getMessage/:senderID&:receiverID", messageController.getMessage);

// Post
router.post("/complain", userController.sendComplains);
router.post(
  "/sendMessage/:senderID&:receiverID",
  messageController.sendMessage
);

// Put
router.put(
  "/update/:id",
  upload.fields([{ name: "avatar", maxCount: 1 }]),
  userController.updateUserForUser
);


module.exports = router;
