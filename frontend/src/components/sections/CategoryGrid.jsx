import React, { useRef } from 'react'
import { Link } from 'react-router-dom'
import { useGSAP } from '../../hooks/useGSAP'
import gsap from 'gsap'

export function CategoryGrid({ categories = [] }) {
  const containerRef = useRef(null)

  const fallbackCategories = [
    { name: 'Men', image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=500', colSpan: 'col-span-1', rowSpan: 'row-span-2' },
    { name: 'Women', image: 'https://images.unsplash.com/photo-1577803645773-f96470509666?q=80&w=500', colSpan: 'col-span-1', rowSpan: 'row-span-1' },
    { name: 'Kids', image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=500', colSpan: 'col-span-1', rowSpan: 'row-span-1' },
    { name: 'Computer Glasses', image: 'https://images.unsplash.com/photo-1577803645773-f96470509666?q=80&w=500', colSpan: 'col-span-2', rowSpan: 'row-span-1' },
  ]

  const displayCategories = categories.length
    ? categories.map((category, idx) => ({
        name: category.name,
        slug: category.slug,
        image: idx % 2
          ? 'https://images.unsplash.com/photo-1577803645773-f96470509666?q=80&w=500'
          : 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=500',
        colSpan: idx === 0 ? 'col-span-1' : idx === 3 ? 'col-span-2' : 'col-span-1',
        rowSpan: idx === 0 ? 'row-span-2' : 'row-span-1'
      }))
    : fallbackCategories

  useGSAP(() => {
    gsap.from('.category-card', {
      opacity: 0,
      y: 48,
      duration: 0.65,
      ease: 'power3.out',
      stagger: { amount: 0.6, from: 'start' },
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 82%',
        once: true
      }
    })
  }, [])

  const handleCardHover = (e, isEnter) => {
    const icon = e.currentTarget.querySelector('.cat-icon')
    if (isEnter) {
      gsap.to(e.currentTarget, { y: -6, boxShadow: '0 12px 40px rgba(0,0,0,0.10)', duration: 0.3 })
      if (icon) gsap.to(icon, { scale: 1.15, rotate: 5, duration: 0.3, ease: 'back.out(1.5)' })
    } else {
      gsap.to(e.currentTarget, { y: 0, boxShadow: 'none', duration: 0.3 })
      if (icon) gsap.to(icon, { scale: 1, rotate: 0, duration: 0.3 })
    }
  }

  return (
    <section ref={containerRef} className="category-grid bg-white px-6 py-24">
      <div className="container-main mx-auto">
        <div className="mb-16 text-center">
          <h2 className="text-section-title mb-4">Shop by Category</h2>
          <p className="text-section-sub">Find exactly what you're looking for.</p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 auto-rows-[240px]">
          {displayCategories.map((cat, idx) => (
            <Link
              key={idx}
              to={`/shop?category=${cat.slug || cat.name.toLowerCase()}`}
              className={`category-card group relative block overflow-hidden rounded-2xl bg-section-alt ${cat.colSpan} ${cat.rowSpan}`}
              onMouseEnter={(e) => handleCardHover(e, true)}
              onMouseLeave={(e) => handleCardHover(e, false)}
              data-cursor="link"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="absolute inset-0 h-full w-full object-cover opacity-80 mix-blend-multiply transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              
              <div className="absolute bottom-6 left-6 flex items-center gap-3">
                <span className="cat-icon flex h-10 w-10 items-center justify-center rounded-full bg-white text-lg shadow-sm">
                  👓
                </span>
                <span className="text-xl font-bold text-white">{cat.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CategoryGrid
