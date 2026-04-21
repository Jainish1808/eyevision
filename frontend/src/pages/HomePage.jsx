import React, { useEffect, useRef } from 'react'
import { Navbar } from '../components/navbar/Navbar'
import { MarqueeStrip } from '../components/sections/MarqueeStrip'
import { HomeBanner } from '../components/sections/HomeBanner'
import { TrendingProducts } from '../components/sections/TrendingProducts'
import { OfferBanner } from '../components/sections/OfferBanner'
import { CategoryGrid } from '../components/sections/CategoryGrid'
import { BrandStrip } from '../components/sections/BrandStrip'
import { StatsCounter } from '../components/sections/StatsCounter'
import { Newsletter } from '../components/sections/Newsletter'
import { NewArrivals } from '../components/sections/NewArrivals'
import { WhyChooseUs } from '../components/sections/WhyChooseUs'
import { Testimonials } from '../components/sections/Testimonials'

import { pageEnter, pageLeave } from '../gsap/pageTransitions'
import { productAPI } from '../services/api'

export function HomePage() {
  const containerRef = useRef(null)
  const [categories, setCategories] = React.useState([])
  const [trendingProducts, setTrendingProducts] = React.useState([])
  const [newArrivals, setNewArrivals] = React.useState([])

  useEffect(() => {
    pageEnter(containerRef.current)

    const loadHomeData = async () => {
      try {
        const [categoriesRes, trendingRes, arrivalsRes] = await Promise.all([
          productAPI.getCategories(),
          productAPI.getTrending(10),
          productAPI.getNewArrivals(10)
        ])

        setCategories(categoriesRes.data || [])
        setTrendingProducts(trendingRes.data || [])
        setNewArrivals(arrivalsRes.data || [])
      } catch (error) {
        console.error('Failed to load home data', error)
      }
    }

    loadHomeData()

    return () => {
      pageLeave(containerRef.current)
    }
  }, [])

  return (
    <div ref={containerRef} className="page-container relative bg-page-bg">
      <Navbar />
      
      <main className="pt-16">
        <MarqueeStrip />
        <HomeBanner />
        <CategoryGrid categories={categories} />
        <TrendingProducts products={trendingProducts} />
        <OfferBanner />
        <NewArrivals products={newArrivals} />
        <BrandStrip />
        <WhyChooseUs />
        <Testimonials />
        <StatsCounter />
        <Newsletter />
      </main>

    </div>
  )
}

export default HomePage
