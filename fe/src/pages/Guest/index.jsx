import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from '../../components/SearchBar'
import Auth from '../Auth'
import HomeLayout from '../../layouts/HomeLayout'
import Login from '../Auth/Login'
import Active from '../Active'

function Guest() {
  const items = [
    {name: 'Home', path: '/'},
  ]

  return (
    <>
      <Routes>
          <Route path="/" element={<Login/>}/>
          <Route path="/auth/*" element={<Auth/>}/>
          <Route path="/active/:token" element={<Active/>}/>
      </Routes>
    </>
  )
}

export default Guest
