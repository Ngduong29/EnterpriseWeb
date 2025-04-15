import axios from 'axios'

// const API_URL = import.meta.env.VITE_API_URL
const API_URL = 'http://localhost:5000/api'
// const API_URL = 'https://e59e-171-233-29-47.ngrok-free.app/api'

const getToken = () => localStorage.getItem('token')

const getHeaders = () => {
  const token = getToken()
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  }
}
const handleError = (error) => {
  console.error('API Error:', error)
  if (error.response) {
    throw new Error(error.response.data.message || 'Something went wrong')
  } else if (error.request) {
    throw new Error('No response from server')
  } else {
    throw new Error('Error setting up request')
  }
}

// GET
export const makeGet = async (url, params = {}) => {
  try {
    const response = await axios.get(`${API_URL}/${url}`, {
      headers: getHeaders(),
      params
    })
    return response.data
  } catch (error) {
    handleError(error)
  }
}

// POST
export const makePost = async (url, data = {}) => {
  try {
    const response = await axios.post(`${API_URL}/${url}`, data, {
      headers: getHeaders()
    })
    return response.data
  } catch (error) {
    handleError(error)
  }
}

// PUT
export const makePut = async (url, data = {}) => {
  try {
    const response = await axios.put(`${API_URL}/${url}`, data, {
      headers: getHeaders()
    })
    return response.data
  } catch (error) {
    handleError(error)
  }
}

// DELETE
export const makeDelete = async (url) => {
  try {
    const response = await axios.delete(`${API_URL}/${url}`, {
      headers: getHeaders()
    })
    return response.data
  } catch (error) {
    handleError(error)
  }
}
