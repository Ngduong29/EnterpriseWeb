import { useEffect, useState } from 'react'
import ChatBox from './ChatBox'
import { makePost } from '../apiService/httpService'
import supabase from '../apiService/supabase'
import { makeGet } from '../apiService/httpService'
const ChatRoomList = ({ user }) => {
  const [classes, setClasses] = useState([])
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [isOpen, setIsOpen] = useState(false)

  const fetchRooms = async () => {
    if (user.role === 'Tutor') {
      const response = await makePost(`tutors/findClasses/${user.tutorID}`)
      if (response) {
        const activeClasses = response.classroom.filter((c) => c.isActive)
        setClasses(activeClasses)
      }
    }

    if (user.role === 'Student') {
      const response = await makeGet(`students/classes`)
      if (response) {
        const activeClasses = response.data.filter((c) => c.isActive)
        setClasses(activeClasses)
      }
    }
  }
  const handleSelectRoom = async (classID) => {
    const { data, error } = await supabase.from('chat_rooms').select('*').eq('class_id', classID)

    if (error) {
      console.error('Error fetching chat room:', error)
    }

    if (data && data.length) {
      setSelectedRoom(data[0].class_id)
      setIsOpen(false)
    } else {
      await createChatRoom(classID)
    }
  }

  const createChatRoom = async (classID) => {
    const response = await makeGet(`users/getClass/${classID}`)
    if (response && response.data) {
      const classData = response.data
      const newRoom = {
        name: classData.className,
        tutor_id: classData.tutorID,
        class_id: +classData.classID
      }

      const { data, error } = await supabase.from('chat_rooms').insert([newRoom]).select()

      if (error) {
        console.log('Error creating chat room:', error)
        return
      } else {
        const newChatRoomID = data[0]?.class_id
        const { error: memberError } = await supabase.from('chat_room_members').insert([
          {
            chat_room_id: newChatRoomID,
            role: 'Tutor',
            user_id: user.userID,
            user_name: user.userName
          }
        ])

        if (memberError) {
          console.log('Error adding tutor member:', memberError)
          return
        }
        setSelectedRoom(classID)
        setIsOpen(false)
      }
    }
  }

  useEffect(() => {
    fetchRooms()
  }, [user])

  const toggleOpen = () => setIsOpen((prev) => !prev)

  return (
    <div className='fixed bottom-0 right-4 w-80 z-50 shadow-lg'>
      {/* Header */}
      <div
        onClick={toggleOpen}
        className='bg-blue-600 text-white p-3 rounded-t-lg cursor-pointer flex justify-between items-center'
      >
        <span className='font-semibold'>Chat rooms</span>
        <span className='text-white text-sm'>{isOpen ? '▼' : '▲'}</span>
      </div>

      {/* Room list */}
      <div
        className={`bg-white text-blue-800 transition-all duration-300 overflow-hidden ${
          isOpen ? 'max-h-96' : 'max-h-0'
        }`}
      >
        <ul className='divide-y divide-gray-200'>
          {classes.map((cls) => (
            <li
              key={cls.classID}
              className='p-3 hover:bg-gray-100 cursor-pointer'
              onClick={() => {
                handleSelectRoom(cls.classID)
              }}
            >
              {cls.className}
            </li>
          ))}
        </ul>
      </div>

      {/* ChatBox hiển thị luôn bên dưới nếu có selectedRoom */}
      {selectedRoom && (
        <div className='h-96 bg-white border border-t-0 rounded-b-lg'>
          <ChatBox user={user} classID={selectedRoom} onClose={() => setSelectedRoom(null)} />
        </div>
      )}
    </div>
  )
}

export default ChatRoomList
