// src/components/VideoCall/RoomDialog.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createRoom } from '../../apiService/livekitService';

const RoomDialog = ({ isOpen, onClose, classId }) => {
  const navigate = useNavigate();
  const [roomName, setRoomName] = useState('');
  const [joinRoom, setJoinRoom] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');
  const [action, setAction] = useState('join'); // 'join' hoặc 'create'
  
  const userRole = localStorage.getItem('role') || 'Student';
  
  const handleCreateRoom = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!roomName.trim()) {
      setError('Vui lòng nhập tên phòng');
      return;
    }
    
    try {
      setIsCreating(true);
      
      const response = await createRoom(roomName, localStorage.getItem('name'));
      
      if (response.success) {
        // Tạo thông báo về phòng học cho lớp học
        // Phần này bạn có thể tích hợp với API đăng thông báo của bạn
        
        // Chuyển hướng đến phòng học
        navigate(`/video-call/${response.roomId}`);
      } else {
        throw new Error(response.message || 'Không thể tạo phòng học');
      }
    } catch (err) {
      console.error('Error creating room:', err);
      setError(err.message || 'Không thể tạo phòng học');
    } finally {
      setIsCreating(false);
    }
  };
  
  const handleJoinRoom = (e) => {
    e.preventDefault();
    setError('');
    
    if (!joinRoom.trim()) {
      setError('Vui lòng nhập ID phòng');
      return;
    }
    
    // Chuyển hướng đến phòng học
    navigate(`/video-call/${joinRoom}`);
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-6 text-center">
          Phòng học trực tuyến
        </h2>
        
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
            <p>{error}</p>
          </div>
        )}
        
        <div className="mb-4 flex">
          <button
            type="button"
            className={`flex-1 py-2 ${action === 'join' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
            onClick={() => setAction('join')}
          >
            Tham gia phòng
          </button>
          <button
            type="button"
            className={`flex-1 py-2 ${action === 'create' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
            onClick={() => setAction('create')}
            disabled={userRole !== 'Tutor'}
          >
            Tạo phòng mới
          </button>
        </div>
        
        {action === 'create' && userRole === 'Tutor' ? (
          <form onSubmit={handleCreateRoom}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Tên phòng học
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                placeholder="Nhập tên phòng học"
                required
              />
            </div>
            
            <div className="flex justify-end">
              <button
                type="button"
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md mr-2"
                onClick={onClose}
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
                disabled={isCreating}
              >
                {isCreating ? "Đang xử lý..." : "Tạo phòng"}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleJoinRoom}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                ID phòng học
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={joinRoom}
                onChange={(e) => setJoinRoom(e.target.value)}
                placeholder="Nhập ID phòng học"
                required
              />
            </div>
            
            <div className="flex justify-end">
              <button
                type="button"
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md mr-2"
                onClick={onClose}
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
              >
                Tham gia
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default RoomDialog;