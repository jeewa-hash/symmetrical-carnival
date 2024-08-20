import React from 'react'
import DefaultHeader from './Header'
import { Outlet } from 'react-router'
import Footer from './Footer'

export default function Layout() {
  return (
    <div>
        <DefaultHeader />

        <Outlet />  {/* This will render the child routes */}
        
        <Footer />
    </div>
  )
}
