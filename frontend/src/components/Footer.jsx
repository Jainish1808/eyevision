import React from 'react'
import { useGSAP } from '../hooks/useGSAP'
import gsap from 'gsap'

const Footer = () => {
  const ref = useGSAP(() => {
    // Stagger footer sections
    gsap.from('.footer-col', {
      opacity: 0,
      y: 40,
      stagger: 0.08,
      duration: 0.6,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.utility-footer',
        start: 'top 90%',
        once: true
      }
    })
  })

  return (
    <footer ref={ref} className="bg-dark-footer text-text-on-dark">
      <div className="container py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-8">
          {/* Brand */}
          <div className="footer-col">
            <h4 className="font-bold mb-4">EyeWear</h4>
            <p className="caption text-text-on-dark-muted">Premium vision, perfect style.</p>
          </div>

          {/* Shop */}
          <div className="footer-col">
            <h4 className="font-bold mb-4">Shop</h4>
            <ul className="space-y-2">
              <li><a href="#" className="caption text-text-on-dark-muted hover:text-white transition-colors">All Products</a></li>
              <li><a href="#" className="caption text-text-on-dark-muted hover:text-white transition-colors">New Arrivals</a></li>
              <li><a href="#" className="caption text-text-on-dark-muted hover:text-white transition-colors">Sale</a></li>
            </ul>
          </div>

          {/* Help */}
          <div className="footer-col">
            <h4 className="font-bold mb-4">Help</h4>
            <ul className="space-y-2">
              <li><a href="#" className="caption text-text-on-dark-muted hover:text-white transition-colors">FAQ</a></li>
              <li><a href="#" className="caption text-text-on-dark-muted hover:text-white transition-colors">Contact</a></li>
              <li><a href="#" className="caption text-text-on-dark-muted hover:text-white transition-colors">Shipping</a></li>
            </ul>
          </div>

          {/* Company */}
          <div className="footer-col">
            <h4 className="font-bold mb-4">Company</h4>
            <ul className="space-y-2">
              <li><a href="#" className="caption text-text-on-dark-muted hover:text-white transition-colors">About</a></li>
              <li><a href="#" className="caption text-text-on-dark-muted hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="caption text-text-on-dark-muted hover:text-white transition-colors">Careers</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-col">
            <h4 className="font-bold mb-4">Contact</h4>
            <ul className="space-y-2">
              <li className="caption text-text-on-dark-muted">support@eyewear.com</li>
              <li className="caption text-text-on-dark-muted">+91 758 812 3456</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border-strong/20 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="caption text-text-on-dark-muted">© 2025 EyeWear Store. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="caption text-text-on-dark-muted">Payment Methods:</span>
            <div className="flex gap-2">
              <div className="w-8 h-5 bg-white/10 rounded text-xs flex items-center justify-center">💳</div>
              <div className="w-8 h-5 bg-white/10 rounded text-xs flex items-center justify-center">₹</div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
