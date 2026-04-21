# 👁️ EYEWEAR STORE — COMPLETE FRONTEND MASTER PROMPT
# Light Theme | GSAP-Powered | Page-by-Page | Animation-by-Animation

---

## 🧠 PROJECT OVERVIEW

Build a **premium eyewear e-commerce website** — fully LIGHT theme, with a custom
cursor system, Glassmorphism card interactions, and GSAP powering every single
animation on the site. Clean, airy, modern — like a luxury optical boutique.

---

## ⚙️ TECH STACK

```
Framework:        React.js 18 (Vite)
Styling:          Tailwind CSS + custom CSS
Animation Engine: GSAP 3 (gsap.com) — PRIMARY and ONLY animation library
  Plugins used:   ScrollTrigger, ScrollSmoother, SplitText, Flip, Draggable
Smooth Scroll:    GSAP ScrollSmoother (integrates natively with ScrollTrigger)
Cursor System:    Custom JS cursor — powered by GSAP quickSetter + ticker
Carousels:        Swiper.js (GSAP animates card entry/exit)
Auth:             Firebase Auth (Google OAuth + Email OTP)
Hosting:          Firebase Hosting
Icons:            Lucide React
Fonts:            'DM Sans' — Google Fonts (all UI text)
                  'DM Serif Display' — Google Fonts (hero display only)

REMOVED — do NOT use these:
  × Framer Motion   → replaced by GSAP entirely
  × Lenis           → replaced by GSAP ScrollSmoother
  × Vanilla-tilt    → replaced by GSAP mousemove handlers
  × AOS             → replaced by GSAP ScrollTrigger
```

---

## 🎨 DESIGN SYSTEM — LIGHT THEME

### Philosophy
Clean, breathable, premium optical boutique aesthetic.
White and warm off-white backgrounds. Dark near-black text. One strong accent.
GSAP brings everything to life — the design itself is restrained and elegant.
No dark mode. No black sections (except footer utility bar and stats counter).

---

### COLOR PALETTE

```
BACKGROUNDS
  Page:               #FFFFFF
  Section alt:        #F7F7F5   (warm off-white)
  Card / surface:     #FAFAF8
  Input:              #F4F4F2
  Navbar (scrolled):  rgba(255,255,255,0.88) + blur(16px)
  Stats section:      #111111   (only dark section — homepage stats)
  Footer utility:     #111111
  Footer gallery:     #F7F7F5

TEXT
  Primary:            #111111
  Secondary:          #555555
  Muted:              #888888
  Disabled:           #BBBBBB
  On dark:            #FFFFFF
  On dark muted:      rgba(255,255,255,0.55)

ACCENT
  Primary (buttons, strong UI):  #1A1A1A
  Hover:                         #333333
  Blue CTA (Add to Cart, Login): #0066FF
  Blue hover:                    #0052CC
  Focus ring:                    2px solid #1A1A1A, 2px offset

STATUS
  Success:    #16A34A
  Error:      #DC2626
  Warning:    #D97706
  WhatsApp:   #25D366  (floating button only)

BORDERS
  Default:    1px solid #E8E8E6
  Strong:     1px solid #D0D0CC
  Focus:      2px solid #1A1A1A

GLASSMORPHISM (product card hover — light version)
  Glass bg:       rgba(255,255,255,0.80)
  Glass border:   rgba(255,255,255,0.95)
  Glass blur:     backdrop-filter: blur(20px) saturate(180%)
  Glass shadow:   0 8px 40px rgba(0,0,0,0.10)

SHADOWS
  Card default:   0 1px 4px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)
  Card hover:     0 8px 40px rgba(0,0,0,0.12)
  Nav scrolled:   0 1px 0 rgba(0,0,0,0.08)
  Button:         0 2px 8px rgba(0,0,0,0.10)
```

---

### TYPOGRAPHY

```
FONTS (load in <head>):
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet">

SCALE:
  Hero Display:   DM Serif Display | 72px  | 400 | line-height 1.05 | -1px
  Hero Sub:       DM Sans          | 20px  | 300 | line-height 1.5
  Section Title:  DM Sans          | 48px  | 600 | line-height 1.1  | -0.5px
  Section Sub:    DM Sans          | 18px  | 400 | line-height 1.6
  Card Title:     DM Sans          | 18px  | 600 | line-height 1.2
  Card Body:      DM Sans          | 14px  | 400 | line-height 1.6
  Navbar Link:    DM Sans          | 15px  | 500 | line-height 1
  Button:         DM Sans          | 15px  | 500 | letter-spacing 0.02em
  Caption:        DM Sans          | 13px  | 400 | line-height 1.5
  Badge:          DM Sans          | 11px  | 600 | letter-spacing 0.08em

Max weights: 300 / 400 / 500 / 600. Never use 700+.
Alignment: hero = centered. All other text = left-aligned.
```

---

### BUTTONS

```
PRIMARY (#1A1A1A):
  bg #1A1A1A | text #fff | padding 12px 24px | radius 8px
  Hover: GSAP to({ background: '#333', scale: 1.02 }, 0.2)
  Active: GSAP to({ scale: 0.97 }, 0.1)

SECONDARY (outlined):
  transparent | border 1.5px #1A1A1A | text #1A1A1A | padding 12px 24px | radius 8px
  Hover: GSAP to({ background: '#1A1A1A', color: '#fff' }, 0.25)

BLUE (Add to Cart, Login):
  bg #0066FF | text #fff | padding 12px 24px | radius 8px
  Hover: GSAP to({ background: '#0052CC', scale: 1.02 }, 0.2)

PILL LINK (Browse all, See more):
  transparent | border 1px #D0D0CC | text #1A1A1A | radius 999px | padding 8px 20px
  Hover: GSAP to({ borderColor: '#1A1A1A', background: '#F4F4F2' }, 0.2)

ICON BUTTON:
  bg #F4F4F2 | radius 50% | 40×40px
  Hover: GSAP to({ background: '#E8E8E6', scale: 1.08 }, 0.18)
```

---

### BORDER RADIUS

```
4px    chips, tags, badges
8px    buttons, inputs, cards
12px   large cards, panels, modals
16px   feature panels, auth form
999px  pill links, pill badges, floating button
50%    icon buttons, avatar, circular controls
```

---

---

# ═══════════════════════════════════════
# GSAP — COMPLETE INTEGRATION GUIDE
# Every animation uses GSAP. Zero exceptions.
# ═══════════════════════════════════════

## SETUP

### Install
```bash
npm install gsap
```

### Register Plugins (main.jsx — do once)
```javascript
import gsap from 'gsap'
import { ScrollTrigger }  from 'gsap/ScrollTrigger'
import { ScrollSmoother } from 'gsap/ScrollSmoother'
import { SplitText }      from 'gsap/SplitText'
import { Flip }           from 'gsap/Flip'

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText, Flip)
```

### ScrollSmoother (replaces Lenis — in App.jsx)
```javascript
// Wrap entire app:
// <div id="smooth-wrapper">
//   <div id="smooth-content">{children}</div>
// </div>

useEffect(() => {
  const smoother = ScrollSmoother.create({
    wrapper: '#smooth-wrapper',
    content: '#smooth-content',
    smooth: 1.4,
    smoothTouch: 0.1,
    effects: true,         // enables data-speed parallax on elements
    normalizeScroll: true
  })
  return () => smoother.kill()
}, [])
```

### React useGSAP Hook (use in every component)
```javascript
// hooks/useGSAP.js
import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export function useGSAP(callback, deps = []) {
  const ref = useRef(null)
  useEffect(() => {
    const ctx = gsap.context(callback, ref)
    return () => ctx.revert()   // auto-cleanup on unmount
  }, deps)
  return ref
}
```

---

## CORE ANIMATION PATTERNS

### 1. Fade Up on Scroll
```javascript
gsap.from(element, {
  opacity: 0, y: 48, duration: 0.8, ease: 'power2.out',
  scrollTrigger: { trigger: element, start: 'top 88%', once: true }
})
```

### 2. Stagger Grid Cards
```javascript
gsap.from('.product-card', {
  opacity: 0, y: 60, duration: 0.7, ease: 'power3.out',
  stagger: { amount: 0.5, from: 'start' },
  scrollTrigger: { trigger: '.products-grid', start: 'top 85%', once: true }
})
```

### 3. SplitText Headline
```javascript
const split = new SplitText('.hero-heading', { type: 'words,chars' })
gsap.from(split.chars, {
  opacity: 0, y: 80, rotationX: -90, duration: 0.6,
  ease: 'back.out(1.7)', stagger: 0.025
})
// Cleanup: split.revert() in useEffect return
```

### 4. GSAP Timeline (sequenced entry)
```javascript
const tl = gsap.timeline({ delay: 0.2 })
tl.from('.nav',           { y: -60, opacity: 0, duration: 0.6, ease: 'power2.out' })
  .from('.hero-badge',    { y: 20, opacity: 0, duration: 0.5 }, '-=0.2')
  .from(split.words,      { y: 60, opacity: 0, duration: 0.8, stagger: 0.08 }, '-=0.2')
  .from('.hero-subtitle', { y: 20, opacity: 0, duration: 0.5 }, '-=0.4')
  .from('.hero-cta > *',  { y: 20, opacity: 0, stagger: 0.12, duration: 0.5 }, '-=0.3')
```

### 5. Parallax (hero bg, product images)
```javascript
// Simple: add data-speed="0.7" to element (ScrollSmoother handles it)
// Manual:
gsap.to('.hero-image', {
  y: '-20%', ease: 'none',
  scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
})
```

### 6. Mouse Parallax (hero product image)
```javascript
window.addEventListener('mousemove', (e) => {
  const xPct = (e.clientX / window.innerWidth - 0.5) * 2
  const yPct = (e.clientY / window.innerHeight - 0.5) * 2
  gsap.to('.hero-product-image', { x: xPct * 20, y: yPct * 10, duration: 1.2, ease: 'power2.out' })
})
```

### 7. GSAP Flip (filter/grid layout changes)
```javascript
import { Flip } from 'gsap/Flip'
const state = Flip.getState('.product-card')
filterProducts()  // change DOM
Flip.from(state, {
  duration: 0.5, ease: 'power2.inOut', stagger: 0.04, absolute: true,
  onLeave: els => gsap.to(els, { opacity: 0, scale: 0.9, duration: 0.25 }),
  onEnter: els => gsap.from(els, { opacity: 0, scale: 0.9, duration: 0.35 })
})
```

### 8. Pin + Scrub (horizontal scroll)
```javascript
const trackWidth = track.scrollWidth - track.offsetWidth
gsap.to('.scroll-track', {
  x: -trackWidth, ease: 'none',
  scrollTrigger: { trigger: '.scroll-section', pin: true, scrub: 1, end: () => '+=' + trackWidth }
})
```

### 9. Counter Animation
```javascript
gsap.to({ val: 0 }, {
  val: 50000, duration: 2, ease: 'power1.out',
  scrollTrigger: { trigger: '.stats', start: 'top 80%', once: true },
  onUpdate() { el.textContent = Math.round(this.targets()[0].val).toLocaleString('en-IN') + '+' }
})
```

### 10. Number Flip (countdown, qty change)
```javascript
const flipNumber = (el, newVal) => {
  gsap.to(el, { rotationX: -90, duration: 0.15, ease: 'power2.in', onComplete: () => {
    el.textContent = newVal
    gsap.fromTo(el, { rotationX: 90 }, { rotationX: 0, duration: 0.2, ease: 'power2.out' })
  }})
}
```

### 11. SVG Path Draw (checkmark, success)
```javascript
gsap.from('.checkmark-path', {
  strokeDashoffset: 100,
  strokeDasharray: 100,
  duration: 0.6, ease: 'power2.out'
})
```

### 12. ScrollTrigger.batch (large product lists)
```javascript
ScrollTrigger.batch('.product-card', {
  onEnter: els => gsap.from(els, { opacity: 0, y: 50, stagger: 0.08, duration: 0.6, ease: 'power3.out' }),
  start: 'top 88%', once: true
})
```

---

## EASE REFERENCE

```
power1.out   — gentle. Use for captions, small text
power2.out   — standard. Use for most UI (nav, inputs)
power3.out   — snappy. Use for cards, images, panels
power4.out   — dramatic. Use for hero headlines
back.out(1.7) — slight overshoot. Use for badges, icons
elastic.out  — springy. Use for heart icon, success
expo.out     — extreme snap. Use for modal open
sine.inOut   — smooth wave. Use for infinite loops
none         — linear. Use for scrubbed scroll only
```

## SCROLLTRIGGER QUICK REFERENCE

```javascript
ScrollTrigger.create({
  trigger: '.el',
  start: 'top 85%',      // [element-edge] [viewport-%]
  end: 'bottom 20%',
  scrub: false,          // false=once | true=scroll-linked | 1=1s lag
  pin: false,            // pin element during scroll range
  once: true,            // fire only once
  toggleActions: 'play none none none',
  invalidateOnRefresh: true,
  markers: false         // TRUE only in dev, remove in production
})

// Refresh on resize:
window.addEventListener('resize', () => ScrollTrigger.refresh())
```

---

---

# ═══════════════════════════════════════
# CUSTOM CURSOR SYSTEM (GSAP-powered)
# ═══════════════════════════════════════

## GLOBAL CSS
```css
/* Desktop only — hide native cursor */
@media (pointer: fine) {
  * { cursor: none !important; }
}
```

## HTML ELEMENTS
```html
<div id="cursor-dot"></div>
<div id="cursor-ring"></div>
<div class="cursor-crosshair" style="opacity:0">
  <span class="ch-h"></span><span class="ch-v"></span>
</div>
<div class="cursor-label" style="opacity:0"></div>
```

## BASE CSS
```css
#cursor-dot {
  width: 6px; height: 6px;
  background: #1A1A1A;
  border-radius: 50%;
  position: fixed; pointer-events: none;
  z-index: 99999; left: 0; top: 0;
  will-change: transform;
}
#cursor-ring {
  width: 36px; height: 36px;
  border: 1.5px solid rgba(26,26,26,0.35);
  border-radius: 50%;
  position: fixed; pointer-events: none;
  z-index: 99998; left: 0; top: 0;
  will-change: transform;
}
```

## MOVEMENT (GSAP quickSetter + ticker)
```javascript
const dotX = gsap.quickSetter('#cursor-dot', 'x', 'px')
const dotY = gsap.quickSetter('#cursor-dot', 'y', 'px')
let ringX = 0, ringY = 0, mouseX = 0, mouseY = 0

window.addEventListener('mousemove', e => {
  mouseX = e.clientX; mouseY = e.clientY
  dotX(mouseX); dotY(mouseY)
})

gsap.ticker.add(() => {
  ringX += (mouseX - ringX) * 0.12
  ringY += (mouseY - ringY) * 0.12
  gsap.set('#cursor-ring', { x: ringX, y: ringY })
})
```

## 6 CURSOR STATES

### State 1 — Default
```
Dot: 6px, #1A1A1A
Ring: 36px, 1.5px border rgba(26,26,26,0.35)
```

### State 2 — Links & Buttons
```javascript
el.addEventListener('mouseenter', () => {
  gsap.to('#cursor-dot', { scale: 2, background: '#0066FF', duration: 0.25 })
  gsap.to('#cursor-ring', { scale: 1.8, borderColor: 'rgba(0,102,255,0.45)', duration: 0.3 })
})
el.addEventListener('mouseleave', () => {
  gsap.to('#cursor-dot', { scale: 1, background: '#1A1A1A', duration: 0.25 })
  gsap.to('#cursor-ring', { scale: 1, borderColor: 'rgba(26,26,26,0.35)', duration: 0.3 })
})
```

### State 3 — Product Cards (Lens Effect + Glassmorphism)
```javascript
card.addEventListener('mouseenter', () => {
  // Cursor becomes a lens circle
  gsap.to('#cursor-dot', { opacity: 0, duration: 0.2 })
  gsap.to('#cursor-ring', {
    width: 100, height: 100, borderWidth: '1px',
    borderColor: 'rgba(26,26,26,0.25)',
    background: 'rgba(255,255,255,0.15)',
    duration: 0.35, ease: 'power2.out'
  })
  gsap.to('.cursor-crosshair', { opacity: 1, duration: 0.2, delay: 0.15 })

  // Card lifts with Glassmorphism
  gsap.to(card, {
    y: -8,
    boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
    background: 'rgba(255,255,255,0.80)',
    backdropFilter: 'blur(20px) saturate(180%)',
    duration: 0.35, ease: 'power2.out'
  })
  // Sibling cards dim
  gsap.to(siblings, { opacity: 0.55, duration: 0.3 })
  // Product image zooms
  gsap.to(card.querySelector('img'), { scale: 1.06, duration: 0.4 })
  // Add to Cart slides up
  gsap.to(card.querySelector('.add-to-cart'), { y: 0, opacity: 1, duration: 0.3 })
})

card.addEventListener('mouseleave', () => {
  gsap.to('#cursor-dot', { opacity: 1, duration: 0.2 })
  gsap.to('#cursor-ring', {
    width: 36, height: 36, background: 'transparent',
    borderWidth: '1.5px', borderColor: 'rgba(26,26,26,0.35)', duration: 0.3
  })
  gsap.to('.cursor-crosshair', { opacity: 0, duration: 0.15 })
  gsap.to(card, { y: 0, boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
    background: '#FAFAF8', backdropFilter: 'none', duration: 0.4 })
  gsap.to(siblings, { opacity: 1, duration: 0.3 })
  gsap.to(card.querySelector('img'), { scale: 1, duration: 0.4 })
  gsap.to(card.querySelector('.add-to-cart'), { y: 40, opacity: 0, duration: 0.25 })
})
```

### State 4 — Images
```javascript
img.addEventListener('mouseenter', () => {
  gsap.to('#cursor-ring', { scale: 1.6, duration: 0.25 })
  gsap.to('.cursor-label', { opacity: 1, duration: 0.2 })
  label.textContent = 'VIEW'
})
img.addEventListener('mouseleave', () => {
  gsap.to('#cursor-ring', { scale: 1, duration: 0.25 })
  gsap.to('.cursor-label', { opacity: 0, duration: 0.15 })
})
```

### State 5 — Text Inputs
```javascript
input.addEventListener('mouseenter', () => {
  gsap.to('#cursor-dot', { width: 2, height: 20, borderRadius: 2, duration: 0.2 })
  gsap.to('#cursor-ring', { opacity: 0, duration: 0.2 })
})
input.addEventListener('mouseleave', () => {
  gsap.to('#cursor-dot', { width: 6, height: 6, borderRadius: '50%', duration: 0.2 })
  gsap.to('#cursor-ring', { opacity: 1, duration: 0.2 })
})
```

### State 6 — Click / Mousedown
```javascript
document.addEventListener('mousedown', () => {
  gsap.to(['#cursor-dot', '#cursor-ring'], { scale: 0.7, duration: 0.1 })
})
document.addEventListener('mouseup', () => {
  gsap.to(['#cursor-dot', '#cursor-ring'], { scale: 1, duration: 0.2, ease: 'back.out(2)' })
})
```

---

---

# ═══════════════════════════════════════
# PAGE 1 — HERO / LANDING PAGE
# ═══════════════════════════════════════

## LAYOUT
```
Background: #FFFFFF | Height: 100dvh | Overflow: hidden

TOP:    NAVBAR (transparent → frosted on scroll)
CENTER: Hero content (vertically centered)
        Badge pill | H1 | Subtitle | CTA row | Trust badges
        Product image (right, parallax on mouse)
        Floating product card (GSAP float loop)
BOTTOM: Scroll indicator (GSAP bounce)
```

## HERO BG — SUBTLE PARTICLE CANVAS
```javascript
// tsParticles — light mode config
// Particles: #D0D0CC, very small (2px), opacity 0.4, qty 30
// Slow drift, mouse repulse (gentle), thin connecting lines rgba(0,0,0,0.05)
// Canvas: z-index 0 | Content: z-index 10
```

## HERO ENTRY GSAP TIMELINE
```javascript
const split = new SplitText('.hero-title', { type: 'words' })
const tl = gsap.timeline({ delay: 0.2 })

tl.from('.navbar', { y: -70, opacity: 0, duration: 0.7, ease: 'power3.out' })
  .from('.hero-badge', { y: 24, opacity: 0, duration: 0.5, ease: 'power2.out' }, '-=0.3')
  .from(split.words, {
    y: 80, opacity: 0, rotationX: -40,
    duration: 0.8, stagger: 0.1, ease: 'power4.out',
    transformOrigin: '50% 50% -30px'
  }, '-=0.2')
  .from('.hero-subtitle', { y: 24, opacity: 0, duration: 0.6, ease: 'power2.out' }, '-=0.4')
  .from('.hero-cta > *', { y: 20, opacity: 0, duration: 0.5, stagger: 0.12 }, '-=0.35')
  .from('.hero-trust > *', { opacity: 0, duration: 0.4, stagger: 0.08 }, '-=0.2')
  .from('.hero-product-image', { x: 80, opacity: 0, duration: 1.0, ease: 'power3.out' }, 0.6)
  .from('.floating-product-card', { scale: 0.8, opacity: 0, duration: 0.6, ease: 'back.out(1.7)' }, '-=0.3')
```

## HERO CONTINUOUS ANIMATIONS
```javascript
// Floating card — gentle up/down loop
gsap.to('.floating-product-card', {
  y: -12, duration: 2.5, ease: 'sine.inOut', yoyo: true, repeat: -1
})

// Scroll indicator
gsap.to('.scroll-indicator', {
  y: 8, duration: 0.8, ease: 'power1.inOut', yoyo: true, repeat: -1
})

// Mouse parallax on hero image
window.addEventListener('mousemove', (e) => {
  const xR = e.clientX / window.innerWidth - 0.5
  const yR = e.clientY / window.innerHeight - 0.5
  gsap.to('.hero-product-image', { x: xR * 30, y: yR * 15, duration: 1.5, ease: 'power1.out' })
})
```

## NAVBAR
```
Height: 64px
Initial: transparent, no shadow
Scrolled: rgba(255,255,255,0.88) + blur(16px) + shadow 0 1px 0 rgba(0,0,0,0.08)

GSAP on scroll:
ScrollTrigger.create({
  trigger: 'body', start: 'top top-=60',
  onEnter:     () => gsap.to('.navbar', { background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(16px)', duration: 0.35 }),
  onLeaveBack: () => gsap.to('.navbar', { background: 'transparent', backdropFilter: 'none', duration: 0.35 })
})

LEFT:   Logo (DM Sans 600 18px #1A1A1A + eyewear SVG)
CENTER: Home | Shop | About | Contact
        Link hover: GSAP underline scaleX 0→1, origin left, 0.25s
RIGHT:  Search | Wishlist (badge) | Cart (badge) | Login button

MOBILE DRAWER:
gsap.to(drawer,  { x: 0, duration: 0.4, ease: 'power3.out' })
gsap.to(overlay, { opacity: 1, duration: 0.3 })
gsap.from(navItems, { x: 30, opacity: 0, stagger: 0.06, duration: 0.35 })
```

---

---

# ═══════════════════════════════════════
# PAGE 2 — LOGIN / REGISTER PAGE
# ═══════════════════════════════════════

## LAYOUT — 70 / 30 SPLIT
```
Background: #F7F7F5 | Height: 100dvh

LEFT 70%:  Lifestyle video (autoplay muted loop) or animated image slideshow
           Bottom-left: brand quote card (frosted glass: rgba(255,255,255,0.75) blur(12px))

RIGHT 30%: White auth panel, full height
           border-left: 1px solid #E8E8E6
           padding: 48px 40px
           overflow-y: auto
```

## PAGE ENTRY GSAP
```javascript
const tl = gsap.timeline()
tl.from('.auth-visual',     { x: -60, opacity: 0, duration: 0.9, ease: 'power3.out' })
  .from('.auth-form-panel', { x: 60,  opacity: 0, duration: 0.9, ease: 'power3.out' }, '<')
  .from('.auth-form-panel > *', { y: 30, opacity: 0, stagger: 0.08, duration: 0.5, ease: 'power2.out' }, '-=0.4')
```

## AUTH FORM CONTENT

```
TABS: [LOGIN] [REGISTER]
  Active tab: sliding black underline
  GSAP tab switch:
    tl.to(oldContent, { y: -15, opacity: 0, duration: 0.25 })
      .set(oldContent, { display: 'none' })
      .set(newContent, { display: 'block' })
      .from(newContent, { y: 15, opacity: 0, duration: 0.3 })
  Tab indicator:
    gsap.to('.tab-indicator', { x: tab.offsetLeft, width: tab.offsetWidth, duration: 0.3, ease: 'power2.inOut' })

LOGIN:
  [Continue with Google] button
  Email input (floating label)
  Password input (toggle eye icon)
  [Forgot password?]
  [Sign In] — Blue CTA full width
  Loading state: gsap.to(btnText, { opacity: 0, duration: 0.2 }) → spinner fades in

REGISTER:
  Full Name | Email | Phone
  [Send OTP] button
  On click: fields slide out, OTP panel slides in

  OTP PANEL:
    6 single-char boxes
    Active box border: GSAP to({ borderColor: '#1A1A1A' }, 0.15)
    Each fill: GSAP to(box, { scale: 1.08, duration: 0.1, yoyo: true, repeat: 1 })
    
  After OTP: Create Password step
    Password strength bar: gsap.to(bar, { width: `${strength}%`, duration: 0.3 })
    
  Success:
    gsap draws SVG checkmark (strokeDashoffset animation)
    canvas-confetti burst
    gsap.to(panel, { scale: 1.02, opacity: 0, duration: 0.4 })
    gsap.from(successCard, { scale: 0.9, opacity: 0, duration: 0.5, ease: 'back.out(1.5)' })

LEFT PANEL SLIDESHOW (if using images):
const imgTl = gsap.timeline({ repeat: -1 })
images.forEach(img => {
  imgTl.to(img, { opacity: 1, scale: 1, duration: 0.8, ease: 'power2.inOut' })
       .to(img, { opacity: 0, scale: 1.04, duration: 0.6, delay: 4, ease: 'power2.in' })
})
```

---

---

# ═══════════════════════════════════════
# PAGE 3 — HOME PAGE (AUTHENTICATED)
# ═══════════════════════════════════════

## AUTHENTICATED NAVBAR — EXPANDED MEGA MENU
```
Links: Home | Shop ▾ | Brands | Offers | About | Contact

MEGA MENU OPEN:
gsap.fromTo(megaMenu, { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' })
gsap.from(menuItems, { opacity: 0, y: 8, stagger: 0.04, duration: 0.3 })

MEGA MENU CLOSE:
gsap.to(megaMenu, { opacity: 0, y: -6, duration: 0.2, ease: 'power2.in' })

CATEGORIES IN MENU:
  👓 Normal Specs    |  🕶️ Sunglasses
  🔬 Prescription    |  💻 Computer Glasses
  👶 Kids Eyewear    |  🏃 Sports Glasses
  📖 Reading Glasses |  🧳 Cases & Accessories

SEARCH OVERLAY:
gsap.fromTo(searchOverlay, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' })
Auto-focus input. ESC closes.
```

## HOME SECTIONS

---

### MARQUEE STRIP
```
Height: 44px | BG: #1A1A1A | Text: white
Content: FREE DELIVERY ABOVE ₹999  ·  NEW ARRIVALS WEEKLY  ·  1 YEAR WARRANTY  ·  CODE FRAME10  ·

GSAP infinite scroll:
// Double content in DOM for seamless loop
gsap.to('.marquee-track', { xPercent: -50, duration: 25, ease: 'none', repeat: -1 })
// Hover pause:
strip.addEventListener('mouseenter', () => gsap.globalTimeline.timeScale(0))
strip.addEventListener('mouseleave', () => gsap.globalTimeline.timeScale(1))
// Better: just target the marquee tween
```

---

### HOME MINI BANNER (60vh)
```
BG: #FFFFFF
Heading: "Good to see you, [Name]" — DM Serif Display 48px

GSAP:
const split = new SplitText('.home-heading', { type: 'words' })
gsap.from(split.words, {
  y: 40, opacity: 0, stagger: 0.08, duration: 0.7, ease: 'power3.out',
  scrollTrigger: { trigger: '.home-banner', start: 'top 80%', once: true }
})
gsap.from('.category-pills > *', {
  scale: 0.85, opacity: 0, stagger: 0.06, duration: 0.4, ease: 'back.out(1.5)',
  scrollTrigger: { trigger: '.home-banner', start: 'top 80%', once: true, delay: 0.3 }
})
```

---

### TRENDING PRODUCTS CAROUSEL
```
BG: #F7F7F5

Filter tabs with sliding indicator:
gsap.to('.tab-indicator', {
  x: activeTab.offsetLeft, width: activeTab.offsetWidth,
  duration: 0.35, ease: 'power2.inOut'
})

Filter change → GSAP Flip:
const state = Flip.getState('.swiper-slide')
filterContent()
Flip.from(state, { duration: 0.5, ease: 'power2.inOut', stagger: 0.04 })

Carousel section entry:
gsap.from('.swiper-slide', {
  opacity: 0, y: 60, duration: 0.7, stagger: 0.1, ease: 'power3.out',
  scrollTrigger: { trigger: '.trending-section', start: 'top 80%', once: true }
})
```

### PRODUCT CARD — LIGHT DESIGN
```
BG: #FAFAF8 | Border: 1px solid #E8E8E6 | Radius: 12px | Padding: 16px
Shadow: 0 1px 4px rgba(0,0,0,0.06)

Product image: white bg, rounded 8px, object-contain
Brand: DM Sans 13px #888888
Name: DM Sans 16px 600 #111111
Stars | Price (sale + strikethrough)
Add to Cart: initial state y:40 opacity:0 (slides up on hover via cursor section GSAP)
Wishlist heart: top-right absolute

All card hover/leave GSAP defined in CURSOR section above.

Wishlist click:
gsap.to(heart, { scale: 1.5, duration: 0.15, yoyo: true, repeat: 1, ease: 'back.out(2)' })

Add to Cart click:
gsap.to(cartIcon,  { rotate: 12, duration: 0.15, yoyo: true, repeat: 1 })
gsap.to(cartBadge, { scale: 1.5, duration: 0.15, ease: 'back.out(2)', yoyo: true, repeat: 1 })
```

---

### SPECIAL OFFER BANNER
```
BG: #F7F7F5 | Contained card (radius 16px, border #E8E8E6, max-w 1200px)
Padding: 48px | Split: LEFT text | RIGHT product image

GSAP:
const tl = gsap.timeline({ scrollTrigger: { trigger: '.offer-banner', start: 'top 80%', once: true } })
tl.from('.offer-text > *', { x: -40, opacity: 0, stagger: 0.1, duration: 0.7, ease: 'power3.out' })
  .from('.offer-image',    { x: 40,  opacity: 0, duration: 0.8, ease: 'power3.out' }, '<')

Countdown timer flip: use flipNumber() pattern from core patterns
```

---

### CATEGORY GRID
```
BG: #FFFFFF | 4 cols desktop / 2 tablet / 1 mobile
8 category cards: white bg, border #E8E8E6, radius 12px

Entry:
gsap.from('.category-card', {
  opacity: 0, y: 48, duration: 0.65, ease: 'power3.out',
  stagger: { amount: 0.6, from: 'start' },
  scrollTrigger: { trigger: '.category-grid', start: 'top 82%', once: true }
})

Card hover:
gsap.to(card, { y: -6, boxShadow: '0 12px 40px rgba(0,0,0,0.10)', duration: 0.3 })
gsap.to(icon, { scale: 1.15, rotate: 5, duration: 0.3, ease: 'back.out(1.5)' })
```

---

### NEW ARRIVALS GRID
```
BG: #F7F7F5 | Masonry CSS grid | First card spans 2 columns

Entry:
gsap.from('.arrival-card', {
  opacity: 0, scale: 0.94, duration: 0.6, stagger: 0.08, ease: 'power2.out',
  scrollTrigger: { trigger: '.arrivals-grid', start: 'top 80%', once: true }
})
```

---

### BRAND STRIP (dual marquee)
```
BG: #FFFFFF | Two rows of brand logos

// Row 1 scrolls left, Row 2 scrolls right
gsap.to('.brand-row-1', { xPercent: -50, duration: 20, ease: 'none', repeat: -1 })
gsap.to('.brand-row-2', { xPercent: 50,  duration: 25, ease: 'none', repeat: -1 })

Logo hover:
gsap.to(logo, { filter: 'grayscale(0)', scale: 1.1, duration: 0.25 })
// Default state: filter: grayscale(1)
```

---

### WHY CHOOSE US
```
BG: #F7F7F5 | 4 feature cards

Entry:
gsap.from('.feature-card', {
  opacity: 0, y: 40, duration: 0.6, stagger: 0.12, ease: 'power2.out',
  scrollTrigger: { trigger: '.features', start: 'top 82%', once: true }
})
Icon on hover: gsap.to(icon, { rotate: 360, duration: 0.6, ease: 'power2.inOut' })
```

---

### TESTIMONIALS
```
BG: #FFFFFF | Swiper coverflow | Active card scale 1.03

Section title SplitText:
const split = new SplitText('.testimonials-title', { type: 'words' })
gsap.from(split.words, {
  opacity: 0, y: 30, stagger: 0.07, duration: 0.6, ease: 'power3.out',
  scrollTrigger: { trigger: '.testimonials', start: 'top 82%', once: true }
})

Star entry: gsap.from(stars, { scale: 0, opacity: 0, stagger: 0.08, duration: 0.3, ease: 'back.out(2)' })
```

---

### STATS COUNTER
```
BG: #111111 | Text: #FFFFFF  ← only dark section on homepage
4 stats: 50,000+ Customers | 200+ Brands | 1 Year Warranty | 4.8★ Rating

Entry:
gsap.from('.stat-item', {
  opacity: 0, y: 30, stagger: 0.1, duration: 0.6, ease: 'power2.out',
  scrollTrigger: { trigger: '.stats-section', start: 'top 80%', once: true }
})

Counter:
gsap.to({ val: 0 }, {
  val: 50000, duration: 2, ease: 'power1.out',
  scrollTrigger: { trigger: '.stats-section', start: 'top 75%', once: true },
  onUpdate() { el.textContent = Math.round(this.targets()[0].val).toLocaleString('en-IN') + '+' }
})
```

---

### NEWSLETTER
```
BG: #F7F7F5 | Contained white card (max-w 600px, radius 16px, border #E8E8E6)

Entry:
gsap.from('.newsletter-card', {
  opacity: 0, y: 60, scale: 0.96, duration: 0.7, ease: 'power3.out',
  scrollTrigger: { trigger: '.newsletter', start: 'top 82%', once: true }
})

Submit success:
gsap.to(form,       { opacity: 0, y: -20, duration: 0.4, ease: 'power2.in',
  onComplete: () => {
    gsap.from(successMsg, { opacity: 0, y: 20, duration: 0.5, ease: 'back.out(1.5)' })
  }
})
+ canvas-confetti burst
```

---

---

# ═══════════════════════════════════════
# PAGE 4 — PRODUCT LISTING PAGE (PLP)
# ═══════════════════════════════════════

```
BG: #FFFFFF

LEFT SIDEBAR (280px, sticky):
  Filter by: Price slider | Frame Shape | Brand | Color | Gender | Lens | Width | Rating
  [Apply] [Clear All]
  Mobile → bottom sheet:
    gsap.to(sheet,   { y: 0, duration: 0.45, ease: 'power3.out' })
    gsap.to(overlay, { opacity: 1, duration: 0.3 })

RIGHT: Breadcrumb | Sort | Grid toggle | Product grid | Pagination

GSAP:
// Page load stagger
gsap.from('.product-card', {
  opacity: 0, y: 50, duration: 0.6, ease: 'power3.out',
  stagger: { amount: 0.8, from: 'start' },
  scrollTrigger: { trigger: '.plp-grid', start: 'top 85%', once: true }
})

// Filter change → Flip
const applyFilter = () => {
  const state = Flip.getState('.product-card')
  filterProducts()
  Flip.from(state, {
    duration: 0.5, ease: 'power2.inOut', stagger: 0.03, absolute: true,
    onLeave: els => gsap.to(els,   { opacity: 0, scale: 0.9, duration: 0.25 }),
    onEnter: els => gsap.from(els, { opacity: 0, scale: 0.9, duration: 0.35 })
  })
}
```

---

---

# ═══════════════════════════════════════
# PAGE 5 — PRODUCT DETAIL PAGE (PDP)
# ═══════════════════════════════════════

```
BG: #FFFFFF

LEFT 50%  — IMAGE GALLERY (GSAP pin while info scrolls)
RIGHT 50% — PRODUCT INFO (scrolls)

GALLERY: Main image + thumbnails + [View 360°] button

INFO: Brand | Name (H1) | Stars | Price | Frame Color | Size | Lens Type
      Prescription Form (for RX) | Qty stepper
      [Add to Cart] [Wishlist] [Buy Now]
      Delivery checker | Return/Warranty badges

BELOW: Tabs — Description | Specs | Reviews | Size Guide
BELOW: Combo Suggestions | You Might Also Like

GSAP:
// Pin image gallery
ScrollTrigger.create({
  trigger: '.pdp-layout', start: 'top top+=64',
  end: 'bottom bottom', pin: '.pdp-image-col', pinSpacing: false
})

// Page entry
const tl = gsap.timeline()
tl.from('.pdp-image-col', { x: -40, opacity: 0, duration: 0.8, ease: 'power3.out' })
  .from('.pdp-info > *',  { y: 30,  opacity: 0, stagger: 0.08, duration: 0.5 }, '-=0.4')

// Image swap on thumbnail click
const swapImage = (src) => {
  gsap.to('.main-image', { opacity: 0, scale: 1.02, duration: 0.2,
    onComplete: () => {
      mainImg.src = src
      gsap.to('.main-image', { opacity: 1, scale: 1, duration: 0.3 })
    }
  })
}

// Swatch selection
gsap.to(activeSwatch, { scale: 1.15, duration: 0.2, ease: 'back.out(1.5)' })

// Prescription form slide open
gsap.from('.rx-form', { y: 30, opacity: 0, height: 0, duration: 0.5, ease: 'power2.out' })
```

## COMBO SUGGESTIONS
```
Title: "Complete Your Look"
Horizontal scrollable cards (each: product A + B + optional case, combo price, [Add Combo])

GSAP:
gsap.from('.combo-card', {
  opacity: 0, x: 60, duration: 0.6, stagger: 0.1, ease: 'power3.out',
  scrollTrigger: { trigger: '.combo-section', start: 'top 82%', once: true }
})

Toast on "Add Combo":
gsap.fromTo(toast, { x: 120, opacity: 0 }, { x: 0, opacity: 1, duration: 0.4, ease: 'back.out(1.5)' })
gsap.to(progressBar, { scaleX: 0, duration: 4, ease: 'none', transformOrigin: 'left',
  onComplete: () => gsap.to(toast, { x: 120, opacity: 0, duration: 0.3 })
})
```

---

---

# ═══════════════════════════════════════
# PAGE 6 — CART PAGE
# ═══════════════════════════════════════

```
BG: #F7F7F5

LEFT 65%: Cart items | RIGHT 35%: Order summary (sticky)

GSAP:
// Stagger on load
gsap.from('.cart-item', { opacity: 0, y: 30, stagger: 0.08, duration: 0.5, ease: 'power2.out' })

// Remove item
const removeItem = (item) => {
  gsap.to(item, { x: -80, opacity: 0, height: 0, marginBottom: 0,
    padding: 0, duration: 0.4, ease: 'power2.in', onComplete: () => item.remove() })
}

// Qty flip: use flipNumber() pattern
// Empty state:
gsap.from('.empty-cart-illustration', { scale: 0.85, opacity: 0, duration: 0.6, ease: 'back.out(1.5)' })
```

---

---

# ═══════════════════════════════════════
# FOOTER — MARKETING GALLERY FOOTER
# ═══════════════════════════════════════

## PART A — GALLERY STATEMENT
```
BG: #F7F7F5 | Height: 80-90vh | Max-width 1200px centered

ELEMENTS:
  Watermark:   "VISION" — 200px DM Sans 600, #1A1A1A, opacity 0.04, absolute center
  Pill label:  "EST. [YEAR]  ·  [CITY], INDIA" — border #D0D0CC, bg white
  Line 1:      "The World's Finest" — DM Serif Display 40px italic
  Line 2:      "EYEWEAR" — DM Sans 100px 600 #111111
  Line 3:      "crafted for those who see differently." — DM Serif Display 24px italic #555
  Products:    5 product images, grayscale → color on hover, staggered heights
  CTAs:        [Shop the Collection] primary | [Book an Eye Test] pill outline
  Trust badges: 50,000+ Customers · 1 Year Warranty · Free Delivery ₹999+

GSAP (all in gsap.context on footer):
  Watermark: gsap.from('.footer-watermark', { opacity: 0, scale: 0.95, duration: 1, scrollTrigger: {...} })
  Pill:      gsap.from('.footer-label',     { opacity: 0, y: 20, duration: 0.6, delay: 0.2, scrollTrigger: {...} })
  Line 1:    gsap.from('.footer-line1',     { x: -60, opacity: 0, duration: 0.8, scrollTrigger: {...} })
  Line 2 SplitText:
    const split = new SplitText('.footer-eyewear', { type: 'chars' })
    gsap.from(split.chars, { opacity: 0, y: 60, scale: 0.7, duration: 0.6, stagger: 0.04,
      ease: 'back.out(1.5)', scrollTrigger: { trigger: '.footer-gallery', start: 'top 78%', once: true } })
  Line 3:    gsap.from('.footer-line3',    { opacity: 0, y: 20, duration: 0.6, scrollTrigger: {...} })
  Products odd:  gsap.from('.footer-product:nth-child(odd)',  { y: 60,  opacity: 0, stagger: 0.1, ... })
  Products even: gsap.from('.footer-product:nth-child(even)', { y: -40, opacity: 0, stagger: 0.1, ... })
  CTAs: gsap.from('.footer-cta > *', { opacity: 0, y: 20, stagger: 0.12, ... })

  Product image hover:
  gsap.to(img, { filter: 'grayscale(0)', y: -10, boxShadow: '0 12px 40px rgba(0,0,0,0.12)', duration: 0.35 })
  gsap.to(img, { filter: 'grayscale(1)', y: 0, boxShadow: 'none', duration: 0.4 })  // on leave
```

## PART B — MARQUEE STRIP
```
BG: #1A1A1A | Text: rgba(255,255,255,0.7) | Height: 44px
GSAP: gsap.to('.footer-marquee-track', { xPercent: -50, duration: 20, ease: 'none', repeat: -1 })
```

## PART C — UTILITY FOOTER
```
BG: #111111 | Text: rgba(255,255,255,0.7)
5-column grid: Brand | Shop | Help | Company | Contact
Bottom bar: © 2025 [Brand]. | Payment icons (Visa, Mastercard, UPI, GPay, PhonePe)

GSAP:
gsap.from('.footer-col', {
  opacity: 0, y: 40, stagger: 0.08, duration: 0.6, ease: 'power2.out',
  scrollTrigger: { trigger: '.utility-footer', start: 'top 90%', once: true }
})
```

---

## FLOATING WHATSAPP BUTTON
```
Fixed: bottom 28px, right 28px, z-index 9990
Style: 56px circle, #25D366, white WhatsApp SVG 28px

GSAP pulse:
gsap.to('.wa-btn', {
  boxShadow: '0 0 0 16px rgba(37,211,102,0)',
  duration: 1.5, ease: 'power1.out', repeat: -1,
  onRepeat() { gsap.set(this.targets()[0], { boxShadow: '0 0 0 0 rgba(37,211,102,0.5)' }) }
})

Hover → expand to pill:
gsap.to('.wa-btn', { width: 160, borderRadius: 28, duration: 0.3, ease: 'power2.out' })
gsap.from('.wa-label', { opacity: 0, x: -10, duration: 0.25 })

Cursor state on this button: ring 80px, rgba(37,211,102,0.4) tinted border
```

---

---

# ═══════════════════════════════════════
# GSAP PAGE TRANSITIONS
# ═══════════════════════════════════════

```javascript
// Standard route change — fade + slight Y
const pageEnter = (el) => {
  gsap.from(el, { opacity: 0, y: 24, duration: 0.5, ease: 'power2.out', clearProps: 'all' })
}
const pageLeave = (el, done) => {
  gsap.to(el, { opacity: 0, y: -16, duration: 0.3, ease: 'power2.in', onComplete: done })
}

// Major transition (Landing → Auth) — curtain wipe
const curtainTransition = (to) => {
  const curtain = document.querySelector('.page-curtain')  // white full-screen div
  gsap.timeline()
    .fromTo(curtain, { scaleY: 0, transformOrigin: 'bottom' }, { scaleY: 1, duration: 0.4, ease: 'power3.in' })
    .call(() => router.push(to))
    .fromTo(curtain, { transformOrigin: 'top', scaleY: 1 }, { scaleY: 0, duration: 0.4, ease: 'power3.out' })
}
```

---

---

# ═══════════════════════════════════════
# LOADING SCREEN (GSAP)
# ═══════════════════════════════════════

```javascript
// White full-screen loader shown on initial app load
const runLoader = () => {
  const split = new SplitText('#loader-brand', { type: 'chars' })
  const tl = gsap.timeline({
    onComplete: () => {
      gsap.to('#loader', { opacity: 0, duration: 0.5, onComplete: () => loader.remove() })
    }
  })

  tl.from(split.chars, { opacity: 0, y: 20, stagger: 0.05, duration: 0.4, ease: 'power2.out' })
    .to('#loader-bar',   { scaleX: 1, duration: 1.2, ease: 'power1.inOut', transformOrigin: 'left' }, '-=0.2')
    .from('#loader-tag', { opacity: 0, duration: 0.4 }, '-=0.3')
}
```

---

---

# ═══════════════════════════════════════
# TOAST NOTIFICATIONS (GSAP)
# ═══════════════════════════════════════

```javascript
const showToast = ({ type, message }) => {
  const toast = createToastElement(type, message)  // creates DOM element
  document.body.appendChild(toast)

  gsap.fromTo(toast,
    { x: 120, opacity: 0 },
    { x: 0, opacity: 1, duration: 0.4, ease: 'back.out(1.5)' }
  )
  gsap.to(toast.querySelector('.toast-progress'), {
    scaleX: 0, transformOrigin: 'left', duration: 4, ease: 'none',
    onComplete: () => dismissToast(toast)
  })
}

const dismissToast = (toast) => {
  gsap.to(toast, { x: 120, opacity: 0, duration: 0.3, ease: 'power2.in',
    onComplete: () => toast.remove() })
}
// Toast types: success (green border) | info (#1A1A1A border) | error (red border)
// Position: fixed bottom-right, stack upward, max 3 visible
```

---

---

# ═══════════════════════════════════════
# RESPONSIVE
# ═══════════════════════════════════════

```
xs:  < 480px   Mobile small. Cursor DISABLED. All GSAP still active.
sm:  480-640px  Mobile. Single column. Hamburger nav.
md:  640-1024px Tablet. 2-col grids. Condensed nav.
lg:  1024-1280px Laptop. Full layout.
xl:  > 1280px   Desktop. Max-width 1200px centered.

Responsive font sizes:
  Hero H1:       72px → 48px → 36px
  Section title: 48px → 36px → 28px

GSAP on mobile:
  Cursor:          DISABLED via @media (pointer: coarse)
  All animations:  ACTIVE (GSAP works perfectly on mobile)
  ScrollSmoother:  smooth: 0.8 on mobile (lighter)
  SplitText:       Active — works on mobile
  Marquees:        Slightly reduced speed on mobile (duration * 1.5)

// Responsive GSAP example using gsap.matchMedia:
const mm = gsap.matchMedia()
mm.add('(min-width: 1024px)', () => {
  // desktop-only animations (e.g. mouse parallax, cursor)
})
mm.add('(max-width: 1023px)', () => {
  // mobile-specific tweaks
})

window.addEventListener('resize', () => ScrollTrigger.refresh())
```

---

---

# ═══════════════════════════════════════
# PERFORMANCE
# ═══════════════════════════════════════

```
GSAP RULES:
  - Use gsap.context() in every React component → auto-cleanup on unmount
  - Animate ONLY transform + opacity (not layout properties)
  - Use gsap.quickSetter for mousemove / high-frequency updates
  - Use ScrollTrigger.batch() for large card lists
  - Kill all ScrollTriggers: ctx.revert() in useEffect cleanup
  - SplitText.revert() to restore DOM on unmount
  - markers: false in all ScrollTriggers before production

ScrollTrigger.batch for product grids:
ScrollTrigger.batch('.product-card', {
  onEnter: els => gsap.from(els, { opacity: 0, y: 50, stagger: 0.08, duration: 0.6, ease: 'power3.out' }),
  start: 'top 88%', once: true
})

General:
  Code split: React.lazy + Suspense per route
  Images: WebP, lazy-loaded, blur placeholder
  Fonts: preload DM Sans + DM Serif Display in <head>
  Target: Lighthouse 90+ Performance, 100 Accessibility
```

---

---

# ═══════════════════════════════════════
# FILE STRUCTURE
# ═══════════════════════════════════════

```
/src
  /gsap
    gsap.config.js        ← plugin registration + ScrollSmoother init
    animations.js         ← reusable GSAP timeline functions
    cursorSystem.js       ← entire cursor module (quickSetter + 6 states)
    scrollAnimations.js   ← all ScrollTrigger configs
    pageTransitions.js    ← route change curtain + fade

  /components
    /cursor               ← CursorDot.jsx, CursorRing.jsx
    /navbar               ← Navbar.jsx, MegaMenu.jsx, MobileDrawer.jsx
    /hero                 ← HeroLanding.jsx, ParticleCanvas.jsx
    /auth                 ← AuthPage.jsx, OTPInput.jsx, GoogleAuthButton.jsx
    /products             ← ProductCard.jsx, ProductGrid.jsx, ProductCarousel.jsx
    /pdp                  ← ProductDetail.jsx, ImageGallery.jsx
                          ← ComboSuggestions.jsx, PrescriptionForm.jsx
    /plp                  ← ProductListing.jsx, FilterSidebar.jsx, FilterSheet.jsx
    /cart                 ← CartPage.jsx, CartItem.jsx, OrderSummary.jsx
    /profile              ← ProfilePage.jsx, SavedPrescriptions.jsx
    /ui                   ← Button.jsx, Badge.jsx
                          ← Toast.jsx (GSAP-powered)
                          ← Skeleton.jsx, Modal.jsx, Drawer.jsx
                          ← OTPBox.jsx, CountdownTimer.jsx, Loader.jsx
    /sections             ← MarqueeStrip.jsx, BrandStrip.jsx, Newsletter.jsx
                          ← WhyChooseUs.jsx, Testimonials.jsx, OfferBanner.jsx
                          ← StatsCounter.jsx, CategoryGrid.jsx
    /footer               ← FooterGallery.jsx, FooterMarquee.jsx
                          ← UtilityFooter.jsx, FloatingWhatsApp.jsx

  /pages
    LandingPage.jsx
    AuthPage.jsx
    HomePage.jsx
    ShopPage.jsx          ← PLP
    ProductPage.jsx       ← PDP
    CartPage.jsx
    ProfilePage.jsx

  /hooks
    useGSAP.js            ← context-safe hook for React + GSAP
    useCart.js
    useWishlist.js
    useAuth.js
    useScrollDirection.js
    useCountdown.js

  /context
    AuthContext.jsx
    CartContext.jsx
    WishlistContext.jsx

  /styles
    globals.css           ← cursor: none for desktop, scrollbar style, body bg #fff
    typography.css        ← DM Sans + DM Serif utility classes

  main.jsx                ← GSAP plugin register + ScrollSmoother wrapper
  App.jsx                 ← Routes + page transition + cursor render
```

---

*BUILD ORDER:*
*1. gsap.config.js → 2. cursorSystem.js → 3. LandingPage → 4. AuthPage*
*5. HomePage (all sections) → 6. PLP → 7. PDP → 8. Cart → 9. Footer*

*RULE: Every animation in this project uses GSAP.*
*No Framer Motion. No AOS. No Lenis. No CSS transition for anything complex.*
*GSAP ScrollSmoother + ScrollTrigger = ALL scroll behavior.*
*GSAP quickSetter + ticker = cursor.*
*GSAP Flip = all layout transitions.*
*GSAP SplitText = all headline animations.*