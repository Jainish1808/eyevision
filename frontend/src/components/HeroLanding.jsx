import React from 'react'
import { useGSAP } from '../hooks/useGSAP'
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import Button from './Button'
import Navbar from './Navbar'

const HeroLanding = () => {
  const ref = useGSAP(() => {
    const split = new SplitText('.hero-title', { type: 'words' })
    const tl = gsap.timeline({ delay: 0.2 })

    tl.from('.navbar', { y: -70, opacity: 0, duration: 0.7, ease: 'power3.out' })
      .from('.hero-badge', { y: 24, opacity: 0, duration: 0.5, ease: 'power2.out' }, '-=0.3')
      .from(split.words, {
        y: 80, opacity: 0, rotationX: -40,
        duration: 0.8, stagger: 0.1, ease: 'power4.out',
        transformOrigin: '50% 50% -30px'
      }, '-=0.2')
      .from('.hero-subtitle', { y: 24, opacity: 0, duration: 0.6, ease: 'power2.out' }, '-=0.4')
      .from('.hero-cta > *', { y: 20, opacity: 0, duration: 0.5, stagger: 0.12 }, '-=0.35')
      .from('.hero-trust > *', { opacity: 0, duration: 0.4, stagger: 0.08 }, '-=0.2')
      .from('.hero-product-image', { x: 80, opacity: 0, duration: 1.0, ease: 'power3.out' }, 0.6)

    // Floating animation
    gsap.to('.floating-product-card', {
      y: -12, duration: 2.5, ease: 'sine.inOut', yoyo: true, repeat: -1
    })

    // Scroll indicator
    gsap.to('.scroll-indicator', {
      y: 8, duration: 0.8, ease: 'power1.inOut', yoyo: true, repeat: -1
    })

    return () => split.revert()
  })

  return (
    <div ref={ref} className="relative w-full h-screen bg-white overflow-hidden">
      <Navbar />

      <div className="flex items-center justify-center h-full relative z-10">
        <div className="grid grid-cols-2 gap-12 items-center w-full container">
          {/* Left Content */}
          <div className="flex flex-col gap-8">
            <div className="hero-badge inline-flex items-center gap-2 border border-border-default rounded-full px-4 py-2 w-fit">
              <span className="w-2 h-2 bg-success rounded-full"></span>
              <span className="caption text-text-muted">NEW ARRIVALS WEEKLY</span>
            </div>

            <h1 className="hero-title hero-display text-text-primary">
              Premium Vision. Perfect Style.
            </h1>

            <p className="hero-subtitle text-section-sub text-text-secondary max-w-md">
              Discover our curated collection of handpicked eyewear for every occasion and style.
            </p>

            <div className="hero-cta flex items-center gap-4">
              <Button variant="primary" size="lg">Shop Now</Button>
              <Button variant="pill">Browse Collections</Button>
            </div>

            <div className="hero-trust flex items-center gap-6">
              <div className="flex flex-col">
                <span className="font-bold text-lg">50K+</span>
                <span className="caption text-text-muted">Happy Customers</span>
              </div>
              <div className="w-px h-12 bg-border-default"></div>
              <div className="flex flex-col">
                <span className="font-bold text-lg">4.8★</span>
                <span className="caption text-text-muted">Highly Rated</span>
              </div>
            </div>
          </div>

          {/* Right - Product Image Area */}
          <div className="flex items-center justify-center h-full relative">
            <div className="hero-product-image relative w-96 h-96 bg-section-alt rounded-2xl flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">👓</div>
                <p className="text-text-muted">Premium Eyeglasses</p>
              </div>
            </div>

            {/* Floating Card */}
            <div className="floating-product-card absolute bottom-12 -left-20 w-48 h-32 bg-white shadow-card rounded-lg p-4">
              <div className="flex gap-3">
                <div className="w-16 h-16 bg-section-alt rounded-lg"></div>
                <div className="flex-1">
                  <h4 className="card-title">Classic Frame</h4>
                  <p className="caption text-text-muted">₹2,499</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="scroll-indicator absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="caption text-text-muted">Scroll to explore</span>
        <div className="w-6 h-10 border border-accent-primary rounded-full flex items-center justify-center">
          <div className="w-1 h-2 bg-accent-primary rounded-full animate-bounce"></div>
        </div>
      </div>
    </div>
  )
}

export default HeroLanding
