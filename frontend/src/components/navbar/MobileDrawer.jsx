import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { X, ChevronRight } from 'lucide-react'
import gsap from 'gsap'

export function MobileDrawer({ isOpen, onClose, links, categories = [], isLoggedIn = false }) {
  const drawerRef = useRef(null)
  const overlayRef = useRef(null)
  const linksRef = useRef([])

  useEffect(() => {
    if (isOpen) {
      // Open
      document.body.style.overflow = 'hidden'
      gsap.to(overlayRef.current, { opacity: 1, duration: 0.3, display: 'block' })
      gsap.to(drawerRef.current, { x: 0, duration: 0.4, ease: 'power3.out' })
      gsap.fromTo(
        linksRef.current,
        { x: 30, opacity: 0 },
        { x: 0, opacity: 1, stagger: 0.06, duration: 0.35, delay: 0.1, ease: 'power2.out' }
      )
    } else {
      // Close
      document.body.style.overflow = ''
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
          if (overlayRef.current) overlayRef.current.style.display = 'none'
        }
      })
      gsap.to(drawerRef.current, { x: '100%', duration: 0.3, ease: 'power2.in' })
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return (
    <>
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[101] hidden bg-black/40 opacity-0 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        ref={drawerRef}
        className="fixed right-0 top-0 z-[102] h-full w-[85%] max-w-sm translate-x-full overflow-y-auto bg-white p-6 shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-border-default pb-4">
          <span className="font-sans text-[18px] font-semibold text-text-primary">
            Menu
          </span>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-input-bg transition-colors hover:bg-border-default"
          >
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        <div className="mt-8 flex flex-col gap-2">
          {links.map((link, i) => (
            <Link
              key={link.label}
              to={link.path}
              ref={(el) => (linksRef.current[i] = el)}
              onClick={onClose}
              className="flex items-center justify-between rounded-lg px-4 py-4 text-[18px] font-medium text-text-primary transition-colors hover:bg-section-alt"
            >
              {link.label}
              <ChevronRight size={18} className="text-text-muted" />
            </Link>
          ))}

          {isLoggedIn && categories.length > 0 && (
            <div className="mt-3 border-t border-border-default pt-5">
              <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-[0.14em] text-text-muted">
                Eyewear Categories
              </p>
              <div className="flex flex-col gap-1">
                {categories.map((category, categoryIndex) => (
                  <Link
                    key={category.label}
                    to={category.path}
                    onClick={onClose}
                    ref={(el) => (linksRef.current[links.length + categoryIndex + 1] = el)}
                    className="flex items-center justify-between rounded-lg px-4 py-3 text-base font-medium text-text-primary transition-colors hover:bg-section-alt"
                  >
                    {category.label}
                    <ChevronRight size={16} className="text-text-muted" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div ref={(el) => (linksRef.current[links.length + categories.length + 2] = el)} className="mt-4 border-t border-border-default pt-6">
            {isLoggedIn ? (
              <Link
                to="/home"
                onClick={onClose}
                className="flex w-full items-center justify-center rounded-lg border border-border-strong bg-white py-3 px-4 text-btn text-text-primary"
              >
                Go to Home
              </Link>
            ) : (
              <Link
                to="/auth"
                onClick={onClose}
                className="flex w-full items-center justify-center rounded-lg bg-accent-primary py-3 px-4 text-btn text-white"
              >
                Login / Register
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default MobileDrawer
