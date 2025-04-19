import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import BreadcrumbsWithIcon from '../../components/BreadCrumb.jsx'
import MegaMenuWithHover from '../../components/MegaMenuWithHover.jsx'
import { makeGet } from '../../apiService/httpService.js'

const BlogDetail = () => {
  const { id } = useParams()
  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)

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

  return (
    <div className='container mx-auto p-4 pt-16'>
      <header>
        <MegaMenuWithHover />
      </header>

      <div className='w-full p-4 flex justify-between'>
        <BreadcrumbsWithIcon pathnames={['Home', 'Blog', 'Blog Detail']} />
      </div>

      <main className='space-y-6 max-w-3xl mx-auto'>
        {loading ? (
          <p className='text-center'>Loading...</p>
        ) : !blog ? (
          <p className='text-center text-red-500'>Blog not found.</p>
        ) : (
          <>
            <h1 className='text-4xl font-bold'>{blog.title}</h1>
            <div className='text-sm text-gray-500 mb-4'>
              <span>{formatDate(blog.created_at)}</span> • <span>{blog.status === 1 ? 'Published' : 'Draft'}</span>
            </div>
            <div className='prose max-w-none'>
              {blog.content ? <p>{blog.content}</p> : <p className='italic text-gray-400'>No content provided.</p>}
            </div>
          </>
        )}
      </main>
    </div>
  )
}

export default BlogDetail
