import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './page/HomePage';
import GetQuote from './page/GetQuote';
import Login from './page/Login';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/get-quote" element={<GetQuote />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App; 