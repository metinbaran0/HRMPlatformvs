import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AuthPage from './page/AuthPage'
import HomePage from './page/HomePage'
import CompanyPage from './page/CompanyPage'
import EmployeePage from './page/EmployeePage'
import ProfilePage from './page/ProfilePage'
import EmployeeProfile from './page/EmployeeProfile'
import GetQuote from './page/GetQuote'
import TumHikayeler from './pages/tum-hikayeler'
import ShiftPage from './page/ShiftPage'
import MolaYonetimi from './page/MolaYonetimi'
import VardiyaAtama from './page/VardiyaAtama'






function RouterPage() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<HomePage/>}/>
        <Route path='/login' element={<AuthPage/>}/>
        <Route path='/register' element={<AuthPage/>}/>
        <Route path='/company' element={<CompanyPage/>}/>
        <Route path='/employee' element={<EmployeePage/>}/>
        <Route path='/profile' element={<ProfilePage/>}/>
        <Route path='/employeeProfile' element={<EmployeeProfile/>}/>
        <Route path='/get-quote' element={<GetQuote />} />
        <Route path='/tum-hikayeler' element={<TumHikayeler />} />
        <Route path='/shift' element={<ShiftPage />} />
        <Route path='/shift/molalar' element={
          <MolaYonetimi 
            breaks={[]} 
            handleNewBreak={(newBreak) => console.log(newBreak)} 
          />
        } />
        <Route path='/shift/atamalar' element={
          <VardiyaAtama 
            employees={[]} 
            shifts={[]} 
            employeeShifts={[]} 
            handleAssignShift={(assignment) => console.log(assignment)} 
          />
        } />
       
       

      </Routes>
    </BrowserRouter>
  )
}

export default RouterPage