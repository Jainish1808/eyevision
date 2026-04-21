import React, { useRef, useState } from 'react'
import gsap from 'gsap'

export function ImageGallery({ images = [] }) {
  const defaultImages = [
    'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=1200',
    'https://images.unsplash.com/photo-1577803645773-f96470509666?q=80&w=1200',
    'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=1200',
    'https://images.unsplash.com/photo-1577803645773-f96470509666?q=80&w=1200',
  ]
  const displayImages = images.length ? images : defaultImages
  
  const [activeImg, setActiveImg] = useState(displayImages[0])
  const mainImgRef = useRef(null)

  const swapImage = (src) => {
    if (src === activeImg) return

    gsap.to(mainImgRef.current, {
      opacity: 0,
      scale: 1.02,
      duration: 0.2,
      onComplete: () => {
        setActiveImg(src)
        gsap.to(mainImgRef.current, { opacity: 1, scale: 1, duration: 0.3 })
      }
    })
  }

  return (
    <div className="flex select-none gap-6 lg:h-[calc(100vh-140px)]">
      {/* Thumbnails (Vertical on desktop) */}
      <div className="hidden w-20 flex-col gap-4 lg:flex">
        {displayImages.map((src, idx) => (
          <button
            key={idx}
            onClick={() => swapImage(src)}
            className={`overflow-hidden rounded-lg border-2 bg-section-alt transition-colors ${
              activeImg === src ? 'border-accent-primary' : 'border-transparent hover:border-border-strong'
            }`}
          >
            <img src={src} alt="thumbnail" className="aspect-square w-full object-cover mix-blend-multiply" />
          </button>
        ))}
      </div>

      {/* Main Image */}
      <div 
        className="relative flex-1 overflow-hidden rounded-2xl bg-section-alt"
        data-cursor="image"
      >
        <img
          ref={mainImgRef}
          src={activeImg}
          alt="Product Main"
          className="h-full w-full object-cover main-image"
        />
        
        {/* Virtual Try On Button (Stub) */}
        <button className="absolute bottom-6 left-1/2 flex h-12 -translate-x-1/2 items-center justify-center gap-2 rounded-full bg-white/90 px-6 font-semibold text-text-primary shadow-glass backdrop-blur-md transition-transform hover:scale-105">
          <span className="text-xl">📱</span> Try On Vertually
        </button>
      </div>

      {/* Mobile Thumbnails */}
      <div className="mt-4 flex gap-4 overflow-x-auto pb-4 lg:hidden">
         {displayImages.map((src, idx) => (
          <button
            key={idx}
            onClick={() => swapImage(src)}
            className={`shrink-0 overflow-hidden rounded-lg border-2 bg-section-alt transition-colors w-20 ${
              activeImg === src ? 'border-accent-primary' : 'border-transparent hover:border-border-strong'
            }`}
          >
            <img src={src} alt="thumbnail" className="aspect-square w-full object-cover mix-blend-multiply" />
          </button>
        ))}
      </div>
    </div>
  )
}

export default ImageGallery
