const express = require("express");
const auth = require("../middleware/auth");
const Student = require("../models/Student");

const studentController = require("../controllers/studentController");
const blogController = require('../controllers/blogController');
const classroomController = require("../controllers/classController");

const router = express.Router();

// Apply authentication middleware to all routes
router.use(auth('Student'));

// Get all classes of a student - must be before other routes with :id
router.get("/classes", studentController.getStudentClasses);

// Other routes
router.get("/getTutor/:search?", studentController.getTutor);
router.get("/searchClassByTutorName/:search", studentController.findClassByTutorNameController);
router.get("/searchTutorByTutorName/:search", studentController.findTutorByTutorNameController);
router.get("/searchClassByClassName/:search", studentController.findClassByClassName);
router.get("/searchClassBySubject/:id", classroomController.findClassroomBySubject);
router.get("/checkEnroll/:id", studentController.checkEnrollStatus);
router.post("/enrollClass/:id", studentController.enrollClass);
router.post("/unEnrollClass/:id", studentController.unEnrollClass);
router.post("/feedback/:classID", studentController.feedbackClass);
router.post("/requestClass/:tutorID", studentController.requestClass);
router.get("/viewRequest/:studentID", studentController.viewRequest);

// Blog routes
router.get('/blogs/', blogController.getAll);
router.post('/blogs/', blogController.create);
router.get('/blogs/:id', blogController.getOne);
router.put('/blogs/:id', blogController.update);
router.delete('/blogs/:id', blogController.remove);

// Delete student route (must be last due to :id parameter)
router.delete("/:id", auth("Admin"), studentController.deleteStudent);

module.exports = router;
