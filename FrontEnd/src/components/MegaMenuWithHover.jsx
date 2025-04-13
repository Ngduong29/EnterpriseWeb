import React, { useState, useEffect } from 'react'
import Logo from '../assets/logoNav.png'
import NavList from './NavList'
import { Link } from 'react-router-dom'
import { Button, Input, Collapse, IconButton } from '@material-tailwind/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import SearchBar from './Navigation/SearchBar'

export function MegaMenuWithHover() {
  const [openNav, setOpenNav] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true') // Retrieve login status from localStorage

  // Function to handle login
  const handleLogin = () => {
    setIsLoggedIn(true) // Update login state to true
    localStorage.setItem('isLoggedIn', 'true') // Store login status in localStorage
  }

  // Function to handle logout
  const handleLogout = () => {
    setIsLoggedIn(false) // Update login state to false
    localStorage.removeItem('token')
    localStorage.removeItem('isLoggedIn') // Remove login status from localStorage
    window.location.reload()
  }

  useEffect(() => {
    window.addEventListener('resize', () => window.innerWidth >= 960 && setOpenNav(false))
  }, [])

  return (
    <div className='block shadow-md backdrop-saturate-200 backdrop-blur-2xl text-white w-full fixed top-0 left-0 right-0 px-0 py-0 bg-orange-300 z-50'>
      <div className='flex items-center justify-between text-white py-2 px-4'>
        <Link to='/' className='inline-block'>
          <img className='h-16 min-w-11 ml-6' src={Logo} alt='Logo' />
        </Link>
        <SearchBar />

        <div className='mobile-hidden'>
          {/* Pass isLoggedIn state to NavList */}
          <NavList isLoggedIn={isLoggedIn} />
        </div>

        <IconButton variant='text' color='blue-gray' className='lg:hidden' onClick={() => setOpenNav(!openNav)}>
          {openNav ? (
            <XMarkIcon className='h-6 w-6' strokeWidth={2} />
          ) : (
            <Bars3Icon className='h-6 w-6' strokeWidth={2} />
          )}
        </IconButton>
      </div>
      <Collapse open={openNav}>
        {/* Pass isLoggedIn state to NavList */}
        <NavList isLoggedIn={isLoggedIn} />
      </Collapse>
    </div>
  )
}

export default MegaMenuWithHover
