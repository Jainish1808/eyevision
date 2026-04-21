import React, { useRef, useEffect, useState } from 'react'
import { useGSAP } from '../../hooks/useGSAP'
import { flipNumber } from '../../gsap/animations'
import gsap from 'gsap'
import { ArrowRight } from 'lucide-react'

export function OfferBanner() {
  const containerRef = useRef(null)
  
  const [timeLeft, setTimeLeft] = useState({ days: 2, hours: 14, mins: 45, secs: 0 })

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 80%',
        once: true
      }
    })

    tl.from('.offer-text > *', {
      x: -40,
      opacity: 0,
      stagger: 0.1,
      duration: 0.7,
      ease: 'power3.out'
    }).from('.offer-image', {
      x: 40,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    }, '<')
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hours, mins, secs } = prev
        if (secs > 0) secs--
        else {
          secs = 59
          if (mins > 0) mins--
          else {
            mins = 59
            if (hours > 0) hours--
            else {
              hours = 23
              if (days > 0) days--
            }
          }
        }
        return { days, hours, mins, secs }
      })
    }, 1000)
    
    return () => clearInterval(timer)
  }, [])

  // In a real app we'd use useGSAP hook and flipNumber to animate the numbers on change.
  // For simplicity, we just render the raw numbers here.

  return (
    <section className="bg-section-alt px-6 py-24">
      <div ref={containerRef} className="offer-banner container-main mx-auto max-w-[1200px] overflow-hidden rounded-[16px] border border-border-default bg-white shadow-sm">
        <div className="grid lg:grid-cols-2">
          {/* Left Text */}
          <div className="offer-text flex flex-col justify-center p-12 lg:p-16">
            <span className="mb-4 inline-block rounded-md bg-accent-primary px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white w-max">
              Limited Time Offer
            </span>
            <h2 className="mb-4 text-4xl font-bold text-text-primary md:text-5xl">
              Save 25% on Titanium Frames
            </h2>
            <p className="mb-8 text-lg text-text-secondary">
              Upgrade your look with our ultra-lightweight, durable titanium collection. 
              Offer ends soon.
            </p>

            <div className="mb-8 flex gap-4">
              {[
                { label: 'Days', val: timeLeft.days },
                { label: 'Hours', val: timeLeft.hours },
                { label: 'Mins', val: timeLeft.mins },
                { label: 'Secs', val: timeLeft.secs },
              ].map((t, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-input-bg text-2xl font-bold text-text-primary">
                    {t.val.toString().padStart(2, '0')}
                  </div>
                  <span className="mt-2 text-xs font-semibold uppercase text-text-muted">{t.label}</span>
                </div>
              ))}
            </div>

            <button
              data-cursor="link"
              className="flex w-max items-center gap-2 rounded-lg bg-blue-cta px-8 py-4 text-btn text-white transition-transform hover:bg-blue-hover hover:scale-[1.02]"
            >
              Shop Offer Now <ArrowRight size={18} />
            </button>
          </div>

          {/* Right Image */}
          <div className="offer-image aspect-square bg-section-alt lg:aspect-auto">
             <img
                src="https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=1000&auto=format&fit=crop"
                alt="Titanium Frames"
                className="h-full w-full object-cover"
             />
          </div>
        </div>
      </div>
    </section>
  )
}

export default OfferBanner
