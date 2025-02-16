import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './page/Login'
<<<<<<< HEAD
import Register from './page/Register'
=======
import HomePage from './page/HomePage'
>>>>>>> main

function RouterPage() {
  return (
    <BrowserRouter>
<<<<<<< HEAD
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
      </Routes>
=======
    <Routes>
        <Route path='/' element={<HomePage/>}/>
        <Route path='/login' element={<Login/>}/>
    </Routes>
>>>>>>> main
    </BrowserRouter>
  )
}

export default RouterPage