import React, { useRef, useEffect } from 'react'
import gsap from 'gsap'

export function OTPInput({ length = 6, onComplete }) {
  const containerRef = useRef(null)
  const inputsRef = useRef([])

  useEffect(() => {
    // Initial animation for inputs
    gsap.from(inputsRef.current, {
      y: 20,
      opacity: 0,
      stagger: 0.1,
      duration: 0.4,
      ease: 'back.out(1.5)'
    })
  }, [])

  const handleChange = (e, index) => {
    const value = e.target.value
    if (!/^[0-9]*$/.test(value)) return // Only numbers allowed
    
    // Animate box on fill
    if (value) {
      gsap.to(inputsRef.current[index], {
        scale: 1.08,
        duration: 0.1,
        yoyo: true,
        repeat: 1
      })
    }
    
    if (value.length === 1 && index < length - 1) {
      inputsRef.current[index + 1].focus()
    }

    // Check if complete
    const otp = inputsRef.current.map(input => input.value).join('')
    if (otp.length === length && onComplete) {
      onComplete(otp)
    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !e.target.value && index > 0) {
      inputsRef.current[index - 1].focus()
    }
  }

  const handleFocus = (index) => {
    gsap.to(inputsRef.current[index], { borderColor: '#1A1A1A', duration: 0.15 })
  }

  const handleBlur = (index) => {
    if (!inputsRef.current[index].value) {
        gsap.to(inputsRef.current[index], { borderColor: '#E8E8E6', duration: 0.15 })
    }
  }

  return (
    <div ref={containerRef} className="flex gap-3 justify-center">
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => (inputsRef.current[index] = el)}
          className="h-12 w-12 rounded-lg border border-border-default bg-input-bg text-center text-lg font-semibold text-text-primary outline-none transition-shadow focus:border-accent-primary focus:bg-white focus:ring-2 focus:ring-accent-primary/20"
          type="text"
          maxLength={1}
          inputMode="numeric"
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onFocus={() => handleFocus(index)}
          onBlur={() => handleBlur(index)}
          data-cursor="text"
        />
      ))}
    </div>
  )
}

export default OTPInput
