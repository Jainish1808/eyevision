import React, { useEffect } from 'react'
import { useGSAP } from '../../hooks/useGSAP'
import gsap from 'gsap'

const Toast = ({ type = 'info', message, duration = 4000, onClose }) => {
  const ref = useGSAP(() => {
    const toast = document.querySelector('[data-toast]')
    if (!toast) return

    gsap.fromTo(toast,
      { x: 120, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.4, ease: 'back.out(1.5)' }
    )

    gsap.to(toast.querySelector('.toast-progress'), {
      scaleX: 0,
      transformOrigin: 'left',
      duration: duration / 1000,
      ease: 'none',
      onComplete: () => {
        gsap.to(toast, { x: 120, opacity: 0, duration: 0.3, ease: 'power2.in', onComplete: onClose })
      }
    })
  })

  const typeStyles = {
    success: 'border-l-4 border-success bg-green-50',
    error: 'border-l-4 border-error bg-red-50',
    info: 'border-l-4 border-accent-primary bg-gray-50',
    warning: 'border-l-4 border-warning bg-yellow-50'
  }

  return (
    <div
      ref={ref}
      data-toast
      className={`fixed bottom-8 right-8 w-80 rounded-lg shadow-button overflow-hidden ${typeStyles[type]}`}
    >
      <div className="p-4 flex items-start gap-3">
        <div className="flex-1">
          <p className="text-sm font-medium text-text-primary">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="text-text-muted hover:text-text-primary transition-colors"
        >
          ✕
        </button>
      </div>
      <div
        className="toast-progress h-1 bg-current opacity-20"
        style={{ transformOrigin: 'left', scaleX: 1 }}
      />
    </div>
  )
}

export default Toast
