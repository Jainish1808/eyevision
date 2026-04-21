import React from 'react'

const Skeleton = ({ variant = 'card', className = '' }) => {
  const variants = {
    card: 'rounded-lg bg-input-bg h-48 mb-4',
    text: 'rounded-sm bg-input-bg h-4 w-3/4 mb-2',
    title: 'rounded-sm bg-input-bg h-6 w-1/2 mb-4',
    image: 'rounded-lg bg-input-bg aspect-square mb-4'
  }

  return (
    <div className={`animate-pulse ${variants[variant]} ${className}`} />
  )
}

export default Skeleton
