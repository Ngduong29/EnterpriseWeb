import React, { useState } from 'react'
import './JoinForm.css'

export const JoinForm = ({ onJoinRoom }) => {
  const [roomName, setRoomName] = useState('')
  const [participantName, setParticipantName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!roomName || !participantName) {
      setError('Room name and participant name are required')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      console.log(`Requesting token for room: ${roomName}, participant: ${participantName}`)

      // Try to use the API with absolute URL if the proxy setup fails
      let apiUrl = '/api/get-token'

      console.log(`Sending request to: ${apiUrl}`)
      const response = await fetch('localhost:5001' + apiUrl, {
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
        console.error('Error response from token API:', data)
        throw new Error(data.error || 'Failed to get token')
      }

      console.log('Token received successfully')
      // Don't log the actual token for security reasons
      console.log('LiveKit URL:', data.url)

      if (!data.token || !data.url) {
        console.error('Invalid response from token API:', data)
        throw new Error('Invalid token response from server')
      }

      onJoinRoom({
        token: data.token,
        url: data.url,
        roomName,
        participantName
      })
    } catch (err) {
      console.error('Error joining room:', err)

      // If fetch fails completely (e.g., server not running), try with a different URL
      if (err.message === 'Failed to fetch') {
        setError('Cannot connect to server. Make sure the backend is running.')

        console.log('Trying fallback to direct URL...')
        try {
          const absoluteUrl = 'http://localhost:5000/api/get-token'
          console.log(`Sending fallback request to: ${absoluteUrl}`)

          const fallbackResponse = await fetch(absoluteUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              roomName,
              participantName
            })
          })

          const fallbackData = await fallbackResponse.json()

          if (!fallbackResponse.ok) {
            throw new Error(fallbackData.error || 'Failed to get token')
          }

          console.log('Token received from fallback request')
          onJoinRoom({
            token: fallbackData.token,
            url: fallbackData.url,
            roomName,
            participantName
          })

          // Clear error since fallback worked
          setError('')
          return
        } catch (fallbackErr) {
          console.error('Fallback request also failed:', fallbackErr)
          setError('Cannot connect to backend server. Please check that it is running at http://localhost:5000')
        }
      } else {
        setError(err.message || 'Failed to join room')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='join-form'>
      <div className='form-header'>
        <h2>Join Video Chat</h2>
        <p>Enter a room name and your name to get started</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <label htmlFor='room-name'>Room Name</label>
          <input
            id='room-name'
            type='text'
            placeholder='Enter room name'
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            disabled={isLoading}
            required
          />
        </div>

        <div className='form-group'>
          <label htmlFor='participant-name'>Your Name</label>
          <input
            id='participant-name'
            type='text'
            placeholder='Enter your name'
            value={participantName}
            onChange={(e) => setParticipantName(e.target.value)}
            disabled={isLoading}
            required
          />
        </div>

        {error && <div className='error'>{error}</div>}

        <button type='submit' disabled={isLoading || !roomName || !participantName}>
          {isLoading ? 'Connecting...' : 'Join Room'}
        </button>
      </form>
    </div>
  )
}
