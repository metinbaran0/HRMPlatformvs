import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import HomePage from './page/HomePage'

function routerpage() {
  return (
    <BrowserRouter>
    <Routes>
        <Route path='/' element={<HomePage/>}/>
    </Routes>
    </BrowserRouter>
  )
}

export default routerpage