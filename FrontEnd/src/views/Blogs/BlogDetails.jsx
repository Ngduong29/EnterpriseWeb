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
  const [authorBlogs, setAuthorBlogs] = useState([]);
  const [authorBlogsLoading, setAuthorBlogsLoading] = useState(true);
  const [authorInfo, setAuthorInfo] = useState(null);

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
      if (response.data?.student_id) {
      // Filter out the current blog from the list
      const authorResponse = await makeGet(`students/blogs/author/${response.data.student_id}`);
      const filteredBlogs = authorResponse.data.filter(authorBlog => authorBlog.id !== parseInt(id));
        setAuthorBlogs(filteredBlogs);
      }
    } catch (error) {
      console.error('Error fetching blog detail:', error)
    } finally {
      setLoading(false);
      setAuthorBlogsLoading(false);
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
    <div className='min-h-screen bg-gray-50'>
      <header className='bg-orange-400 text-white shadow-md fixed top-0 w-full z-20'>
        <MegaMenuWithHover />
      </header>

      <div className='container mx-auto px-3 sm:px-4 md:px-6 pt-20'>
        {/* Breadcrumb section - Responsive */}
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 border-b border-gray-200 mb-4 sm:mb-6 gap-2'>
          <div className='w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 -mx-3 px-3 sm:mx-0 sm:px-0'>
            <BreadcrumbsWithIcon pathnames={breadcrumbs} />
          </div>
          <button
            onClick={handleGoBack}
            className='flex items-center px-3 py-1.5 sm:px-4 sm:py-2 bg-orange-400 text-white text-sm sm:text-base rounded-lg hover:bg-orange-500 transition duration-300 whitespace-nowrap'
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Blogs
          </button>
        </div>

        <main className='space-y-4 sm:space-y-6 max-w-3xl mx-auto bg-white p-4 sm:p-6 rounded-lg shadow-md mb-6 sm:mb-10'>
          {loading ? (
            <div className='flex justify-center items-center py-8 sm:py-10'>
              <div className='animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-t-2 border-b-2 border-orange-500'></div>
              <p className='ml-3 text-orange-500 text-sm sm:text-base'>Loading...</p>
            </div>
          ) : !blog ? (
            <div className='text-center py-8 sm:py-10'>
              <div className='text-red-500 text-4xl sm:text-5xl mb-3 sm:mb-4'>😕</div>
              <p className='text-center text-red-500 font-semibold text-lg sm:text-xl'>Blog not found.</p>
              <button
                onClick={handleGoBack}
                className='mt-3 sm:mt-4 px-3 py-1.5 sm:px-4 sm:py-2 bg-orange-400 text-white text-sm sm:text-base rounded-lg hover:bg-orange-500 transition duration-300'
              >
                Return to Blogs
              </button>
            </div>
          ) : (
            <>
              <h1 className='text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800'>{blog.title}</h1>
              
              <div className='text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4 flex flex-wrap items-center gap-1 sm:gap-0'>
                <span className='mr-1 sm:mr-2'>{formatDate(blog.created_at)}</span> • 
                <span className={`ml-1 sm:ml-2 px-2 py-0.5 sm:px-2 sm:py-1 rounded-full text-xs ${
                  blog.status === 1 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {blog.status === 1 ? 'Published' : 'Draft'}
                </span>
              </div>
              
              <div className='prose max-w-none text-sm sm:text-base'>
                {blog.content ? 
                  blog.content.split('\n').map((paragraph, index) => (
                    <p key={index} className='mb-3 sm:mb-4 text-gray-700'>{paragraph}</p>
                  ))
                : <p className='italic text-gray-400'>No content provided.</p>}
              </div>
              
              <div className='pt-4 sm:pt-6 mt-4 sm:mt-6 border-t border-gray-200'>
                <div className='flex items-center'>
                  <div className='w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-orange-200 flex items-center justify-center text-orange-700 font-bold text-xs sm:text-sm'>
                    {blog.author ? blog.author.charAt(0).toUpperCase() : 'M'}
                  </div>
                  <span className='ml-2 text-gray-700 text-sm sm:text-base'>{blog.author ?? 'Me'}</span>
                </div>
              </div>
            </>
          )}
        </main>
        <div className="mt-12 border-t pt-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        More from {authorInfo?.full_name || 'this author'}
      </h2>
      {authorBlogs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {authorBlogs.slice(0, 4).map((authorBlog) => (
            <Link 
              to={`/Blog/${authorBlog.id}`}
              key={authorBlog.id}
              className="block bg-white rounded-lg shadow-sm hover:shadow-md transition duration-300"
            >
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                  {authorBlog.title}
                </h3>
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <span>{formatDate(authorBlog.created_at)}</span>
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                    authorBlog.status === 1 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {authorBlog.status === 1 ? 'Published' : 'Draft'}
                  </span>
                </div>
                <p className="text-gray-600 line-clamp-2">
                  {authorBlog.content}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 italic">No other blogs from this author.</p>
      )}
    </div>
      </div>
    </div>
  )
}

export default BlogDetail