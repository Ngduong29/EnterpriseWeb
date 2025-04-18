import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@material-tailwind/react'
import { ChatBubbleLeftIcon, NewspaperIcon, EllipsisHorizontalIcon } from '@heroicons/react/24/outline'
import BreadcrumbsWithIcon from '../../components/BreadCrumb.jsx'
import MegaMenuWithHover from '../../components/MegaMenuWithHover.jsx'

const mockClasses = [
  {
    id: 1,
    className: 'Lập trình Web cơ bản',
    subject: 'WEB101',
    tutorFullName: 'Thầy Nguyễn Văn Nam',
    enrolledAt: '2025-01-15'
  },
  {
    id: 2,
    className: 'Cấu trúc dữ liệu và giải thuật',
    subject: 'DSA202',
    tutorFullName: 'Cô Trần Thị Huyền',
    enrolledAt: '2025-02-01'
  }
]

const MyClass = () => {
  const [classes] = useState(mockClasses)
  const [selectedClass, setSelectedClass] = useState(mockClasses[0])

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
                  key={cls.id}
                  className={`p-3 rounded-lg mb-2 cursor-pointer transition-colors duration-200 ${
                    selectedClass.id === cls.id ? 'bg-blue-700' : 'hover:bg-blue-700'
                  }`}
                  onClick={() => setSelectedClass(cls)}
                  role='button'
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && setSelectedClass(cls)}
                  aria-current={selectedClass.id === cls.id ? 'true' : 'false'}
                >
                  <span className='block text-sm font-medium truncate'>{cls.className}</span>
                  <span className='text-xs text-blue-200'>{cls.subject}</span>
                </li>
              ))}
            </ul>
          </aside>

          {/* Main Content */}
          <main className='flex-1 bg-white p-8 rounded-lg shadow-md overflow-y-auto mt-10'>
            <BreadcrumbsWithIcon pathnames={['Lớp học', selectedClass.className]} />
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
                  to={`/class/${selectedClass.id}/chat`}
                >
                  <ChatBubbleLeftIcon className='h-5 w-5' />
                  <span>Vào phòng chat</span>
                </Button>
                <Button
                  color='blue'
                  className='flex items-center justify-center space-x-2'
                  as={Link}
                  to={`/class/${selectedClass.id}/blog`}
                >
                  <NewspaperIcon className='h-5 w-5' />
                  <span>Xem blog lớp học</span>
                </Button>
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
          </main>
        </div>
      </div>
    </div>
  )
}

export default MyClass
