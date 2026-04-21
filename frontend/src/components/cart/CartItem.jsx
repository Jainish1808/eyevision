import React from 'react'
import { X } from 'lucide-react'
import gsap from 'gsap'

export function CartItem({ item, onRemove, onUpdateQty }) {
  const handleRemove = (e) => {
    // Traverse up to find the item container
    const el = e.currentTarget.closest('.cart-item')
    if (!el) {
      if (onRemove) onRemove(item.id)
      return
    }

    gsap.to(el, {
      x: -80,
      opacity: 0,
      height: 0,
      marginBottom: 0,
      padding: 0,
      duration: 0.4,
      ease: 'power2.in',
      onComplete: () => {
        if (onRemove) onRemove(item.id)
      }
    })
  }

  const handleQtyChange = (delta) => {
    const newQty = Math.max(1, item.quantity + delta)
    if (newQty === item.quantity) return

    if (onUpdateQty) {
      onUpdateQty(item.id, newQty)
    }
  }

  return (
    <div className="cart-item mb-6 flex gap-6 border-b border-border-default pb-6">
      <div className="h-32 w-24 shrink-0 overflow-hidden rounded-xl bg-section-alt">
        <img
          src={item.product.primary_image || 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=200'}
          alt={item.product.name}
          className="h-full w-full object-cover mix-blend-multiply"
        />
      </div>

      <div className="flex flex-1 flex-col">
        <div className="flex justify-between items-start">
           <div>
             <h3 className="text-lg font-bold text-text-primary">{item.product.name}</h3>
             <p className="text-sm text-text-secondary mt-1">
                {item.variant ? Object.values(item.variant).join(' / ') : 'Standard'}
             </p>
           </div>
           <button 
             onClick={handleRemove}
             className="text-text-muted transition-colors hover:text-red-500"
             aria-label="Remove item"
           >
             <X size={20} />
           </button>
        </div>

        <div className="mt-auto flex items-end justify-between">
           <div className="flex h-10 w-28 items-center justify-between rounded-lg border border-border-strong bg-white px-2">
              <button 
                onClick={() => handleQtyChange(-1)} 
                className="flex h-6 w-6 items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-section-alt"
              >
                -
              </button>
              <span className="w-6 text-center font-bold text-text-primary text-sm">{item.quantity}</span>
              <button 
                onClick={() => handleQtyChange(1)}
                className="flex h-6 w-6 items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-section-alt"
              >
                +
              </button>
           </div>
           
           <span className="text-lg font-bold text-text-primary">${(item.product.price * item.quantity).toFixed(2)}</span>
        </div>
      </div>
    </div>
  )
}

export default CartItem
