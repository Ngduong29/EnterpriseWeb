const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const classController = require("../controllers/classController");
const auth = require("../middleware/auth");

// User Management
router.get("/users", auth("Admin"), adminController.getAllUser);
router.get("/users/active", auth("Admin"), adminController.getActiveUser);
router.put("/users/:id", auth("Admin"), adminController.updateUser);
router.put("/users/:id/ban", auth("Admin"), adminController.banUsers);
router.put("/users/:id/unban", auth("Admin"), adminController.unbanUsers);

// Tutor Management
router.get("/tutors/requests", auth("Admin"), adminController.getTutorRequest);
router.put("/tutors/:id/requests", auth("Admin"), adminController.handleTutor);

// Class Management
router.get("/classes", auth("Admin"), classController.getAllClass);
router.get("/classes/existed", auth("Admin"), classController.getAllClassExisted);
router.delete("/classes/:id", auth("Admin"), adminController.deleteClass);

// Complaint Management
router.get("/complaints", auth("Admin"), adminController.getComplainList);
router.delete("/complaints/:id", auth("Admin"), adminController.deleteComplain);

module.exports = router;
