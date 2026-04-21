import React, { useRef } from 'react'
import { useGSAP } from '../../hooks/useGSAP'
import { counterAnimate } from '../../gsap/animations'

export function StatsCounter() {
  const containerRef = useRef(null)
  
  useGSAP(() => {
    // Reveal text elements
    gsap.from('.stat-item', {
      opacity: 0,
      y: 30,
      stagger: 0.1,
      duration: 0.6,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 80%',
        once: true
      }
    })

    // Animate numbers
    const counters = containerRef.current.querySelectorAll('.stat-number')
    counters.forEach(el => {
      const target = parseInt(el.dataset.target, 10)
      const suffix = el.dataset.suffix || ''
      counterAnimate(el, target, {
        trigger: containerRef.current,
        start: 'top 75%',
        suffix
      })
    })

  }, [])

  const stats = [
    { label: 'Happy Customers', value: 50000, suffix: '+' },
    { label: 'Premium Brands', value: 200, suffix: '+' },
    { label: 'Years Warranty', value: 1, suffix: ' Yr' },
    { label: 'Avg Rating', value: 4.8, suffix: ' ★' },
  ]

  return (
    <section ref={containerRef} className="stats-section bg-dark-section px-6 py-24 text-text-on-dark">
      <div className="container-main mx-auto grid grid-cols-2 gap-12 md:grid-cols-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="stat-item flex flex-col items-center text-center">
            <span 
              className="stat-number mb-2 text-5xl font-bold"
              data-target={stat.value}
              data-suffix={stat.suffix}
            >
              0
            </span>
            <span className="text-sm font-semibold uppercase tracking-wider text-text-on-dark-muted">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}

export default StatsCounter
