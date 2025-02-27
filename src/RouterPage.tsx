import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AuthPage from './page/AuthPage'
import HomePage from './page/HomePage'
import CompanyPage from './page/CompanyPage'
import PersonelPage from './pages/PersonelPage'
import ProfilePage from './page/ProfilePage'

function RouterPage() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<HomePage/>}/>
        <Route path='/login' element={<AuthPage/>}/>
        <Route path='/register' element={<AuthPage/>}/>
        <Route path='/company' element={<CompanyPage/>}/>
        <Route path='/personal' element={<PersonelPage/>}/>
        <Route path='/profile/:userId' element={<ProfilePage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default RouterPage