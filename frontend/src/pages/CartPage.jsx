import React, { useRef, useEffect, useState } from 'react'
import { Navbar } from '../components/navbar/Navbar'
import { CartItem } from '../components/cart/CartItem'
import { OrderSummary } from '../components/cart/OrderSummary'
import { pageEnter, pageLeave } from '../gsap/pageTransitions'
import gsap from 'gsap'
import { ShoppingBag } from 'lucide-react'
import { Link } from 'react-router-dom'

export function CartPage() {
  const containerRef = useRef(null)

  // Dummy cart state
  const [items, setItems] = useState([
     { id: 'item1', quantity: 1, product: { name: 'Aero Titanium', price: 240, primary_image: '' }, variant: { color: 'Matte Black' } },
     { id: 'item2', quantity: 2, product: { name: 'Blue Block Pro', price: 90, primary_image: '' }, variant: { color: 'Tortoise' } }
  ])

  useEffect(() => {
    pageEnter(containerRef.current)

    if (items.length > 0) {
       gsap.from('.cart-item', { 
         opacity: 0, 
         y: 30, 
         stagger: 0.08, 
         duration: 0.5, 
         ease: 'power2.out',
         delay: 0.2
       })
    } else {
       gsap.from('.empty-cart', {
         scale: 0.85, 
         opacity: 0, 
         duration: 0.6, 
         ease: 'back.out(1.5)',
         delay: 0.2
       })
    }

    return () => {
      pageLeave(containerRef.current)
    }
  }, [items.length])

  const handleRemove = (id) => {
    setItems(items.filter(item => item.id !== id))
  }

  const handleUpdateQty = (id, newQty) => {
    setItems(items.map(item => item.id === id ? { ...item, quantity: newQty } : item))
  }

  const subtotal = items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0)

  return (
    <div ref={containerRef} className="page-container min-h-screen bg-page-bg">
      <Navbar />
      
      <main className="pt-24 pb-20">
        <div className="container-main mx-auto">
          
          <h1 className="mb-12 text-4xl font-serif font-bold text-text-primary border-b border-border-default pb-6">
             Your Bag {items.length > 0 && <span className="text-2xl text-text-muted font-sans ml-2">({items.length})</span>}
          </h1>

          {items.length === 0 ? (
            <div className="empty-cart flex flex-col items-center justify-center py-20 text-center">
               <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-section-alt text-text-muted">
                 <ShoppingBag size={48} strokeWidth={1} />
               </div>
               <h2 className="mb-2 text-2xl font-bold text-text-primary">Your bag is empty</h2>
               <p className="mb-8 text-text-secondary">Looks like you haven't added anything to your cart yet.</p>
               <Link 
                 to="/shop"
                 className="rounded-lg bg-accent-primary px-8 py-4 text-btn font-semibold text-white transition-transform hover:bg-accent-hover hover:scale-[1.02]"
               >
                 Continue Shopping
               </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-12 lg:flex-row items-start relative">
               
               {/* LEFT 65% — Items */}
               <div className="w-full lg:w-[65%]">
                  <div className="mb-6 flex justify-between text-sm font-semibold text-text-muted uppercase tracking-wider border-b border-border-default pb-4">
                    <span>Product</span>
                    <span>Total</span>
                  </div>
                  <div>
                    {items.map(item => (
                      <CartItem 
                        key={item.id} 
                        item={item} 
                        onRemove={handleRemove} 
                        onUpdateQty={handleUpdateQty} 
                      />
                    ))}
                  </div>
               </div>

               {/* RIGHT 35% — Summary (Sticky) */}
               <div className="w-full lg:w-[35%] lg:sticky lg:top-24">
                  <OrderSummary 
                     subtotal={subtotal} 
                     delivery={subtotal > 999 ? 0 : 50} 
                     onCheckout={() => console.log('Checkout clicked')} 
                  />
               </div>

            </div>
          )}

        </div>
      </main>
    </div>
  )
}

export default CartPage
