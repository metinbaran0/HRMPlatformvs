import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AuthPage from './page/AuthPage'
import HomePage from './page/HomePage'
import CompanyPage from './page/CompanyPage'

import ProfilePage from './page/ProfilePage'
import EmployeeProfile from './page/EmployeeProfile'


import GetQuote from './page/GetQuote'
import ProfilePage from './page/ProfilePage'

import PersonelPage from './pages/PersonelPage'








function RouterPage() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<HomePage/>}/>
        <Route path='/login' element={<AuthPage/>}/>
        <Route path='/register' element={<AuthPage/>}/>
        <Route path='/company' element={<CompanyPage/>}/>

        <Route path='/profile' element={<ProfilePage/>}/>
        <Route path='/employeeProfile' element={<EmployeeProfile/>}/>


        <Route path='/get-quote' element={<GetQuote />} />
        <Route path='/profile' element={<ProfilePage />} />
        <Route path='/personal' element={<PersonelPage/>}/>


      </Routes>
    </BrowserRouter>
  )
}

export default RouterPage