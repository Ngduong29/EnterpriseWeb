// src/apiService/livekitService.js
import axios from 'axios';

// API keys cho LiveKit
const API_KEY = 'apikeytutor123456789';
const API_SECRET = 'apikeysecrettutor123456789123456789123456789';

// Sử dụng cùng URL như các service khác
const API_URL = 'http://localhost:5000/api';

export const getToken = async (room, username, metadata = {}) => {
  try {
    console.log('Getting token for room:', room, 'participant:', username, 'metadata:', metadata);
    
    // Bỏ /api vì API_URL đã bao gồm
    const response = await axios.post(`${API_URL}/livekit/token`, {
      room,
      username,
      metadata,
      apiKey: API_KEY,  // Truyền API key mới
      apiSecret: API_SECRET  // Truyền API secret mới (không bắt buộc nếu backend đã cấu hình)
    }, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    console.log('Token response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy token:', error);
    // Trả về một đối tượng với success: false để phù hợp với cách xử lý lỗi trong VideoCallRoom
    return {
      success: false,
      error: error.message || 'Không thể lấy token'
    };
  }
};

export const createRoom = async (className, tutorName) => {
  try {
    console.log('Creating room:', className, 'tutor:', tutorName);
    
    // Bỏ /api vì API_URL đã bao gồm
    const response = await axios.post(`${API_URL}/livekit/create-room`, {
      className,
      tutorName,
      apiKey: API_KEY,  // Truyền API key mới
      apiSecret: API_SECRET  // Truyền API secret mới (không bắt buộc nếu backend đã cấu hình)
    }, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    console.log('Room creation response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi tạo phòng:', error);
    // Trả về một đối tượng với success: false để phù hợp với cách xử lý lỗi
    return {
      success: false,
      error: error.message || 'Không thể tạo phòng'
    };
  }
};