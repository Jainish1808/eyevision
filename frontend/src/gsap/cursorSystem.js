/**
 * Custom Cursor System — 6 States, GSAP-powered
 * Uses quickSetter + ticker for 60fps movement.
 * Desktop only — disabled on touch devices.
 */
import gsap from 'gsap'

class CursorSystem {
  constructor() {
    this.dot = null
    this.ring = null
    this.crosshair = null
    this.label = null
    this.mouseX = 0
    this.mouseY = 0
    this.ringX = 0
    this.ringY = 0
    this.dotXSet = null
    this.dotYSet = null
    this.isTouch = false
    this.initialized = false
    this.observer = null
  }

  init() {
    // Check for touch device
    this.isTouch = window.matchMedia('(pointer: coarse)').matches
    if (this.isTouch) return

    this.dot = document.getElementById('cursor-dot')
    this.ring = document.getElementById('cursor-ring')
    this.crosshair = document.querySelector('.cursor-crosshair')
    this.label = document.querySelector('.cursor-label')

    if (!this.dot || !this.ring) return

    // quickSetter for instant dot position
    this.dotXSet = gsap.quickSetter(this.dot, 'x', 'px')
    this.dotYSet = gsap.quickSetter(this.dot, 'y', 'px')

    // Mouse movement
    window.addEventListener('mousemove', this.onMouseMove)

    // Ring follows with lerp via ticker
    gsap.ticker.add(this.onTick)

    // Click state
    document.addEventListener('mousedown', this.onMouseDown)
    document.addEventListener('mouseup', this.onMouseUp)

    // Bind cursor states to existing elements
    this.bindAll()

    // Watch for new elements added to DOM
    this.observer = new MutationObserver(() => this.bindAll())
    this.observer.observe(document.body, { childList: true, subtree: true })

    this.initialized = true
  }

  onMouseMove = (e) => {
    this.mouseX = e.clientX
    this.mouseY = e.clientY
    if (this.dotXSet) this.dotXSet(this.mouseX)
    if (this.dotYSet) this.dotYSet(this.mouseY)
  }

  onTick = () => {
    this.ringX += (this.mouseX - this.ringX) * 0.12
    this.ringY += (this.mouseY - this.ringY) * 0.12
    if (this.ring) {
      gsap.set(this.ring, { x: this.ringX, y: this.ringY })
    }
    if (this.crosshair) {
      gsap.set(this.crosshair, { x: this.ringX, y: this.ringY })
    }
    if (this.label) {
      gsap.set(this.label, { x: this.ringX, y: this.ringY })
    }
  }

  // State 6 — Click
  onMouseDown = () => {
    gsap.to([this.dot, this.ring], { scale: 0.7, duration: 0.1 })
  }

  onMouseUp = () => {
    gsap.to([this.dot, this.ring], { scale: 1, duration: 0.2, ease: 'back.out(2)' })
  }

  // Bind states to DOM elements
  bindAll() {
    // State 2 — Links & Buttons
    document.querySelectorAll('a, button, [data-cursor="link"]').forEach((el) => {
      if (el.dataset.cursorBound) return
      el.dataset.cursorBound = 'true'
      el.addEventListener('mouseenter', () => this.setLinkState())
      el.addEventListener('mouseleave', () => this.resetState())
    })

    // State 3 — Product Cards
    document.querySelectorAll('[data-cursor="product"]').forEach((card) => {
      if (card.dataset.cursorBound) return
      card.dataset.cursorBound = 'true'
      card.addEventListener('mouseenter', () => this.setProductState(card))
      card.addEventListener('mouseleave', () => this.resetProductState(card))
    })

    // State 4 — Images
    document.querySelectorAll('[data-cursor="image"]').forEach((img) => {
      if (img.dataset.cursorBound) return
      img.dataset.cursorBound = 'true'
      img.addEventListener('mouseenter', () => this.setImageState())
      img.addEventListener('mouseleave', () => this.resetState())
    })

    // State 5 — Text Inputs
    document.querySelectorAll('input[type="text"], input[type="email"], input[type="password"], input[type="search"], input[type="tel"], textarea').forEach((input) => {
      if (input.dataset.cursorBound) return
      input.dataset.cursorBound = 'true'
      input.addEventListener('mouseenter', () => this.setInputState())
      input.addEventListener('mouseleave', () => this.resetState())
    })
  }

  // State 2 — Links & Buttons
  setLinkState() {
    gsap.to(this.dot, { scale: 2, background: '#0066FF', duration: 0.25 })
    gsap.to(this.ring, { scale: 1.8, borderColor: 'rgba(0,102,255,0.45)', duration: 0.3 })
  }

  // State 3 — Product Card (Lens Effect)
  setProductState(card) {
    gsap.to([this.dot, this.ring, this.crosshair, this.label], { opacity: 0, duration: 0.15 })

    // Card glassmorphism lift
    gsap.to(card, {
      y: -8,
      boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
      duration: 0.35, ease: 'power2.out'
    })

    // Dim siblings
    const siblings = Array.from(card.parentElement?.children || []).filter(c => c !== card)
    gsap.to(siblings, { opacity: 0.55, duration: 0.3 })

    // Zoom product image
    const img = card.querySelector('img')
    if (img) gsap.to(img, { scale: 1.06, duration: 0.4 })

    // Slide up Add to Cart
    const addBtn = card.querySelector('[data-add-to-cart]')
    if (addBtn) gsap.to(addBtn, { y: 0, opacity: 1, duration: 0.3 })
  }

  resetProductState(card) {
    gsap.to(this.dot, {
      opacity: 1,
      width: 6,
      height: 6,
      borderRadius: '50%',
      background: '#1A1A1A',
      duration: 0.18
    })
    gsap.to(this.ring, {
      opacity: 1,
      width: 36,
      height: 36,
      background: 'transparent',
      borderWidth: '1.5px',
      borderColor: 'rgba(26,26,26,0.35)',
      duration: 0.25
    })
    if (this.crosshair) gsap.to(this.crosshair, { opacity: 0, duration: 0.15 })
    if (this.label) gsap.to(this.label, { opacity: 0, duration: 0.15 })

    gsap.to(card, {
      y: 0,
      boxShadow: '0 1px 4px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)',
      duration: 0.4
    })

    const siblings = Array.from(card.parentElement?.children || []).filter(c => c !== card)
    gsap.to(siblings, { opacity: 1, duration: 0.3 })

    const img = card.querySelector('img')
    if (img) gsap.to(img, { scale: 1, duration: 0.4 })

    const addBtn = card.querySelector('[data-add-to-cart]')
    if (addBtn) gsap.to(addBtn, { y: 40, opacity: 0, duration: 0.25 })
  }

  // State 4 — Images
  setImageState() {
    gsap.to(this.ring, { scale: 1.6, duration: 0.25 })
    if (this.label) {
      this.label.textContent = 'VIEW'
      gsap.to(this.label, { opacity: 1, duration: 0.2 })
    }
  }

  // State 5 — Text Inputs
  setInputState() {
    gsap.to(this.dot, { width: 2, height: 20, borderRadius: 2, duration: 0.2 })
    gsap.to(this.ring, { opacity: 0, duration: 0.2 })
  }

  // Reset to default
  resetState() {
    gsap.to(this.dot, {
      scale: 1, background: '#1A1A1A', opacity: 1,
      width: 6, height: 6, borderRadius: '50%', duration: 0.25
    })
    gsap.to(this.ring, {
      scale: 1, borderColor: 'rgba(26,26,26,0.35)', opacity: 1,
      width: 36, height: 36, background: 'transparent',
      borderWidth: '1.5px', duration: 0.3
    })
    if (this.label) {
      gsap.to(this.label, { opacity: 0, duration: 0.15 })
    }
  }

  destroy() {
    if (this.observer) this.observer.disconnect()
    window.removeEventListener('mousemove', this.onMouseMove)
    document.removeEventListener('mousedown', this.onMouseDown)
    document.removeEventListener('mouseup', this.onMouseUp)
    gsap.ticker.remove(this.onTick)
    this.initialized = false
  }
}

export const cursorSystem = new CursorSystem()
export default cursorSystem
