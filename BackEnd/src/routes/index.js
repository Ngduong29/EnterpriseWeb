const express = require("express");
const authRoutes = require("./authRoutes");
const studentRoutes = require("./studentRoutes");
const tutorRoutes = require("./tutorRoutes");
const adminRoutes = require("./adminRoutes");
const userRoutes = require("./userRoutes");
const paymentRoutes = require("./paymentRoutes");
const publicRouters = require("./publicRoutes");
<<<<<<< Updated upstream
const blogRoutes = require("./blogRoutes");
=======
const livekitRoutes = require("./livekitRoutes");

>>>>>>> Stashed changes
const router = express.Router();

router.use("/public", publicRouters);
router.use("/auth", authRoutes);
router.use("/admin", adminRoutes);
router.use("/users", userRoutes);
router.use("/students", studentRoutes);
router.use("/tutors", tutorRoutes);
router.use("/payments", paymentRoutes);
router.use("/blogs", blogRoutes);
router.use("/assignment", require("./postsAssignmentRoutes"));
router.use("/livekit", livekitRoutes);

module.exports = router;
