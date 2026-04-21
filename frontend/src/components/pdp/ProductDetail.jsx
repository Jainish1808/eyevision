import React, { useState } from 'react'
import { Star, Heart, CheckCircle2, ShieldCheck, Truck, ChevronDown } from 'lucide-react'
import gsap from 'gsap'

export function ProductDetail({ product, onAddToCart, isAdding = false }) {
  const [qty, setQty] = useState(1)
  const [activeColor, setActiveColor] = useState('black')
  const [activeTab, setActiveTab] = useState('description')
  const [needsPrescription, setNeedsPrescription] = useState(false)
  const [prescriptionType, setPrescriptionType] = useState('number-glasses')
  const [prescription, setPrescription] = useState({
    leftEye: '',
    rightEye: '',
    pupillaryDistance: ''
  })

  const colors = [
    { id: 'black', name: 'Matte Black', hex: '#222222' },
    { id: 'tortoise', name: 'Classic Tortoise', hex: '#5A3A1F' },
    { id: 'clear', name: 'Crystal Clear', hex: '#F0F0F0' },
  ]
  
  const handleColorClick = (colorId, e) => {
    setActiveColor(colorId)
    gsap.fromTo(e.currentTarget, 
      { scale: 0.9 },
      { scale: 1.15, duration: 0.2, ease: 'back.out(1.5)', clearProps: 'scale' }
    )
  }

  const handleQtyChange = (delta) => {
    const newVal = Math.max(1, Math.min(10, qty + delta))
    if (newVal === qty) return
    
    const el = document.getElementById('qty-display')
    if (el) {
       gsap.to(el, {
         rotationX: delta > 0 ? -90 : 90,
         duration: 0.15,
         ease: 'power2.in',
         onComplete: () => {
           setQty(newVal)
           gsap.fromTo(el,
             { rotationX: delta > 0 ? 90 : -90 },
             { rotationX: 0, duration: 0.2, ease: 'power2.out' }
           )
         }
       })
    } else {
       setQty(newVal)
    }
  }

  const p = product || {
     brand: 'Ray-Ban',
     name: 'Classic Wayfarer Polarized',
     price: 185.00,
     originalPrice: 220.00,
     rating: 4.8,
     reviews: 342,
     description: "The Original Wayfarer Classic is the most recognizable style in the history of sunglasses. Since its initial design in 1952, Wayfarer Classics gained popularity among celebrities, musicians, artists and those with an impeccable fashion sense."
  }

  const price = Number(p.price || 0)
  const originalPrice = p.original_price || p.originalPrice
  const reviewCount = Number(p.review_count || p.reviews || 0)

  const handleAddToBag = () => {
    if (!onAddToCart) return

    const prescriptionPayload = needsPrescription
      ? {
          type: prescriptionType,
          ...prescription
        }
      : undefined

    onAddToCart({
      quantity: qty,
      variant: {
        color: colors.find((c) => c.id === activeColor)?.name
      },
      prescription: prescriptionPayload
    })
  }

  return (
    <div className="flex flex-col gap-8 pb-12 w-full max-w-xl">
      
      {/* Header Info */}
      <div className="border-b border-border-default pb-6">
        <p className="mb-2 text-sm font-semibold tracking-wider text-text-muted">{p.brand}</p>
        <h1 className="mb-4 text-4xl font-bold leading-tight text-text-primary">{p.name}</h1>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
             <Star className="text-yellow-400" fill="currentColor" size={18} />
             <span className="font-semibold">{p.rating}</span>
             <a href="#reviews" className="text-sm font-medium text-text-muted underline">({reviewCount} reviews)</a>
          </div>
          <span className="flex items-center gap-1 text-sm font-medium text-success">
            <CheckCircle2 size={16} /> In Stock
          </span>
        </div>
      </div>

      {/* Price */}
      <div className="flex items-end gap-3">
        <span className="text-3xl font-bold text-text-primary">${price.toFixed(2)}</span>
        {originalPrice && (
          <span className="mb-1 text-lg font-medium text-text-muted line-through">${Number(originalPrice).toFixed(2)}</span>
        )}
      </div>

      {/* Colors */}
      <div className="flex flex-col gap-3">
        <div className="flex justify-between">
           <span className="text-sm font-semibold text-text-primary">Frame Color</span>
           <span className="text-sm text-text-muted">{colors.find(c => c.id === activeColor)?.name}</span>
        </div>
        <div className="flex gap-3">
          {colors.map((color) => (
             <button
               key={color.id}
               onClick={(e) => handleColorClick(color.id, e)}
               className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors ${
                 activeColor === color.id ? 'border-accent-primary' : 'border-transparent hover:border-border-strong'
               }`}
             >
               <span 
                 className="h-8 w-8 rounded-full border border-border-default" 
                 style={{ backgroundColor: color.hex }}
               />
             </button>
          ))}
        </div>
      </div>

      <button
        onClick={() => setNeedsPrescription((prev) => !prev)}
        className="flex w-full items-center justify-between rounded-xl border border-border-strong bg-card-surface px-6 py-4 transition-colors hover:border-accent-primary hover:bg-white text-left"
      >
          <div>
             <h4 className="font-bold text-text-primary">Need Prescription Lenses?</h4>
             <p className="text-sm text-text-secondary mt-1">Add number glasses or lens details before checkout</p>
          </div>
          <ChevronDown className={`text-text-muted transition-transform ${needsPrescription ? 'rotate-180' : ''}`} />
      </button>

      {needsPrescription && (
        <div className="rounded-xl border border-border-default bg-white p-5">
          <div className="mb-4 grid gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold uppercase tracking-[0.08em] text-text-muted">Prescription Type</label>
              <select
                value={prescriptionType}
                onChange={(e) => setPrescriptionType(e.target.value)}
                className="rounded-lg border border-border-default bg-input-bg px-3 py-2.5 text-sm text-text-primary focus:border-accent-primary focus:bg-white focus:outline-none"
              >
                <option value="number-glasses">Number Glasses</option>
                <option value="lenses">Contact Lenses</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold uppercase tracking-[0.08em] text-text-muted">PD (mm)</label>
              <input
                type="text"
                value={prescription.pupillaryDistance}
                onChange={(e) => setPrescription((prev) => ({ ...prev, pupillaryDistance: e.target.value }))}
                placeholder="e.g. 62"
                className="rounded-lg border border-border-default bg-input-bg px-3 py-2.5 text-sm text-text-primary focus:border-accent-primary focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold uppercase tracking-[0.08em] text-text-muted">Right Eye</label>
              <input
                type="text"
                value={prescription.rightEye}
                onChange={(e) => setPrescription((prev) => ({ ...prev, rightEye: e.target.value }))}
                placeholder="SPH / CYL"
                className="rounded-lg border border-border-default bg-input-bg px-3 py-2.5 text-sm text-text-primary focus:border-accent-primary focus:bg-white focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold uppercase tracking-[0.08em] text-text-muted">Left Eye</label>
              <input
                type="text"
                value={prescription.leftEye}
                onChange={(e) => setPrescription((prev) => ({ ...prev, leftEye: e.target.value }))}
                placeholder="SPH / CYL"
                className="rounded-lg border border-border-default bg-input-bg px-3 py-2.5 text-sm text-text-primary focus:border-accent-primary focus:bg-white focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Add to Cart area */}
      <div className="mt-4 flex gap-4">
         <div className="flex h-[56px] w-[140px] items-center justify-between rounded-lg border border-border-strong bg-white px-2">
            <button 
              onClick={() => handleQtyChange(-1)} 
              className="flex h-10 w-10 items-center justify-center rounded-md text-xl text-text-secondary transition-colors hover:bg-section-alt"
            >
              -
            </button>
            <span id="qty-display" className="w-8 text-center font-bold text-text-primary overflow-hidden inline-block">{qty}</span>
            <button 
              onClick={() => handleQtyChange(1)}
              className="flex h-10 w-10 items-center justify-center rounded-md text-xl text-text-secondary transition-colors hover:bg-section-alt"
            >
              +
            </button>
         </div>

         <button 
            data-cursor="link" 
          onClick={handleAddToBag}
          disabled={isAdding}
          className="flex h-[56px] flex-1 items-center justify-center gap-2 rounded-lg bg-blue-cta px-8 text-btn text-white transition-all hover:bg-blue-hover font-semibold hover:shadow-button active:scale-[0.98]"
         >
          {isAdding ? 'Adding...' : `Add to Bag - $${(price * qty).toFixed(2)}`}
         </button>
         
         <button className="flex h-[56px] w-[56px] items-center justify-center rounded-lg border border-border-strong bg-white text-text-muted transition-colors hover:border-accent-primary hover:text-red-500">
           <Heart size={24} />
         </button>
      </div>

      {/* Trust Badges */}
      <div className="mt-4 flex flex-col gap-4 rounded-xl bg-section-alt p-6">
        <div className="flex items-start gap-4">
          <Truck className="mt-1 text-text-primary" />
          <div>
            <h4 className="font-semibold text-text-primary">Free Express Delivery</h4>
            <p className="text-sm text-text-secondary">Order within 2hrs for delivery tomorrow</p>
          </div>
        </div>
        <div className="h-px w-full bg-border-default" />
        <div className="flex items-start gap-4">
          <ShieldCheck className="mt-1 text-text-primary" />
          <div>
            <h4 className="font-semibold text-text-primary">1 Year Warranty & 14 Day Returns</h4>
            <p className="text-sm text-text-secondary">Free return shipping included</p>
          </div>
        </div>
      </div>

      {/* Details Tabs */}
      <div className="mt-8">
        <div className="flex border-b border-border-default">
           {['description', 'specs', 'shipping'].map(tab => (
             <button 
               key={tab}
               onClick={() => setActiveTab(tab)}
               className={`border-b-2 px-6 py-4 text-sm font-semibold capitalize transition-colors ${activeTab === tab ? 'border-accent-primary text-text-primary' : 'border-transparent text-text-muted hover:text-text-primary'}`}
             >
               {tab}
             </button>
           ))}
        </div>
        <div className="py-6 text-[15px] leading-relaxed text-text-secondary">
           {activeTab === 'description' && p.description}
           {activeTab === 'specs' && "Material: Italian Acetate\nLens Width: 52mm\nBridge: 22mm\nTemple: 150mm"}
           {activeTab === 'shipping' && "Standard shipping takes 3-5 business days. Express shipping takes 1-2 business days. Tracking details will be provided via email."}
        </div>
      </div>

    </div>
  )
}

export default ProductDetail
