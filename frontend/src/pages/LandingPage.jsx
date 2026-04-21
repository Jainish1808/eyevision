import React, { useEffect } from 'react'
import { Navbar } from '../components/navbar/Navbar'
import { HeroLanding } from '../components/hero/HeroLanding'
import { useScrollDirection } from '../hooks/useScrollDirection'
import { pageEnter, pageLeave } from '../gsap/pageTransitions'

export function LandingPage() {
  const containerRef = React.useRef(null)

  useEffect(() => {
    // Initial page enter animation
    pageEnter(containerRef.current)
    return () => {
      pageLeave(containerRef.current)
    }
  }, [])

  return (
    <div ref={containerRef} className="page-container">
      <Navbar isTransparent={true} />
      <main>
        <HeroLanding />
      </main>
    </div>
  )
}

export default LandingPage
