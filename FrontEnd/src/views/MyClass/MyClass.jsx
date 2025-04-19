import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@material-tailwind/react'
import { ChatBubbleLeftIcon, NewspaperIcon, EllipsisHorizontalIcon } from '@heroicons/react/24/outline'
import BreadcrumbsWithIcon from '../../components/BreadCrumb.jsx'
import MegaMenuWithHover from '../../components/MegaMenuWithHover.jsx'
import { makeDelete, makeGet, makePost, makePostFormData, makePut } from '../../apiService/httpService.js'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'

const MyClass = () => {
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedClass, setSelectedClass] = useState([])

  const fetchClasses = async () => {
    try {
      setLoading(true)
      const response = await makeGet('students/classes')

      if (!response) {
        setError('No data found')
        return
      }
      const data = response.data

      setClasses(data)
      setSelectedClass(data[0]) // Set the first class as selected
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    fetchClasses()
  }, [])

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <header className='bg-purple-600 text-white shadow-md py-6'>
        <MegaMenuWithHover />
      </header>

      {/* Content */}
      <div className='container mx-auto pt-16 md:pt-20 '>
        <div className='flex flex-col lg:flex-row gap-6'>
          {/* Sidebar */}
          <aside className='lg:w-64 bg-blue-900 text-white p-6 rounded-lg shadow-md sticky top-0 h-max-parent'>
            <h2 className='text-xl font-semibold mb-6'>Lớp học</h2>
            <ul>
              {classes.map((cls) => (
                <li
                  key={cls.classID}
                  className={`p-3 rounded-lg mb-2 cursor-pointer transition-colors duration-200 ${
                    selectedClass.classID === cls.classID ? 'bg-blue-700' : 'hover:bg-blue-700'
                  }`}
                  onClick={() => setSelectedClass(cls)}
                  role='button'
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && setSelectedClass(cls)}
                  aria-current={selectedClass.classID === cls.classID ? 'true' : 'false'}
                >
                  <span className='block text-sm font-medium truncate'>{cls.className}</span>
                  <span className='text-xs text-blue-200'>{cls.subject}</span>
                </li>
              ))}
            </ul>
          </aside>
          {/* Main Content */}
          <main className='flex-1 bg-white p-8 rounded-lg shadow-md overflow-y-auto mt-10'>
            {classes.length === 0 ? (
              <div className='flex-1 flex items-center justify-center text-gray-500'>
                Không có lớp học nào để hiển thị.
              </div>
            ) : (
              <div className='mt-6 space-y-6'>
                {/* Class Information */}
                <div className='space-y-4'>
                  <h1 className='text-3xl font-bold text-gray-900'>{selectedClass.className}</h1>
                  <p className='text-gray-600'>
                    Môn học: <span className='font-medium'>{selectedClass.subject}</span>
                  </p>
                  <p className='text-gray-600'>
                    Giảng viên: <span className='font-medium'>{selectedClass.tutorFullName}</span>
                  </p>
                  <p className='text-gray-600'>
                    Ngày tham gia: <span className='font-medium'>{selectedClass.enrolledAt}</span>
                  </p>
                </div>

                {/* Action Buttons */}
                <div className='flex flex-col sm:flex-row gap-4'>
                  <Button
                    color='blue'
                    className='flex items-center justify-center space-x-2'
                    as={Link}
                    to={`/class/${selectedClass.classID}/chat`}
                  >
                    <ChatBubbleLeftIcon className='h-5 w-5' />
                    <span>Vào phòng chat</span>
                  </Button>

                  <Link to={`/my-classes/${selectedClass.classID}/blogs`}>
                    <Button color='blue' className='flex items-center justify-center space-x-2'>
                      <ChatBubbleLeftIcon className='h-5 w-5' />
                      <span> Go to Blogs</span>
                    </Button>
                  </Link>
                  <Button
                    variant='outlined'
                    color='blue'
                    className='flex items-center justify-center space-x-2'
                    onClick={() => alert('More features coming soon!')}
                  >
                    <EllipsisHorizontalIcon className='h-5 w-5' />
                    <span>Thêm</span>
                  </Button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

export default MyClass
