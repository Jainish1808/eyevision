import React from 'react'

export function OrderSummary({ subtotal, delivery = 0, discount = 0, onCheckout }) {
  const total = subtotal + delivery - discount

  return (
    <div className="rounded-2xl border border-border-default bg-section-alt p-8">
      <h3 className="mb-6 text-xl font-bold text-text-primary">Order Summary</h3>

      <div className="space-y-4 border-b border-border-default pb-6">
         <div className="flex justify-between items-center text-sm">
           <span className="text-text-secondary font-medium">Subtotal</span>
           <span className="text-text-primary font-semibold">${subtotal.toFixed(2)}</span>
         </div>
         <div className="flex justify-between items-center text-sm">
           <span className="text-text-secondary font-medium">Estimated Delivery</span>
           <span className="text-text-primary font-semibold">{delivery === 0 ? 'Free' : `$${delivery.toFixed(2)}`}</span>
         </div>
         {discount > 0 && (
           <div className="flex justify-between items-center text-sm text-success">
             <span className="font-medium">Discount</span>
             <span className="font-semibold">-${discount.toFixed(2)}</span>
           </div>
         )}
      </div>

      <div className="flex justify-between items-center py-6">
         <span className="text-lg text-text-primary font-bold">Total</span>
         <span className="text-2xl text-text-primary font-bold">${total.toFixed(2)}</span>
      </div>

      <div className="mb-6 relative">
         <div className="flex">
            <input 
              type="text" 
              placeholder="Promo Code" 
              className="flex-1 rounded-l-lg border border-r-0 border-border-strong bg-white px-4 py-3 text-sm focus:border-accent-primary focus:outline-none"
              data-cursor="text"
            />
            <button className="rounded-r-lg border border-l-0 border-accent-primary bg-accent-primary px-4 py-3 text-sm font-semibold text-white hover:bg-accent-hover transition-colors">
              Apply
            </button>
         </div>
      </div>

      <button 
         onClick={onCheckout}
         data-cursor="link"
         className="w-full rounded-lg bg-blue-cta py-4 text-btn text-white transition-transform hover:scale-[1.02] hover:bg-blue-hover shadow-button font-bold"
      >
        Proceed to Checkout
      </button>

      <div className="mt-6 flex justify-center gap-4 text-text-muted opacity-60 grayscale">
         {/* Simple text placeholders for payment methods */}
         <span className="text-xs font-bold font-serif italic">VISA</span>
         <span className="text-xs font-bold font-serif italic">MasterCard</span>
         <span className="text-xs font-bold">G Pay</span>
         <span className="text-xs font-bold">PhonePe</span>
      </div>
    </div>
  )
}

export default OrderSummary
