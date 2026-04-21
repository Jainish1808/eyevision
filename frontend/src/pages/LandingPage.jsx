import React, { useEffect } from 'react'
import { Navbar } from '../components/navbar/Navbar'
import { HeroLanding } from '../components/hero/HeroLanding'
import { CategoryGrid } from '../components/sections/CategoryGrid'
import { MarqueeStrip } from '../components/sections/MarqueeStrip'
import { HomeBanner } from '../components/sections/HomeBanner'
import { TrendingProducts } from '../components/sections/TrendingProducts'
import { OfferBanner } from '../components/sections/OfferBanner'
import { BrandStrip } from '../components/sections/BrandStrip'
import { StatsCounter } from '../components/sections/StatsCounter'
import { Newsletter } from '../components/sections/Newsletter'
import { NewArrivals } from '../components/sections/NewArrivals'
import { WhyChooseUs } from '../components/sections/WhyChooseUs'
import { Testimonials } from '../components/sections/Testimonials'
import { useAuth } from '../context/AuthContext'
import { useScrollDirection } from '../hooks/useScrollDirection'
import { pageEnter, pageLeave } from '../gsap/pageTransitions'
import { productAPI } from '../services/api'

export function LandingPage() {
  const containerRef = React.useRef(null)
  const { isAuthenticated } = useAuth()
  
  const [categories, setCategories] = React.useState([
    { id: '1', name: 'Normal Specs', slug: 'normal-specs', icon: '👓', description: 'Everyday eyewear for clear vision' },
    { id: '2', name: 'Sunglasses', slug: 'sunglasses', icon: '🕶️', description: 'Stylish protection from the sun' },
    { id: '3', name: 'Lenses', slug: 'lenses', icon: '🔍', description: 'Premium lenses for all needs' },
    { id: '4', name: 'Number Glasses', slug: 'number-glasses', icon: '📖', description: 'Prescription eyewear' },
    { id: '5', name: 'Cases', slug: 'cases', icon: '💼', description: 'Protect your eyewear' }
  ])
  
  const [trendingProducts, setTrendingProducts] = React.useState([])
  const [newArrivals, setNewArrivals] = React.useState([])

  useEffect(() => {
    // Initial page enter animation
    pageEnter(containerRef.current)
    return () => {
      pageLeave(containerRef.current)
    }
  }, [])

  useEffect(() => {
    // Load products only if authenticated
    if (isAuthenticated) {
      const loadHomeData = async () => {
        try {
          const [categoriesRes, trendingRes, arrivalsRes] = await Promise.all([
            productAPI.getCategories(),
            productAPI.getTrending(10),
            productAPI.getNewArrivals(10)
          ])

          if (categoriesRes.data && categoriesRes.data.length > 0) {
            setCategories(categoriesRes.data)
          }
          setTrendingProducts(trendingRes.data || [])
          setNewArrivals(arrivalsRes.data || [])
        } catch (error) {
          console.error('Failed to load home data', error)
        }
      }

      loadHomeData()
    }
  }, [isAuthenticated])

  return (
    <div ref={containerRef} className="page-container">
      <Navbar isTransparent={!isAuthenticated} />
      
      <main>
        {!isAuthenticated ? (
          // Guest view - Hero + Categories
          <>
            <HeroLanding />
            <div className="home-categories bg-page-bg py-20">
              <CategoryGrid categories={categories} />
            </div>
          </>
        ) : (
          // Authenticated view - Full home page
          <>
            <div className="pt-16">
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
            </div>
          </>
        )}
      </main>
    </div>
  )
}

export default LandingPage
