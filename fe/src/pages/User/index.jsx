import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from '../../components/SearchBar'
import Auth from '../Auth'
import UploadDocument from '../UploadDocument'
import Me from '../Me'
import Detail from '../Detail'
import HomeLayout from '../../layouts/HomeLayout'

function User() {
  const items = [
    {name: 'Home', path: '/'},
    {name: 'Cá nhân', path: '/me'},
  ]

  return (
    <>
    <HomeLayout items={items}>
      <Routes>
        <Route path="/" element={<Me/>}/>
        <Route path="/auth/*" element={<Auth/>}/>
      </Routes>
    </HomeLayout>
    <Routes>
      <Route path="/document/:id" element={<Detail/>}/>
    </Routes>
    </>
  )
}

export default User
