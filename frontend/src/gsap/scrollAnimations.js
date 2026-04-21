/**
 * Scroll Animations — ScrollTrigger configurations
 */
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Batch animation for large lists of cards
 */
export function batchCards(selector, options = {}) {
  ScrollTrigger.batch(selector, {
    onEnter: (els) => gsap.from(els, {
      opacity: 0,
      y: options.y || 50,
      stagger: options.stagger || 0.08,
      duration: options.duration || 0.6,
      ease: 'power3.out'
    }),
    start: options.start || 'top 88%',
    once: true,
  })
}

/**
 * Initialize navbar scroll behavior
 */
export function navbarScrollTrigger(navElement) {
  if (!navElement) return

  return ScrollTrigger.create({
    trigger: document.body,
    start: 'top top-=60',
    onEnter: () => {
      gsap.to(navElement, {
        background: 'rgba(255,255,255,0.88)',
        backdropFilter: 'blur(16px)',
        boxShadow: '0 1px 0 rgba(0,0,0,0.08)',
        duration: 0.35
      })
    },
    onLeaveBack: () => {
      gsap.to(navElement, {
        background: 'transparent',
        backdropFilter: 'none',
        boxShadow: 'none',
        duration: 0.35
      })
    }
  })
}

/**
 * Section reveal animation
 */
export function sectionReveal(element, options = {}) {
  return gsap.from(element, {
    opacity: 0,
    y: options.y || 60,
    duration: options.duration || 0.8,
    ease: options.ease || 'power3.out',
    scrollTrigger: {
      trigger: options.trigger || element,
      start: options.start || 'top 82%',
      once: true,
    }
  })
}

/**
 * Parallax effect (hero image, sections)
 */
export function parallax(element, options = {}) {
  return gsap.to(element, {
    y: options.y || '-20%',
    ease: 'none',
    scrollTrigger: {
      trigger: options.trigger || element,
      start: options.start || 'top top',
      end: options.end || 'bottom top',
      scrub: true,
    }
  })
}

/**
 * Responsive GSAP setup with matchMedia
 */
export function setupResponsive(desktopFn, mobileFn) {
  const mm = gsap.matchMedia()

  mm.add('(min-width: 1024px)', () => {
    if (desktopFn) desktopFn()
  })

  mm.add('(max-width: 1023px)', () => {
    if (mobileFn) mobileFn()
  })

  return mm
}
