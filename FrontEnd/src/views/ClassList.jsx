import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MegaMenuWithHover } from '../components/MegaMenuWithHover.jsx'
import { Typography, Card, CardBody } from '@material-tailwind/react'
import BreadcrumbsWithIcon from '../components/BreadCrumb.jsx'
import PriceRangeSlider from '../components/PriceRangeSlider.jsx'
import ClassCard from '../components/ClassCard.jsx' // Assuming ClassCard component exists
import { Pagination } from '@nextui-org/react'
import ChatBox from '../components/ChatBox.jsx'
import { makeGet } from '../apiService/httpService.js'
import altImageThumbnail from '../assets/hero.png'
import Loading from '../components/Loading.jsx'
const itemsPerPage = 12

const ClassList = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [data, setData] = useState([])
  const [error, setError] = useState(null)

  //state for filter
  const [priceRange, setPriceRange] = useState([0, 5000])
  const [selectedRatings, setSelectedRatings] = useState([])
  const [selectedDurations, setSelectedDurations] = useState([])

  //Filter Function
  const filterByPrice = (classes, range) => {
    if (range[0] === 0 && range[1] === 5000) return classes
    return classes.filter((cls) => cls.price >= range[0] && cls.price <= range[1])
  }

  const filterByRating = (classes, ratings) => {
    if (ratings.length === 0) return classes
    return classes.filter((cls) => {
      const classRating = Math.floor(cls.rating)
      return ratings.some((rating) => classRating >= rating)
    })
  }

  const filterByDuration = (classes, durations) => {
    if (durations.length === 0) return classes
    return classes.filter((cls) => {
      const duration = cls.length.toLowerCase()
      const durationInDays = convertToDays(duration)
      return durations.some((d) => {
        const [min, max] = convertDurationToRange(d)
        return durationInDays > min && durationInDays <= max
      })
    })
  }

  const convertToDays = (duration) => {
    const regex = /(\d+)\s*(day|week|month|year)s?/
    const match = duration.match(regex)
    if (!match) return 0
    const value = parseInt(match[1], 10)
    const unit = match[2]
    switch (unit) {
      case 'day':
        return value
      case 'week':
        return value * 7
      case 'month':
        return value * 30
      case 'year':
        return value * 365
      default:
        return 0
    }
  }

  const convertDurationToRange = (duration) => {
    switch (duration) {
      case '1-4 weeks':
        return [7, 28]
      case '1-3 months':
        return [30, 90]
      case '3-6 months':
        return [90, 180]
      case '6-12 months':
        return [180, 365]
      default:
        return [0, 0]
    }
  }

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await makeGet('api/users/getAllClass')

        let filteredData = response.data
        filteredData = filterByPrice(filteredData, priceRange)
        filteredData = filterByRating(filteredData, selectedRatings)
        filteredData = filterByDuration(filteredData, selectedDurations)
        setData(filteredData)
      } catch (error) {
        setError(error.message)
      }
    }

    fetchClasses()
  }, [priceRange, selectedRatings, selectedDurations])

  const totalPages = Math.ceil(data.length / itemsPerPage)
  const currentData = [...data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)]

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div className='container mx-auto p-4 pt-16'>
      <header>
        <MegaMenuWithHover />
      </header>
      <div className='w-3/4 p-4 flex justify-between'>
        <div>
          <BreadcrumbsWithIcon pathnames={['Home', 'ClassList']} />
          <Typography variant='h3' className='mt-2'>
            Filters by
          </Typography>
        </div>
        <div className='flex items-end pl-10'>
          <Typography variant='h3' className='mt-2'>
            {data.length <= 1 ? <div>There is {data.length} class</div> : <div>There are {data.length} classes</div>}
          </Typography>
        </div>
      </div>

      <div className='flex'>
        <aside className='w-1/4 p-4 rounded-lg shadow-md'>
          <PriceRangeSlider onChange={(value) => setPriceRange(value)} />

          <div className='mt-6'>
            <Typography variant='h6' className='text-gray-800 font-bold mb-2'>
              Filter by Rating
            </Typography>
            <div className='space-y-2'>
              {[1, 2, 3, 4, 5].map((rating) => (
                <label className='flex items-center' key={rating}>
                  <input
                    type='checkbox'
                    className='form-checkbox text-blue-500'
                    checked={selectedRatings.includes(rating)}
                    onChange={() => {
                      setSelectedRatings((prevRatings) =>
                        prevRatings.includes(rating)
                          ? prevRatings.filter((r) => r !== rating)
                          : [...prevRatings, rating]
                      )
                    }}
                  />
                  <span className='ml-2 text-gray-700'>{rating} Stars & Up</span>
                </label>
              ))}
            </div>
          </div>

          <div className='mt-6'>
            <Typography variant='h6' className='text-gray-800 font-bold mb-2'>
              Filter by Duration
            </Typography>
            <div className='space-y-2'>
              {['1-4 weeks', '1-3 months', '3-6 months', '6-12 months'].map((duration) => (
                <label className='flex items-center' key={duration}>
                  <input
                    type='checkbox'
                    className='form-checkbox text-blue-500'
                    checked={selectedDurations.includes(duration)}
                    onChange={() => {
                      setSelectedDurations((prevDurations) =>
                        prevDurations.includes(duration)
                          ? prevDurations.filter((d) => d !== duration)
                          : [...prevDurations, duration]
                      )
                    }}
                  />
                  <span className='ml-2 text-gray-700'>{duration}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        <main className='w-3/4 px-7'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-20'>
            {currentData.map((item) => (
              <Link to={`/classDetail/${item.classID}`} key={item.classID} state={item}>
                <Card className='group relative overflow-hidden hover:opacity-75'>
                  <img
                    src={
                      item.videoLink
                        ? `https://img.youtube.com/vi/${item?.videoLink?.split('v=')[1]}/0.jpg`
                        : altImageThumbnail
                    }
                    alt={item.className}
                    className='object-cover aspect-video'
                  />
                  <CardBody className='py-4'>
                    <Typography variant='h5' className='font-bold'>
                      {item.className}
                    </Typography>
                    <Typography tag='h3' className='mt-2'>
                      Tutor: {item.tutorFullName}
                    </Typography>
                    {item.type && (
                      <Typography tag='h3' className='mt-2'>
                        Type: {item.type}
                      </Typography>
                    )}
                    <Typography tag='h3' className='mt-2'>
                      Duration: {item.length}
                    </Typography>
                    <Typography tag='h3' className='mt-2'>
                      Price per hour: {item.price} VND
                    </Typography>
                  </CardBody>
                </Card>
              </Link>
            ))}
          </div>

          <div className='flex justify-center mt-8'>
            <Pagination
              total={totalPages}
              active={currentPage}
              // maxVisible={5}
              onChange={(page) => handlePageChange(page)}
            />
          </div>
        </main>
      </div>
      <ChatBox />
    </div>
  )
}

export default ClassList
