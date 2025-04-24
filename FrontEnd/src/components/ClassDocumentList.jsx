import { useEffect, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import { makeGet } from '../apiService/httpService'

export default function ClassDocumentList({ role, classId }) {
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchDocumentByClassId = async () => {
    setLoading(true)
    try {
      const response = await makeGet(`tutors/getDocuments/${classId}`)
      setDocuments(response.data)
    } catch (error) {
      toast.error('Failed to fetch class documents data')
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    fetchDocumentByClassId()
  }, [classId])
  return (
    <>
      {loading ? (
        <p className='text-center text-gray-600'>Loading...</p>
      ) : documents.length === 0 ? (
        <p className='text-center text-gray-600'>No documents available.</p>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {documents.map((doc) => (
            <div key={doc.documentID} className='bg-white p-4 rounded shadow'>
              <h3 className='font-bold text-lg mb-2'>{doc.documentTitle}</h3>
              <p className='text-sm text-gray-600 mb-2'>Uploaded at: {new Date(doc.uploadAt).toLocaleString()}</p>
              <a href={doc.documentLink} target='_blank' rel='noopener noreferrer' className='text-blue-500 underline'>
                View / Download
              </a>
            </div>
          ))}
        </div>
      )}
      <ToastContainer />
    </>
  )
}
