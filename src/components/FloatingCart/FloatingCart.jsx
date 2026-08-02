import React, { useContext, useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { StoreContext } from '../../context/StoreContext'
import { assets } from '../../assets/assets'
import './FloatingCart.css'

const FloatingCart = () => {
    const { token, cartItems, cartPulse } = useContext(StoreContext)
    const [animate, setAnimate] = useState(false)
    const location = useLocation()

    // Count items in cart
    const cartCount = Object.values(cartItems).reduce((sum, count) => sum + count, 0)

    useEffect(() => {
        if (cartPulse > 0) {
            setAnimate(true)
            const timer = setTimeout(() => setAnimate(false), 1000)
            return () => clearTimeout(timer)
        }
    }, [cartPulse])

    // Hide if not logged in or if we are already on the cart page
    if (!token || location.pathname.toLowerCase() === '/cart') {
        return null
    }

    return (
        <Link to="/cart" className={`floating-cart-fab ${animate ? 'sparkle-pulse' : ''}`}>
            <div className="floating-cart-glow"></div>
            {/* Sparkle particles */}
            {animate && (
                <>
                    <div className="sparkle-particle p1">✨</div>
                    <div className="sparkle-particle p2">✨</div>
                    <div className="sparkle-particle p3">✨</div>
                    <div className="sparkle-particle p4">✨</div>
                </>
            )}
            <img src={assets.basket_icon} alt="Cart" className="floating-cart-icon" />
            {cartCount > 0 && (
                <div className="floating-cart-badge">{cartCount}</div>
            )}
        </Link>
    )
}

export default FloatingCart
