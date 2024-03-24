import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from '../../components/SearchBar'
import Auth from '../Auth'
import UploadDocument from '../UploadDocument'
import Me from '../Me'
import Detail from '../Detail'

function User() {
  return (
      <Routes>
          <Route path="/" element={<Me/>}/>
          <Route path="/auth/*" element={<Auth/>}/>
          <Route path="/document/:id" element={<Detail/>}/>
      </Routes>
  )
}

export default User
