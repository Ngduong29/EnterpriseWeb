import { useEffect, useState, useContext, useRef } from 'react'
import { makeGet, makePost } from '../apiService/httpService'
import { toast, ToastContainer } from 'react-toastify'
import { useNavigate, useParams } from 'react-router-dom'
import MegaMenuWithHover from '../components/MegaMenuWithHover'
import AuthContext from '../contexts/JWTAuthContext'
import supabase from '../apiService/supabase'
import ClassDocumentList from '../components/ClassDocumentList'

const ClassDocument = () => {
  const { classId } = useParams()
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [documentTitle, setDocumentTitle] = useState('')
  const [classDetail, setClassDetail] = useState({})
  const [showUploadForm, setShowUploadForm] = useState(false)
  const fileInputRef = useRef()

  const fetchClassDetail = async () => {
    setLoading(true)
    try {
      const classResponse = await makeGet(`users/getClass/${classId}`)
      setClassDetail(classResponse.data)
    } catch (error) {
      toast.error('Failed to fetch class documents data')
    } finally {
      setLoading(false)
    }
  }

  const fetchDocumentByClassId = async () => {
    try {
      await makeGet(`tutors/getDocuments/${classId}`)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    if (!user || !user.role || user.role !== 'Tutor') {
      navigate('/unauthorized')
    }
    fetchClassDetail()
  }, [classId])

  const handleUploadDocument = async () => {
    if (!selectedFile || !documentTitle) {
      toast.warning('Please choose a file and enter document title')
      return
    }

    setUploading(true)

    const fileExt = selectedFile.name.split('.').pop()
    const fileName = `${Date.now()}.${fileExt}`
    const filePath = `documents/${fileName}`

    const { error: uploadError } = await supabase.storage.from('documents').upload(filePath, selectedFile)

    if (uploadError) {
      toast.error('File upload failed')
      setUploading(false)
      return
    }

    const { data } = supabase.storage.from('documents').getPublicUrl(filePath)
    const publicUrl = data.publicUrl

    const newDoc = {
      documentTitle,
      documentLink: publicUrl,
      classID: classId,
      uploadAt: new Date().toISOString()
    }

    try {
      await makePost(`tutors/insertDocument/${classId}`, newDoc)
      toast.success('Document uploaded successfully!')
      fetchDocumentByClassId()
      // reset form
      setDocumentTitle('')
      setSelectedFile(null)
      fileInputRef.current.value = ''
      setShowUploadForm(false)
    } catch (err) {
      toast.error('Failed to save document')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className='min-h-screen bg-gray-100 p-4 pt-12'>
      <header className='pt-4'>
        <MegaMenuWithHover />
      </header>

      <div className='max-w-4xl mx-auto mt-10'>
        <h2 className='text-2xl font-semibold mb-6 text-center'>Class {classDetail.className} documents</h2>

        {/* Toggle Form */}
        {!showUploadForm ? (
          <div className='mb-6 text-right'>
            <button
              onClick={() => setShowUploadForm(true)}
              className='bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600'
            >
              <i className='mr-2 fa-solid fa-plus'></i>Document
            </button>
          </div>
        ) : (
          <div className='bg-white p-4 rounded shadow mb-6'>
            <div className='flex justify-between align-top'>
              <h3 className='text-lg font-bold mb-2'>Upload New Document</h3>
              <button
                onClick={() => {
                  setShowUploadForm(false)
                  setDocumentTitle('')
                  setSelectedFile(null)
                  fileInputRef.current.value = ''
                }}
                className='rounded text-red-600 mt-0 mb-2 text-xl'
              >
                <i className='fa-solid fa-circle-xmark'></i>
              </button>
            </div>
            <input
              type='text'
              placeholder='Document Title'
              value={documentTitle}
              onChange={(e) => setDocumentTitle(e.target.value)}
              className='w-full p-2 border mb-2 rounded'
            />
            <input
              type='file'
              ref={fileInputRef}
              onChange={(e) => setSelectedFile(e.target.files[0])}
              className='w-full p-2 border mb-2 rounded'
            />
            <div className='flex gap-2 justify-end'>
              <button
                onClick={handleUploadDocument}
                disabled={uploading}
                className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50'
              >
                {uploading ? 'Uploading...' : 'Upload Document'}
              </button>
              <button
                onClick={() => {
                  setShowUploadForm(false)
                  setDocumentTitle('')
                  setSelectedFile(null)
                  fileInputRef.current.value = ''
                }}
                className='bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700'
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* List documents */}
        {user && user.role && classId && <ClassDocumentList role={user.role} classId={classId} />}
      </div>

      <ToastContainer />
    </div>
  )
}

export default ClassDocument
