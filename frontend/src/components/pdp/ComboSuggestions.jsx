import React, { useRef } from 'react'
import { useGSAP } from '../../hooks/useGSAP'
import gsap from 'gsap'

export function ComboSuggestions({ products = [], onAddSuggestion }) {
  const containerRef = useRef(null)
  const hasBackendProducts = products.length > 0

  const fallbackCombos = [
    { id: 1, name: "The Complete Package", items: ["Frame", "Blue Light Lenses", "Premium Leather Case"], price: 250, save: 45 },
    { id: 2, name: "Sun Protection Kit", items: ["Sunglasses", "Cleaning Kit", "Hard Shell Case"], price: 180, save: 20 },
    { id: 3, name: "Work From Anywhere", items: ["Computer Glasses", "Screen Spray", "Microfiber Pouch"], price: 140, save: 15 },
  ]

  const combos = products.length
    ? products.map((product) => ({
        id: product.id,
        name: product.name,
        items: [product.brand, 'Recommended with this item'],
        price: Number(product.price || 0),
        save: product.original_price ? Number(product.original_price) - Number(product.price || 0) : 0,
        image: product.primary_image
      }))
    : fallbackCombos

  useGSAP(() => {
    gsap.from('.combo-card', {
      opacity: 0,
      x: 60,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 82%',
        once: true
      }
    })
  }, [])

  return (
    <section ref={containerRef} className="combo-section border-t border-border-default bg-white px-6 py-24">
      <div className="container-main mx-auto">
        <h2 className="mb-4 text-section-title">Complete Your Look</h2>
        <p className="mb-12 text-section-sub">Add curated combos or related products to build your full eyewear setup.</p>

        <div className="flex gap-6 overflow-x-auto pb-8 snap-x">
          {combos.map((combo) => (
            <div key={combo.id} className="combo-card flex min-w-[320px] max-w-[400px] flex-col rounded-[16px] border border-border-strong bg-card-surface p-6 snap-center shadow-sm">
              {combo.image && (
                <img src={combo.image} alt={combo.name} className="mb-4 h-40 w-full rounded-lg object-cover" />
              )}

              <h3 className="text-xl font-bold text-text-primary mb-2">{combo.name}</h3>
              {combo.save > 0 && <p className="text-xs font-semibold uppercase text-success tracking-wider mb-6">Save ${combo.save}</p>}
              
              <ul className="mb-8 flex-1 space-y-3">
                {combo.items.map((item, idx) => (
                   <li key={idx} className="flex items-center gap-3 text-sm text-text-secondary">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent-primary/10 text-accent-primary">✓</span>
                      {item}
                   </li>
                ))}
              </ul>

              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-text-primary">${combo.price}</span>
                <button
                  onClick={() => onAddSuggestion?.({ productId: hasBackendProducts ? combo.id : undefined, quantity: 1, variant: { combo: combo.name } })}
                  className="rounded-lg bg-accent-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
                >
                   Add Combo
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ComboSuggestions
