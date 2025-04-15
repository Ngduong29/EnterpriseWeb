const express = require("express");
const auth = require("../middleware/auth");
const classController = require("../controllers/classController");
const tutorController = require("../controllers/tutorController");
const authenticateToken = require('../middleware/auth');
const blogController = require('../controllers/blogController');

const router = express.Router();
//router.use(authenticateToken('Tutor'));

router.post("/createClasses", tutorController.createClasses);
router.post("/updateClasses/:id", tutorController.updateClasses); //need auth for update
router.delete("/deleteClasses/:id", tutorController.deleteClasses);
router.put("/activeClasses/:id", tutorController.activeClasses);
router.post("/findClasses/:search", classController.findClassroomByTutorID);
router.get("/viewStudent/:classID", classController.viewStudentInClass);
router.get("/viewRequest/:tutorID", tutorController.getRequest);
router.get("/viewFeedback/:classID", classController.getFeedbackByClass);
router.delete("/confirmRequest", tutorController.confirmRequest);
router.get("/check-status/:id", tutorController.checkTutorStatus);
router.delete("/:id", auth("Admin"), tutorController.deleteTutor);


// blog tutor
router.get('/blogs/', blogController.getAll);
router.get('/blogs/:id', blogController.getOne);

module.exports = router;
