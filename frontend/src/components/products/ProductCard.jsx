import React from 'react'
import { Link } from 'react-router-dom'
import { Heart, ShoppingBag, Star } from 'lucide-react'
import gsap from 'gsap'

export function ProductCard({
  id,
  name,
  brand,
  price,
  originalPrice,
  image,
  rating,
  reviews,
  badge
}) {
  const handleCardMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    e.currentTarget.style.setProperty('--mx', `${x}px`)
    e.currentTarget.style.setProperty('--my', `${y}px`)
  }

  const handleWishlistClick = (e) => {
    e.preventDefault()
    gsap.to(e.currentTarget, {
      scale: 1.5,
      duration: 0.15,
      yoyo: true,
      repeat: 1,
      ease: 'back.out(2)'
    })
  }

  const handleAddToCart = (e) => {
    e.preventDefault()
    const icon = e.currentTarget.querySelector('svg')
    if (icon) {
        gsap.to(icon, { rotate: 12, duration: 0.15, yoyo: true, repeat: 1 })
    }
  }

  return (
    <Link
      to={`/product/${id}`}
      data-cursor="product"
      onMouseMove={handleCardMove}
      className="product-lens-card group relative flex h-full flex-col overflow-hidden rounded-xl border border-border-default bg-card-surface p-4 shadow-card transition-colors duration-500 hover:bg-white"
    >
      <span className="card-lens-glow" />

      {/* Badges & Actions */}
      <div className="absolute left-4 right-4 top-4 z-10 flex items-start justify-between pointer-events-none">
        <div>
          {badge && (
            <span className="inline-block rounded-md bg-accent-primary px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
              {badge}
            </span>
          )}
        </div>
        <button
          onClick={handleWishlistClick}
          className="pointer-events-auto flex h-8 w-8 items-center justify-center rounded-full bg-white text-text-muted shadow-sm transition-colors hover:text-red-500"
        >
          <Heart size={16} strokeWidth={2} />
        </button>
      </div>

      {/* Image */}
      <div className="relative mb-4 aspect-square w-full overflow-hidden rounded-lg bg-white">
        <img
          src={image || 'https://images.unsplash.com/photo-1577803645773-f96470509666?w=500&auto=format&fit=crop'}
          alt={name}
          className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Hidden Add to cart (slides up on desktop hover) */}
        <div className="absolute bottom-4 left-0 w-full px-4" data-add-to-cart style={{ transform: 'translateY(40px)', opacity: 0 }}>
             <button
                onClick={handleAddToCart}
                className="pointer-events-auto flex w-full items-center justify-center gap-2 rounded-lg bg-accent-primary py-2.5 text-sm font-semibold text-white shadow-button transition-colors hover:bg-accent-hover"
              >
                <ShoppingBag size={16} /> Add to Cart
              </button>
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col">
        <span className="mb-1 text-[13px] text-text-muted">{brand}</span>
        <h3 className="mb-2 text-card-title text-text-primary line-clamp-1">{name}</h3>
        
        <div className="mb-3 flex items-center gap-1">
          <Star className="text-yellow-400" fill="currentColor" size={14} />
          <span className="text-[13px] font-medium text-text-primary">{rating}</span>
          <span className="text-[13px] text-text-muted">({reviews})</span>
        </div>

        <div className="mt-auto flex items-end gap-2">
          <span className="text-lg font-bold text-text-primary">${price?.toFixed(2)}</span>
          {originalPrice && (
            <span className="text-sm text-text-muted line-through">${originalPrice?.toFixed(2)}</span>
          )}
        </div>
      </div>
    </Link>
  )
}

export default ProductCard
