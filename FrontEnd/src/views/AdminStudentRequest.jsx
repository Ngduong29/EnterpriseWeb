import React, { useEffect, useState } from 'react'
import { MegaMenuWithHover } from '../components/MegaMenuWithHover.jsx'
import AccessDeniedPage from '../components/AccessDeniedPage.jsx'
import Loading from '../components/Loading.jsx'
import { makeGet, makePost } from '../apiService/httpService.js'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const AdminStudentRequests = () => {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const role1 = localStorage.getItem('role')
  
  if (role1 !== 'Admin') {
    return <AccessDeniedPage />
  }

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      setLoading(true)
      const response = await makeGet('admin/enrollmentRequests')
      setRequests(response.data)
    } catch (error) {
      setError(error.response ? error.response.data.message : 'Error loading requests')
      toast.error('Unable to load enrollment requests')
    } finally {
      setLoading(false)
    }
  }

  const handleAction = async (requestID, action) => {
    try {
      const response = await makePost(`admin/handleEnrollment/${requestID}`, { 
        status: action,
        adminComment: action === 'Accept' ? 'Approved' : 'Rejected'
      })
      
      setRequests(requests.map(req => 
        req.requestID === parseInt(requestID) ? { ...req, status: action } : req
      ))
      
      toast.success(`Request has been ${action === 'Accept' ? 'accepted' : 'rejected'} successfully`)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error processing request')
    }
  }

  if (loading) return <Loading />
  if (error) return <p>{error}</p>

  return (
    <div className='mx-auto p-2 sm:p-6 bg-gray-100 min-h-screen'>
      <ToastContainer position='top-right' />
      <header className='bg-purple-600 text-white shadow-md py-4'>
        <MegaMenuWithHover />
      </header>
      <div className='pt-16 sm:pt-20'>
        <h1 className='text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-center text-black'>Admin Portal - Student Enrollment Requests</h1>
        <div className='overflow-x-auto'>
          <div className='mx-auto w-full max-w-full bg-white shadow-md rounded-lg overflow-hidden'>
            <div className='block md:hidden'>
              {/* Mobile view - card layout */}
              {requests.length === 0 ? (
                <div className="text-center p-6 bg-white rounded-lg shadow-md mt-4">
                  <p className="text-gray-600">No enrollment requests found</p>
                </div>
              ) : (
                requests.map((request, index) => (
                  <div key={request.requestID} className="p-4 border-b">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold">#{index + 1}</span>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm ${
                          request.status === 'Pending'
                            ? 'bg-yellow-100 text-yellow-700'
                            : request.status === 'Accept'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {request.status === 'Pending' ? 'Pending' : 
                         request.status === 'Accept' ? 'Accepted' : 'Rejected'}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <div>
                        <p className="text-sm text-gray-500">Student</p>
                        <p className="font-medium">{request.studentName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Teacher</p>
                        <p className="font-medium">{request.tutorName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Class</p>
                        <p className="font-medium">{request.className}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Date</p>
                        <p className="font-medium">{new Date(request.requestDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="mb-2">
                      <p className="text-sm text-gray-500">Message</p>
                      <p className="font-medium">{request.message || 'None'}</p>
                    </div>
                    {request.status === 'Pending' && (
                      <div className="flex space-x-2 mt-3">
                        <button
                          onClick={() => handleAction(request.requestID, 'Accept')}
                          className='flex-1 p-2 rounded-lg bg-green-500 hover:bg-green-600 text-white transition-colors duration-300'
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleAction(request.requestID, 'Deny')}
                          className='flex-1 p-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors duration-300'
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
            
            {/* Desktop view - table layout */}
            <div className='hidden md:block'>
              <table className='w-full'>
                <thead className='bg-gradient-to-t from-yellow-700 to-yellow-300 text-black'>
                  <tr>
                    <th className='p-3 md:p-4 text-left'>ID</th>
                    <th className='p-3 md:p-4 text-left'>Student</th>
                    <th className='p-3 md:p-4 text-left'>Teacher</th>
                    <th className='p-3 md:p-4 text-left'>Class Name</th>
                    <th className='p-3 md:p-4 text-left'>Request Date</th>
                    <th className='p-3 md:p-4 text-left'>Message</th>
                    <th className='p-3 md:p-4 text-left'>Status</th>
                    <th className='p-3 md:p-4 text-left'>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((request, index) => (
                    <tr key={request.requestID} className='border-b hover:bg-purple-50'>
                      <td className='p-3 md:p-4'>{index + 1}</td>
                      <td className='p-3 md:p-4'>{request.studentName}</td>
                      <td className='p-3 md:p-4'>{request.tutorName}</td>
                      <td className='p-3 md:p-4'>{request.className}</td>
                      <td className='p-3 md:p-4'>{new Date(request.requestDate).toLocaleString()}</td>
                      <td className='p-3 md:p-4'>{request.message || 'None'}</td>
                      <td className='p-3 md:p-4'>
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm ${
                            request.status === 'Pending'
                              ? 'bg-yellow-100 text-yellow-700'
                              : request.status === 'Accept'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {request.status === 'Pending' ? 'Pending' : 
                           request.status === 'Accept' ? 'Accepted' : 'Rejected'}
                        </span>
                      </td>
                      <td className='p-3 md:p-4'>
                        {request.status === 'Pending' && (
                          <>
                            <button
                              onClick={() => handleAction(request.requestID, 'Accept')}
                              className='mr-2 p-2 rounded-lg bg-green-500 hover:bg-green-600 text-white transition-colors duration-300'
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleAction(request.requestID, 'Deny')}
                              className='p-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors duration-300'
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {requests.length === 0 && (
                <div className="text-center p-6 bg-white rounded-lg shadow-md mt-4">
                  <p className="text-gray-600">No enrollment requests found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminStudentRequests