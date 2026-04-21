import React, { useRef, useState } from 'react'
import { useGSAP } from '../../hooks/useGSAP'
import gsap from 'gsap'
import confetti from 'canvas-confetti'

export function Newsletter() {
  const containerRef = useRef(null)
  const formRef = useRef(null)
  const successRef = useRef(null)
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  useGSAP(() => {
    gsap.from('.newsletter-card', {
      opacity: 0,
      y: 60,
      scale: 0.96,
      duration: 0.7,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 82%',
        once: true
      }
    })
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email) return

    setSubmitted(true)
    
    // Animate transition
    gsap.to(formRef.current, {
      opacity: 0,
      y: -20,
      duration: 0.4,
      ease: 'power2.in',
      onComplete: () => {
        gsap.fromTo(successRef.current,
          { opacity: 0, y: 20, display: 'none' },
          { opacity: 1, y: 0, display: 'block', duration: 0.5, ease: 'back.out(1.5)' }
        )
      }
    })

    // Confetti burst
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#1A1A1A', '#0066FF', '#16A34A']
    })
  }

  return (
    <section ref={containerRef} className="newsletter bg-section-alt px-6 py-24">
      <div className="newsletter-card mx-auto max-w-[600px] rounded-[16px] border border-border-default bg-white p-12 text-center shadow-card">
        <h2 className="mb-4 text-3xl font-bold text-text-primary">Join the Vision Club</h2>
        <p className="mb-8 text-text-secondary">
          Subscribe to our newsletter to receive early access to new collections, exclusive drops, and 10% off your first order.
        </p>

        <div className="relative min-h-[56px]">
          <form 
            ref={formRef}
            onSubmit={handleSubmit}
            className={`absolute inset-0 flex gap-2 ${submitted ? 'pointer-events-none' : ''}`}
          >
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="flex-1 rounded-lg border border-border-default bg-input-bg px-4 outline-none transition-colors focus:border-accent-primary focus:bg-white focus:ring-1 focus:ring-accent-primary"
              data-cursor="text"
            />
            <button
              type="submit"
              data-cursor="link"
              className="rounded-lg bg-accent-primary px-6 py-3 text-btn text-white transition-colors hover:bg-accent-hover font-semibold"
            >
              Subscribe
            </button>
          </form>

          <div 
            ref={successRef} 
            className="absolute inset-0 hidden rounded-lg border border-success bg-green-50 px-6 py-4"
          >
            <p className="font-semibold text-success flex items-center justify-center gap-2">
              <span className="text-xl">✓</span> Welcome to the club!
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Newsletter
