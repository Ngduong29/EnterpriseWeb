import React, { useState, useEffect, useRef } from 'react';
import {
  LiveKitRoom,
  VideoConference,
  RoomAudioRenderer,
  ControlBar,
  useTracks,
  useLocalParticipant,
  useRoomContext,
} from '@livekit/components-react';
import { IoMdExpand, IoMdContract } from 'react-icons/io';
import { FaVideo, FaVideoSlash, FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';

// Import CSS the correct way
import './VideoRoom.css';

export const VideoRoom = ({ token, url, roomName, participantName, onLeaveRoom }) => {
  const [error, setError] = useState('');
  const [isFullScreen, setIsFullScreen] = useState(false);
  const videoRoomRef = useRef(null);
  const roomRef = useRef(null);
  const [mediaPermissions, setMediaPermissions] = useState({
    video: false,
    audio: false,
    requested: false
  });
  const [hasPermission, setHasPermission] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [micEnabled, setMicEnabled] = useState(true);

  // Request media permissions on component mount
  useEffect(() => {
    const requestMediaPermissions = async () => {
      try {
        setMediaPermissions(prev => ({ ...prev, requested: true }));
        
        // Request access to microphone and camera
        const stream = await navigator.mediaDevices.getUserMedia({ 
          audio: true, 
          video: true 
        });
        
        // Check if we have permissions
        const audioTracks = stream.getAudioTracks();
        const videoTracks = stream.getVideoTracks();
        
        setMediaPermissions({
          audio: audioTracks.length > 0 && audioTracks[0].enabled,
          video: videoTracks.length > 0 && videoTracks[0].enabled,
          requested: true
        });
        
        console.log('Media permissions granted:', { 
          audio: audioTracks.length > 0, 
          video: videoTracks.length > 0 
        });
        
        // Clean up the stream when component unmounts
        return () => {
          stream.getTracks().forEach(track => track.stop());
        };
      } catch (err) {
        console.error('Error requesting media permissions:', err);
        setError('Không thể truy cập microphone hoặc camera. Vui lòng kiểm tra quyền truy cập trong trình duyệt của bạn.');
        setMediaPermissions({
          audio: false,
          video: false,
          requested: true
        });
      }
    };
    
    requestMediaPermissions();
  }, []);

  // Handle connection errors
  const handleError = (err) => {
    console.error('Error connecting to LiveKit:', err);
    setError(err.message || 'Failed to connect to room');
  };

  // Handle when the room is disconnected
  const handleDisconnected = () => {
    console.log('Disconnected from room');
    onLeaveRoom();
  };

  // Toggle fullscreen mode
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      videoRoomRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullScreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullScreen(false);
      }
    }
  };

  const toggleCamera = () => {
    setCameraEnabled(!cameraEnabled);
    if (roomRef.current) {
      const localParticipant = roomRef.current.localParticipant;
      const videoTracks = localParticipant.getTrackPublications().filter(
        publication => publication.kind === 'video'
      );
      
      videoTracks.forEach(publication => {
        if (cameraEnabled) {
          publication.mute();
        } else {
          publication.unmute();
        }
      });
    }
  };

  const toggleMicrophone = () => {
    setMicEnabled(!micEnabled);
    if (roomRef.current) {
      const localParticipant = roomRef.current.localParticipant;
      const audioTracks = localParticipant.getTrackPublications().filter(
        publication => publication.kind === 'audio'
      );
      
      audioTracks.forEach(publication => {
        if (micEnabled) {
          publication.mute();
        } else {
          publication.unmute();
        }
      });
    }
  };

  // Listen for fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Permission warning component
  const PermissionWarning = () => (
    <div className="media-permissions-warning">
      <h3>Thiếu quyền truy cập thiết bị</h3>
      <p>
        {!mediaPermissions.audio && !mediaPermissions.video ? 
          'Không thể truy cập microphone và camera. Vui lòng cấp quyền trong cài đặt trình duyệt.' :
          !mediaPermissions.audio ? 
            'Không thể truy cập microphone. Vui lòng cấp quyền trong cài đặt trình duyệt.' :
            'Không thể truy cập camera. Vui lòng cấp quyền trong cài đặt trình duyệt.'
        }
      </p>
      <button onClick={() => window.location.reload()}>Thử lại</button>
    </div>
  );

  return (
    <div 
      ref={videoRoomRef} 
      className={`video-room ${isFullScreen ? 'fullscreen' : ''}`}
    >
      <div className="room-header">
        <h3>{roomName}</h3>
        <div className="room-controls">
          <button 
            className="fullscreen-btn" 
            onClick={toggleFullScreen}
            title={isFullScreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullScreen ? <IoMdContract /> : <IoMdExpand />}
          </button>
        </div>
      </div>

      {error && <div className="error">{error}</div>}
      
      {mediaPermissions.requested && (!mediaPermissions.audio || !mediaPermissions.video) ? (
        <PermissionWarning />
      ) : (
        <LiveKitRoom
          token={token}
          serverUrl={url}
          options={{
            adaptiveStream: true,
            dynacast: true,
            publishDefaults: {
              simulcast: true,
            },
          }}
          video={cameraEnabled}
          audio={micEnabled}
          onDisconnected={handleDisconnected}
          onError={handleError}
          className="livekit-container"
          data-lk-theme="default"
        >
          <CustomVideoConference 
            chatEnabled={true}
            screenShareEnabled={true}
            participantName={participantName}
          />
          <RoomAudioRenderer />
        </LiveKitRoom>
      )}
    </div>
  );
};

// Custom VideoConference component for more control over the UI
const CustomVideoConference = ({ chatEnabled, screenShareEnabled, participantName }) => {
  const { localParticipant } = useLocalParticipant();
  
  // Update the participant name if available
  useEffect(() => {
    if (localParticipant && participantName) {
      localParticipant.setName(participantName);
    }
  }, [localParticipant, participantName]);
  
  return (
    <div className="custom-video-conference">
      <VideoConference 
        chatEnabled={true} 
        screenShareEnabled={screenShareEnabled}
      />
    </div>
  );
};



export default VideoRoom; 