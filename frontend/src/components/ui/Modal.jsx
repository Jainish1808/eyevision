import React from 'react'
import { useGSAP } from '../hooks/useGSAP'
import gsap from 'gsap'

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  const ref = useGSAP(() => {
    if (!isOpen) return

    const modal = document.querySelector('[data-modal]')
    const overlay = document.querySelector('[data-modal-overlay]')

    gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.3 })
    gsap.fromTo(modal, { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.5)' })
  })

  if (!isOpen) return null

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl'
  }

  return (
    <div ref={ref} className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        data-modal-overlay
        className="absolute inset-0 bg-black bg-opacity-50 cursor-pointer"
        onClick={onClose}
      />

      <div
        data-modal
        className={`relative bg-white rounded-lg shadow-button p-8 ${sizes[size]} w-full mx-4`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-text-muted hover:text-text-primary transition-colors"
        >
          ✕
        </button>

        {title && <h2 className="section-title mb-6">{title}</h2>}
        {children}
      </div>
    </div>
  )
}

export default Modal
