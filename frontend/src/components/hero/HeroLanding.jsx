import React, { useEffect, useRef, useState } from 'react'
import { ArrowRight, ShieldCheck, Sparkles, Star, Truck } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useGSAP } from '../../hooks/useGSAP'
import { manualSplitText } from '../../gsap/animations'
import { curtainTransition } from '../../gsap/pageTransitions'
import gsap from 'gsap'

export function HeroLanding() {
  const containerRef = useRef(null)
  const titleRef = useRef(null)
  const visualRef = useRef(null)
  const primaryCardRef = useRef(null)
  const secondaryCardRef = useRef(null)
  const scrollIndRef = useRef(null)
  const canvasRef = useRef(null)
  const navigate = useNavigate()
  const words = ['Sunglasses', 'Prescription', 'Lenses', 'Premium Cases']
  const [wordIndex, setWordIndex] = useState(0)
  const [typedWord, setTypedWord] = useState('')

  useEffect(() => {
    let charIndex = 0
    const fullWord = words[wordIndex]
    setTypedWord('')

    const typeTimer = window.setInterval(() => {
      charIndex += 1
      setTypedWord(fullWord.slice(0, charIndex))

      if (charIndex >= fullWord.length) {
        window.clearInterval(typeTimer)
        window.setTimeout(() => {
          setWordIndex((prev) => (prev + 1) % words.length)
        }, 1000)
      }
    }, 80)

    return () => window.clearInterval(typeTimer)
  }, [wordIndex])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined

    const ctx = canvas.getContext('2d')
    if (!ctx) return undefined

    const particles = []
    const particleCount = 44
    let raf = 0

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }

    const createParticles = () => {
      particles.length = 0
      for (let i = 0; i < particleCount; i += 1) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2.8 + 1,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          alpha: Math.random() * 0.45 + 0.15
        })
      }
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1

        ctx.beginPath()
        ctx.fillStyle = `rgba(20, 20, 20, ${p.alpha})`
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
      }
      raf = window.requestAnimationFrame(draw)
    }

    resize()
    createParticles()
    draw()
    window.addEventListener('resize', resize)

    return () => {
      window.removeEventListener('resize', resize)
      window.cancelAnimationFrame(raf)
    }
  }, [])

  useGSAP(() => {
    const split = manualSplitText(titleRef.current, 'words')
    const tl = gsap.timeline({ delay: 0.2 })

    tl.from('.navbar', { y: -70, opacity: 0, duration: 0.7, ease: 'power3.out' })
      .from('.hero-badge', { y: 24, opacity: 0, duration: 0.5, ease: 'power2.out' }, '-=0.3')
      .from(split.words, {
        y: 80,
        opacity: 0,
        rotationX: -40,
        duration: 0.82,
        stagger: 0.1,
        ease: 'power4.out',
        transformOrigin: '50% 50% -30px'
      }, '-=0.2')
      .from('.hero-subtitle', { y: 24, opacity: 0, duration: 0.6, ease: 'power2.out' }, '-=0.4')
      .from('.hero-typewriter', { y: 24, opacity: 0, duration: 0.45, ease: 'power2.out' }, '-=0.35')
      .from('.hero-cta > *', { y: 20, opacity: 0, duration: 0.5, stagger: 0.12 }, '-=0.35')
      .from('.hero-trust > *', { opacity: 0, duration: 0.4, stagger: 0.08, ease: 'back.out(1.5)' }, '-=0.2')
      .from(visualRef.current, { x: 80, opacity: 0, duration: 1.0, ease: 'power3.out' }, 0.6)
      .from(primaryCardRef.current, { scale: 0.84, opacity: 0, duration: 0.55, ease: 'back.out(1.7)' }, '-=0.3')
      .from(secondaryCardRef.current, { scale: 0.9, opacity: 0, duration: 0.5, ease: 'power2.out' }, '-=0.35')

    gsap.to(primaryCardRef.current, {
      y: -12,
      duration: 2.5,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1
    })

    gsap.to(secondaryCardRef.current, {
      y: 8,
      duration: 2.2,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1
    })

    gsap.to(scrollIndRef.current, {
      y: 8, duration: 0.8, ease: 'power1.inOut', yoyo: true, repeat: -1
    })

    const handleMouseMove = (e) => {
      if (window.innerWidth < 1024) return
      const xR = e.clientX / window.innerWidth - 0.5
      const yR = e.clientY / window.innerHeight - 0.5
      gsap.to(visualRef.current, {
        x: xR * 24,
        y: yR * 12,
        duration: 1.35,
        ease: 'power1.out'
      })
    }

    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      split.revert()
    }
  }, { scope: containerRef })

  const handleShopClick = (e) => {
    e.preventDefault()
    curtainTransition(navigate, '/auth')
  }

  return (
    <section ref={containerRef} className="relative flex min-h-[100dvh] items-center overflow-hidden bg-page-bg pt-16">
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 z-[1] opacity-70" />
      <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(circle_at_18%_20%,rgba(182,215,255,0.38),transparent_45%),radial-gradient(circle_at_82%_72%,rgba(255,215,153,0.3),transparent_42%)]" />

      <div className="container-main hero-grid relative z-10 mx-auto grid items-center gap-12 lg:grid-cols-2">
        <div className="flex max-w-xl flex-col items-start pt-10 lg:pt-0">
          <div className="hero-badge mb-6 inline-flex items-center gap-2 rounded-full border border-border-strong bg-white/70 px-4 py-1.5 text-badge text-text-primary backdrop-blur-md">
            <Sparkles size={14} />
            New Collection 2026
          </div>

          <h1 ref={titleRef} className="text-display mb-6">
            See Better.
            <br />
            Wear Better.
          </h1>

          <p className="hero-subtitle text-hero-sub mb-10 text-text-secondary">
            Discover premium eyewear inspired by editorial design and crafted for every vision journey.
          </p>

          <p className="hero-typewriter mb-8 text-sm font-semibold uppercase tracking-[0.2em] text-text-primary">
            Explore: {typedWord}
            <span className="ml-1 inline-block h-4 w-[2px] animate-pulse bg-text-primary align-middle" />
          </p>

          <div className="hero-cta flex flex-wrap items-center gap-4">
            <a
              href="/auth"
              onClick={handleShopClick}
              data-cursor="link"
              className="flex items-center gap-2 rounded-lg bg-accent-primary px-8 py-4 text-btn text-white transition-all hover:bg-accent-hover hover:scale-[1.02] active:scale-[0.97]"
            >
              Start Shopping <ArrowRight size={18} />
            </a>
            <Link
              to="/shop"
              data-cursor="link"
              className="rounded-lg border-2 border-accent-primary bg-transparent px-8 py-4 text-btn text-text-primary transition-colors hover:bg-accent-primary hover:text-white"
            >
              Browse Collection
            </Link>
          </div>

          <div className="hero-trust mt-12 flex items-center gap-8 border-t border-border-default pt-8">
            <div className="flex items-center gap-2">
              <Star className="text-yellow-400" fill="currentColor" size={20} />
              <span className="font-medium text-text-primary">4.9/5 <span className="font-normal text-text-muted">(10k+ Reviews)</span></span>
            </div>
            <div className="hidden items-center gap-2 sm:flex">
              <ShieldCheck className="text-success" size={20} />
              <span className="font-medium text-text-primary">1 Year Warranty</span>
            </div>
            <div className="hidden items-center gap-2 lg:flex">
              <Truck className="text-blue-cta" size={20} />
              <span className="font-medium text-text-primary">Free Delivery Over INR 999</span>
            </div>
          </div>
        </div>

        <div className="relative hidden aspect-square h-[600px] items-center justify-center lg:flex">
          <div ref={visualRef} className="relative z-0 h-full w-full rounded-2xl border border-white/70 bg-section-alt">
            <div className="absolute inset-0 rounded-2xl bg-[linear-gradient(140deg,rgba(255,255,255,0.72),rgba(247,247,245,0.35))]" />
            <div className="absolute inset-0 flex items-center justify-center p-12">
              <img
                src="https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=2000&auto=format&fit=crop"
                alt="Premium Eyewear"
                className="h-full w-full object-cover rounded-2xl"
                data-cursor="image"
              />
            </div>

            <div className="absolute left-8 top-8 rounded-xl border border-white/80 bg-white/65 px-4 py-3 backdrop-blur-lg">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-text-muted">Vision Lab</p>
              <p className="text-lg font-semibold text-text-primary">Curated by Optics Experts</p>
            </div>
          </div>

          <div
            ref={primaryCardRef}
            className="absolute -left-12 bottom-20 z-20 flex items-center gap-4 rounded-xl border border-border-default bg-white/85 p-4 shadow-glass backdrop-blur-[20px]"
          >
            <div className="h-16 w-20 rounded-md bg-section-alt bg-[url('https://images.unsplash.com/photo-1577803645773-f96470509666?q=80&w=400&auto=format&fit=crop')] bg-cover bg-center" />
            <div>
              <p className="text-[13px] font-medium text-text-muted">Aero Titanium</p>
              <p className="text-[16px] font-bold text-text-primary">INR 2,499</p>
            </div>
          </div>

          <div
            ref={secondaryCardRef}
            className="absolute right-8 top-14 z-20 rounded-xl border border-white/85 bg-white/80 px-5 py-4 shadow-glass backdrop-blur-[18px]"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-text-muted">Limited Drop</p>
            <p className="mt-1 text-base font-semibold text-text-primary">Lens + Frame Combos</p>
            <p className="mt-1 text-sm text-text-secondary">Save up to 28% with curated kits</p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-text-muted">Scroll</span>
        <div className="h-12 w-[1px] bg-border-strong overflow-hidden relative">
            <div ref={scrollIndRef} className="absolute inset-0 h-1/2 w-full bg-text-primary" />
        </div>
      </div>
    </section>
  )
}

export default HeroLanding
