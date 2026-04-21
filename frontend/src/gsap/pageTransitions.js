/**
 * Page Transitions — GSAP-powered route change animations
 */
import gsap from 'gsap'

/**
 * Standard page enter — fade up
 */
export function pageEnter(element) {
  if (!element) return
  gsap.from(element, {
    opacity: 0,
    y: 24,
    duration: 0.5,
    ease: 'power2.out',
    clearProps: 'all'
  })
}

/**
 * Standard page leave — fade out up
 */
export function pageLeave(element) {
  return new Promise((resolve) => {
    if (!element) { resolve(); return }
    gsap.to(element, {
      opacity: 0,
      y: -16,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: resolve
    })
  })
}

/**
 * Curtain wipe transition for major page changes (Landing → Auth)
 */
export function curtainTransition(navigate, to) {
  const curtain = document.querySelector('.page-curtain')
  if (!curtain) {
    navigate(to)
    return
  }

  const tl = gsap.timeline()
  tl.set(curtain, { display: 'block' })
    .fromTo(curtain,
      { scaleY: 0, transformOrigin: 'bottom' },
      { scaleY: 1, duration: 0.4, ease: 'power3.in' }
    )
    .call(() => navigate(to))
    .fromTo(curtain,
      { transformOrigin: 'top', scaleY: 1 },
      { scaleY: 0, duration: 0.4, ease: 'power3.out' }
    )
    .set(curtain, { display: 'none' })
}
