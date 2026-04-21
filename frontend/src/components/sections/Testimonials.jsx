import React, { useRef } from 'react'
import { useGSAP } from '../../hooks/useGSAP'
import { manualSplitText } from '../../gsap/animations'
import gsap from 'gsap'
import { Star } from 'lucide-react'

// Swiper
import { Swiper, SwiperSlide } from 'swiper/react'
import { EffectCoverflow, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/effect-coverflow'
import 'swiper/css/pagination'

export function Testimonials() {
  const containerRef = useRef(null)
  const titleRef = useRef(null)

  const reviews = [
    { text: "Best pair of glasses I've ever owned. The frame is incredibly light but feels very sturdy. Customer service was excellent.", author: "Sarah Jenkins", role: "Designer", rating: 5 },
    { text: "I was skeptical about buying glasses online, but the virtual try-on and size guide made it perfect. Crystal clear lenses.", author: "Michael Chen", role: "Software Engineer", rating: 5 },
    { text: "The titanium frames are a game changer. I forget I'm even wearing them. Super fast delivery too.", author: "Emma Thompson", role: "Architect", rating: 4 },
    { text: "Great quality for the price. The blue light blocking is noticeably better than my previous pair. Will buy again.", author: "David Patel", role: "Consultant", rating: 5 },
  ]

  useGSAP(() => {
    // Title split animation
    const split = manualSplitText(titleRef.current, 'words')
    gsap.from(split.words, {
      opacity: 0,
      y: 30,
      stagger: 0.07,
      duration: 0.6,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 82%',
        once: true
      }
    })

    // Star entry
    gsap.from('.star-icon', {
      scale: 0,
      opacity: 0,
      stagger: 0.08,
      duration: 0.3,
      ease: 'back.out(2)',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 80%',
        once: true
      }
    })

    return () => split.revert()
  }, [])

  return (
    <section ref={containerRef} className="testimonials bg-white px-6 py-24 overflow-hidden">
      <div className="container-main mx-auto mb-16 text-center">
        <h2 ref={titleRef} className="text-section-title testimonials-title mb-4">Don't Just Take Our Word</h2>
        <p className="text-section-sub">See what our customers have to say about their vision experience.</p>
      </div>

      <div className="mx-auto max-w-5xl">
        <Swiper
          effect={'coverflow'}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={'auto'}
          initialSlide={1}
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 100,
            modifier: 2,
            slideShadows: false,
          }}
          pagination={{ clickable: true }}
          modules={[EffectCoverflow, Pagination]}
          className="w-full pb-16"
        >
          {reviews.map((review, idx) => (
            <SwiperSlide key={idx} className="max-w-[400px]">
              <div className="flex h-full flex-col rounded-[16px] border border-border-default bg-card-surface p-8 shadow-sm">
                <div className="mb-6 flex gap-1 text-yellow-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star 
                      key={i} 
                      className={`star-icon ${i < review.rating ? 'fill-current' : 'text-border-strong'}`} 
                      size={20} 
                    />
                  ))}
                </div>
                <p className="mb-8 flex-1 text-lg italic text-text-primary">"{review.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-primary text-xl font-bold text-white">
                    {review.author.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-text-primary">{review.author}</h4>
                    <p className="text-xs text-text-muted">{review.role}</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
}

export default Testimonials
