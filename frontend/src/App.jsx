import React, { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { Loader } from './components/ui/Loader'
import { Cursor } from './components/cursor/Cursor'
import { Footer } from './components/sections/Footer'
import cursorSystem from './gsap/cursorSystem'

// Pages
import LandingPage from './pages/LandingPage'
import AuthPage from './pages/AuthPage'
import HomePage from './pages/HomePage'
import ShopPage from './pages/ShopPage'
import ProductPage from './pages/ProductPage'
import CartPage from './pages/CartPage'

export function App() {
  const location = useLocation()

  // Initialize cursor system on mount
  useEffect(() => {
    cursorSystem.init()
    return () => cursorSystem.destroy()
  }, [])

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <>
      <Cursor />
      <div className="page-curtain" />
      <Loader />
      
      {/* ScrollSmoother Wrapper */}
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/cart" element={<CartPage />} />
          </Routes>
          
          {/* Global Footer (not on Auth page) */}
          {location.pathname !== '/auth' && <Footer />}
        </div>
      </div>
    </>
  )
}

export default App
