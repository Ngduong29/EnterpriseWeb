import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import './App.css'
import { JoinForm } from './components/JoinForm'
import { VideoRoom } from './components/VideoRoom'

function Classroom() {
  const [roomInfo, setRoomInfo] = useState(null)
  const location = useLocation()

  useEffect(() => {
    // Parse query parameters for room name and participant name
    const searchParams = new URLSearchParams(location.search)
    const roomName = searchParams.get('room')
    const participantName = searchParams.get('name')

    // If both parameters are provided, automatically join the room
    if (roomName && participantName) {
      handleAutoJoin(roomName, participantName)
    }
  }, [location])

  // Auto-join the room with provided parameters
  const handleAutoJoin = async (roomName, participantName) => {
    try {
      console.log(`Auto-joining room: ${roomName}, as: ${participantName}`)
      
      // Call API to get token
      const absoluteUrl = 'http://localhost:5000/api/get-token'
      const response = await fetch(absoluteUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          roomName,
          participantName
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get token')
      }

      // Join the room with the received token
      setRoomInfo({
        token: data.token,
        url: data.url,
        roomName,
        participantName
      })
    } catch (error) {
      console.error('Error auto-joining room:', error)
      // If auto-join fails, just show the form
    }
  }

  // Handle when user joins a room
  const handleJoinRoom = (roomData) => {
    setRoomInfo(roomData)
  }

  // Handle when user leaves a room
  const handleLeaveRoom = () => {
    setRoomInfo(null)
  }

  return (
    <div className='classroom-page'>
      {!roomInfo ? (
        <div className='join-form-container'>
          <h1 className='classroom-title'>Classroom</h1>
          <JoinForm onJoinRoom={handleJoinRoom} />
        </div>
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
  )
}

export default Classroom
