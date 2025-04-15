
const express = require("express");
const studentController = require("../controllers/studentController");
const classroomController = require("../controllers/classController");


const router = express.Router();
router.get("/students/getTutor/:search?", studentController.getTutor); //? để khi muốn lấy toàn bộ tutor
router.get("/students/searchClassByTutorName/:search", studentController.findClassByTutorNameController);
router.get("/students/searchTutorByTutorName/:search", studentController.findTutorByTutorNameController);
router.get("/students/searchClassByClassName/:search", studentController.findClassByClassName);
router.get("/students/searchClassBySubject/:id", classroomController.findClassroomBySubject);

module.exports = router; 