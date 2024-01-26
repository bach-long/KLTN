import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from '../Home'
import Auth from '../Auth'
import UploadDocument from '../UploadDocument'
import Me from '../Me'

function User() {
  return (
      <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/auth/*" element={<Auth/>}/>
          <Route path='/upload' element={<UploadDocument/>}/>
          <Route path='/me' element={<Me/>}/>
      </Routes>
  )
}

export default User
