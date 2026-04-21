import React, { useEffect, useState } from 'react'
import { manualSplitText } from '../../gsap/animations'
import gsap from 'gsap'

export function Loader() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Split the brand text
    const brandText = document.getElementById('loader-brand')
    const split = manualSplitText(brandText, 'chars')

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to('#loader-container', {
          opacity: 0,
          duration: 0.5,
          onComplete: () => {
            setLoading(false)
            split.revert()
          }
        })
      }
    })

    tl.from(split.chars, {
      opacity: 0,
      y: 20,
      stagger: 0.05,
      duration: 0.4,
      ease: 'power2.out'
    })
      .to('#loader-bar', {
        scaleX: 1,
        duration: 1.2,
        ease: 'power1.inOut',
        transformOrigin: 'left'
      }, '-=0.2')
      .from('#loader-tag', {
        opacity: 0,
        duration: 0.4
      }, '-=0.3')

    return () => tl.kill()
  }, [])

  if (!loading) return null

  return (
    <div
      id="loader-container"
      className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-white"
    >
      <div className="flex flex-col items-center gap-6">
        {/* Brand Text */}
        <h1
          id="loader-brand"
          className="text-section-title tracking-tight"
        >
          VISION
        </h1>

        {/* Loading Bar Container */}
        <div className="h-[1px] w-48 overflow-hidden bg-border-default">
          <div
            id="loader-bar"
            className="h-full w-full origin-left scale-x-0 bg-accent-primary"
          />
        </div>

        {/* Tagline */}
        <p
          id="loader-tag"
          className="text-caption uppercase tracking-[0.2em] text-text-muted"
        >
          Crafting clarity
        </p>
      </div>
    </div>
  )
}

export default Loader
