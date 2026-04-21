import React, { useRef } from 'react'
import { useGSAP } from '../../hooks/useGSAP'
import { manualSplitText } from '../../gsap/animations'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function HomeBanner({ userName = 'Guest' }) {
  const containerRef = useRef(null)
  const headingRef = useRef(null)
  const pillsRef = useRef(null)

  useGSAP(() => {
    const split = manualSplitText(headingRef.current, 'words')

    gsap.from(split.words, {
      y: 40,
      opacity: 0,
      stagger: 0.08,
      duration: 0.7,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 80%',
        once: true
      }
    })

    if (pillsRef.current) {
        gsap.from(pillsRef.current.children, {
          scale: 0.85,
          opacity: 0,
          stagger: 0.06,
          duration: 0.4,
          ease: 'back.out(1.5)',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
            once: true,
          },
          delay: 0.3
        })
    }

    return () => split.revert()
  }, [])

  const categories = [
    { name: 'Normal Specs', icon: '👓' },
    { name: 'Sunglasses', icon: '🕶️' },
    { name: 'Prescription', icon: '🔬' },
    { name: 'Computer Glasses', icon: '💻' },
    { name: 'Kids Eyewear', icon: '👶' },
    { name: 'Sports Glasses', icon: '🏃' },
  ]

  return (
    <section ref={containerRef} className="home-banner flex min-h-[60vh] flex-col items-center justify-center bg-page-bg py-20 px-6 mt-16 text-center">
      <h2 ref={headingRef} className="text-display mb-12">
        Good to see you, {userName}.
      </h2>
      
      <p className="mb-6 text-sm font-medium uppercase tracking-wider text-text-muted">
        What are you looking for today?
      </p>

      <div ref={pillsRef} className="category-pills flex max-w-3xl flex-wrap justify-center gap-4">
        {categories.map((cat, idx) => (
          <a
            key={idx}
            href={`/shop?category=${cat.name}`}
            data-cursor="link"
            className="flex items-center gap-2 rounded-full border border-border-strong bg-white px-6 py-3 shadow-sm transition-all hover:-translate-y-1 hover:border-accent-primary hover:bg-section-alt hover:shadow-md"
          >
            <span className="text-lg">{cat.icon}</span>
            <span className="text-[14px] font-medium text-text-primary">{cat.name}</span>
          </a>
        ))}
      </div>
    </section>
  )
}

export default HomeBanner
