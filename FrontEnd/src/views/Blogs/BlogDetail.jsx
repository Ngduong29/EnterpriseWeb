import React from 'react'
import BreadcrumbsWithIcon from '../../components/BreadCrumb.jsx'
import MegaMenuWithHover from '../../components/MegaMenuWithHover.jsx'
import { Link } from 'react-router-dom'

const mockBlogs = {
  id: 1,
  title: '48 Giờ ở Amanoi với bác Trịnh Lữ',
  description:
    'Tôi được mời một chuyến du ngoạn tới Amanoi vào dịp cuối tháng 3 – thời điểm đẹp nhất trong năm của vùng Vĩnh Hy. Không chỉ đơn nghi dưỡng, chúng tôi đã tham dự workshop Việt...',
  author: 'Thuỷ Minh',
  date: '15 Thg 04',
  readTime: '7 phút đọc',
  image: '/images/sample-blog.jpg'
}

const BlogDetail = () => {
  return (
    <div className='container mx-auto p-4 pt-16'>
      <header>
        <MegaMenuWithHover />
      </header>

      <div className='w-full p-4 flex justify-between'>
        <BreadcrumbsWithIcon pathnames={['Home', 'Blog', 'Blog Detail']} />
      </div>

      <main className='space-y-6 max-w-3xl mx-auto'>
        <h1 className='text-4xl font-bold'>{mockBlogs.title}</h1>

        <div className='text-gray-500 text-sm flex gap-4'>
          <span>{mockBlogs.author}</span>
          <span>{mockBlogs.date}</span>
          <span>{mockBlogs.readTime}</span>
        </div>

        {/* <img src={mockBlogs.image} alt={mockBlogs.title} className='w-full rounded-xl shadow-md' /> */}

        <p className='text-lg leading-relaxed'>{mockBlogs.description}</p>
      </main>
    </div>
  )
}

export default BlogDetail
