const express = require("express");
const authRoutes = require("./authRoutes");
const studentRoutes = require("./studentRoutes");
const tutorRoutes = require("./tutorRoutes");
const adminRoutes = require("./adminRoutes");
const userRoutes = require("./userRoutes");
const paymentRoutes = require("./paymentRoutes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/admin", adminRoutes);
router.use("/users", userRoutes);
router.use("/students", studentRoutes);
router.use("/tutors", tutorRoutes);
router.use("/payments", paymentRoutes);

module.exports = router;
