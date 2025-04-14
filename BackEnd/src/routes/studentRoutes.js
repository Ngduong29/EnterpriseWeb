const express = require("express");
const auth = require("../middleware/auth");

const studentController = require("../controllers/studentController");
const blogController = require('../controllers/blogController');
const classroomController = require("../controllers/classController");
const authenticateToken = require('../middleware/auth');


const router = express.Router();

router.use(authenticateToken('Student'));

router.get("/getTutor/:search?", studentController.getTutor); //? để khi muốn lấy toàn bộ tutor
router.get("/searchClassByTutorName/:search", studentController.findClassByTutorNameController);
router.get("/searchTutorByTutorName/:search", studentController.findTutorByTutorNameController);
router.get("/searchClassByClassName/:search", studentController.findClassByClassName);

router.get("/searchClassBySubject/:id", classroomController.findClassroomBySubject);
// router.get("/getTutorEnrolled", studentController.getTutorEnroll);
router.get("/checkEnroll/:id", studentController.checkEnrollStatus);
router.post("/enrollClass/:id", studentController.enrollClass);
router.post("/unEnrollClass/:id", studentController.unEnrollClass);
router.post("/feedback/:classID", studentController.feedbackClass);
router.post("/requestClass/:tutorID", studentController.requestClass);
router.get("/viewRequest/:studentID", studentController.viewRequest);
router.delete("/:id", studentController.deleteStudent);

// blog students
router.get('/blogs/', blogController.getAll);
router.post('/blogs/', blogController.create);
router.get('/blogs/:id', blogController.getOne);
router.put('/blogs/:id', blogController.update);
router.delete('/blogs/:id', blogController.remove);
router.delete("/:id", auth("Admin"), studentController.deleteStudent);

module.exports = router;
