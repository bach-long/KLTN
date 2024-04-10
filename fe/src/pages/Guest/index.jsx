import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from '../../components/SearchBar'
import Auth from '../Auth'
import HomeLayout from '../../layouts/HomeLayout'

function Guest() {
  const items = [
    {name: 'Home', path: '/'},
  ]

  return (
    <HomeLayout items={items}>
      <Routes>
          <Route path="/auth/*" element={<Auth/>}/>
          <Route path="*" element={<Auth/>}/>
      </Routes>
    </HomeLayout>
  )
}

export default Guest
