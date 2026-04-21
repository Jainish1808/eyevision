import React, { useEffect, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '../../hooks/useGSAP'

const CountdownTimer = ({ targetDate }) => {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date().getTime()
      const distance = new Date(targetDate).getTime() - now

      if (distance > 0) {
        setTime({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        })
      }
    }

    updateTimer()
    const timer = setInterval(updateTimer, 1000)
    return () => clearInterval(timer)
  }, [targetDate])

  const TimerUnit = ({ label, value }) => (
    <div className="flex flex-col items-center">
      <div className="text-2xl font-bold text-accent-primary mb-1">{String(value).padStart(2, '0')}</div>
      <span className="caption text-text-muted">{label}</span>
    </div>
  )

  return (
    <div className="flex items-center gap-4">
      <TimerUnit label="Days" value={time.days} />
      <span className="text-accent-primary text-2xl">:</span>
      <TimerUnit label="Hours" value={time.hours} />
      <span className="text-accent-primary text-2xl">:</span>
      <TimerUnit label="Min" value={time.minutes} />
      <span className="text-accent-primary text-2xl">:</span>
      <TimerUnit label="Sec" value={time.seconds} />
    </div>
  )
}

export default CountdownTimer
