/**
 * GSAP Configuration — Plugin Registration
 * All GSAP plugins registered once at app init.
 * ScrollSmoother/SplitText/Flip are club plugins — we use fallbacks.
 */
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register core plugins
gsap.registerPlugin(ScrollTrigger)

// Register optional club plugins without using top-level await.
async function registerOptionalPlugins() {
  try {
    const { ScrollSmoother } = await import('gsap/ScrollSmoother')
    gsap.registerPlugin(ScrollSmoother)
  } catch (e) {
    // ScrollSmoother not available — no smooth scroll wrapper
  }

  try {
    const { Flip } = await import('gsap/Flip')
    gsap.registerPlugin(Flip)
  } catch (e) {
    // Flip not available — use CSS transitions for layout changes
  }

  try {
    const { SplitText } = await import('gsap/SplitText')
    gsap.registerPlugin(SplitText)
  } catch (e) {
    // SplitText not available — use manual text splitting
  }
}

registerOptionalPlugins()

// Global GSAP defaults
gsap.defaults({
  ease: 'power2.out',
  duration: 0.6,
})

// Refresh ScrollTrigger on resize
window.addEventListener('resize', () => ScrollTrigger.refresh())

export { gsap, ScrollTrigger }
export default gsap
