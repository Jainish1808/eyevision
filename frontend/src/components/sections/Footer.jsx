import React, { useRef } from 'react'
import { useGSAP } from '../../hooks/useGSAP'
import { marqueeScroll } from '../../gsap/animations'
import gsap from 'gsap'
import { Instagram, Twitter, Facebook, ArrowUpRight } from 'lucide-react'

export function Footer() {
  const containerRef = useRef(null)
  const marqueeRef = useRef(null)

  useGSAP(() => {
    // Reveal animation
    gsap.from('.footer-col > *', {
      opacity: 0,
      y: 20,
      stagger: 0.05,
      duration: 0.5,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 85%',
        once: true
      }
    })

    // Big Marquee at bottom
    if (marqueeRef.current) {
        marqueeScroll(marqueeRef.current, { duration: 40 })
    }
  }, [])

  return (
    <footer ref={containerRef} className="relative overflow-hidden bg-dark-section pt-24 text-text-on-dark pb-[180px]">
      <div className="container-main mx-auto grid grid-cols-1 gap-12 border-b border-white/10 pb-16 md:grid-cols-2 lg:grid-cols-4">
        
        {/* Col 1 */}
        <div className="footer-col flex flex-col gap-6 lg:col-span-1">
           <h3 className="text-xl font-bold font-serif text-white">VISION</h3>
           <p className="text-sm text-text-on-dark-muted max-w-[250px]">
             Crafting premium eyewear for those who see the world differently. Designed in Italy.
           </p>
           <div className="flex gap-4">
              <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 transition-colors hover:bg-accent-primary hover:text-white">
                 <Instagram size={18} />
              </a>
              <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 transition-colors hover:bg-accent-primary hover:text-white">
                 <Twitter size={18} />
              </a>
              <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 transition-colors hover:bg-accent-primary hover:text-white">
                 <Facebook size={18} />
              </a>
           </div>
        </div>

        {/* Col 2 */}
        <div className="footer-col flex flex-col gap-4">
           <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Shop</h4>
           <a href="/shop" data-cursor="link" className="w-max text-sm text-text-on-dark-muted transition-colors hover:text-white flex items-center gap-1 group">
             All Products <ArrowUpRight size={14} className="opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all"/>
           </a>
           <a href="/shop?category=sunglasses" data-cursor="link" className="w-max text-sm text-text-on-dark-muted transition-colors hover:text-white">Sunglasses</a>
           <a href="/shop?category=computer" data-cursor="link" className="w-max text-sm text-text-on-dark-muted transition-colors hover:text-white">Computer Glasses</a>
           <a href="/shop?category=reading" data-cursor="link" className="w-max text-sm text-text-on-dark-muted transition-colors hover:text-white">Reading Glasses</a>
        </div>

        {/* Col 3 */}
        <div className="footer-col flex flex-col gap-4">
           <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Support</h4>
           <a href="#" data-cursor="link" className="w-max text-sm text-text-on-dark-muted transition-colors hover:text-white">Help Center</a>
           <a href="#" data-cursor="link" className="w-max text-sm text-text-on-dark-muted transition-colors hover:text-white">Track Order</a>
           <a href="#" data-cursor="link" className="w-max text-sm text-text-on-dark-muted transition-colors hover:text-white">Returns & Exchanges</a>
           <a href="#" data-cursor="link" className="w-max text-sm text-text-on-dark-muted transition-colors hover:text-white">Warranty</a>
        </div>

        {/* Col 4 */}
        <div className="footer-col flex flex-col gap-4">
           <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Contact</h4>
           <p className="text-sm text-text-on-dark-muted">hello@vision.com</p>
           <p className="text-sm text-text-on-dark-muted">+1 (800) 123-4567</p>
        </div>

      </div>

      <div className="container-main mx-auto mt-8 flex flex-col items-center justify-between gap-4 text-xs text-text-on-dark-muted md:flex-row">
         <p>© 2026 Vision Boutique. All rights reserved.</p>
         <div className="flex gap-6">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
         </div>
      </div>

      {/* Giant Background Marquee */}
      <div className="absolute bottom-[-18%] left-0 flex w-full overflow-hidden opacity-[0.03] pointer-events-none select-none">
         <div ref={marqueeRef} className="flex whitespace-nowrap text-gallery-watermark">
            <span className="px-8">VISION</span>
            <span className="px-8 text-gallery-serif">VISION</span>
            <span className="px-8">VISION</span>
            <span className="px-8 text-gallery-serif">VISION</span>
         </div>
      </div>
    </footer>
  )
}

export default Footer
