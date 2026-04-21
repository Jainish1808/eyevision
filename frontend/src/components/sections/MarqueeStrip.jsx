import React, { useRef } from 'react'
import { useGSAP } from '../../hooks/useGSAP'
import { marqueeScroll } from '../../gsap/animations'
import gsap from 'gsap'

export function MarqueeStrip() {
  const containerRef = useRef(null)
  const trackRef = useRef(null)

  useGSAP(() => {
    const animation = marqueeScroll(trackRef.current, { duration: 25 })
    
    const container = containerRef.current
    if (container) {
      container.addEventListener('mouseenter', () => animation.timeScale(0))
      container.addEventListener('mouseleave', () => animation.timeScale(1))
    }

    return () => {
      animation.kill()
    }
  }, [])

  const items = [
    'FREE DELIVERY ABOVE ₹999',
    'NEW ARRIVALS WEEKLY',
    '1 YEAR WARRANTY',
    'CODE FRAME10',
    'FREE DELIVERY ABOVE ₹999',
    'NEW ARRIVALS WEEKLY',
    '1 YEAR WARRANTY',
    'CODE FRAME10',
    'FREE DELIVERY ABOVE ₹999',
    'NEW ARRIVALS WEEKLY',
    '1 YEAR WARRANTY',
    'CODE FRAME10',
  ]

  return (
    <div
      ref={containerRef}
      className="flex h-11 w-full items-center overflow-hidden bg-accent-primary"
    >
      <div ref={trackRef} className="flex whitespace-nowrap">
        {items.map((text, i) => (
          <div key={i} className="flex items-center">
            <span className="text-[12px] font-semibold tracking-[0.1em] text-white">
              {text}
            </span>
            <span className="mx-6 text-white/50">·</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MarqueeStrip
