// src/views/VideoCall/VideoCallRoom.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Room, RoomEvent } from 'livekit-client';
import { getToken } from '../../apiService/livekitService.js';
import MegaMenuWithHover from '../../components/MegaMenuWithHover.jsx';
import BreadcrumbsWithIcon from '../../components/BreadCrumb.jsx';
import VideoControls from '../../components/VideoCall/VideoControls';
import ParticipantView from '../../components/VideoCall/ParticipantView';

const VideoCallRoom = () => {
    const { roomId } = useParams();
    const navigate = useNavigate();

    const [room, setRoom] = useState(null);
    const [participants, setParticipants] = useState([]);
    const [isMicEnabled, setIsMicEnabled] = useState(true);
    const [isCameraEnabled, setIsCameraEnabled] = useState(true);
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const [isConnecting, setIsConnecting] = useState(true);
    const [error, setError] = useState(null);

    // Breadcrumbs
    const breadcrumbs = [
        { name: 'Home', path: '/' },
        { name: 'My Classes', path: '/my-classes' },
        { name: 'Video Call', path: '#' }
    ];
    
    // THÊM BƯỚC 1: Hàm kiểm tra quyền truy cập media
    const checkMediaPermissions = async () => {
      try {
        console.log('Kiểm tra quyền truy cập media...');
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        console.log('Quyền truy cập đã được cấp:', stream.getTracks().map(t => t.kind));
        stream.getTracks().forEach(track => track.stop());
        return true;
      } catch (err) {
        console.error('Lỗi truy cập thiết bị:', err);
        alert('Không thể truy cập camera/microphone. Vui lòng kiểm tra quyền truy cập trong trình duyệt.');
        return false;
      }
    };
    
    // THÊM BƯỚC 2: Hàm khởi động lại camera - ĐÃ CẢI TIẾN
    const restartCamera = async () => {
        if (!room) return;
        
        try {
            // Hiển thị đang đang xử lý
            alert('Đang khởi động lại kết nối... Vui lòng đợi.');
            
            // Tắt camera và mic trước
            await room.localParticipant.setCameraEnabled(false)
                .catch(err => console.error('Error disabling camera:', err));
            await room.localParticipant.setMicrophoneEnabled(false)
                .catch(err => console.error('Error disabling mic:', err));
            
            // Ngắt kết nối và kết nối lại phòng (cách làm mới hoàn toàn)
            room.disconnect();
            
            // Khởi động lại trang
            window.location.reload();
        } catch (err) {
            console.error('Error during restart:', err);
            alert('Không thể khởi động lại kết nối: ' + err.message);
        }
    };

    // Kiểm tra WebRTC compatibility
    useEffect(() => {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            setError('Trình duyệt của bạn không hỗ trợ WebRTC. Vui lòng thử trình duyệt khác như Chrome, Firefox hoặc Edge.');
            setIsConnecting(false);
            return;
        }

        if (!window.RTCPeerConnection) {
            setError('Trình duyệt của bạn không hỗ trợ RTCPeerConnection. Vui lòng thử trình duyệt khác.');
            setIsConnecting(false);
            return;
        }
    }, []);

    // Kết nối đến phòng LiveKit
    useEffect(() => {
        const connectToRoom = async () => {
            if (error) return; // Không kết nối nếu có lỗi compatibility

            try {
                setIsConnecting(true);

                // Kiểm tra quyền truy cập media trước bằng hàm mới
                if (!await checkMediaPermissions()) {
                    throw new Error('Không có quyền truy cập thiết bị media');
                }

                // Thay đổi cách tạo identity để đảm bảo duy nhất
                const username = localStorage.getItem('name') || 'Anonymous';
                const userRole = localStorage.getItem('role') || 'Student';
                // Sử dụng userId từ localStorage nếu có, không tạo mới mỗi lần
                const userId = localStorage.getItem('userId');
                const uniqueIdentity = userId ? `${username}_${userId}` : `${username}_${Date.now()}`;
                
                // Lưu lại userId để sử dụng nhất quán
                if (!userId) {
                    localStorage.setItem('userId', Date.now().toString());
                }

                // Lấy token từ backend
                const tokenResponse = await getToken(roomId, uniqueIdentity, {
                    role: userRole,
                    userId: userId
                });

                if (!tokenResponse.success || !tokenResponse.token) {
                    throw new Error('Failed to get token');
                }

                // Kết nối đến LiveKit room - sử dụng URL chính xác
                const liveKitUrl = 'ws://localhost:7880'; // Thay bằng địa chỉ server thực tế của bạn hoặc 'wss://localhost:7880' nếu dùng HTTPS local
                console.log('Connecting to LiveKit:', liveKitUrl);

                const roomOptions = {
                    adaptiveStream: true,
                    dynacast: true,
                    rtcConfig: {
                        iceTransportPolicy: 'all', 
                        bundlePolicy: 'max-bundle',
                        iceCandidatePoolSize: 10,
                        iceServers: [
                            // STUN servers 
                            { urls: 'stun:stun.l.google.com:19302' },
                            { urls: 'stun:stun1.l.google.com:19302' },
                            { urls: 'stun:stun2.l.google.com:19302' },
                            { urls: 'stun:stun3.l.google.com:19302' },
                            { urls: 'stun:stun4.l.google.com:19302' },
                            
                            // TURN servers
                            {
                                urls: [
                                    'turn:global.turn.twilio.com:3478?transport=udp',
                                    'turn:global.turn.twilio.com:3478?transport=tcp',
                                    'turn:global.turn.twilio.com:443?transport=tcp'
                                ],
                                username: 'your_username', // Thay thế bằng thông tin thực tế
                                credential: 'your_password'  // Thay thế bằng thông tin thực tế
                            }
                        ]
                    }
                };

                const newRoom = new Room(roomOptions);

                // Đăng ký thêm các event handlers để debug
                newRoom.on(RoomEvent.ParticipantConnected, (participant) => {
                    console.log('Participant connected:', participant.identity);
                    handleParticipantsChanged();
                });

                newRoom.on(RoomEvent.ParticipantDisconnected, (participant) => {
                    console.log('Participant disconnected:', participant.identity);
                    handleParticipantsChanged();
                });

                newRoom.on(RoomEvent.Disconnected, () => {
                    console.log('Disconnected from room');
                });

                // Bắt thêm các sự kiện để debug chi tiết hơn
                newRoom.on(RoomEvent.ConnectionStateChanged, (state) => {
                    console.log('Connection state changed:', state);
                });

                newRoom.on(RoomEvent.SignalConnected, () => {
                    console.log('Signal connected successfully');
                });

                newRoom.on(RoomEvent.MediaDevicesError, (e) => {
                    console.error('Media device error:', e);
                    alert('Lỗi thiết bị media: ' + e.message);
                });

                newRoom.on(RoomEvent.TrackPublished, (publication, participant) => {
                    console.log('Track published:', publication.trackSid, 'by', participant.identity);
                });

                // Log thêm các sự kiện ICE
                newRoom.on(RoomEvent.ConnectionQualityChanged, (quality, participant) => {
                    console.log('Connection quality changed:', quality, 'for participant:', participant.identity);
                });

                // Kết nối với timeout dài hơn và các tùy chọn bổ sung
                try {
                    console.log('Connecting to room with token:', tokenResponse.token.substring(0, 20) + '...');
                    await Promise.race([
                        newRoom.connect(liveKitUrl, tokenResponse.token, {
                            autoSubscribe: true,
                            publishDefaults: {
                                simulcast: false,
                                videoSimulcastLayers: [],
                                dtx: true,
                                red: true,
                                videoCodec: 'vp8',
                                stopMicTrackOnMute: false
                            },
                            reconnectPolicy: {
                                maxRetries: 10,
                                retryBackoff: 1.5
                            }
                        }),
                        new Promise((_, reject) => setTimeout(() => reject(new Error('Connection timeout after 60s')), 60000))
                    ]);
                    console.log('Room connected successfully!');
                } catch (err) {
                    console.error('Room connection error:', err);
                    throw err;
                }

                setRoom(newRoom);

                // Cập nhật danh sách người tham gia
                handleParticipantsChanged();

                // Tách biệt phần bật camera/mic sau khi đã kết nối thành công
                // Trì hoãn bật camera và mic để đảm bảo kết nối đã ổn định
                console.log('Room connected, waiting before enabling media...');
                await new Promise(resolve => setTimeout(resolve, 2000));

                // Bật camera và mic
                try {
                    // Bật mic trước với độ trễ
                    console.log('Enabling microphone...');
                    await newRoom.localParticipant.setMicrophoneEnabled(true);
                    console.log('Microphone enabled');

                    // Đợi 1s nữa trước khi bật camera
                    await new Promise(resolve => setTimeout(resolve, 1000));

                    console.log('Enabling camera...');
                    await newRoom.localParticipant.setCameraEnabled(true, {
                        resolution: { width: 320, height: 240 },
                        maxFramerate: 15,
                        maxBitrate: 150000 // 150 kbps
                    });
                    console.log('Camera enabled');
                } catch (err) {
                    console.error('Error enabling media:', err);
                    alert('Có lỗi khi kết nối microphone hoặc camera. Vui lòng làm mới trang và thử lại.');
                    // Không throw error ở đây để tránh disconnect
                }

                setIsConnecting(false);
            } catch (err) {
                console.error('Error connecting to room:', err);
                setError(err.message || 'Không thể kết nối đến phòng');
                setIsConnecting(false);
            }
        };

        connectToRoom();

        // Cleanup - ĐÃ CẢI TIẾN
        return () => {
            if (room) {
                console.log('Component unmounting, cleaning up...');
                // Tắt camera và mic
                if (room.localParticipant) {
                    room.localParticipant.setCameraEnabled(false)
                        .catch(err => console.error('Error disabling camera during cleanup:', err));
                        
                    room.localParticipant.setMicrophoneEnabled(false)
                        .catch(err => console.error('Error disabling mic during cleanup:', err));
                    
                    // Dừng tất cả các tracks
                    room.localParticipant.tracks.forEach(publication => {
                        if (publication.track) {
                            publication.track.stop();
                        }
                    });
                }
                
                room.disconnect();
                console.log('Room disconnected during cleanup');
            }
        };
    }, [roomId, error]);

    // Thay đổi cách cập nhật danh sách người tham gia
    const handleParticipantsChanged = () => {
        if (!room) return;

        console.log('Updating participants list', room.localParticipant, room.participants.size);
        
        // Tạo một bản sao của dữ liệu để đảm bảo component re-render
        const participantList = [];
        
        // Thêm người dùng local (chính mình) vào danh sách
        if (room.localParticipant) {
            participantList.push(room.localParticipant);
            console.log('Added local participant:', room.localParticipant.identity);
        }
        
        // Thêm tất cả người tham gia khác
        room.participants.forEach(participant => {
            participantList.push(participant);
            console.log('Added remote participant:', participant.identity);
        });

        // Cập nhật state để kích hoạt re-render
        setParticipants([...participantList]);
        console.log('Total participants in list:', participantList.length);
    };

    // Thêm useEffect để theo dõi thay đổi của room và cập nhật participants
    useEffect(() => {
        if (!room) return;
        
        // Cập nhật participants ngay khi room thay đổi
        handleParticipantsChanged();
        
        // Thêm event listener để cập nhật khi có người tham gia mới
        const handleParticipantConnected = (participant) => {
            console.log('Participant connected event:', participant.identity);
            handleParticipantsChanged();
        };
        
        const handleParticipantDisconnected = (participant) => {
            console.log('Participant disconnected event:', participant.identity);
            handleParticipantsChanged();
        };
        
        // Đăng ký các sự kiện
        room.on(RoomEvent.ParticipantConnected, handleParticipantConnected);
        room.on(RoomEvent.ParticipantDisconnected, handleParticipantDisconnected);
        
        return () => {
            // Hủy đăng ký sự kiện khi component unmount hoặc room thay đổi
            room.off(RoomEvent.ParticipantConnected, handleParticipantConnected);
            room.off(RoomEvent.ParticipantDisconnected, handleParticipantDisconnected);
        };
    }, [room]);

    // Thêm debug code để kiểm tra danh sách participants trong component
    useEffect(() => {
        console.log('Participants state changed:', participants.length, participants.map(p => p.identity));
    }, [participants]);

    // Xử lý các hành động điều khiển
    const toggleMic = async () => {
        if (!room) return;

        try {
            await room.localParticipant.setMicrophoneEnabled(!isMicEnabled);
            setIsMicEnabled(!isMicEnabled);
            console.log('Microphone toggled:', !isMicEnabled);
        } catch (err) {
            console.error('Error toggling microphone:', err);
            alert('Không thể thay đổi trạng thái microphone: ' + err.message);
        }
    };

    const toggleCamera = async () => {
        if (!room) return;

        try {
            console.log('Attempting to toggle camera to:', !isCameraEnabled);
            await room.localParticipant.setCameraEnabled(!isCameraEnabled);
            setIsCameraEnabled(!isCameraEnabled);
            console.log('Camera toggled successfully to:', !isCameraEnabled);

            // Kiểm tra tracks của người dùng local
            console.log('Local participant tracks:',
                Array.from(room.localParticipant.tracks.values())
                    .map(pub => `${pub.trackName}: ${pub.track?.isEnabled}`));
        } catch (err) {
            console.error('Error toggling camera:', err);
            alert('Không thể thay đổi trạng thái camera: ' + err.message);
        }
    };

    const toggleScreenShare = async () => {
        if (!room) return;

        try {
            await room.localParticipant.setScreenShareEnabled(!isScreenSharing);
            setIsScreenSharing(!isScreenSharing);
            console.log('Screen sharing toggled:', !isScreenSharing);
        } catch (err) {
            console.error('Error toggling screen share:', err);
            alert('Không thể thay đổi trạng thái chia sẻ màn hình: ' + err.message);
        }
    };

    // Phương thức leaveRoom đã được cải tiến
    const leaveRoom = () => {
        if (room) {
            // Tắt camera và mic trước khi ngắt kết nối
            try {
                console.log('Stopping all local tracks before leaving room...');
                // Tắt camera
                if (isCameraEnabled) {
                    room.localParticipant.setCameraEnabled(false);
                }
                
                // Tắt mic
                if (isMicEnabled) {
                    room.localParticipant.setMicrophoneEnabled(false);
                }
                
                // Tắt chia sẻ màn hình nếu đang bật
                if (isScreenSharing) {
                    room.localParticipant.setScreenShareEnabled(false);
                }
                
                // Dừng tất cả các tracks
                room.localParticipant.tracks.forEach(publication => {
                    if (publication.track) {
                        publication.track.stop();
                    }
                });
                
                // Ngắt kết nối phòng
                room.disconnect();
                console.log('Disconnected from room');
            } catch (err) {
                console.error('Error during cleanup:', err);
            }
        }
        navigate(-1);
    };

    // Hiển thị loading state
    if (isConnecting) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-white text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
                    <p className="text-xl">Đang kết nối tới phòng học...</p>
                </div>
            </div>
        );
    }

    // Hiển thị lỗi
    if (error) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="bg-red-800 text-white p-4 rounded-lg max-w-md">
                    <h2 className="text-xl font-bold mb-2">Không thể kết nối</h2>
                    <p>{error}</p>
                    <button
                        className="mt-4 bg-white text-red-800 px-4 py-2 rounded"
                        onClick={() => navigate(-1)}
                    >
                        Quay lại
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900">
            <header className="bg-orange-400 text-white shadow-md">
                <MegaMenuWithHover />
            </header>

            <div className="container mx-auto px-4 py-6 mt-16">
                <div className="flex justify-between items-center mb-6">
                    <BreadcrumbsWithIcon pathnames={breadcrumbs} />
                    <div>
                        <h1 className="text-2xl font-bold text-white">Phòng học: {roomId}</h1>
                        <p className="text-gray-400">Số người tham gia: {room?.participants.size + 1 || 0}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-20">
                    {room?.localParticipant && (
                        <ParticipantView
                            key={room.localParticipant.sid}
                            participant={room.localParticipant}
                            isLocal={true}
                        />
                    )}
                    
                    {Array.from(room?.participants.values() || []).map((participant) => (
                        <ParticipantView
                            key={participant.sid}
                            participant={participant}
                            isLocal={false}
                        />
                    ))}
                    
                </div>

                <VideoControls
                    isMicEnabled={isMicEnabled}
                    isCameraEnabled={isCameraEnabled}
                    isScreenSharing={isScreenSharing}
                    onToggleMic={toggleMic}
                    onToggleCamera={toggleCamera}
                    onToggleScreenShare={toggleScreenShare}
                    onLeaveRoom={leaveRoom}
                />
            </div>
        </div>
    );
};

export default VideoCallRoom;