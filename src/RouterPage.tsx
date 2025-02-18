import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AuthPage from './page/AuthPage'
import HomePage from './page/HomePage'

function RouterPage() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<HomePage/>}/>
        <Route path='/login' element={<AuthPage/>}/>
        <Route path='/register' element={<AuthPage/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default RouterPage