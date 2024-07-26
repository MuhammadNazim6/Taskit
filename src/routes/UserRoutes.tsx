import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import NotFoundPage from '../pages/NotFoundPage';
import Signup from '../pages/Signup';

function UserRoutes() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/signup' element={<Signup />} />
      <Route path="*" element={<NotFoundPage />} /> 
    </Routes>
  )
}

export default UserRoutes