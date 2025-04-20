import React, { useState, useEffect, useContext, forwardRef, useImperativeHandle } from 'react'
import io from 'socket.io-client'
import { FaComments, FaTimes } from 'react-icons/fa'
import AuthContext from '../contexts/JWTAuthContext'
import { jwtDecode } from 'jwt-decode'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Height } from '@mui/icons-material'
import { makeGet, makePost } from '../apiService/httpService'

const socket = io('http://localhost:5000') // Ensure the URL matches your server

const ChatBox = forwardRef((props, ref) => {
  const { user, isAuthenticated } = useContext(AuthContext)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [isSelectOpen, setIsSelectOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null) // State to hold the selected user
  const [users, setUsers] = useState([]) // State to hold the list of users (tutors or students)

  if (!user) {
    return <div></div>
  }

  useImperativeHandle(ref, () => ({
    sendMessage: async (messageText, recipient) => {
      try {
        setSelectedUser(recipient)
        const message = {
          senderID: user.userID,
          receiverID: recipient.userID,
          senderType: user.role,
          receiverType: recipient.role,
          messageText,
          timestamp: new Date()
        }

        const response = await makePost(`users/sendMessage/${user.userID}&${recipient.userID}`, {
          ...message
        })
        setIsOpen(true)
        if (recipient.userID === selectedUser.userID) {
          setMessages((prevMessages) => [...prevMessages, message])
        }
        // Notify other user via socket
        socket.emit('sendMessage', message)
      } catch (error) {
        console.error('Error sending message:', error)
      }
    },
    refreshUsers: async () => {
      // Fetch users (tutors or students) from the server again
      makeGet('admin/getUser')
        .then(async (response) => {
          let filterRole = ''
          let id = ''

          const responseClass = await makeGet('admin/classList')
          let userClasses = responseClass.data
          let filteredUsers = response.data

          if (user.role === 'Tutor') {
            filterRole = 'Student'
            id = user.tutorID
            const requestResponse = await makeGet(`tutors/viewRequest/${id}`)
            const requests = requestResponse.data
            const studentIDsInClasses = userClasses
              .filter((cls) => cls.tutorID == id)
              .map((cls) => cls.studentID)
              .filter((studentID) => studentID !== null)

            const studentIDsInRequests = requests.map((req) => req.studentID).filter((studentID) => studentID !== null)
            filteredUsers = filteredUsers.filter(
              (user) => studentIDsInClasses.includes(user.studentID) || studentIDsInRequests.includes(user.studentID)
            )
          } else if (user.role === 'Student') {
            filterRole = 'Tutor'
            id = user.studentID

            const requestResponse = await makeGet(`students/viewRequest/${id}`)
            const requests = requestResponse.data
            const tutorIDsInClasses = userClasses
              .filter((cls) => cls.studentID == id)
              .map((cls) => cls.tutorID)
              .filter((tutorID) => tutorID !== null)

            const tutorIDsInRequests = requests.map((req) => req.tutorID).filter((tutorID) => tutorID !== null)
            filteredUsers = filteredUsers.filter(
              (user) => tutorIDsInClasses.includes(user.tutorID) || tutorIDsInRequests.includes(user.tutorID)
            )
          }

          setUsers(filteredUsers)
          if (filteredUsers.length > 0) {
            setSelectedUser(filteredUsers[0])
          }
        })
        .catch((error) => {
          console.error('Error fetching users:', error)
        })
    }
  }))

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server')
    })

    socket.on('receiveMessage', (message) => {
      if (selectedUser && (message.senderID === selectedUser.userID || message.receiverID === selectedUser.userID)) {
        setMessages((prevMessages) => [...prevMessages, message])
      }
    })

    socket.on('disconnect', () => {
      console.log('Disconnected from server')
    })

    return () => {
      socket.off('connect')
      socket.off('receiveMessage')
      socket.off('disconnect')
    }
  }, [selectedUser])

  useEffect(() => {
    // Fetch users (tutors or students) from the server
    // if (user.role === 'Admin') {
    makeGet('admin/getUser')
      .then(async (response) => {
        let filterRole = ''
        let id = ''

        const responseClass = await makeGet('admin/classList')
        let userClasses = responseClass.data
        let filteredUsers = response.data

        if (user.role === 'Tutor') {
          filterRole = 'Student'
          id = user.tutorID
          const requestResponse = await makeGet(`tutors/viewRequest/${id}`)
          const requests = requestResponse.data
          const studentIDsInClasses = userClasses
            .filter((cls) => cls.tutorID == id)
            .map((cls) => cls.studentID)
            .filter((studentID) => studentID !== null)

          const studentIDsInRequests = requests.map((req) => req.studentID).filter((studentID) => studentID !== null)
          filteredUsers = filteredUsers.filter(
            (user) => studentIDsInClasses.includes(user.studentID) || studentIDsInRequests.includes(user.studentID)
            //  || user.role == 'Admin'
          )
        } else if (user.role === 'Student') {
          filterRole = 'Tutor'
          id = user.studentID

          const requestResponse = await makeGet(`students/viewRequest/${id}`)
          const requests = requestResponse.data.data
          const tutorIDsInClasses = userClasses
            .filter((cls) => cls.studentID == id)
            .map((cls) => cls.tutorID)
            .filter((tutorID) => tutorID !== null)

          const tutorIDsInRequests = requests.map((req) => req.tutorID).filter((tutorID) => tutorID !== null)
          filteredUsers = filteredUsers.filter(
            (user) => tutorIDsInClasses.includes(user.tutorID) || tutorIDsInRequests.includes(user.tutorID)
            //  || user.role == 'Admin'
          )
        }

        setUsers(filteredUsers)
        if (filteredUsers.length > 0) {
          setSelectedUser(filteredUsers[0])
        }
      })
      .catch((error) => {
        console.error('Error fetching users:', error)
      })
    // }
  }, [user, isOpen]) // Add user.role as a dependency to ensure the effect runs when user.role changes

  useEffect(() => {
    if (selectedUser) {
      // Fetch chat history with the selected user
      handleGetMessage(user.userID, selectedUser.userID)
    }
  }, [user.userID, selectedUser])

  const handleGetMessage = async (senderID, receiverID) => {
    try {
      const response = await makeGet(`users/getMessage/${senderID}&${receiverID}`)
      setMessages(response.data.data)
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }

  const handleSendMessage = async () => {
    if (!selectedUser) return // Ensure a user is selected before sending a message

    if (!newMessage.trim()) {
      toast.error('Message cannot be empty!')
      return
    }

    const message = {
      senderID: user.userID,
      receiverID: selectedUser.userID,
      senderType: user.role,
      receiverType: selectedUser.role,
      messageText: newMessage,
      timestamp: new Date()
    }

    const response = await makePost(`users/sendMessage/${message.senderID}&${message.receiverID}`, {
      ...message
    })
    socket.emit('sendMessage', message)
    setNewMessage('')
  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSendMessage()
    }
  }

  const toggleChatBox = () => {
    setIsOpen(!isOpen)
    setIsSelectOpen(false)
  }

  const handleUserSelect = (user) => {
    setSelectedUser(user)
    setMessages(messages)
    setIsOpen(true) // Ensure the chat box is open after selecting a user
    setIsSelectOpen(false) // Close the user list after selecting a user
  }

  const toggleUserList = () => {
    setIsSelectOpen(!isSelectOpen)
  }

  if (!user) {
    return null // Return null if the user is not logged in
  }

  return (
    <div
      className={`fixed bottom-9 z-30 right-5 w-80 h-96 border border-gray-300 rounded-lg bg-white shadow-lg transition-transform transform ${
        isOpen ? 'translate-y-0' : 'translate-y-full'
      } flex flex-col`}
    >
      <div
        className='text-white bg-gradient-to-r from-orange-500 to-orange-800 p-2 cursor-pointer text-center rounded-t-lg flex items-center justify-between'
        onClick={toggleChatBox}
      >
        {isOpen ? <FaTimes size={20} /> : <FaComments size={20} />}
        <span className='font-bold'>{selectedUser ? `${selectedUser.fullName} Chat` : 'Select a User'}</span>
      </div>
      {isOpen && (
        <div className='flex flex-col h-full overflow-hidden'>
          <div className='flex-1 overflow-y-auto p-2 space-y-2'>
            {messages.length === 0 ? (
              <div className='flex-1 flex items-center justify-center text-gray-500'>No messages yet.</div>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`p-2 rounded-lg ${
                    msg.senderID === user.userID ? 'bg-green-100 self-end' : 'bg-gray-100 self-start'
                  }`}
                >
                  <strong>{msg.senderType}</strong>: {msg.messageText}
                  <span className='block text-xs text-gray-500'>{new Date(msg.timestamp).toLocaleTimeString()}</span>
                </div>
              ))
            )}
          </div>
          <div className='flex p-2 border-t border-gray-300'>
            <input
              type='text'
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder='Type a message'
              className='flex-1 p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
            <button
              onClick={handleSendMessage}
              className='bg-gradient-to-r from-orange-500 to-orange-800 text-white p-2 rounded-r-lg hover:bg-blue-600'
            >
              Send
            </button>
          </div>
          <div className='flex justify-center mt-2'>
            <button
              onClick={toggleUserList}
              className='bg-gradient-to-r from-orange-500 to-orange-800 text-white p-2 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none'
            >
              {isSelectOpen ? 'Close' : 'Select User'}
            </button>
          </div>
        </div>
      )}
      <div
        className={`absolute bottom-32 right-4 bg-white shadow-lg rounded-lg overflow-hidden p-3 max-h-60 w-60 border ${
          isSelectOpen ? 'block' : 'hidden'
        }`}
      >
        <h3 className='text-lg font-semibold mb-3'>Select a User</h3>
        <ul className='divide-y divide-gray-200 max-h-60 overflow-y-auto'>
          {users.map((user) => (
            <li
              key={user.userID}
              className='flex items-center cursor-pointer hover:bg-gradient-to-r hover:from-orange-500 hover:to-orange-800 p-2'
              onClick={() => handleUserSelect(user)}
            >
              <img
                src={
                  user.avatar
                    ? user.avatar
                    : 'https://img.freepik.com/free-vector/cute-man-business-cartoon-vector-icon-illustration-people-business-isolated-flat-vector_138676-10703.jpg'
                }
                alt={`${user.fullName}'s avatar`}
                className='w-8 h-8 rounded-full object-cover mr-2'
              />
              <div>
                <p className='text-sm text-black'>{user.fullName}</p>
                <p className='text-xs text-gray-500'>{user.role}</p>
              </div>
            </li>
          ))}
          <div className='h-20'></div>
        </ul>
      </div>
    </div>
  )
})

export default ChatBox
