import React from 'react'
import "./Navbar.css"
import {assets} from "../../assets/assets"

const Navbar = ({ adminToken, handleLogout }) => {
  const restaurantName = localStorage.getItem("restaurantName") || "Restaurant";
  const adminName = localStorage.getItem("adminName") || "Admin";

  return (
    <div>
      <div className="navbar">
        <div className="logo-group">
          <div className="navbar-logo-text">
            FOOD<span style={{color: '#ff5500', WebkitTextFillColor: '#ff5500'}}>-D</span><span className="logo-sparkle">✨</span>
          </div>
          {adminToken && <span className="restaurant-badge">{restaurantName}</span>}
        </div>
        
        {adminToken && (
          <div className="navbar-admin-right">
            <div className="admin-info">
              <span className="admin-name">{adminName}</span>
              <span className="admin-label">Dashboard Admin</span>
            </div>
            <img className="profile" src={assets.profile_image} alt="" />
            <button onClick={handleLogout} className="btn-logout">Logout</button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Navbar
