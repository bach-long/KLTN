import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from '../../components/SearchBar'
import Auth from '../Auth'
import UploadDocument from '../UploadDocument'
import Me from '../Me'
import Detail from '../Detail'
import Active from '../Active'

function User({user}) {
  return (
    <>
      <Routes>
        <Route path="/" element={<Me/>}/>
        <Route path="/auth/*" element={<Auth/>}/>
        <Route path="/document/:id" element={<Detail/>}/>
        <Route path="/active/:token" element={<Active/>}/>
      </Routes>
    </>
  )
}

export default User
