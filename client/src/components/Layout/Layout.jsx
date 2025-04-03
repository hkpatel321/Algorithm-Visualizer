import React from 'react'
import Navbar from '../Navbar/Navbar'
import Background from '../Background/Background'

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen relative">
      <Background />
      <Navbar />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}

export default Layout
