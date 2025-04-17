import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { MegaMenuWithHover } from '../components/MegaMenuWithHover.jsx'
import AccessDeniedPage from '../components/AccessDeniedPage.jsx'
import { makeDelete, makeGet } from '../apiService/httpService.js'
import { formatVND } from '../utils/format.js'
import StarRating, { ReadonlyStarRating } from '../components/StarRating.jsx'

const AdminPortalClass = () => {
  const [classes, setClasses] = useState([])
  const [allClasses, setAllClasses] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchClasses()
  }, [])

  const fetchClasses = async () => {
    makeGet('admin/classList')
      .then((response) => {
        setClasses(response.data)
        setAllClasses(response.data)
      })
      .catch((error) => {
        console.error('Error fetching classes:', error)
      })
  }

  const handleInputChange = (e) => {
    const value = e.target.value
    setSearchTerm(value)
    if (value.trim() !== '') {
      const filteredClasses = allClasses.filter((classItem) =>
        classItem.className.toLowerCase().includes(value.toLowerCase())
      )
      setClasses(filteredClasses)
    } else {
      // Reset classes list if search term is empty
      setClasses(allClasses)
    }
  }

  const deleteClass = (id) => {
    // Delete class
    makeDelete(`admin/deleteClass/${id}`)
      .then((response) => {
        setClasses(classes.filter((classItem) => classItem.id !== id))
        fetchClasses()
      })
      .catch((error) => {
        console.error('Error deleting class:', error)
      })
  }
  const videoUrlField = (link) =>
    link && link.length > 0 ? (
      <a href={link} target='_blank'>
        Video source
      </a>
    ) : (
      <span>No Video</span>
    )
  return (
    <div className='mx-auto p-6 bg-gray-100 min-h-screen'>
      <header className='bg-purple-600 text-white shadow-md py-4'>
        <MegaMenuWithHover />
      </header>
      <div className='pt-20'>
        <h1 className='text-4xl font-bold mb-6 text-center text-black'>Admin Portal - Classes</h1>
        <div className='flex justify-center mb-6'>
          <input
            type='text'
            value={searchTerm}
            onChange={handleInputChange}
            className='border border-gray-400 p-2 rounded-lg flex-grow max-w-xl focus:outline-none focus:ring-2 focus:ring-purple-500'
            placeholder='Search by class name'
          />
        </div>
        <table className='min-w-full bg-white shadow-md rounded-lg overflow-hidden'>
          <thead className='bg-gradient-to-t from-yellow-700 to-yellow-300 text-black'>
            <tr className='whitespace-nowrap'>
              <th className='p-4 text-left'>Class ID</th>
              <th className='p-4 text-left'>Class Name</th>
              <th className='p-4 text-left'>Video</th>
              <th className='p-4 text-left'>Tutor Name</th>
              <th className='p-4 text-left'>Students</th>
              <th className='p-4 text-left'>Subject</th>
              <th className='p-4 text-left'>Rating</th>
              <th className='p-4 text-left'>Description</th>
              <th className='p-4 text-left'>Price</th>
              <th className='p-4 text-left'>Active</th>
              <th className='p-4 text-left'>Action</th>
            </tr>
          </thead>
          <tbody>
            {classes &&
              classes.length > 0 &&
              classes.map((classItem, index) => (
                <tr key={classItem.classID} className='border-b hover:bg-purple-50'>
                  <td className='p-4'>{classItem.classID}</td>
                  <td className='p-4'>{classItem.className}</td>
                  <td className='p-4'>{videoUrlField(classItem.videoLink)}</td>
                  <td className='p-4'>{classItem.tutorFullName}</td>
                  <td className='p-4'>{classItem.studentCount}</td>
                  <td className='p-4'>{classItem.subject}</td>
                  <td className='p-4'>
                    <ReadonlyStarRating rate={classItem.rating} />
                  </td>
                  <td className='p-4 break-after-column break-word'>{classItem.description}</td>
                  <td className='p-4'>{formatVND(classItem.price)}</td>
                  <td className='p-4'>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm ${
                        classItem.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {classItem.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className='p-4'>
                    <button
                      onClick={() => deleteClass(classItem.classID)}
                      className='p-2 rounded-lg bg-red-500 text-white'
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminPortalClass
