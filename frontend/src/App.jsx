import React, { useEffect } from 'react'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { ErrorBoundary } from './components/ErrorBoundary'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import { AlertProvider } from './context/AlertContext'
import { ProtectedRoute, GuestRoute } from './components/auth/ProtectedRoute'
import { useIdleTimeout } from './hooks/useIdleTimeout'
import { Loader } from './components/ui/Loader'
import { Cursor } from './components/cursor/Cursor'
import { Footer } from './components/sections/Footer'
import cursorSystem from './gsap/cursorSystem'

// Pages
import LandingPage from './pages/LandingPage'
import AuthPage from './pages/AuthPage'
import ShopPage from './pages/ShopPage'
import ProductPage from './pages/ProductPage'
import CartPage from './pages/CartPage'
import { NotFoundPage, UnauthorizedPage, ForbiddenPage } from './pages/ErrorPages'

const AppContent = () => {
  const location = useLocation()
  
  // Initialize idle timeout
  useIdleTimeout()

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
      
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <Routes location={location} key={location.pathname}>
            {/* Main landing/home page - shows different content based on auth */}
            <Route path="/" element={<LandingPage />} />
            
            {/* Guest-only routes (redirect if authenticated) */}
            <Route path="/auth" element={
              <GuestRoute>
                <AuthPage />
              </GuestRoute>
            } />
            
            {/* Protected routes (require authentication) */}
            <Route path="/shop" element={
              <ProtectedRoute>
                <ShopPage />
              </ProtectedRoute>
            } />
            <Route path="/product/:id" element={
              <ProtectedRoute>
                <ProductPage />
              </ProtectedRoute>
            } />
            <Route path="/cart" element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            } />
            
            {/* Error pages */}
            <Route path="/401" element={<UnauthorizedPage />} />
            <Route path="/403" element={<ForbiddenPage />} />
            <Route path="/404" element={<NotFoundPage />} />
            
            {/* Redirect old /home to / */}
            <Route path="/home" element={<Navigate to="/" replace />} />
            
            {/* Catch-all 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          
          {/* Global Footer (not on Auth or error pages) */}
          {!location.pathname.match(/\/(auth|401|403|404)/) && <Footer />}
        </div>
      </div>
    </>
  )
}

export function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  )
}

export default App
