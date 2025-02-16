import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './page/Login'
import Register from './page/Register'

function RouterPage() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default RouterPage