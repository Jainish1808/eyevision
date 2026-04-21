import { useEffect, useCallback, useRef, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useAlert } from '../context/AlertContext'

const IDLE_TIMEOUT = 15 * 60 * 1000 // 15 minutes
const WARNING_TIME = 2 * 60 * 1000 // 2 minutes before logout

export const useIdleTimeout = () => {
  const { isAuthenticated, logout } = useAuth()
  const { showConfirm } = useAlert()
  const [showWarning, setShowWarning] = useState(false)
  const timeoutRef = useRef(null)
  const warningTimeoutRef = useRef(null)

  const resetTimer = useCallback(() => {
    if (!isAuthenticated) return

    // Clear existing timers
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current)
    setShowWarning(false)

    // Set warning timer
    warningTimeoutRef.current = setTimeout(() => {
      setShowWarning(true)
      showConfirm({
        title: 'Session Expiring',
        message: 'Your session will expire in 2 minutes due to inactivity. Do you want to stay logged in?',
        variant: 'warning',
        confirmLabel: 'Stay Logged In',
        cancelLabel: 'Logout',
        onConfirm: () => {
          setShowWarning(false)
          resetTimer()
        },
        onCancel: () => {
          logout()
        }
      })
    }, IDLE_TIMEOUT - WARNING_TIME)

    // Set logout timer
    timeoutRef.current = setTimeout(() => {
      logout()
    }, IDLE_TIMEOUT)
  }, [isAuthenticated, logout, showConfirm])

  useEffect(() => {
    if (!isAuthenticated) return

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click']
    
    events.forEach(event => {
      document.addEventListener(event, resetTimer)
    })

    resetTimer()

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, resetTimer)
      })
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current)
    }
  }, [isAuthenticated, resetTimer])

  return { showWarning }
}
