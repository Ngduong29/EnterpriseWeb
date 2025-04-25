import React, { useState, useEffect } from 'react';
import {
  LiveKitRoom,
  VideoConference,
  RoomAudioRenderer,
  ControlBar,
  useTracks,
  useLocalParticipant,
  useRoomContext,
} from '@livekit/components-react';

// Import CSS the correct way
import './VideoRoom.css';

export const VideoRoom = ({ token, url, roomName, participantName, onLeaveRoom }) => {
  const [error, setError] = useState('');
  const [isFullScreen, setIsFullScreen] = useState(false);
  const videoRoomRef = React.useRef(null);

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
      if (videoRoomRef.current && videoRoomRef.current.requestFullscreen) {
        videoRoomRef.current.requestFullscreen().catch(err => {
          console.error(`Error attempting to enable full-screen mode: ${err.message}`);
        });
      }
      setIsFullScreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullScreen(false);
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

  return (
    <div 
      ref={videoRoomRef} 
      className={`video-room ${isFullScreen ? 'fullscreen' : ''}`}
    >
      <div className="room-header">
        <h2>Video Chat: {roomName}</h2>
        <div className="room-controls">
          <button 
            className="fullscreen-btn" 
            onClick={toggleFullScreen}
            title={isFullScreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullScreen ? "Exit Fullscreen" : "Fullscreen"}
          </button>
        </div>
      </div>

      {error && <div className="error">{error}</div>}

      <LiveKitRoom
        token={token}
        serverUrl={url}
        options={{
          adaptiveStream: true,
          dynacast: true,
          // Simplify the configuration to avoid the maxBitrate error
          publishDefaults: {
            simulcast: true,
          },
        }}
        video={true}
        audio={true}
        onDisconnected={handleDisconnected}
        onError={handleError}
        className="livekit-container"
        data-lk-theme="default"
      >
        {/* Use custom VideoConferenceView for more control */}
        <CustomVideoConference 
          chatEnabled={false}
          screenShareEnabled={true}
          participantName={participantName}
        />
        <RoomAudioRenderer />
      </LiveKitRoom>
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
        chatEnabled={chatEnabled} 
        screenShareEnabled={screenShareEnabled}
      />
    </div>
  );
}; 