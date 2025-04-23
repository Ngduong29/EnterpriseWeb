import React, { useEffect, useState } from 'react'
// import axios from 'axios'
import { MegaMenuWithHover } from '../components/MegaMenuWithHover.jsx'
import AccessDeniedPage from '../components/AccessDeniedPage.jsx'
import Loading from '../components/Loading.jsx'
import { makeGet, makePost } from '../apiService/httpService.js'

const AdminTutorRequests = () => {
  const [requests, setRequests] = useState([])
  const [tutors, setTutors] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const role1 = localStorage.getItem('role')
  if (role1 !== 'Admin') {
    return <AccessDeniedPage />
  }

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await makeGet('admin/getRequest')
        const requestsData = response.data

        // Fetch tutor information for each request
        const tutorRequests = requestsData.map((request) => makeGet(`users/getTutor/${request.userID}`))
        const tutorsData = await Promise.all(tutorRequests)

        const tutorsInfo = tutorsData.reduce((acc, curr) => {
          acc[curr.data.tutorID] = curr.data
          return acc
        }, {})

        setRequests(requestsData)
        setTutors(tutorsInfo)
      } catch (error) {
        setError(error.response ? error.response.data.message : 'Error loading requests')
      } finally {
        setLoading(false)
      }
    }

    fetchRequests()
  }, [])

  const handleAction = async (userID, action) => {
    try {
      await makePost(`admin/handleTutor/${userID}`, { status: action })
      setRequests(requests.map((req) => (req.userID === userID ? { ...req, status: action } : req)))
    } catch (error) {
      alert(error.response ? error.response.data.message : 'Error performing action')
    }
  }

  if (loading) return <Loading />
  if (error) return <p>{error}</p>

  return (
    <div className='mx-auto p-2 sm:p-6 bg-gray-100 min-h-screen'>
      <header className='bg-purple-600 text-white shadow-md py-4'>
        <MegaMenuWithHover />
      </header>
      <div className='pt-16 sm:pt-20'>
        <h1 className='text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-center text-black'>Admin Portal - Tutor Requests</h1>
        <div className='overflow-x-auto'>
          <div className='mx-auto w-full max-w-full bg-white shadow-md rounded-lg overflow-hidden'>
            {/* Mobile view - card layout */}
            <div className='block md:hidden'>
              {requests.length === 0 ? (
                <div className="text-center p-6 bg-white rounded-lg shadow-md">
                  <p className="text-gray-600">No tutor requests found</p>
                </div>
              ) : (
                requests.map((request, index) => {
                  const tutor = tutors[request.tutorID];
                  return (
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
                          {request.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        <div>
                          <p className="text-sm text-gray-500">User ID</p>
                          <p className="font-medium">{request.userID}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Tutor ID</p>
                          <p className="font-medium">{request.tutorID}</p>
                        </div>
                      </div>
                      <div className="mb-3">
                        <p className="text-sm text-gray-500 mb-1">Degree</p>
                        {tutor && tutor.degrees ? (
                          <a href={tutor.degrees} target='_blank' rel='noopener noreferrer'>
                            <img src={tutor.degrees} alt='Tutor Degree' className='w-full max-w-[150px] h-auto object-cover' />
                          </a>
                        ) : (
                          <p>No Degree</p>
                        )}
                      </div>
                      <div className="mb-3">
                        <p className="text-sm text-gray-500 mb-1">Identity Card</p>
                        {tutor && tutor.identityCard ? (
                          <a href={tutor.identityCard} target='_blank' rel='noopener noreferrer'>
                            <img src={tutor.identityCard} alt='Identity Card' className='w-full max-w-[150px] h-auto object-cover' />
                          </a>
                        ) : (
                          <p>No ID Card</p>
                        )}
                      </div>
                      {request.status === 'Pending' && (
                        <div className="flex space-x-2 mt-3">
                          <button
                            onClick={() => handleAction(request.userID, 'Accept')}
                            className='flex-1 p-2 rounded-lg bg-green-500 hover:bg-green-600 text-white transition-colors duration-300'
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleAction(request.userID, 'Deny')}
                            className='flex-1 p-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors duration-300'
                          >
                            Deny
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
            
            {/* Desktop view - table layout */}
            <div className='hidden md:block'>
              <table className='w-full'>
                <thead className='bg-gradient-to-t from-yellow-700 to-yellow-300 text-black'>
                  <tr>
                    <th className='p-3 md:p-4 text-left'>ID</th>
                    <th className='p-3 md:p-4 text-left'>User ID</th>
                    <th className='p-3 md:p-4 text-left'>Tutor ID</th>
                    <th className='p-3 md:p-4 text-left'>Degree</th>
                    <th className='p-3 md:p-4 text-left'>Identity Card</th>
                    <th className='p-3 md:p-4 text-left'>Status</th>
                    <th className='p-3 md:p-4 text-left'>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((request, index) => {
                    const tutor = tutors[request.tutorID]
                    return (
                      <tr key={request.requestID} className='border-b hover:bg-purple-50'>
                        <td className='p-3 md:p-4'>{index + 1}</td>
                        <td className='p-3 md:p-4'>{request.userID}</td>
                        <td className='p-3 md:p-4'>{request.tutorID}</td>
                        <td className='p-3 md:p-4'>
                          {tutor && tutor.degrees ? (
                            <a href={tutor.degrees} target='_blank' rel='noopener noreferrer'>
                              <img src={tutor.degrees} alt='Tutor Degree' className='w-20 h-20 object-cover' />
                            </a>
                          ) : (
                            'No Degree'
                          )}
                        </td>
                        <td className='p-3 md:p-4'>
                          {tutor && tutor.identityCard ? (
                            <a href={tutor.identityCard} target='_blank' rel='noopener noreferrer'>
                              <img src={tutor.identityCard} alt='Identity Card' className='w-20 h-20 object-cover' />
                            </a>
                          ) : (
                            'No ID Card'
                          )}
                        </td>
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
                            {request.status}
                          </span>
                        </td>
                        <td className='p-3 md:p-4'>
                          {request.status === 'Pending' && (
                            <>
                              <button
                                onClick={() => handleAction(request.userID, 'Accept')}
                                className='mr-2 p-2 rounded-lg bg-green-500 hover:bg-green-600 text-white transition-colors duration-300'
                              >
                                Accept
                              </button>
                              <button
                                onClick={() => handleAction(request.userID, 'Deny')}
                                className='p-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors duration-300'
                              >
                                Deny
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              
              {requests.length === 0 && (
                <div className="text-center p-6 bg-white rounded-lg shadow-md">
                  <p className="text-gray-600">No tutor requests found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminTutorRequests
