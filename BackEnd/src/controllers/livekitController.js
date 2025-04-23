// src/controllers/livekitController.js
const { AccessToken } = require('livekit-server-sdk');
const { v4: uuidv4 } = require('uuid');
const config = require('../config/livekitConfig');

class livekitController {
  // Tạo token cho người dùng tham gia phòng
  static createToken = async (req, res) => {
    try {
      const { room, username, metadata } = req.body;
      
      if (!room || !username) {
        return res.status(400).json({ 
          success: false, 
          message: 'Thiếu thông tin phòng hoặc tên người dùng' 
        });
      }

      // Tạo AccessToken với API key và secret
      const at = new AccessToken(config.apiKey, config.apiSecret, {
        identity: username,
        // Thêm metadata cho user nếu cần
        metadata: JSON.stringify(metadata || {})
      });

      // Thêm quyền cho token
      at.addGrant({
        roomJoin: true,
        room,
        canPublish: true,
        canSubscribe: true
      });

      // Tạo JWT token
      const token = at.toJwt();
      
      return res.status(200).json({
        success: true,
        token,
        room,
        username
      });
    } catch (error) {
      console.error('Error creating token:', error);
      return res.status(500).json({
        success: false,
        message: 'Không thể tạo token',
        error: error.message
      });
    }
  };

  // Tạo room mới (sẽ được tự động tạo bởi LiveKit khi người dùng join)
  static createRoom = async (req, res) => {
    try {
      const { className, tutorName } = req.body;
      
      // Tạo ID phòng ngẫu nhiên hoặc sử dụng ID được cung cấp
      const roomId = req.body.roomId || `class-${uuidv4().substring(0, 8)}`;
      
      // Trong môi trường thực tế, bạn sẽ muốn lưu thông tin phòng vào database
      
      return res.status(200).json({
        success: true,
        roomId,
        message: 'Phòng học đã được tạo',
        joinUrl: `${config.wsUrl}/${roomId}`
      });
    } catch (error) {
      console.error('Error creating room:', error);
      return res.status(500).json({
        success: false,
        message: 'Không thể tạo phòng học',
        error: error.message
      });
    }
  };
}

module.exports = livekitController;