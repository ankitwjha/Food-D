import React, { useState, useContext } from 'react'
import Navbar from './components/Navbar/Navbar'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home/Home'
import Cart from './pages/Cart/Cart'
import PlaceOrder from './pages/Place Order/PlaceOrder'
import Footer from './components/Footer/Footer'
import LoginPopup from './components/LoginPopup/LoginPopup'
import Verify from './pages/Verify/Verify'
import MyOrders from './pages/MyOrders/MyOrders'
import { StoreContext } from './context/StoreContext'
import FloatingCart from './components/FloatingCart/FloatingCart'

const App = () => {
  const [showLogin, setShowLogin] = useState(false)
  const { showAuthAlert, setShowAuthAlert } = useContext(StoreContext)

  return (
    <>
      {showLogin ? <LoginPopup setShowLogin={setShowLogin} /> : <></>}
      <div className='app'>
        <Navbar setShowLogin={setShowLogin} />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/Cart' element={<Cart />} />
          <Route path='/Order' element={<PlaceOrder />} />
          <Route path='/verify' element={<Verify />} />
          <Route path='/myorders' element={<MyOrders />} />
        </Routes>
      </div>
      <Footer />
      <FloatingCart />

      {showAuthAlert && (
        <div className="auth-alert-overlay animate-fadeIn">
          <div className="auth-alert-card glass-card">
            <div className="auth-alert-glow"></div>
            <div className="auth-alert-icon">🔒</div>
            <h3 className="auth-alert-title">Authentication Required</h3>
            <p className="auth-alert-message">
              please login first and then kill your cravings
            </p>
            <div className="auth-alert-buttons">
              <a 
                href="#user-section" 
                className="btn-primary glow-btn"
                onClick={() => setShowAuthAlert(false)}
              >
                Sign In / Register
              </a>
              <button 
                onClick={() => setShowAuthAlert(false)} 
                className="btn-outline"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default App
