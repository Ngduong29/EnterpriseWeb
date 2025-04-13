import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { MegaMenuWithHover } from '../components/MegaMenuWithHover.jsx'
import AccessDeniedPage from '../components/AccessDeniedPage.jsx'

const AdminPortal = () => {
  const [users, setUsers] = useState([])
  const [allUsers, setAllUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRole, setSelectedRole] = useState('User') // Default selection is 'User'
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role')

  if (!token || role !== 'Admin') {
    return <AccessDeniedPage />
  }

  useEffect(() => {
    // Fetch users from the API
    axios
      .get('http://localhost:5000/api/admin/getUser')
      .then((response) => {
        setUsers(response.data.data)
        setAllUsers(response.data.data)
      })
      .catch((error) => {
        console.error('Error fetching users:', error)
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
      filteredUsers = filteredUsers.filter((user) => user.role && user.role.toLowerCase() === role.toLowerCase())
    }

    setUsers(filteredUsers)
  }

  const toggleActiveStatus = (id, isActive) => {
    // Update user's active status
    const newStatus = isActive ? 0 : 1
    const apiUrl = isActive
      ? `http://localhost:5000/api/admin/banUsers/${id}`
      : `http://localhost:5000/api/admin/unbanUsers/${id}`
    axios
      .put(apiUrl)
      .then((response) => {
        setUsers(users.map((user) => (user.userID === id ? { ...user, active: newStatus } : user)))
      })
      .catch((error) => {
        console.error('Error updating user status:', error)
      })
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${day}/${month}/${year}`
  }

  return (
    <div className='mx-auto p-6 bg-gray-100 min-h-screen'>
      <header className='bg-purple-600 text-white shadow-md py-4'>
        <MegaMenuWithHover />
      </header>
      <div className='pt-20'>
        <h1 className='text-4xl font-bold mb-6 text-center text-black'>Admin Portal - Users</h1>
        <div className='flex justify-center mb-6'>
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
          </select>
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
                      user.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {user.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className='p-4'>
                  {user.role !== 'Admin' && (
                    <button
                      onClick={() => toggleActiveStatus(user.userID, user.active)}
                      className={`p-2 rounded-lg transition-colors duration-300 ${
                        user.active ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                      } text-white`}
                    >
                      {user.active ? 'Ban' : 'Unban'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminPortal
