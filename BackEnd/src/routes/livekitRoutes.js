// src/routes/livekitRoutes.js
const express = require('express');
const router = express.Router();
const livekitController = require('../controllers/livekitController');

// Route tạo token cho người dùng
router.post('/token', livekitController.createToken);

// Route tạo phòng mới
router.post('/create-room', livekitController.createRoom);

module.exports = router;