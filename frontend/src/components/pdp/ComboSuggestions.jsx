import React, { useRef } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingBag, Plus } from 'lucide-react'
import { useGSAP } from '../../hooks/useGSAP'
import gsap from 'gsap'

export function ComboSuggestions({ combos = [], suggestions = [], related = [], onAddSuggestion }) {
  const containerRef = useRef(null)
  const suggestionsRef = useRef(null)

  const fallbackCombos = [
    { id: 1, name: "The Complete Package", items: ["Frame", "Blue Light Lenses", "Premium Leather Case"], price: 250, save: 45 },
    { id: 2, name: "Sun Protection Kit", items: ["Sunglasses", "Cleaning Kit", "Hard Shell Case"], price: 180, save: 20 },
  ]

  const displayCombos = combos.length
    ? combos.map((product) => ({
        id: product.id,
        name: product.name,
        items: [product.brand, product.description || 'Recommended with this item'],
        price: Number(product.price || 0),
        save: product.original_price ? Number(product.original_price) - Number(product.price || 0) : 0,
        image: product.primary_image
      }))
    : fallbackCombos

  const displaySuggestions = suggestions.length ? suggestions : related

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

    if (displaySuggestions.length) {
      gsap.from('.suggestion-card', {
        opacity: 0,
        y: 40,
        duration: 0.6,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: suggestionsRef.current,
          start: 'top 82%',
          once: true
        }
      })
    }
  }, [displaySuggestions.length])

  return (
    <>
      {/* Combo Suggestions */}
      <section ref={containerRef} className="combo-section border-t border-border-default bg-white px-6 py-24">
        <div className="container-main mx-auto">
          <h2 className="mb-4 text-section-title">Complete Your Look</h2>
          <p className="mb-12 text-section-sub">Save up to 15% when you buy these items together.</p>

          <div className="flex gap-6 overflow-x-auto pb-8 snap-x">
            {displayCombos.map((combo) => (
              <div key={combo.id} className="combo-card flex min-w-[320px] max-w-[400px] flex-col rounded-[16px] border border-border-strong bg-card-surface p-6 snap-center shadow-sm">
                {combo.image && (
                  <img src={combo.image} alt={combo.name} className="mb-4 h-40 w-full rounded-lg object-cover" />
                )}

                <h3 className="text-xl font-bold text-text-primary mb-2">{combo.name}</h3>
                {combo.save > 0 && <p className="text-xs font-semibold uppercase text-success tracking-wider mb-6">Save ${combo.save.toFixed(2)}</p>}
                
                <ul className="mb-8 flex-1 space-y-3">
                  {combo.items.map((item, idx) => (
                     <li key={idx} className="flex items-center gap-3 text-sm text-text-secondary">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent-primary/10 text-accent-primary">✓</span>
                        {item}
                     </li>
                  ))}
                </ul>

                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-text-primary">${combo.price.toFixed(2)}</span>
                  <button
                    onClick={() => onAddSuggestion?.({ productId: combo.id, quantity: 1, variant: { combo: combo.name } })}
                    className="flex items-center gap-2 rounded-lg bg-accent-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
                    data-cursor="link"
                  >
                     <Plus size={16} /> Add Combo
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Individual Suggestions */}
      {displaySuggestions.length > 0 && (
        <section ref={suggestionsRef} className="suggestions-section border-t border-border-default bg-section-alt px-6 py-24">
          <div className="container-main mx-auto">
            <h2 className="mb-4 text-section-title">You May Also Like</h2>
            <p className="mb-12 text-section-sub">Handpicked recommendations based on this product.</p>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {displaySuggestions.map((product) => (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  className="suggestion-card group relative flex flex-col overflow-hidden rounded-xl border border-border-default bg-white p-4 shadow-card transition-all hover:shadow-lg"
                  data-cursor="product"
                >
                  <div className="relative mb-4 aspect-square w-full overflow-hidden rounded-lg bg-section-alt">
                    <img
                      src={product.primary_image || 'https://images.unsplash.com/photo-1577803645773-f96470509666?w=500&auto=format&fit=crop'}
                      alt={product.name}
                      className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  <div className="flex flex-1 flex-col">
                    <span className="mb-1 text-xs text-text-muted">{product.brand}</span>
                    <h3 className="mb-2 text-base font-semibold text-text-primary line-clamp-2">{product.name}</h3>
                    
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-end gap-2">
                        <span className="text-lg font-bold text-text-primary">${product.price?.toFixed(2)}</span>
                        {product.original_price && (
                          <span className="text-sm text-text-muted line-through">${product.original_price?.toFixed(2)}</span>
                        )}
                      </div>
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          onAddSuggestion?.({ productId: product.id, quantity: 1 })
                        }}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-primary text-white transition-colors hover:bg-accent-hover"
                        data-cursor="link"
                      >
                        <ShoppingBag size={16} />
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}

export default ComboSuggestions
