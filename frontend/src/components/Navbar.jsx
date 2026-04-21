import React, { useState } from 'react'
import { useGSAP } from '../hooks/useGSAP'
import gsap from 'gsap'
import { Menu, X, Search, Heart, ShoppingCart, User } from 'lucide-react'
import Button from './Button'

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const ref = useGSAP(() => {
    // Navbar scroll effect
    let lastScroll = 0
    const navbar = document.querySelector('[data-navbar]')

    window.addEventListener('scroll', () => {
      const currentScroll = window.scrollY

      if (currentScroll > 60) {
        gsap.to(navbar, {
          background: 'rgba(255,255,255,0.88)',
          backdropFilter: 'blur(16px)',
          boxShadow: '0 1px 0 rgba(0,0,0,0.08)',
          duration: 0.35
        })
      } else {
        gsap.to(navbar, {
          background: 'transparent',
          backdropFilter: 'none',
          boxShadow: 'none',
          duration: 0.35
        })
      }

      lastScroll = currentScroll
    })
  })

  return (
    <nav
      ref={ref}
      data-navbar
      className="fixed top-0 w-full h-16 bg-transparent z-1000 transition-all duration-300"
    >
      <div className="container flex items-center justify-between h-full">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-accent-primary rounded-full"></div>
          <span className="font-sans font-600 text-lg text-accent-primary">EyeWear</span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#" className="nav-link text-accent-primary hover:text-blue-cta transition-colors">Home</a>
          <a href="#" className="nav-link text-accent-primary hover:text-blue-cta transition-colors">Shop</a>
          <a href="#" className="nav-link text-accent-primary hover:text-blue-cta transition-colors">About</a>
          <a href="#" className="nav-link text-accent-primary hover:text-blue-cta transition-colors">Contact</a>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-input-bg rounded-full transition-colors">
            <Search size={20} className="text-accent-primary" />
          </button>
          <button className="p-2 hover:bg-input-bg rounded-full transition-colors relative">
            <Heart size={20} className="text-accent-primary" />
            <span className="absolute top-0 right-0 w-5 h-5 bg-error text-white text-xs rounded-full flex items-center justify-center">0</span>
          </button>
          <button className="p-2 hover:bg-input-bg rounded-full transition-colors relative">
            <ShoppingCart size={20} className="text-accent-primary" />
            <span className="absolute top-0 right-0 w-5 h-5 bg-error text-white text-xs rounded-full flex items-center justify-center">0</span>
          </button>
          <Button variant="blue" size="sm" className="hidden md:flex">Login</Button>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-b border-border-default">
          <div className="container py-4 flex flex-col gap-4">
            <a href="#" className="nav-link">Home</a>
            <a href="#" className="nav-link">Shop</a>
            <a href="#" className="nav-link">About</a>
            <a href="#" className="nav-link">Contact</a>
            <Button variant="blue" className="w-full">Login</Button>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
