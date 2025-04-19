import React, { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { makeGet, makePost } from '../../apiService/httpService.js'
import MegaMenuWithHover from '../../components/MegaMenuWithHover.jsx'
import BreadcrumbsWithIcon from '../../components/BreadCrumb.jsx'

const StudentBlogs = () => {
  const { classID } = useParams()
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const navigate = useNavigate()

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
      setContent('')
      setStatus(1)
      fetchBlogs()
    } catch (error) {
      console.error('Error creating blog:', error)
    }
  }

  const formatDate = (dateStr) => {
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    }).format(new Date(dateStr))
  }

  // Tạo mảng breadcrumbs có URL đúng
  const breadcrumbs = [
    { name: 'Home', path: '/' },
    { name: 'My Classes', path: '/my-classes' },
    { name: 'Blogs', path: '#' } // Trang hiện tại, không click được
  ];

  return (
    <div className='min-h-screen bg-gray-50'>
      <header className='bg-orange-400 text-white shadow-md fixed top-0 w-full z-10'>
        <MegaMenuWithHover />
      </header>
      
      <div className='container mx-auto px-4 pt-24 pb-10'>
        <div className='flex flex-col md:flex-row justify-between items-center mb-8'>
          <div>
            <h1 className='text-3xl font-bold text-orange-800'>Class Blog</h1>
            <BreadcrumbsWithIcon pathnames={breadcrumbs} />
          </div>
          <button
            onClick={() => setShowModal(true)}
            className='mt-4 md:mt-0 px-6 py-3 bg-orange-500 text-white font-medium rounded-lg shadow-md hover:shadow-lg hover:bg-orange-600 transition duration-300 flex items-center'
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            New Blog
          </button>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          {loading && (
            <div className='col-span-full flex justify-center items-center py-20'>
              <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500'></div>
              <p className='ml-3 text-orange-500'>Loading blogs...</p>
            </div>
          )}
          
          {!loading && blogs.length === 0 && (
            <div className='col-span-full bg-white rounded-xl shadow-md p-12 text-center'>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1M19 20a2 2 0 002-2V8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2h8z" />
              </svg>
              <h3 className='text-xl font-medium text-gray-700 mb-2'>No blogs available</h3>
              <p className='text-gray-500'>Be the first to create a blog for this class!</p>
            </div>
          )}

          {blogs.map((blog) => (
            <Link to={`/my-classes/${classID}/blogs/blogDetail/${blog.blog_id}`} key={blog.blog_id} state={blog}>
              <div className='bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition duration-300 flex flex-col h-full transform hover:-translate-y-1'>
                <div className='h-48 overflow-hidden'>
                  <img
                    src='https://t.ex-cdn.com/danviet.vn/768w/files/news/2025/04/18/fb_img_1744977210928-1901.jpg'
                    alt={blog.title}
                    className='w-full h-full object-cover transition duration-300 hover:scale-105'
                  />
                </div>
                <div className='p-6 flex-grow'>
                  <div className='flex items-center text-xs text-gray-500 mb-2'>
                    <span className={`rounded-full px-3 py-1 ${
                      blog.status === '1' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {blog.status === '1' ? 'Published' : 'Draft'}
                    </span>
                    <span className='mx-2'>•</span>
                    <span>{formatDate(blog.created_at)}</span>
                  </div>
                  <h2 className='text-xl font-bold text-gray-800 mb-2 line-clamp-2'>{blog.title}</h2>
                  <p className='text-gray-600 mb-4 line-clamp-3'>{blog.description || 'No description provided'}</p>
                  <div className='flex items-center mt-auto'>
                    <div className='w-8 h-8 rounded-full bg-orange-200 flex items-center justify-center text-orange-700 font-bold'>
                      {blog.author ? blog.author.charAt(0).toUpperCase() : 'M'}
                    </div>
                    <span className='ml-2 text-gray-700'>{blog.author ?? 'Me'}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className='fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-lg max-w-xl w-full shadow-2xl overflow-hidden'>
            <div className='bg-orange-500 py-4 px-6'>
              <h2 className='text-xl font-bold text-white'>Create New Blog</h2>
            </div>
            <div className='p-6 space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Title</label>
                <input
                  type='text'
                  placeholder='Enter blog title'
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className='w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Description</label>
                <textarea
                  placeholder='Brief description of your blog'
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className='w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent'
                  rows={3}
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Content</label>
                <textarea
                  placeholder='Write your blog content here...'
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className='w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent'
                  rows={8}
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Status</label>
                <select 
                  value={status} 
                  onChange={(e) => setStatus(e.target.value)}
                  className='w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent'
                >
                  <option value="1">Published</option>
                  <option value="0">Draft</option>
                </select>
              </div>
              <div className='flex justify-end space-x-3 pt-4 border-t'>
                <button 
                  onClick={() => setShowModal(false)} 
                  className='px-5 py-2.5 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 transition duration-200'
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateBlog}
                  className='px-5 py-2.5 rounded-lg bg-orange-500 text-white hover:bg-orange-600 hover:shadow-lg transition duration-200'
                >
                  Create Blog
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