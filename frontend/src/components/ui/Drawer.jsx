import React, { useState } from 'react'
import { useGSAP } from '../hooks/useGSAP'
import gsap from 'gsap'

const Drawer = ({ isOpen, onClose, children, side = 'right' }) => {
  const ref = useGSAP(() => {
    if (!isOpen) return

    const drawer = document.querySelector('[data-drawer]')
    const overlay = document.querySelector('[data-drawer-overlay]')

    gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power2.out' })

    if (side === 'right') {
      gsap.fromTo(drawer, { x: 400 }, { x: 0, duration: 0.4, ease: 'power3.out' })
    } else {
      gsap.fromTo(drawer, { x: -400 }, { x: 0, duration: 0.4, ease: 'power3.out' })
    }
  })

  if (!isOpen) return null

  return (
    <div ref={ref} className="fixed inset-0 z-50 flex pointer-events-none">
      <div
        data-drawer-overlay
        className="absolute inset-0 bg-black bg-opacity-50 cursor-pointer pointer-events-auto"
        onClick={onClose}
      />

      <div
        data-drawer
        className={`absolute inset-y-0 w-80 bg-white shadow-xl pointer-events-auto overflow-y-auto ${side === 'right' ? 'right-0' : 'left-0'}`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-text-muted hover:text-text-primary transition-colors z-10"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  )
}

export default Drawer
