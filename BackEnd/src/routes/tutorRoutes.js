const express = require("express");
const auth = require("../middleware/auth");
const classController = require("../controllers/classController");
const tutorController = require("../controllers/tutorController");
const authenticateToken = require('../middleware/auth');
const blogController = require('../controllers/blogController');

const router = express.Router();
router.use(authenticateToken('Tutor'));

// Get
router.get("/viewStudent/:classID", classController.viewStudentInClass);
router.get("/viewRequest/:tutorID", tutorController.getRequest);
router.get("/viewFeedback/:classID", classController.getFeedbackByClass);
router.get("/check-status/:id", tutorController.checkTutorStatus);
router.get('/blogs/', blogController.getAll);
router.get('/blogs/:id', blogController.getOne);

// Post
router.post("/createClasses", tutorController.createClasses);
router.post("/updateClasses/:id", tutorController.updateClasses);
router.post("/findClasses/:search", classController.findClassroomByTutorID);

// Put
router.put("/activeClasses/:id", tutorController.activeClasses);

// Delete
router.delete("/deleteClasses/:id", tutorController.deleteClasses);
router.delete("/confirmRequest", tutorController.confirmRequest);

module.exports = router;
