import React from 'react'
import { useGSAP } from '../../hooks/useGSAP'
import gsap from 'gsap'

const Badge = ({ children, variant = 'default', className = '' }) => {
  const baseStyles = 'badge-text inline-flex items-center gap-1 rounded-xs px-3 py-1'

  const variants = {
    default: 'bg-accent-primary text-white',
    secondary: 'bg-input-bg text-accent-primary border border-border-default',
    success: 'bg-success bg-opacity-10 text-success',
    error: 'bg-error bg-opacity-10 text-error',
    warning: 'bg-warning bg-opacity-10 text-warning'
  }

  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </span>
  )
}

export default Badge
