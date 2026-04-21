/**
 * useScrollDirection — detect scroll up/down for navbar behavior
 */
import { useState, useEffect } from 'react'

export function useScrollDirection(threshold = 10) {
  const [scrollDir, setScrollDir] = useState('up')
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    let lastY = window.scrollY
    let ticking = false

    const updateScrollDir = () => {
      const currentY = window.scrollY
      if (Math.abs(currentY - lastY) < threshold) {
        ticking = false
        return
      }
      setScrollDir(currentY > lastY ? 'down' : 'up')
      setScrollY(currentY)
      lastY = currentY > 0 ? currentY : 0
      ticking = false
    }

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollDir)
        ticking = true
      }
    }

    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [threshold])

  return { scrollDir, scrollY }
}

export default useScrollDirection
