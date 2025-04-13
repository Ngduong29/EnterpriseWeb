import React, { useState } from 'react'
import { Slider } from '@nextui-org/react'

const PriceRangeSlider = ({ onChange }) => {
  const min = 10000
  const max = 50000
  const [priceRange, setPriceRange] = useState([min, max])

  const handleChange = (value) => {
    setPriceRange(value)
    onChange(value)
  }

  return (
    <Slider
      label='Price Range / per hour'
      step={1000}
      minValue={min}
      maxValue={max}
      defaultValue={[min, max]}
      formatOptions={{ style: 'currency', currency: 'VND' }}
      className='max-w-md block antialiased tracking-normal font-sans text-base font-semibold leading-relaxed text-inherit mb-4'
      onChange={handleChange}
    />
  )
}

export default PriceRangeSlider
