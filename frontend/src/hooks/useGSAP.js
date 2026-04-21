/**
 * useGSAP — React hook for safe GSAP context
 * Wraps animations in gsap.context() for automatic cleanup on unmount.
 */
import { useEffect, useRef, useLayoutEffect } from 'react'
import gsap from 'gsap'

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect

export function useGSAP(callback, deps = []) {
  const ref = useRef(null)

  useIsomorphicLayoutEffect(() => {
    if (!ref.current) return

    const ctx = gsap.context(callback, ref.current)
    return () => ctx.revert()
  }, deps)

  return ref
}

export default useGSAP
