import React, { useState, useEffect } from 'react'
import Navbar from './components/Navbar/Navbar'
import Sidebar from './components/Sidebar/Sidebar'
import { Route, Routes, useNavigate, Navigate } from 'react-router-dom'
import List from './pages/List/List'
import Add from './pages/Add/Add'
import Orders from './pages/Orders/Orders'
import AdminAuth from './pages/AdminAuth/AdminAuth'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const App = () => {
  const url = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000"
  const [adminToken, setAdminToken] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem("adminToken")
    if (token) {
      setAdminToken(token)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("adminToken")
    localStorage.removeItem("adminUsername")
    localStorage.removeItem("restaurantName")
    localStorage.removeItem("adminName")
    setAdminToken("")
    navigate('/')
  }

  return (
    <div>
      <ToastContainer theme="dark" />
      <Navbar adminToken={adminToken} handleLogout={handleLogout} />
      <hr style={{ border: 'none', height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.05)' }} />
      
      {!adminToken ? (
        <AdminAuth url={url} setAdminToken={setAdminToken} />
      ) : (
        <div className="app-content">
          <Sidebar />
          <Routes>
            <Route path="/" element={<Navigate to="/list" replace />} />
            <Route path='/add' element={<Add url={url} />} />
            <Route path='/list' element={<List url={url} />} />
            <Route path='/orders' element={<Orders url={url} />} />
          </Routes>
        </div>
      )}
    </div>
  )
}

export default App
