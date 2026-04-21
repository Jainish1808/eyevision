import React from 'react'
import { useGSAP } from '../hooks/useGSAP'
import gsap from 'gsap'

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  disabled = false,
  ...props
}) => {
  const ref = useGSAP(() => {
    const buttons = document.querySelectorAll('[data-button]')
    buttons.forEach(btn => {
      btn.addEventListener('mouseenter', function() {
        if (variant === 'primary') {
          gsap.to(this, { background: '#333333', scale: 1.02, duration: 0.2 })
        } else if (variant === 'secondary') {
          gsap.to(this, { background: '#1A1A1A', color: '#fff', duration: 0.25 })
        }
      })
      btn.addEventListener('mouseleave', function() {
        gsap.to(this, { scale: 1, duration: 0.2 })
      })
    })
  })

  const baseStyles = 'font-button font-sans rounded-sm transition-all duration-200 flex items-center justify-center'

  const variants = {
    primary: 'bg-accent-primary text-white hover:bg-accent-hover',
    secondary: 'border-1.5 border-accent-primary text-accent-primary bg-transparent hover:bg-accent-primary hover:text-white',
    blue: 'bg-blue-cta text-white hover:bg-blue-hover',
    pill: 'border border-border-strong text-accent-primary rounded-full px-5 py-2 hover:bg-input-bg'
  }

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-6 py-3 text-button',
    lg: 'px-8 py-4 text-lg'
  }

  return (
    <button
      ref={ref}
      data-button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
