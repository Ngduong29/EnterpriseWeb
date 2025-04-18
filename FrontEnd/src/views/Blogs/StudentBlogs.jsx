import React from 'react'
import BreadcrumbsWithIcon from '../../components/BreadCrumb.jsx'
import MegaMenuWithHover from '../../components/MegaMenuWithHover.jsx'
import { Link } from 'react-router-dom'
import { makeDelete, makeGet, makePost, makePostFormData, makePut } from '../../apiService/httpService.js'
import { useEffect, useState } from 'react'

const StudentBlogs = () => {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await makeGet('students/blogs', { class_id: '2' })
        setBlogs(response.data)
      } catch (error) {
        console.error('Error fetching blogs:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBlogs()
  }, [])

  if (loading) {
    return <div className='text-center'>Loading...</div>
  }

  if (!blogs || blogs.length === 0) {
    return <div className='text-center'>No blogs available</div>
  }

  return (
    <div className='container mx-auto p-4 pt-16'>
      <header>
        <MegaMenuWithHover />
      </header>
      <div className='w-full p-4 flex justify-between'>
        <div>
          <BreadcrumbsWithIcon pathnames={['Home', 'Blog']} />
        </div>
      </div>

      <main className='space-y-6'>
        {blogs.map((blog) => (
          <Link to={`/blogDetail/${blog.blog_id}`} key={blog.blog_id} state={blog}>
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
            <div className='mt-4'></div>
          </Link>
        ))}
      </main>
    </div>
  )
}

export default StudentBlogs
