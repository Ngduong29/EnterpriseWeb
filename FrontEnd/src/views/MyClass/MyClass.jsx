import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@material-tailwind/react'
import { ChatBubbleLeftIcon, NewspaperIcon, EllipsisHorizontalIcon } from '@heroicons/react/24/outline'
import BreadcrumbsWithIcon from '../../components/BreadCrumb.jsx'
import MegaMenuWithHover from '../../components/MegaMenuWithHover.jsx'
import { makeGet } from '../../apiService/httpService.js'
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

  useEffect(() => {
    fetchClasses()
  }, [])

  // Hàm format ngày tháng năm
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    
    // Giả sử dateStr có định dạng là "2025-04-13T06:33:04.000Z" hoặc tương tự
    // Nếu dateStr là định dạng khác, bạn có thể cần điều chỉnh
    try {
      const date = new Date(dateStr);
      
      // Tạo chuỗi ngày/tháng/năm, ví dụ: 13/04/2025
      return new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).format(date);
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateStr; // Trả về chuỗi gốc nếu có lỗi
    }
  };

  // Breadcrumbs
  const breadcrumbs = [
    { name: 'Home', path: '/' },
    { name: 'My Classes', path: '#' }
  ];

  return (
    <div className='flex flex-col min-h-screen bg-gray-50'>
      <header className='bg-orange-400 text-white shadow-md fixed top-0 w-full z-10'>
        <MegaMenuWithHover />
      </header>

      <div className='flex-1 flex flex-col pt-20 px-4 md:px-6 lg:px-8'>
        <div className='mb-4 ml-1 mt-4'>
          <BreadcrumbsWithIcon pathnames={breadcrumbs} />
        </div>

        <div className='flex flex-col lg:flex-row gap-6 h-full'>
          <aside className='lg:w-64 bg-blue-900 text-white p-6 rounded-lg shadow-md lg:sticky lg:top-32 self-start'>
            <h2 className='text-xl font-semibold mb-6'>My Classes</h2>
            <div className='max-h-[calc(100vh-180px)] overflow-y-auto'>
              <ul className='space-y-2'>
                {classes.map((cls) => (
                  <li
                    key={cls.classID}
                    className={`p-3 rounded-lg cursor-pointer transition-colors duration-200 ${
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
            </div>
          </aside>

          <main className='flex-1 bg-white p-6 md:p-8 rounded-lg shadow-md min-h-[calc(100vh-180px)]'>
            {loading ? (
              <div className='flex justify-center items-center h-full'>
                <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500'></div>
                <p className='ml-3 text-orange-500'>Loading classes...</p>
              </div>
            ) : classes.length === 0 ? (
              <div className='flex flex-col items-center justify-center h-full text-gray-500'>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 19 7.5 19s3.332-.477 4.5-1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 19 16.5 19c-1.746 0-3.332-.477-4.5-1.253" />
                </svg>
                <p className='text-xl font-medium'>No classes found</p>
                <p className='mt-2 text-gray-500'>You haven't enrolled in any classes yet.</p>
              </div>
            ) : (
              <div className='space-y-6'>
                <h1 className='text-3xl font-bold text-gray-900'>{selectedClass.className}</h1>
                
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4'>
                  <div className='bg-gray-50 p-4 rounded-lg'>
                    <p className='text-gray-600'>
                      Subject: <span className='font-medium text-gray-800'>{selectedClass.subject}</span>
                    </p>
                  </div>
                  <div className='bg-gray-50 p-4 rounded-lg'>
                    <p className='text-gray-600'>
                      Tutor: <span className='font-medium text-gray-800'>{selectedClass.tutorFullName}</span>
                    </p>
                  </div>
                  <div className='bg-gray-50 p-4 rounded-lg'>
                    <p className='text-gray-600'>
                      Enrolled Date: <span className='font-medium text-gray-800'>{formatDate(selectedClass.enrolledAt)}</span>
                    </p>
                  </div>
                  <div className='bg-gray-50 p-4 rounded-lg'>
                    <p className='text-gray-600'>
                      Status: <span className='font-medium text-green-600'>Active</span>
                    </p>
                  </div>
                </div>

                <div className='flex flex-col sm:flex-row gap-4 mt-8'>
                  <Button
                    color='blue'
                    className='flex items-center justify-center space-x-2 bg-orange-500 hover:bg-orange-600'
                    as={Link}
                    to={`/class/${selectedClass.classID}/chat`}
                  >
                    <ChatBubbleLeftIcon className='h-5 w-5' />
                    <span>Join Chat Room</span>
                  </Button>

                  <Link to={`/my-classes/${selectedClass.classID}/blogs`}>
                    <Button color='blue' className='flex items-center justify-center space-x-2 bg-blue-500 hover:bg-blue-600'>
                      <NewspaperIcon className='h-5 w-5' />
                      <span>Go to Blogs</span>
                    </Button>
                  </Link>
                  <Button
                    variant='outlined'
                    color='blue'
                    className='flex items-center justify-center space-x-2 border-gray-300 text-gray-700 hover:bg-gray-50'
                  >
                    <EllipsisHorizontalIcon className='h-5 w-5' />
                    <span>More</span>
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