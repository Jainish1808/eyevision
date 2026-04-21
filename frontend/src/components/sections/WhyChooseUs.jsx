import React, { useRef } from 'react'
import { useGSAP } from '../../hooks/useGSAP'
import gsap from 'gsap'
import { Shield, Eye, Truck, RefreshCcw } from 'lucide-react'

export function WhyChooseUs() {
  const containerRef = useRef(null)

  const features = [
    { icon: <Shield size={24} />, title: 'Premium Quality', desc: 'Handcrafted acetate & titanium frames built to last a lifetime.' },
    { icon: <Eye size={24} />, title: 'Precision Lenses', desc: 'Digital free-form lenses for uncompromising visual clarity.' },
    { icon: <Truck size={24} />, title: 'Fast Delivery', desc: 'Free express shipping on all orders over ₹999.' },
    { icon: <RefreshCcw size={24} />, title: 'Easy Returns', desc: '14-day no questions asked return policy for piece of mind.' },
  ]

  useGSAP(() => {
    gsap.from('.feature-card', {
      opacity: 0,
      y: 40,
      duration: 0.6,
      stagger: 0.12,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 82%',
        once: true
      }
    })
  }, [])

  const handleHover = (e, isEnter) => {
    const iconWrapper = e.currentTarget.querySelector('.feature-icon-wrapper')
    if (iconWrapper) {
      if (isEnter) {
        gsap.to(iconWrapper, { rotate: 360, duration: 0.6, ease: 'power2.inOut' })
      } else {
        gsap.to(iconWrapper, { rotate: 0, duration: 0.6, ease: 'power2.inOut' })
      }
    }
  }

  return (
    <section ref={containerRef} className="features bg-section-alt px-6 py-24">
      <div className="container-main mx-auto">
        <div className="mb-16 text-center">
          <h2 className="text-section-title mb-4">Why Choose Vision</h2>
          <p className="text-section-sub">We do things differently to bring you the best.</p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, idx) => (
            <div 
              key={idx} 
              className="feature-card flex flex-col items-center text-center rounded-2xl bg-white p-8 shadow-sm transition-shadow hover:shadow-card"
              onMouseEnter={(e) => handleHover(e, true)}
              onMouseLeave={(e) => handleHover(e, false)}
            >
              <div className="feature-icon-wrapper mb-6 flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-input-bg text-accent-primary">
                {feature.icon}
              </div>
              <h3 className="mb-3 text-lg font-bold text-text-primary">{feature.title}</h3>
              <p className="text-sm text-text-secondary">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default WhyChooseUs
