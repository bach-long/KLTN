import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from '../../components/SearchBar'
import Auth from '../Auth'

function Guest() {
  return (
      <Routes>
          <Route path="/auth/*" element={<Auth/>}/>
          <Route path="*" element={<Auth/>}/>
      </Routes>
  )
}

export default Guest
