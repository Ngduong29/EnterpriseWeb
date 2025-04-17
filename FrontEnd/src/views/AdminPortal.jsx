import React, { useState, useEffect, useRef } from 'react'
import { MegaMenuWithHover } from '../components/MegaMenuWithHover.jsx'
import AccessDeniedPage from '../components/AccessDeniedPage.jsx'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { makeDelete, makeGet, makePostFormData, makePut } from '../apiService/httpService.js'
import axios from 'axios'

const AdminPortal = () => {
  const [users, setUsers] = useState([])
  const [allUsers, setAllUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRole, setSelectedRole] = useState('User') // Default selection is 'User'
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState(null)

  // Form data cho cả Student và Tutor
  const [formData, setFormData] = useState({
    userName: '',
    fullName: '',
    email: '',
    password: '',
    dateOfBirth: '',
    role: 'Student',
    phone: '',
    address: '',
    active: 1,
    // Trường cho Student
    grade: '10',
    school: 'Default School',
    // Trường cho Tutor
    workplace: 'Default Workplace',
    description: 'Default Description',
    // URL ảnh đại diện
    avatar: ''
  })

  // Refs cho file uploads
  const avatarRef = useRef(null)
  const degreesRef = useRef(null)
  const identityCardRef = useRef(null)

  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role')

  if (!token || role !== 'Admin') {
    return <AccessDeniedPage />
  }

  useEffect(() => {
    // Fetch users from the API
    makeGet('admin/getUser')
      .then((response) => {
        setUsers(response.data)
        setAllUsers(response.data)
      })
      .catch((error) => {
        console.error('Error fetching users:', error)
        toast.error('Can not load users data')
      })
  }, [])

  const handleInputChange = (e) => {
    const value = e.target.value
    setSearchTerm(value)

    filterUsers(value, selectedRole)
  }

  const handleRoleChange = (e) => {
    const value = e.target.value
    setSelectedRole(value)

    filterUsers(searchTerm, value)
  }

  const filterUsers = (searchTerm, role) => {
    let filteredUsers = allUsers

    if (searchTerm.trim() !== '') {
      filteredUsers = filteredUsers.filter(
        (user) =>
          (user.userName && user.userName.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (user.fullName && user.fullName.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    if (role !== 'User') {
      filteredUsers = filteredUsers?.filter((user) => user.role && user.role.toLowerCase() === role.toLowerCase())
    }

    setUsers(filteredUsers)
  }

  const toggleActiveStatus = (id, isActive) => {
    const newStatus = isActive ? 0 : 1
    const apiUrl = isActive ? `admin/banUsers/${id}` : `admin/unbanUsers/${id}`
    makePut(apiUrl)
      .then((response) => {
        setUsers(users.map((user) => (user.userID === id ? { ...user, isActive: newStatus } : user)))
        toast.success(isActive ? 'User has been banned' : 'Unbanned user')
      })
      .catch((error) => {
        console.error('Error updating user status:', error)
        toast.error('Can not update user data')
      })
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${day}/${month}/${year}`
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const openAddModal = () => {
    setEditingUser(null)
    setFormData({
      userName: '',
      fullName: '',
      email: '',
      password: '',
      dateOfBirth: '',
      role: 'Student',
      phone: '',
      address: '',
      active: 1,
      grade: '10',
      school: 'Default School',
      workplace: 'Default Workplace',
      description: 'Default Description',
      avatar: ''
    })

    // Reset các file input
    if (avatarRef.current) avatarRef.current.value = ''
    if (degreesRef.current) degreesRef.current.value = ''
    if (identityCardRef.current) identityCardRef.current.value = ''

    setIsModalOpen(true)
  }

  const openEditModal = (user) => {
    console.log("Found user:", user);
    setEditingUser(user)
    // Lấy thông tin cơ bản
    const baseFormData = {
      userID: user.userID,
      userName: user.userName || '',
      fullName: user.fullName || '',
      email: user.email || '',
      password: '',
      dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
      role: user.role || 'Student',
      phone: user.phone || '',
      address: user.address || '',
      active: user.isActive, // Sửa lỗi: sử dụng isActive từ API
      avatar: user.avatar || ''
    };

    // Thêm thông tin đặc biệt dựa theo role
    if (user.role === 'Student') {
      setFormData({
        ...baseFormData,
        grade: user.grade || '10',
        school: user.school || 'Default School'
      });
    }
    else if (user.role === 'Tutor') {
      setFormData({
        ...baseFormData,
        workplace: user.workplace || 'Default Workplace',
        description: user.description || 'Default Description',
        degrees: user.degrees || '',
        identityCard: user.identityCard || ''
      });
    }
    else {
      // Cho Admin, Moderator và các role khác
      setFormData(baseFormData);
    }

    setIsModalOpen(true);
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingUser(null)
  }

  const refreshUsersList = () => {
    makeGet('admin/getUser')
      .then((response) => {
        setUsers(response.data)
        setAllUsers(response.data)
      })
      .catch((error) => {
        console.error('Error fetching users:', error)
      })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      if (editingUser) {
        // Cập nhật người dùng hiện có
        await makePut(`users/update/${editingUser.userID}`, JSON.stringify(formData));
        toast.success('User update success');
      } else {
        // Tạo FormData để xử lý file uploads
        const formDataToSend = new FormData();
        
        // Thêm các trường cơ bản
        formDataToSend.append('userName', formData.userName);
        formDataToSend.append('fullName', formData.fullName);
        formDataToSend.append('email', formData.email);
        formDataToSend.append('password', formData.password);
        formDataToSend.append('dateOfBirth', formData.dateOfBirth);
        formDataToSend.append('phone', formData.phone);
        formDataToSend.append('address', formData.address);
        
        // Thêm avatar nếu có
        if (avatarRef.current && avatarRef.current.files[0]) {
          formDataToSend.append('avatar', avatarRef.current.files[0]);
        } else {
          // Nếu không có file, dùng URL nếu đã nhập
          formDataToSend.append('avatar', formData.avatar || '');
        }
        
        // Thêm các trường dựa trên role
        if (formData.role === 'Student') {
          formDataToSend.append('grade', formData.grade || '10');
          formDataToSend.append('school', formData.school || 'Default School');
          
          // Debug log
          console.log("FormData contents:", Object.fromEntries(formDataToSend.entries()));
          
          // Gọi API
          await makePostFormData('admin/registerStudent', formDataToSend);
        } else if (formData.role === 'Tutor') {
          formDataToSend.append('workplace', formData.workplace || 'Default Workplace');
          formDataToSend.append('description', formData.description || 'Default Description');
          
          // Thêm file bằng cấp và CMND nếu có
          if (degreesRef.current && degreesRef.current.files[0]) {
            formDataToSend.append('degrees', degreesRef.current.files[0]);
          } else {
            formDataToSend.append('degrees', 'default_degree.pdf');
          }
          
          if (identityCardRef.current && identityCardRef.current.files[0]) {
            formDataToSend.append('identityCard', identityCardRef.current.files[0]);
          } else {
            formDataToSend.append('identityCard', 'default_id.pdf');
          }
          
          // Gọi API đăng ký gia sư
          await makePostFormData('admin/registerTutor', formDataToSend);
        } else if (formData.role === 'Admin' || formData.role === 'Moderator') {
          // Dùng API registerStudent nhưng thay đổi role
          formDataToSend.append('grade', 'N/A');
          formDataToSend.append('school', 'N/A');
          formDataToSend.append('role', formData.role);
          
          await makePostFormData('admin/registerStudent', formDataToSend);
        }
        
        toast.success('User registered success');
      }
  
      closeModal();
      refreshUsersList();
    } catch (error) {
      console.error('Failed when saving data:', error);
      toast.error(error.message || 'Failed when saving data');
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Do you confirm that you want to delete this user?')) {
      try {
        await makeDelete(`users/${id}`)
        toast.success('User deleted')
        refreshUsersList()
      } catch (error) {
        console.error('Failed to delete user:', error)
        toast.error(error.response?.data?.message || 'Failed to delete user')
      }
    }
  }

  return (
    <div className='mx-auto p-6 bg-gray-100 min-h-screen'>
      <ToastContainer position='top-right' />
      <header className='bg-purple-600 text-white shadow-md py-4'>
        <MegaMenuWithHover />
      </header>
      <div className='pt-20'>
        <h1 className='text-4xl font-bold mb-6 text-center text-black'>
          Admin Portal - {allUsers?.length > 0 && allUsers.length} Users
        </h1>

        <div className='flex justify-between mb-6'>
          <div className='flex justify-center'>
            <input
              type='text'
              value={searchTerm}
              onChange={handleInputChange}
              className='border border-gray-400 p-2 rounded-lg flex-grow max-w-xl focus:outline-none focus:ring-2 focus:ring-purple-500'
              placeholder='Search by username'
            />
            <select
              value={selectedRole}
              onChange={handleRoleChange}
              className='ml-4 border border-gray-400 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500'
            >
              <option value='User'>User</option>
              <option value='Student'>Student</option>
              <option value='Tutor'>Tutor</option>
              <option value='Moderator'>Moderator</option>
            </select>
          </div>

          <button
            onClick={openAddModal}
            className='bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition-colors duration-300'
          >
            New
          </button>
        </div>

        <table className='mx-auto min-w-full bg-white shadow-md rounded-lg overflow-hidden'>
          <thead className='bg-gradient-to-t from-yellow-700 to-yellow-300 text-black'>
            <tr>
              <th className='p-4 text-left'>ID</th>
              <th className='p-4 text-left'>UserName</th>
              <th className='p-4 text-left'>FullName</th>
              <th className='p-4 text-left'>Email</th>
              <th className='p-4 text-left'>DateOfBirth</th>
              <th className='p-4 text-left'>Role</th>
              <th className='p-4 text-left'>Phone</th>
              <th className='p-4 text-left'>Address</th>
              <th className='p-4 text-left'>Active</th>
              <th className='p-4 text-left'>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.userID} className='border-b hover:bg-purple-50'>
                <td className='p-4'>{index + 1}</td>
                <td className='p-4'>{user.userName}</td>
                <td className='p-4'>{user.fullName}</td>
                <td className='p-4'>{user.email}</td>
                <td className='p-4'>{formatDate(user.dateOfBirth)}</td>
                <td className='p-4'>{user.role}</td>
                <td className='p-4'>{user.phone}</td>
                <td className='p-4'>{user.address}</td>
                <td className='p-4'>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm ${user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}
                  >
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className='p-4 flex gap-2'>
                  {user.role !== 'Admin' && (
                    <>
                      <button
                        onClick={() => toggleActiveStatus(user.userID, user.isActive)}
                        className={`p-2 rounded-lg transition-colors duration-300 ${user.isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                          } text-white`}
                      >
                        {user.isActive ? 'Ban' : 'Unban'}
                      </button>

                      <button
                        onClick={() => openEditModal(user)}
                        className='p-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-300'
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDeleteUser(user.userID)}
                        className='p-2 rounded-lg bg-red-700 hover:bg-red-800 text-white transition-colors duration-300'
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal thêm/sửa người dùng */}
      {isModalOpen && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto'>
          <div className='bg-white rounded-lg p-8 w-full max-w-xl mx-4 my-6'>
            <h2 className='text-2xl font-bold mb-4 text-center'>{editingUser ? 'Edit User' : 'Add New User'}</h2>

            <form onSubmit={handleSubmit}>
              <div className='space-y-3'>
                {/* Thông tin cơ bản - luôn hiển thị */}
                <div className='grid grid-cols-2 gap-3'>
                  <div>
                    <label className='block text-gray-700 text-sm font-semibold mb-1'>Username</label>
                    <input
                      type='text'
                      name='userName'
                      value={formData.userName}
                      onChange={handleFormChange}
                      className='w-full border border-gray-300 rounded-md p-2 text-sm'
                      required
                    />
                  </div>

                  <div>
                    <label className='block text-gray-700 text-sm font-semibold mb-1'>Full Name</label>
                    <input
                      type='text'
                      name='fullName'
                      value={formData.fullName}
                      onChange={handleFormChange}
                      className='w-full border border-gray-300 rounded-md p-2 text-sm'
                      required
                    />
                  </div>
                </div>

                <div className='grid grid-cols-2 gap-3'>
                  <div>
                    <label className='block text-gray-700 text-sm font-semibold mb-1'>Email</label>
                    <input
                      type='email'
                      name='email'
                      value={formData.email}
                      onChange={handleFormChange}
                      className='w-full border border-gray-300 rounded-md p-2 text-sm'
                      required
                    />
                  </div>

                  <div>
                    <label className='block text-gray-700 text-sm font-semibold mb-1'>
                      {editingUser ? 'Password (leave empty to keep current)' : 'Password'}
                    </label>
                    <input
                      type='password'
                      name='password'
                      value={formData.password}
                      onChange={handleFormChange}
                      className='w-full border border-gray-300 rounded-md p-2 text-sm'
                      required={!editingUser}
                    />
                  </div>
                </div>

                <div className='grid grid-cols-2 gap-3'>
                  <div>
                    <label className='block text-gray-700 text-sm font-semibold mb-1'>Date of Birth</label>
                    <input
                      type='date'
                      name='dateOfBirth'
                      value={formData.dateOfBirth}
                      onChange={handleFormChange}
                      className='w-full border border-gray-300 rounded-md p-2 text-sm'
                      required
                    />
                  </div>

                  <div>
                    <label className='block text-gray-700 text-sm font-semibold mb-1'>Role</label>
                    <select
                      name='role'
                      value={formData.role}
                      onChange={handleFormChange}
                      className='w-full border border-gray-300 rounded-md p-2 text-sm bg-white'
                      required
                    >
                      <option value='Student'>Student</option>
                      <option value='Tutor'>Tutor</option>
                      <option value='Moderator'>Moderator</option>
                      <option value='Admin'>Admin</option>
                    </select>
                  </div>
                </div>

                <div className='grid grid-cols-2 gap-3'>
                  <div>
                    <label className='block text-gray-700 text-sm font-semibold mb-1'>Phone</label>
                    <input
                      type='text'
                      name='phone'
                      value={formData.phone}
                      onChange={handleFormChange}
                      className='w-full border border-gray-300 rounded-md p-2 text-sm'
                      required
                    />
                  </div>

                  <div>
                    <label className='block text-gray-700 text-sm font-semibold mb-1'>Status</label>
                    <select
                      name='active'
                      value={formData.active}
                      onChange={handleFormChange}
                      className='w-full border border-gray-300 rounded-md p-2 text-sm bg-white'
                    >
                      <option value={1}>Active</option>
                      <option value={0}>Inactive</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className='block text-gray-700 text-sm font-semibold mb-1'>Address</label>
                  <input
                    type='text'
                    name='address'
                    value={formData.address}
                    onChange={handleFormChange}
                    className='w-full border border-gray-300 rounded-md p-2 text-sm'
                    required
                  />
                </div>

                {/* Upload Avatar cho tất cả người dùng */}
                <div>
                  <label className='block text-gray-700 text-sm font-semibold mb-1'>Avatar</label>
                  <input
                    type='file'
                    accept='image/*'
                    ref={avatarRef}
                    className='w-full border border-gray-300 rounded-md p-2 text-sm'
                  />
                  <p className='text-xs text-gray-500 mt-1'>Or enter image URL:</p>
                  <input
                    type='text'
                    name='avatar'
                    value={formData.avatar}
                    onChange={handleFormChange}
                    placeholder='URL to avatar image'
                    className='w-full border border-gray-300 rounded-md p-2 text-sm mt-1'
                  />
                </div>

                {/* Các trường riêng cho Student */}
                {!editingUser && formData.role === 'Student' && (
                  <div className='grid grid-cols-2 gap-3 pt-2 border-t border-gray-200'>
                    <div>
                      <label className='block text-gray-700 text-sm font-semibold mb-1'>Grade</label>
                      <input
                        type='text'
                        name='grade'
                        value={formData.grade}
                        onChange={handleFormChange}
                        className='w-full border border-gray-300 rounded-md p-2 text-sm'
                        required
                      />
                    </div>

                    <div>
                      <label className='block text-gray-700 text-sm font-semibold mb-1'>School</label>
                      <input
                        type='text'
                        name='school'
                        value={formData.school}
                        onChange={handleFormChange}
                        className='w-full border border-gray-300 rounded-md p-2 text-sm'
                        required
                      />
                    </div>
                  </div>
                )}

                {/* Các trường riêng cho Tutor */}
                {!editingUser && formData.role === 'Tutor' && (
                  <div className='pt-2 border-t border-gray-200 space-y-3'>
                    <div className='grid grid-cols-2 gap-3'>
                      <div>
                        <label className='block text-gray-700 text-sm font-semibold mb-1'>Workplace</label>
                        <input
                          type='text'
                          name='workplace'
                          value={formData.workplace}
                          onChange={handleFormChange}
                          className='w-full border border-gray-300 rounded-md p-2 text-sm'
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className='block text-gray-700 text-sm font-semibold mb-1'>Description</label>
                      <textarea
                        name='description'
                        value={formData.description}
                        onChange={handleFormChange}
                        className='w-full border border-gray-300 rounded-md p-2 text-sm'
                        rows={2}
                        required
                      />
                    </div>

                    <div className='grid grid-cols-2 gap-3'>
                      <div>
                        <label className='block text-gray-700 text-sm font-semibold mb-1'>Degree/Certificate</label>
                        <input
                          type='file'
                          accept='.pdf,.doc,.docx,image/*'
                          ref={degreesRef}
                          className='w-full border border-gray-300 rounded-md p-2 text-sm'
                        />
                      </div>

                      <div>
                        <label className='block text-gray-700 text-sm font-semibold mb-1'>Identity Card</label>
                        <input
                          type='file'
                          accept='.pdf,.doc,.docx,image/*'
                          ref={identityCardRef}
                          className='w-full border border-gray-300 rounded-md p-2 text-sm'
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className='flex justify-end gap-3 mt-6'>
                <button
                  type='button'
                  onClick={closeModal}
                  className='px-4 py-2 text-sm bg-gray-400 text-white rounded-md hover:bg-gray-500 transition-colors'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  className='px-4 py-2 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors'
                >
                  {editingUser ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminPortal