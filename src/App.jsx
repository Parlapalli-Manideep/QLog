import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import LandingPage from './Pages/LandingPage/LandingPage';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AuthPage from './Pages/LoginPage/AuthPage';

function App() {
  return (
    <>
     <BrowserRouter>
      <Routes>
        <Route path="/LandingPage" element={<LandingPage />} />
        <Route path="/" element={<Navigate to="/LandingPage" />} />
        <Route path="/Login" element ={<AuthPage />} />
      </Routes>
    </BrowserRouter>

    </>
  )
}
export default App
