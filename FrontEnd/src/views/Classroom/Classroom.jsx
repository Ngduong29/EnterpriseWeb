import React, { useState } from 'react'
import './App.css'
import { JoinForm } from './components/JoinForm'
import { VideoRoom } from './components/VideoRoom'

function Classroom() {
  const [roomInfo, setRoomInfo] = useState(null)

  // Handle when user joins a room
  const handleJoinRoom = (roomData) => {
    setRoomInfo(roomData)
  }

  // Handle when user leaves a room
  const handleLeaveRoom = () => {
    setRoomInfo(null)
  }

  return (
    <div className='app'>
      <div className='container fade-in'>
        <h1>Classroom</h1>

        {!roomInfo ? (
          <JoinForm onJoinRoom={handleJoinRoom} />
        ) : (
          <VideoRoom
            token={roomInfo.token}
            url={roomInfo.url}
            roomName={roomInfo.roomName}
            participantName={roomInfo.participantName}
            onLeaveRoom={handleLeaveRoom}
          />
        )}
      </div>
    </div>
  )
}

export default Classroom
