import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { makeGet, makePost } from '../../apiService/httpService.js'
import MegaMenuWithHover from '../../components/MegaMenuWithHover.jsx'
import BreadcrumbsWithIcon from '../../components/BreadCrumb.jsx'

const StudentBlogs = () => {
  const { classID } = useParams()
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)

  // Form state
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [content, setContent] = useState('')

  const [status, setStatus] = useState('1')

  const fetchBlogs = async () => {
    try {
      setLoading(true)
      const response = await makeGet('students/blogs', { class_id: classID })
      setBlogs(response.data)
    } catch (error) {
      console.error('Error fetching blogs:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBlogs()
  }, [classID])

  const handleCreateBlog = async () => {
    try {
      await makePost('students/blogs', {
        class_id: classID,
        title,
        description,
        content,
        status
      })
      setShowModal(false)
      setTitle('')
      setDescription('')
      setStatus(1)
      fetchBlogs()
    } catch (error) {
      console.error('Error creating blog:', error)
    }
  }

  return (
    <div className='container mx-auto p-4 pt-16'>
      <header>
        <MegaMenuWithHover />
      </header>
      <div className='w-full p-4 flex justify-between mt-4'>
        <BreadcrumbsWithIcon pathnames={['Home', 'Blog']} />
        <button
          onClick={() => setShowModal(true)}
          className='inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700'
        >
          New Blog
        </button>
      </div>

      <main className='space-y-6'>
        {loading && <div className='text-center'>Loading...</div>}
        {!loading && blogs.length === 0 && <div className='text-center'>No blogs available</div>}

        {blogs.map((blog) => (
          <Link to={`/my-classes/${classID}/blogs/blogDetail/${blog.blog_id}`} key={blog.blog_id} state={blog}>
            <div className='border rounded-lg p-4 flex items-center space-x-4 hover:shadow-lg transition duration-300'>
              <img
                src='https://t.ex-cdn.com/danviet.vn/768w/files/news/2025/04/18/fb_img_1744977210928-1901.jpg'
                alt={blog.title}
                className='w-32 h-32 object-cover rounded'
              />
              <div>
                <h2 className='text-xl font-bold'>{blog.title}</h2>
                <p className='text-gray-600'>{blog.description}</p>
                <div className='flex items-center space-x-2 mt-2'>
                  <span>{blog.author ?? 'Me'}</span>
                  <span className='text-gray-500'>
                    {new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' }).format(
                      new Date(blog.created_at)
                    )}{' '}
                    • {blog.status}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </main>

      {/* Modal */}
      {showModal && (
        <div className='fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg p-6 w-full max-w-md shadow-lg'>
            <h2 className='text-xl font-bold mb-4'>New Blog</h2>
            <div className='space-y-10'>
              <input
                type='text'
                placeholder='Title'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className='w-full border border-gray-300 rounded p-2'
              />
              <textarea
                placeholder='Description'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className='w-full border border-gray-300 rounded p-2'
                rows={2}
              />
              <textarea
                placeholder='Content'
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className='w-full border border-gray-300 rounded p-2'
                rows={10}
              />
              <div className='flex justify-end space-x-2'>
                <button onClick={() => setShowModal(false)} className='px-4 py-2 rounded bg-gray-300 hover:bg-gray-400'>
                  Cancel
                </button>
                <button
                  onClick={handleCreateBlog}
                  className='px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700'
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default StudentBlogs
