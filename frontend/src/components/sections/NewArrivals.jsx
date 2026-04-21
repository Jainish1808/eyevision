import React, { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useGSAP } from '../../hooks/useGSAP'
import ProductCard from '../products/ProductCard'
import gsap from 'gsap'

export function NewArrivals({ products = [] }) {
  const containerRef = useRef(null)
  const carouselRef = useRef(null)

  const fallbackProducts = [
    { id: '5', name: 'Minimalist Round', brand: 'Garrett Leight', price: 210, rating: 4.6, reviews: 45, image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=500' },
    { id: '6', name: 'Retro Square', brand: 'Oliver Peoples', price: 280, rating: 4.8, reviews: 112, badge: 'New', image: 'https://images.unsplash.com/photo-1577803645773-f96470509666?q=80&w=500' },
    { id: '7', name: 'Sport Wrap', brand: 'Oakley', price: 160, rating: 4.7, reviews: 89, image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=500' },
    { id: '8', name: 'Blue Light Tortoise', brand: 'Warby Parker', price: 95, rating: 4.9, reviews: 420, image: 'https://images.unsplash.com/photo-1577803645773-f96470509666?q=80&w=500' },
    { id: '9', name: 'Premium Acetate', brand: 'Cutler and Gross', price: 420, rating: 5.0, reviews: 12, image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=500' },
  ]

  const displayProducts = products.length
    ? products.map((p) => ({
        id: p.id,
        name: p.name,
        brand: p.brand,
        price: Number(p.price || 0),
        originalPrice: p.original_price ? Number(p.original_price) : undefined,
        rating: Number(p.rating || 0),
        reviews: Number(p.review_count || 0),
        image: p.primary_image,
        badge: p.is_new_arrival ? 'New' : undefined
      }))
    : fallbackProducts

  useGSAP(() => {
    gsap.from('.arrival-card', {
      opacity: 0,
      scale: 0.94,
      duration: 0.6,
      stagger: 0.08,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 80%',
        once: true
      }
    })
  }, [])

  const slideCards = (direction) => {
    if (!carouselRef.current) return
    const card = carouselRef.current.querySelector('.arrival-card')
    const cardWidth = card ? card.getBoundingClientRect().width + 24 : 320
    carouselRef.current.scrollBy({ left: direction * cardWidth, behavior: 'smooth' })
  }

  return (
    <section ref={containerRef} className="arrivals-grid bg-section-alt px-6 py-24">
      <div className="container-main mx-auto">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <h2 className="text-section-title mb-4">New Arrivals</h2>
            <p className="text-section-sub">Fresh drops just added to the collection.</p>
          </div>
          <a href="/shop" data-cursor="link" className="hidden text-sm font-semibold text-text-primary underline hover:text-blue-cta md:block">
            View All
          </a>
        </div>

        <div className="mb-5 flex items-center justify-end gap-2">
          <button
            onClick={() => slideCards(-1)}
            data-cursor="link"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border-default bg-white text-text-primary transition-colors hover:border-accent-primary"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => slideCards(1)}
            data-cursor="link"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border-default bg-white text-text-primary transition-colors hover:border-accent-primary"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        <div ref={carouselRef} className="flex snap-x gap-6 overflow-x-auto pb-3">
          {displayProducts.map((product, idx) => (
            <div 
              key={product.id} 
              className={`arrival-card min-w-[280px] snap-start sm:min-w-[320px] lg:min-w-[340px] ${idx === 0 ? 'lg:min-w-[420px]' : ''}`}
            >
              <ProductCard {...product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default NewArrivals
