import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import './AdminAuth.css'

const AdminAuth = ({ url, setAdminToken }) => {
  const [authState, setAuthState] = useState("login") // 'login' or 'register'
  const [formData, setFormData] = useState({
    restaurantName: "",
    adminName: "",
    username: "",
    password: ""
  })
  const [loading, setLoading] = useState(false)

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const endpoint = authState === "login" ? "/api/admin/login" : "/api/admin/register"
    const payload = authState === "login"
      ? { username: formData.username, password: formData.password }
      : formData

    try {
      const response = await axios.post(url + endpoint, payload)
      if (response.data.success) {
        toast.success(response.data.message || "Authentication successful!")
        localStorage.setItem("adminToken", response.data.token)
        if (response.data.username) {
          localStorage.setItem("adminUsername", response.data.username)
        }
        if (response.data.restaurantName) {
          localStorage.setItem("restaurantName", response.data.restaurantName)
        }
        if (response.data.adminName) {
          localStorage.setItem("adminName", response.data.adminName)
        }
        setAdminToken(response.data.token)
      } else {
        toast.error(response.data.message || "Authentication failed.")
      }
    } catch (error) {
      console.error(error)
      toast.error("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-auth-container">
      <div className="admin-auth-glow-top"></div>
      <div className="admin-auth-glow-bottom"></div>

      <div className="admin-auth-card glass-card animate-fadeIn">
        <div className="admin-auth-header text-center">
          <h1 className="admin-auth-title animate-glow">FOOD-D</h1>
          <span className="badge admin-auth-badge">Restaurant Admin Portal</span>
          <p className="admin-auth-subtitle">
            {authState === "login" 
              ? "Access your dashboard to manage orders and menus." 
              : "Register your restaurant and setup your admin profile."}
          </p>
        </div>

        <div className="auth-tabs">
          <button 
            onClick={() => setAuthState("login")} 
            className={`auth-tab-btn ${authState === "login" ? "active" : ""}`}
          >
            Login
          </button>
          <button 
            onClick={() => setAuthState("register")} 
            className={`auth-tab-btn ${authState === "register" ? "active" : ""}`}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {authState === "register" && (
            <>
              <div className="form-group">
                <label>Restaurant Name</label>
                <input 
                  type="text" 
                  name="restaurantName" 
                  value={formData.restaurantName} 
                  onChange={handleInputChange} 
                  placeholder="Enter restaurant name" 
                  required 
                />
              </div>

              <div className="form-group">
                <label>Admin Name</label>
                <input 
                  type="text" 
                  name="adminName" 
                  value={formData.adminName} 
                  onChange={handleInputChange} 
                  placeholder="Enter full name" 
                  required 
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label>Username / Email</label>
            <input 
              type="text" 
              name="username" 
              value={formData.username} 
              onChange={handleInputChange} 
              placeholder="Enter username or email" 
              required 
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              name="password" 
              value={formData.password} 
              onChange={handleInputChange} 
              placeholder="••••••••" 
              required 
            />
          </div>

          <button type="submit" className="btn-primary auth-submit-btn" disabled={loading}>
            {loading ? "Processing..." : authState === "login" ? "Access Dashboard" : "Register Restaurant"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AdminAuth
