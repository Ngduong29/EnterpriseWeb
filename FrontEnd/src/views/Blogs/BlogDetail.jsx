import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import BreadcrumbsWithIcon from '../../components/BreadCrumb.jsx'
import MegaMenuWithHover from '../../components/MegaMenuWithHover.jsx'
import { makeGet } from '../../apiService/httpService.js'

const BlogDetail = () => {
  const { id, classID } = useParams()
  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  // Phân tích URL để lấy classID nếu không có trong params
  const getClassID = () => {
    if (classID) return classID;
    
    const currentUrl = window.location.pathname;
    const urlParts = currentUrl.split('/');
    const classIdIndex = urlParts.indexOf('my-classes') + 1;
    
    return (classIdIndex > 0 && urlParts[classIdIndex]) ? urlParts[classIdIndex] : null;
  };
  
  const currentClassID = getClassID();

  const fetchBlogDetail = async () => {
    try {
      const response = await makeGet(`students/blogs/${id}`)
      setBlog(response.data)
    } catch (error) {
      console.error('Error fetching blog detail:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBlogDetail()
  }, [id])

  const formatDate = (dateStr) => {
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(new Date(dateStr))
  }

  const handleGoBack = () => {
    if (currentClassID) {
      navigate(`/my-classes/${currentClassID}/blogs`);
    } else {
      navigate('/Blog');
    }
  }

  // Tạo mảng các breadcrumb có URL đúng
  const breadcrumbs = [
    { name: 'Home', path: '/' },
    { name: 'My Classes', path: '/my-classes' },
    { name: 'Blogs', path: currentClassID ? `/my-classes/${currentClassID}/blogs` : '/Blog' },
    { name: 'Blog Detail', path: '#' }  // # cho trang hiện tại
  ];

  return (
    <div className='container mx-auto p-4 pt-16'>
      <header>
        <MegaMenuWithHover />
      </header>

      <div className='w-full p-4 flex justify-between items-center'>
        {/* Truyền mảng breadcrumbs thay vì chỉ tên */}
        <BreadcrumbsWithIcon pathnames={breadcrumbs} />
        
        <button
          onClick={handleGoBack}
          className='flex items-center px-4 py-2 bg-orange-400 text-white rounded-lg hover:bg-orange-500 transition duration-300'
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Blogs
        </button>
      </div>

      <main className='space-y-6 max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md'>
        {/* Phần còn lại giữ nguyên */}
        {loading ? (
          <div className='flex justify-center items-center py-10'>
            <div className='animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-500'></div>
            <p className='ml-3 text-orange-500'>Loading...</p>
          </div>
        ) : !blog ? (
          <div className='text-center py-10'>
            <div className='text-red-500 text-5xl mb-4'>😕</div>
            <p className='text-center text-red-500 font-semibold text-xl'>Blog not found.</p>
            <button
              onClick={handleGoBack}
              className='mt-4 px-4 py-2 bg-orange-400 text-white rounded-lg hover:bg-orange-500 transition duration-300'
            >
              Return to Blogs
            </button>
          </div>
        ) : (
          <>
            <h1 className='text-4xl font-bold text-gray-800'>{blog.title}</h1>
            
            <div className='text-sm text-gray-500 mb-4 flex items-center'>
              <span className='mr-2'>{formatDate(blog.created_at)}</span> • 
              <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                blog.status === 1 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {blog.status === 1 ? 'Published' : 'Draft'}
              </span>
            </div>
            
            <div className='prose max-w-none'>
              {blog.content ? 
                blog.content.split('\n').map((paragraph, index) => (
                  <p key={index} className='mb-4 text-gray-700'>{paragraph}</p>
                ))
               : <p className='italic text-gray-400'>No content provided.</p>}
            </div>
          </>
        )}
      </main>
    </div>
  )
}

export default BlogDetail