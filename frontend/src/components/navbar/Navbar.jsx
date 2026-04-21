import React, { useRef } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, Menu, Search, ShoppingBag } from 'lucide-react'
import { useGSAP } from '../../hooks/useGSAP'
import { navbarScrollTrigger } from '../../gsap/scrollAnimations'
import MobileDrawer from './MobileDrawer'
import gsap from 'gsap'

export function Navbar({ isTransparent = false }) {
  const navRef = useRef(null)
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false)
  const [isCategoryOpen, setIsCategoryOpen] = React.useState(false)
  const [isLoggedIn, setIsLoggedIn] = React.useState(false)
  const [userName, setUserName] = React.useState('Account')

  React.useEffect(() => {
    const syncAuth = () => {
      const token = localStorage.getItem('auth_token')
      const userRaw = localStorage.getItem('auth_user')

      setIsLoggedIn(Boolean(token))
      if (!userRaw) {
        setUserName('Account')
        return
      }

      try {
        const parsed = JSON.parse(userRaw)
        setUserName(parsed?.username || parsed?.name || 'Account')
      } catch {
        setUserName('Account')
      }
    }

    syncAuth()
    window.addEventListener('storage', syncAuth)
    window.addEventListener('focus', syncAuth)

    return () => {
      window.removeEventListener('storage', syncAuth)
      window.removeEventListener('focus', syncAuth)
    }
  }, [])

  useGSAP(() => {
    if (isTransparent) {
      const scrollTrigger = navbarScrollTrigger(navRef.current)
      return () => scrollTrigger?.kill()
    }
  }, [isTransparent])

  const handleLinkHover = (e, isEnter) => {
    const line = e.currentTarget.querySelector('.nav-line')
    if (line) {
      gsap.to(line, {
        scaleX: isEnter ? 1 : 0,
        transformOrigin: isEnter ? 'left' : 'right',
        duration: 0.25,
        ease: 'power2.out'
      })
    }
  }

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Shop', path: '/shop' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' }
  ]

  const categoryLinks = [
    { label: 'Normal Specs', path: '/shop?category=normal-specs' },
    { label: 'Sunglasses', path: '/shop?category=sunglasses' },
    { label: 'Lenses', path: '/shop?category=lenses' },
    { label: 'Number Glasses', path: '/shop?category=number-glasses' },
    { label: 'Cases', path: '/shop?category=cases' }
  ]

  return (
    <>
      <nav
        ref={navRef}
        className={`fixed left-0 top-0 z-[100] w-full transition-colors duration-300 ${
          isTransparent ? 'bg-transparent' : 'bg-white/88 backdrop-blur-[16px] shadow-[0_1px_0_rgba(0,0,0,0.08)]'
        }`}
      >
        <div className="container-main mx-auto flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" data-cursor="link" className="flex items-center gap-2">
            <span className="font-sans text-[18px] font-semibold text-text-primary">
              VISION
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.path}
                data-cursor="link"
                className="group relative"
                onMouseEnter={(e) => handleLinkHover(e, true)}
                onMouseLeave={(e) => handleLinkHover(e, false)}
              >
                <span className="text-nav text-text-primary">{link.label}</span>
                <span className="nav-line absolute -bottom-1 left-0 h-[1.5px] w-full origin-left scale-x-0 bg-accent-primary" />
              </Link>
            ))}

            {isLoggedIn && (
              <div
                className="relative"
                onMouseEnter={() => setIsCategoryOpen(true)}
                onMouseLeave={() => setIsCategoryOpen(false)}
              >
                <button
                  data-cursor="link"
                  className="flex items-center gap-1 text-nav text-text-primary"
                >
                  Eyewear
                  <ChevronDown size={16} className={`transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} />
                </button>

                <div
                  className={`absolute left-0 top-9 min-w-[220px] rounded-xl border border-border-default bg-white p-2 shadow-[0_20px_40px_rgba(0,0,0,0.12)] transition-all ${isCategoryOpen ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-2 opacity-0'}`}
                >
                  {categoryLinks.map((category) => (
                    <Link
                      key={category.label}
                      to={category.path}
                      data-cursor="link"
                      className="block rounded-lg px-3 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:bg-section-alt hover:text-text-primary"
                    >
                      {category.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button data-cursor="link" className="p-2 text-text-primary transition-colors hover:text-blue-cta">
              <Search size={20} strokeWidth={1.5} />
            </button>
            <Link to="/cart" data-cursor="link" className="relative p-2 text-text-primary transition-colors hover:text-blue-cta">
              <ShoppingBag size={20} strokeWidth={1.5} />
              <span className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-accent-primary text-[10px] font-bold text-white">3</span>
            </Link>

            {isLoggedIn ? (
              <Link
                to="/home"
                data-cursor="link"
                className="hidden rounded-lg border border-border-strong bg-white px-3 py-2 text-btn font-medium text-text-primary transition-colors hover:bg-section-alt md:flex"
              >
                {userName}
              </Link>
            ) : (
              <Link
                to="/auth"
                data-cursor="link"
                className="hidden rounded-lg bg-accent-primary px-4 py-2 text-btn font-medium text-white transition-transform hover:scale-105 hover:bg-accent-hover md:block"
              >
                Login
              </Link>
            )}

            <button
              data-cursor="link"
              className="p-2 text-text-primary md:hidden"
              onClick={() => setIsDrawerOpen(true)}
            >
              <Menu size={24} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </nav>

      <MobileDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        links={navLinks}
        categories={categoryLinks}
        isLoggedIn={isLoggedIn}
      />
    </>
  )
}

export default Navbar
