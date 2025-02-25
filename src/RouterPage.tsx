import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AuthPage from './page/AuthPage'
import HomePage from './page/HomePage'
import CompanyPage from './page/CompanyPage'


function RouterPage() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<HomePage/>}/>
        <Route path='/login' element={<AuthPage/>}/>
        <Route path='/register' element={<AuthPage/>}/>
        <Route path='/company' element={<CompanyPage/>}/>
        
  
      </Routes>
    </BrowserRouter>
  )
}

export default RouterPage