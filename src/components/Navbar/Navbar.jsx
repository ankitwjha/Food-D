import React, { useContext, useState } from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { Link, useNavigate } from 'react-router-dom'
import { StoreContext } from '../../context/StoreContext'

const Navbar = ({setShowLogin}) => {
    const [menu,setMenu]=useState("Home")
    const {getTotalCartAmount,token,setToken,searchQuery,setSearchQuery,cartPulse}=useContext(StoreContext);
    const [isSearchActive, setIsSearchActive] = useState(false);
    const [animateCart, setAnimateCart] = useState(false);
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate=useNavigate();

    React.useEffect(() => {
        if (theme === "light") {
            document.documentElement.classList.add("light-mode");
        } else {
            document.documentElement.classList.remove("light-mode");
        }
        localStorage.setItem("theme", theme);
    }, [theme]);

    React.useEffect(() => {
        if (cartPulse > 0) {
            setAnimateCart(true);
            const timer = setTimeout(() => setAnimateCart(false), 800);
            return () => clearTimeout(timer);
        }
    }, [cartPulse]);

    const logout=()=>{
      localStorage.removeItem("token");
      setToken("");
      navigate('/')
    }

    const handleSearchToggle = () => {
      if (!isSearchActive) {
        setIsSearchActive(true);
        return;
      }
      if (searchQuery && searchQuery.trim().length > 0) {
        const menuSection = document.getElementById('menu-catalog')
        if (menuSection) {
          menuSection.scrollIntoView({ behavior: 'smooth' })
        }
      } else {
        setIsSearchActive(false);
      }
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        if (searchQuery && searchQuery.trim().length > 0) {
          const menuSection = document.getElementById('menu-catalog')
          if (menuSection) {
            menuSection.scrollIntoView({ behavior: 'smooth' })
          }
        }
      }
    }

  return (
    <nav className='navbar'>
      <Link to='/' className="navbar-logo-link">
        <div className="navbar-logo-text">
          FOOD<span style={{color: '#ff5500', WebkitTextFillColor: '#ff5500'}}>-D</span><span className="logo-sparkle">✨</span>
        </div>
      </Link>

      <ul className={`navbar-menu ${isMobileMenuOpen ? 'mobile-active' : ''}`}>
        <Link to='/' onClick={()=>{setMenu("Home"); setIsMobileMenuOpen(false);}} className={menu==='Home'?"active":""}>Home</Link>
        <a href="#explore-menu" onClick={()=>{setMenu("Menu"); setIsMobileMenuOpen(false);}} className={menu==="Menu"?"active":""}>Menu</a>
        <a href="#app-download" onClick={()=>{setMenu("Mobile App"); setIsMobileMenuOpen(false);}} className={menu==="Mobile App"?"active":""}>Mobile App</a>
        <a href="#footer" onClick={()=>{setMenu("Contact Us"); setIsMobileMenuOpen(false);}} className={menu==="Contact Us"?"active":""}>Contact Us</a>
      </ul>
      
      <div className='navbar-right'>
        <button className="icon-button theme-toggle-btn" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} title="Toggle Light/Dark Mode" style={{ color: 'inherit' }}>
          {theme === "dark" ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="nav-svg-icon">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="nav-svg-icon">
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
            </svg>
          )}
        </button>
        <div className={`navbar-search-container ${isSearchActive ? 'active' : ''}`}>
          {isSearchActive && (
            <input 
              type="text" 
              placeholder="Search dishes..." 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
              onKeyDown={handleKeyDown}
              className="navbar-search-input"
              autoFocus
            />
          )}
          <button className='icon-button search-toggle-btn' onClick={handleSearchToggle}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="nav-svg-icon">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </button>
        </div>
        
        {token ? (
          <>
            <div className={`premium-cart-wrapper ${animateCart ? 'sparkle-pulse' : ''}`}>
              <Link to='/cart' style={{ display: 'flex', alignItems: 'center' }}> 
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="nav-svg-icon premium-cart-icon">
                  <circle cx="8" cy="21" r="1" />
                  <circle cx="19" cy="21" r="1" />
                  <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                </svg>
              </Link>
              <div className={getTotalCartAmount()===0?"":"dot premium-dot"}></div>
            </div>
            
            <div className='navbar-profile'>
              <div className="nav-user-avatar">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="nav-svg-icon">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <ul className="nav-profile-dropdown">
                <li onClick={()=>navigate('/myorders')}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="dropdown-svg-icon">
                    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                    <path d="M3 6h18" />
                    <path d="M16 10a4 4 0 0 1-8 0" />
                  </svg>
                  <p>Orders</p>
                </li>
                <hr/>
                <li onClick={logout}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="dropdown-svg-icon">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" x2="9" y1="12" y2="12" />
                  </svg>
                  <p>Logout</p>
                </li>
              </ul>
            </div>
          </>
        ) : (
          <button onClick={() => setShowLogin(true)}>Sign In</button>
        )}
        <button className="icon-button mobile-menu-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="Toggle Navigation Menu">
          {isMobileMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="nav-svg-icon">
              <line x1="18" x2="6" y1="6" y2="18" />
              <line x1="6" x2="18" y1="6" y2="18" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="nav-svg-icon">
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          )}
        </button>
      </div>
    </nav>
  )
}

export default Navbar
