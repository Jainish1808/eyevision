import React, { useState, useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useGSAP } from '../../hooks/useGSAP'
import ProductCard from '../products/ProductCard'
import gsap from 'gsap'

export function TrendingProducts({ products = [] }) {
  const [activeTab, setActiveTab] = useState('all')
  const tabsRef = useRef(null)
  const containerRef = useRef(null)
  const carouselRef = useRef(null)

  const fallbackProducts = [
    { id: '1', name: 'Wayfarer Classic', brand: 'Ray-Ban', price: 150, rating: 4.8, reviews: 120, category: 'sunglasses', image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=500' },
    { id: '2', name: 'Blue Block Pro', brand: 'Vision', price: 90, originalPrice: 120, rating: 4.9, reviews: 340, badge: '-25%', category: 'computer', image: 'https://images.unsplash.com/photo-1577803645773-f96470509666?q=80&w=500' },
    { id: '3', name: 'Titanium Aviator', brand: 'Tom Ford', price: 320, rating: 4.7, reviews: 85, category: 'sunglasses', image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=500' },
    { id: '4', name: 'Clear Reading', brand: 'Ottica', price: 45, rating: 4.5, reviews: 210, category: 'reading', image: 'https://images.unsplash.com/photo-1577803645773-f96470509666?q=80&w=500' },
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
        category: p.tags?.[0] || 'all',
        badge: p.is_new_arrival ? 'New' : p.original_price ? 'Offer' : undefined
      }))
    : fallbackProducts

  useGSAP(() => {
    // Initial entry
    gsap.from('.trending-card', {
      opacity: 0,
      y: 60,
      duration: 0.7,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 80%',
        once: true
      }
    })
  }, [])

  const handleTabClick = (tab, index) => {
    setActiveTab(tab)
    if (!tabsRef.current) return
    const tabEl = tabsRef.current.children[index]
    
    gsap.to('.trending-indicator', {
      x: tabEl.offsetLeft,
      width: tabEl.offsetWidth,
      duration: 0.35,
      ease: 'power2.inOut'
    })

    gsap.fromTo('.trending-card', 
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.4, stagger: 0.05, ease: 'power2.out' }
    )
  }

  const slideCards = (direction) => {
    if (!carouselRef.current) return
    const card = carouselRef.current.querySelector('.trending-card')
    const cardWidth = card ? card.getBoundingClientRect().width + 24 : 320
    carouselRef.current.scrollBy({ left: direction * cardWidth, behavior: 'smooth' })
  }

  const tabs = [
    { id: 'all', label: 'All Products' },
    { id: 'sunglasses', label: 'Sunglasses' },
    { id: 'computer', label: 'Computer Glasses' },
  ]

  const filtered = activeTab === 'all' 
    ? displayProducts 
    : displayProducts.filter(p => p.category === activeTab)

  return (
    <section ref={containerRef} className="trending-section bg-section-alt px-6 py-24">
      <div className="container-main mx-auto">
        <div className="mb-12 flex flex-col items-center justify-between gap-8 md:flex-row md:items-end">
          <div>
            <h2 className="text-section-title mb-4">Trending Now</h2>
            <p className="text-section-sub">Discover our most loved eyewear this season.</p>
          </div>

          <div className="relative flex rounded-full border border-border-default bg-white p-1">
            <div ref={tabsRef} className="relative z-10 flex">
              {tabs.map((tab, idx) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id, idx)}
                  className={`px-6 py-2.5 text-sm font-semibold transition-colors ${activeTab === tab.id ? 'text-white' : 'text-text-secondary hover:text-text-primary'}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            {/* Initial indicator position handled by CSS, then GSAP takes over */}
            <div className="trending-indicator absolute left-1 top-1 h-[calc(100%-8px)] w-[120px] rounded-full bg-accent-primary transition-none" />
          </div>
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
          {filtered.map((product) => (
            <div key={product.id} className="trending-card h-[400px] min-w-[280px] snap-start sm:min-w-[320px] lg:min-w-[340px]">
              <ProductCard {...product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TrendingProducts
