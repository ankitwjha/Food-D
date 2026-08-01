import React, { useContext, useState } from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { Link, useNavigate } from 'react-router-dom'
import { StoreContext } from '../../context/StoreContext'
const Navbar = ({setShowLogin}) => {

    const [menu,setMenu]=useState("Home")

    const {getTotalCartAmount,token,setToken}=useContext(StoreContext);

    const navigate=useNavigate();


  const logout=()=>{
    localStorage.removeItem("token");
    setToken("");
    navigate('/')
  }
  return (
    <nav className='navbar'>
<Link to='/'><img src={assets.logo} alt="Logo" className='logo' /></Link>


  <ul className='navbar-menu'>
    <Link to='/' onClick={()=>setMenu("Home")}className={menu==='Home'?"active":""}>Home</Link>
    <a href="#explore-menu" onClick={()=>setMenu("explore-menu")}className={menu==="Menu"?"active":""}>Menu</a>
    <a href="#app-download" onClick={()=>setMenu("mobile-app")}className={menu==="Mobile App"?"active":""}>Mobile App</a>
    <a href="#footer" onClick={()=>setMenu("contact-us")}className={menu==="Contact Us"?"active":""}>Contact Us</a>
  </ul>
  
  <div className='navbar-right'>
    <button className='icon-button'>
     <img src={assets.search_icon} alt="Search" />
    </button>
    
    <div className='navbar-search-icon'>
     <Link to='/cart'> <img src={assets.basket_icon} alt="Basket" /></Link>
      <div className={getTotalCartAmount()===0?"":"dot"}></div>
    </div>
    {!token?<button onClick={()=>{setShowLogin(true)}} className='sign-in'>Sign In</button>
    :<div className='navbar-profile'>
      <img src={assets.profile_icon} alt="" />
      <ul className="nav-profile-dropdown">
        <li onClick={()=>navigate('/myorders')}><img src={assets.bag_icon} alt="" /><p>Orders</p></li>
        <hr/>
        <li onClick={logout}><img src={assets.logout_icon} alt="" /><p>Logout</p></li>
      </ul>
      </div>}
    
  </div>
</nav>
  )
}

export default Navbar
