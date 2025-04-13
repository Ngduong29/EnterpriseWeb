import React, { useState, useEffect } from 'react'
import { FaStar } from 'react-icons/fa'

const StarRating = ({ initialRating, onRate }) => {
  const [selectedRating, setSelectedRating] = useState(parseInt(initialRating, 10) || 0)

  useEffect(() => {
    setSelectedRating(parseInt(initialRating, 10) || 0)
  }, [initialRating])

  const handleStarClick = (rating) => {
    setSelectedRating(rating)
    onRate(rating.toString()) // Convert rating to string and notify parent component
  }

  const renderStars = () => {
    const totalStars = 5
    const stars = []

    for (let i = 1; i <= totalStars; i++) {
      stars.push(
        <FaStar
          key={i}
          className={`text-3xl cursor-pointer ${i <= selectedRating ? 'text-yellow-500' : 'text-gray-300'}`}
          onClick={() => handleStarClick(i)}
        />
      )
    }

    return stars
  }

  return <div className='flex'>{renderStars()}</div>
}

export default StarRating
