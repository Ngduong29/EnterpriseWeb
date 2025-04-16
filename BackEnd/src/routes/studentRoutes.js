const express = require("express");
const auth = require("../middleware/auth");
const Student = require("../models/Student");

const studentController = require("../controllers/studentController");
const blogController = require('../controllers/blogController');
const classroomController = require("../controllers/classController");

const router = express.Router();

// Apply authentication middleware to all routes
router.use(auth('Student'));

// Get
router.get("/classes", studentController.getStudentClasses);
router.get("/getTutor/:search?", studentController.getTutor);
router.get("/searchClassByTutorName/:search", studentController.findClassByTutorNameController);
router.get("/searchTutorByTutorName/:search", studentController.findTutorByTutorNameController);
router.get("/searchClassByClassName/:search", studentController.findClassByClassName);
router.get("/searchClassBySubject/:id", classroomController.findClassroomBySubject);
router.get("/checkEnroll/:id", studentController.checkEnrollStatus);
router.get('/blogs/', blogController.getAll);
router.get('/blogs/:id', blogController.getOne);
router.get("/viewRequest/:studentID", studentController.viewRequest);

// Post
router.post("/enrollClass/:id", studentController.enrollClass);
router.post("/unEnrollClass/:id", studentController.unEnrollClass);
router.post("/feedback/:classID", studentController.feedbackClass);
router.post("/requestClass/:tutorID", studentController.requestClass);
router.post('/blogs/', blogController.create);

// Put
router.put('/blogs/:id', blogController.update);

// Delete
router.delete('/blogs/:id', blogController.remove);

module.exports = router;
