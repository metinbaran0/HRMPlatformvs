import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './page/Login'
import HomePage from './page/HomePage'


function routerpage() {
  return (
    <BrowserRouter>
    <Routes>
        <Route path='/' element={<HomePage/>}/>
        <Route path='/login' element={<Login/>}/>
    </Routes>
    </BrowserRouter>
  )
}

export default routerpage