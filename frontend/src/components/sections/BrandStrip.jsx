import React, { useRef } from 'react'
import { useGSAP } from '../../hooks/useGSAP'
import gsap from 'gsap'

export function BrandStrip() {
  const containerRef = useRef(null)

  useGSAP(() => {
    // Row 1 scrolls left
    gsap.to('.brand-row-1', { xPercent: -50, duration: 20, ease: 'none', repeat: -1 })
    // Row 2 scrolls right
    gsap.to('.brand-row-2', { xPercent: 50, duration: 25, ease: 'none', repeat: -1 })
  }, [])

  const brands = [
    'Ray-Ban', 'Oakley', 'Gucci', 'Prada', 'Tom Ford', 'Persol', 'Oliver Peoples', 'Carrera'
  ]
  
  // Double for seamless loop
  const seamlessBrands1 = [...brands, ...brands]
  const seamlessBrands2 = [...brands.reverse(), ...brands]

  return (
    <section ref={containerRef} className="overflow-hidden bg-white py-20 border-y border-border-default">
      <div className="container-main mx-auto mb-10 text-center">
        <span className="text-sm font-semibold uppercase tracking-widest text-text-muted">
          Official Retailer For
        </span>
      </div>

      <div className="relative flex flex-col gap-8">
        {/* Row 1 */}
        <div className="flex w-[200%] whitespace-nowrap">
          <div className="brand-row-1 flex w-full items-center justify-around">
            {seamlessBrands1.map((brand, i) => (
              <div 
                key={i} 
                className="group px-8 transition-transform duration-300 hover:scale-110"
              >
                <div className="flex h-16 w-48 items-center justify-center rounded-xl border border-border-default bg-card-surface transition-all duration-300 group-hover:border-accent-primary group-hover:bg-white group-hover:shadow-card">
                   <span className="text-2xl font-bold font-serif text-text-muted transition-colors duration-300 group-hover:text-text-primary grayscale filter transition-[filter] group-hover:filter-none">
                     {brand.toUpperCase()}
                   </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Row 2 */}
        <div className="flex w-[200%] whitespace-nowrap justify-end ml-[-100%]">
          <div className="brand-row-2 flex w-full items-center justify-around">
            {seamlessBrands2.map((brand, i) => (
              <div 
                key={i} 
                className="group px-8 transition-transform duration-300 hover:scale-110"
              >
                <div className="flex h-16 w-48 items-center justify-center rounded-xl border border-border-default bg-card-surface transition-all duration-300 group-hover:border-accent-primary group-hover:bg-white group-hover:shadow-card">
                   <span className="text-2xl font-bold font-serif text-text-muted transition-colors duration-300 group-hover:text-text-primary grayscale filter transition-[filter] group-hover:filter-none">
                     {brand.toUpperCase()}
                   </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default BrandStrip
