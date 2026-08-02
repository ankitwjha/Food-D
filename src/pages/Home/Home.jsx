import React, { useContext, useState, useEffect } from 'react'
import './Home.css'
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu'
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay'
import AppDownload from '../../components/AppDownload/AppDownload'
import AIPlateBuilder from '../../components/AIPlateBuilder/AIPlateBuilder'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'

const Home = () => {
  const [category, setCategory] = useState("All")
  const { url, token, setToken, showAuthAlert, setShowAuthAlert } = useContext(StoreContext)

  useEffect(() => {
    // Reset view to top on mount / refresh with a small delay to override browser hash anchors
    setTimeout(() => {
      window.scrollTo(0, 0);
      if (window.location.hash) {
        window.history.replaceState("", document.title, window.location.pathname + window.location.search);
      }
    }, 50);
  }, []);

  useEffect(() => {
    if (showAuthAlert) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [showAuthAlert])

  // Form states
  const [authState, setAuthState] = useState("login") // 'login' or 'register'
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  })
  const [authError, setAuthError] = useState("")
  const [authSuccess, setAuthSuccess] = useState("")

  useEffect(() => {
    if (!token) {
      setAuthSuccess("");
      setAuthError("");
      window.scrollTo(0, 0);
    }
  }, [token]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleAuthSubmit = async (e) => {
    e.preventDefault()
    setAuthError("")
    setAuthSuccess("")
    
    let endpoint = authState === "login" ? "/api/user/login" : "/api/user/register"
    try {
      const payload = authState === "login" 
        ? { email: formData.email, password: formData.password }
        : { name: formData.name, email: formData.email, password: formData.password }

      const response = await axios.post(url + endpoint, payload)
      if (response.data.success) {
        setToken(response.data.token)
        localStorage.setItem("token", response.data.token)
        setAuthSuccess(authState === "login" ? "Logged in successfully!" : "Account created successfully!")
        setFormData({ name: "", email: "", password: "" })
      } else {
        setAuthError(response.data.message)
      }
    } catch (err) {
      console.error(err)
      setAuthError("Network error. Please try again.")
    }
  }

  const handleLogout = () => {
    setToken("")
    localStorage.removeItem("token")
    setAuthSuccess("Logged out successfully.")
  }

  return (
    <div className="home-container">
      {!token && (
        <>
          {/* 1. HERO SECTION */}
          <section className="hero-section">
            <div className="hero-bg-glow"></div>
            <div className="hero-content">
              <h1 className="hero-title animate-glow">WE ARE FOOD-D</h1>
              <h3 className="hero-subtitle">And are you a foodie?</h3>
              <p className="hero-tagline">
                Craving Solved in a Click. Whether you're ordering your favorite meal or managing your restaurant dashboard, we've got you covered.
              </p>
              <div className="hero-cta-group">
                <a href="#user-section" className="btn-primary glow-btn">Order Now</a>
                <a href="#admin-section" className="btn-secondary">Restaurant Admin</a>
              </div>
            </div>
          </section>

          {/* 2. CUSTOMER / USER SECTION */}
          <section id="user-section" className="user-section">
            <div className="section-header">
              <span className="badge">Customer Portal</span>
              <h2 className="section-title">Kill your cravings now by ordering from us</h2>
              <p className="section-desc">Sign in or create an account to unlock our complete catalog and place orders instantly.</p>
            </div>

            <div className="auth-card-wrapper glass-card">
              <div className="auth-forms-container">
                <div className="auth-tabs">
                  <button 
                    onClick={() => { setAuthState("login"); setAuthError(""); setAuthSuccess(""); }} 
                    className={`auth-tab-btn ${authState === "login" ? "active" : ""}`}
                  >
                    Login
                  </button>
                  <button 
                    onClick={() => { setAuthState("register"); setAuthError(""); setAuthSuccess(""); }} 
                    className={`auth-tab-btn ${authState === "register" ? "active" : ""}`}
                  >
                    Register
                  </button>
                </div>

                <form onSubmit={handleAuthSubmit} className="auth-form">
                  {authError && <div className="auth-message error">{authError}</div>}
                  {authSuccess && <div className="auth-message success">{authSuccess}</div>}

                  {authState === "register" && (
                    <div className="form-group">
                      <label>Username</label>
                      <input 
                        type="text" 
                        name="name" 
                        value={formData.name} 
                        onChange={handleInputChange} 
                        placeholder="Enter username" 
                        required 
                      />
                    </div>
                  )}

                  <div className="form-group">
                    <label>Email Address</label>
                    <input 
                      type="email" 
                      name="email" 
                      value={formData.email} 
                      onChange={handleInputChange} 
                      placeholder="Enter email address" 
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

                  <button type="submit" className="btn-primary auth-submit-btn">
                    {authState === "login" ? "Access Account" : "Create Account"}
                  </button>
                </form>
              </div>
            </div>
          </section>

          {/* 3. ADMIN SECTION */}
          <section id="admin-section" className="admin-section">
            <div className="admin-grid">
              <div className="admin-content-card glass-card">
                <span className="badge admin-badge">Restaurant Dashboard</span>
                <h2 className="admin-title">manage your restaurant on FoodD</h2>
                <p className="admin-desc">
                  Monitor incoming orders, configure food items, adjust pricing, and track delivery status in real-time.
                </p>
                <a href={import.meta.env.VITE_ADMIN_URL || "http://localhost:5174"} target="_blank" rel="noopener noreferrer" className="btn-admin-glow">
                  Launch Dashboard ➜
                </a>
              </div>
              <div className="admin-visual-card glass-card">
                <div className="dashboard-mockup">
                  <div className="mockup-header">
                    <span className="dot red"></span>
                    <span className="dot yellow"></span>
                    <span className="dot green"></span>
                  </div>
                  <div className="mockup-body">
                    <div className="mockup-line title-line"></div>
                    <div className="mockup-chart">
                      <div className="chart-bar" style={{height: '60%'}}></div>
                      <div className="chart-bar" style={{height: '85%'}}></div>
                      <div className="chart-bar" style={{height: '45%'}}></div>
                      <div className="chart-bar" style={{height: '95%'}}></div>
                    </div>
                    <div className="mockup-line"></div>
                    <div className="mockup-line short-line"></div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {/* 4. FOOD MENU & CATALOG */}
      <div id="menu-catalog" className="menu-catalog-section" style={token ? { marginTop: '40px' } : {}}>
        <div className="section-header">
          <span className="badge">Catalog</span>
          <h2 className="section-title">Explore Our Premium Menu</h2>
        </div>
        <AIPlateBuilder />
        <ExploreMenu category={category} setCategory={setCategory} />
        <FoodDisplay category={category} />
      </div>

      <AppDownload />
    </div>
  )
}

export default Home
