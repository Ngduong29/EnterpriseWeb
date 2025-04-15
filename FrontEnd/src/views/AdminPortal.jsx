import React, { useState, useEffect } from 'react'
import { MegaMenuWithHover } from '../components/MegaMenuWithHover.jsx'
import AccessDeniedPage from '../components/AccessDeniedPage.jsx'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { makeDelete, makeGet, makePost, makePut } from '../apiService/httpService.js'

const AdminPortal = () => {
  const [users, setUsers] = useState([])
  const [allUsers, setAllUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRole, setSelectedRole] = useState('User') // Default selection is 'User'
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [formData, setFormData] = useState({
    userName: '',
    fullName: '',
    email: '',
    password: '',
    dateOfBirth: '',
    role: 'Student',
    phone: '',
    address: '',
    active: 1
  })
  const token = localStorage.getItem('token') // hoặc nơi bạn lưu token
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
    // Update user's active status
    const newStatus = isActive ? 0 : 1
    const apiUrl = isActive ? `admin/banUsers/${id}` : `admin/unbanUsers/${id}`
    makePut(apiUrl)
      .then((response) => {
        setUsers(users.map((user) => (user.userID === id ? { ...user, isActive: newStatus } : user)))
        toast.success(isActive ? 'User has been banned' : 'Unbanned user')
      })
      .catch((error) => {
        console.error('Error updating user status:', error)
        toast.error('Can not up date user data')
      })
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${day}/${month}/${year}`
  }

  // Thêm các hàm xử lý form
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
      active: 1
    })
    setIsModalOpen(true)
  }

  const openEditModal = (user) => {
    setEditingUser(user)
    setFormData({
      userName: user.userName || '',
      fullName: user.fullName || '',
      email: user.email || '',
      password: '',
      dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
      role: user.role || 'Student',
      phone: user.phone || '',
      address: user.address || '',
      active: user.active || 0
    })
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
    e.preventDefault()

    try {
      if (editingUser) {
        // Cập nhật người dùng hiện có
        await makePut(`users/update/${editingUser.userID}`, JSON.stringify(formData))
        toast.success('User update success')
      } else {
        // Tạo người dùng mới
        await makePost('auth/registerTutor', formData)
        toast.success('User registered success')
      }

      closeModal()
      refreshUsersList() // Tải lại danh sách người dùng
    } catch (error) {
      console.error('Failed when saving data', error)
      toast.error(error.response?.data?.message || 'Failed when saving data')
    }
  }

  const handleDeleteUser = async (id) => {
    if (window.confirm('Do you confirm that you want to delete this user?')) {
      try {
        await makeDelete(`users/${id}`)
        toast.success('User deleted')
        refreshUsersList() // Tải lại danh sách người dùng
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
                    className={`inline-block px-3 py-1 rounded-full text-sm ${
                      user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
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
                        className={`p-2 rounded-lg transition-colors duration-300 ${
                          user.isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
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
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg p-8 w-full max-w-2xl'>
            <h2 className='text-2xl font-bold mb-6 text-center'>{editingUser ? 'Edit User' : 'Add New User'}</h2>

            <form onSubmit={handleSubmit}>
              <div className='grid grid-cols-2 gap-4'>
                <div className='mb-4'>
                  <label className='block text-gray-700 mb-2'>Username</label>
                  <input
                    type='text'
                    name='userName'
                    value={formData.userName}
                    onChange={handleFormChange}
                    className='w-full border border-gray-300 rounded-lg p-2'
                    required
                  />
                </div>

                <div className='mb-4'>
                  <label className='block text-gray-700 mb-2'>Full Name</label>
                  <input
                    type='text'
                    name='fullName'
                    value={formData.fullName}
                    onChange={handleFormChange}
                    className='w-full border border-gray-300 rounded-lg p-2'
                    required
                  />
                </div>

                <div className='mb-4'>
                  <label className='block text-gray-700 mb-2'>Email</label>
                  <input
                    type='email'
                    name='email'
                    value={formData.email}
                    onChange={handleFormChange}
                    className='w-full border border-gray-300 rounded-lg p-2'
                    required
                  />
                </div>

                <div className='mb-4'>
                  <label className='block text-gray-700 mb-2'>
                    {editingUser ? 'Password (leave empty to keep current)' : 'Password'}
                  </label>
                  <input
                    type='password'
                    name='password'
                    value={formData.password}
                    onChange={handleFormChange}
                    className='w-full border border-gray-300 rounded-lg p-2'
                    required={!editingUser}
                  />
                </div>

                <div className='mb-4'>
                  <label className='block text-gray-700 mb-2'>Date of Birth</label>
                  <input
                    type='date'
                    name='dateOfBirth'
                    value={formData.dateOfBirth}
                    onChange={handleFormChange}
                    className='w-full border border-gray-300 rounded-lg p-2'
                    required
                  />
                </div>

                <div className='mb-4'>
                  <label className='block text-gray-700 mb-2'>Role</label>
                  <select
                    name='role'
                    value={formData.role}
                    onChange={handleFormChange}
                    className='w-full border border-gray-300 rounded-lg p-2'
                    required
                  >
                    <option value='Student'>Student</option>
                    <option value='Tutor'>Tutor</option>
                    <option value='Moderator'>Moderator</option>
                    <option value='Admin'>Admin</option>
                  </select>
                </div>

                <div className='mb-4'>
                  <label className='block text-gray-700 mb-2'>Phone</label>
                  <input
                    type='text'
                    name='phone'
                    value={formData.phone}
                    onChange={handleFormChange}
                    className='w-full border border-gray-300 rounded-lg p-2'
                    required
                  />
                </div>

                <div className='mb-4'>
                  <label className='block text-gray-700 mb-2'>Address</label>
                  <input
                    type='text'
                    name='address'
                    value={formData.address}
                    onChange={handleFormChange}
                    className='w-full border border-gray-300 rounded-lg p-2'
                    required
                  />
                </div>

                <div className='mb-4'>
                  <label className='block text-gray-700 mb-2'>Status</label>
                  <select
                    name='active'
                    value={formData.active}
                    onChange={handleFormChange}
                    className='w-full border border-gray-300 rounded-lg p-2'
                  >
                    <option value={1}>Active</option>
                    <option value={0}>Inactive</option>
                  </select>
                </div>
              </div>

              <div className='flex justify-end gap-4 mt-6'>
                <button
                  type='button'
                  onClick={closeModal}
                  className='px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-colors'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  className='px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors'
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
