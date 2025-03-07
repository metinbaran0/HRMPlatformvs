import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AuthPage from './page/AuthPage'
import HomePage from './page/HomePage'
import CompanyPage from './page/CompanyPage'
import EmployeePage from './page/EmployeePage'
import EmployeeProfile from './page/EmployeeProfile'
import GetQuote from './page/GetQuote'

import { Add } from '@mui/icons-material'
import PendingLeaveRequests from './components/organisms/PendingLeaveRequests'
import LeaveRequestForm from './components/organisms/LeaveRequestForm'

import TumHikayeler from './pages/tum-hikayeler'
import ShiftPage from './page/ShiftPage'


function RouterPage() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<HomePage/>}/>
        <Route path='/login' element={<AuthPage/>}/>
        <Route path='/register' element={<AuthPage/>}/>
        <Route path='/company' element={<CompanyPage/>}/>
        <Route path='/employee' element={<EmployeePage/>}/>
        <Route path='/employeeProfile' element={<EmployeeProfile/>}/>
        <Route path='/get-quote' element={<GetQuote />} />

        <Route path='/pending-leaves' element={<PendingLeaveRequests/>} />
        <Route path='/leave-request' element={<LeaveRequestForm/>} />
       
     

        <Route path='/tum-hikayeler' element={<TumHikayeler />} />
        <Route path='/shift' element={<ShiftPage />} />

       
      </Routes>
    </BrowserRouter>
  )
}

export default RouterPage