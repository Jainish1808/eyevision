import React, { useRef } from 'react'
import { useGSAP } from '../../hooks/useGSAP'
import ProductCard from '../products/ProductCard'
import gsap from 'gsap'

export function ProductGrid({ products = [] }) {
  const gridRef = useRef(null)

  // Dummy data if empty
  const displayProducts = products.length
    ? products.map((product) => ({
        id: product.id,
        name: product.name,
        brand: product.brand,
        price: Number(product.price || 0),
        originalPrice: product.original_price ? Number(product.original_price) : undefined,
        rating: Number(product.rating || 0),
        reviews: Number(product.review_count || 0),
        image: product.primary_image,
        badge: product.is_new_arrival ? 'New' : undefined
      }))
    : Array.from({ length: 12 }, (_, i) => ({
        id: `prod-${i}`,
        name: `Optical Frame ${i + 1}`,
        brand: ['Ray-Ban', 'Oakley', 'Gucci', 'Persol'][i % 4],
        price: 150 + (i * 10),
        rating: Number((4 + (i % 10) / 10).toFixed(1)),
        reviews: 45 + i * 12,
        image: i % 2 === 0 ? 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=500' : 'https://images.unsplash.com/photo-1577803645773-f96470509666?q=80&w=500'
      }))

  useGSAP(() => {
    // Initial page load stagger
    gsap.from('.plp-card', {
      opacity: 0,
      y: 50,
      duration: 0.6,
      ease: 'power3.out',
      stagger: { amount: 0.8, from: 'start' },
      scrollTrigger: {
        trigger: gridRef.current,
        start: 'top 85%',
        once: true
      }
    })
  }, [displayProducts.length])

  return (
    <div ref={gridRef} className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {displayProducts.map((product) => (
        <div key={product.id} className="plp-card h-[400px]">
          <ProductCard {...product} />
        </div>
      ))}
    </div>
  )
}

export default ProductGrid
