/**
 * Reusable GSAP Animation Library
 * All core animation patterns from project.md
 */
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * SplitText fallback — manually split text into spans
 */
export function manualSplitText(element, type = 'words') {
  if (!element) return { chars: [], words: [], revert: () => {} }

  const originalHTML = element.innerHTML
  const text = element.textContent

  if (type === 'chars' || type === 'words,chars') {
    const chars = text.split('').map((char) => {
      const span = document.createElement('span')
      span.style.display = 'inline-block'
      span.textContent = char === ' ' ? '\u00A0' : char
      return span
    })
    element.innerHTML = ''
    chars.forEach((s) => element.appendChild(s))
    return {
      chars,
      words: [],
      revert: () => { element.innerHTML = originalHTML }
    }
  }

  // words
  const words = text.split(/\s+/).map((word) => {
    const span = document.createElement('span')
    span.style.display = 'inline-block'
    span.style.marginRight = '0.25em'
    span.textContent = word
    return span
  })
  element.innerHTML = ''
  words.forEach((s) => element.appendChild(s))
  return {
    chars: [],
    words,
    revert: () => { element.innerHTML = originalHTML }
  }
}

/**
 * 1. Fade Up on Scroll
 */
export function fadeUp(element, options = {}) {
  return gsap.from(element, {
    opacity: 0,
    y: options.y || 48,
    duration: options.duration || 0.8,
    ease: options.ease || 'power2.out',
    delay: options.delay || 0,
    scrollTrigger: options.scrollTrigger !== false ? {
      trigger: options.trigger || element,
      start: options.start || 'top 88%',
      once: true,
      ...options.scrollTrigger
    } : undefined
  })
}

/**
 * 2. Stagger Grid Cards
 */
export function staggerGrid(selector, options = {}) {
  return gsap.from(selector, {
    opacity: 0,
    y: options.y || 60,
    duration: options.duration || 0.7,
    ease: 'power3.out',
    stagger: { amount: options.staggerAmount || 0.5, from: 'start' },
    scrollTrigger: {
      trigger: options.trigger || selector,
      start: options.start || 'top 85%',
      once: true,
    }
  })
}

/**
 * 3. Split Headline Animation
 */
export function splitHeadline(element, options = {}) {
  const split = manualSplitText(element, options.type || 'words')
  const targets = options.type === 'chars' ? split.chars : split.words

  gsap.from(targets, {
    opacity: 0,
    y: options.y || 80,
    rotationX: options.rotationX || 0,
    duration: options.duration || 0.6,
    ease: options.ease || 'back.out(1.7)',
    stagger: options.stagger || 0.025,
    delay: options.delay || 0,
    scrollTrigger: options.scrollTrigger ? {
      trigger: options.trigger || element,
      start: 'top 82%',
      once: true,
      ...options.scrollTrigger
    } : undefined
  })

  return split
}

/**
 * 9. Counter Animation
 */
export function counterAnimate(element, endValue, options = {}) {
  const obj = { val: 0 }
  return gsap.to(obj, {
    val: endValue,
    duration: options.duration || 2,
    ease: options.ease || 'power1.out',
    scrollTrigger: {
      trigger: options.trigger || element,
      start: options.start || 'top 80%',
      once: true,
    },
    onUpdate() {
      if (element) {
        element.textContent = Math.round(obj.val).toLocaleString('en-IN') + (options.suffix || '+')
      }
    }
  })
}

/**
 * 10. Number Flip animation
 */
export function flipNumber(element, newVal) {
  gsap.to(element, {
    rotationX: -90,
    duration: 0.15,
    ease: 'power2.in',
    onComplete: () => {
      element.textContent = newVal
      gsap.fromTo(element,
        { rotationX: 90 },
        { rotationX: 0, duration: 0.2, ease: 'power2.out' }
      )
    }
  })
}

/**
 * Marquee infinite scroll
 */
export function marqueeScroll(track, options = {}) {
  return gsap.to(track, {
    xPercent: options.direction === 'right' ? 50 : -50,
    duration: options.duration || 25,
    ease: 'none',
    repeat: -1,
  })
}

/**
 * Toast slide-in
 */
export function toastEnter(element) {
  return gsap.fromTo(element,
    { x: 120, opacity: 0 },
    { x: 0, opacity: 1, duration: 0.4, ease: 'back.out(1.5)' }
  )
}

export function toastLeave(element, onComplete) {
  return gsap.to(element, {
    x: 120, opacity: 0, duration: 0.3, ease: 'power2.in',
    onComplete
  })
}

/**
 * Page enter/leave
 */
export function pageEnter(element) {
  return gsap.from(element, {
    opacity: 0, y: 24, duration: 0.5, ease: 'power2.out', clearProps: 'all'
  })
}

export function pageLeave(element) {
  return new Promise((resolve) => {
    gsap.to(element, {
      opacity: 0, y: -16, duration: 0.3, ease: 'power2.in',
      onComplete: resolve
    })
  })
}
