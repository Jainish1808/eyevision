import React, { useEffect, useRef, useState } from 'react'
import confetti from 'canvas-confetti'
import { Eye, EyeOff, Mail, ShieldCheck } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'

import OTPInput from '../components/auth/OTPInput'
import GoogleAuthButton from '../components/auth/GoogleAuthButton'
import { useGSAP } from '../hooks/useGSAP'
import { curtainTransition } from '../gsap/pageTransitions'
import { authAPI } from '../services/api'

const USERNAME_REGEX = /^[a-zA-Z][a-zA-Z0-9_]{2,29}$/
const PHONE_REGEX = /^\+?[1-9]\d{7,14}$/
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,128}$/
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function AuthPage() {
  const leftRef = useRef(null)
  const rightRef = useRef(null)
  const tabsRef = useRef(null)
  const loginContentRef = useRef(null)
  const registerContentRef = useRef(null)

  const [activeTab, setActiveTab] = useState('login')
  const [authMode, setAuthMode] = useState('password')
  const [showPassword, setShowPassword] = useState(false)
  const [showRegisterPassword, setShowRegisterPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formError, setFormError] = useState('')
  const [otpNotice, setOtpNotice] = useState('')
  const [otpEmail, setOtpEmail] = useState('')
  const [otpCooldown, setOtpCooldown] = useState(0)

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  })

  const [registerForm, setRegisterForm] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
    confirm_password: ''
  })

  const navigate = useNavigate()

  useGSAP(() => {
    const tl = gsap.timeline()
    tl.from(leftRef.current, { x: -70, opacity: 0, duration: 0.85, ease: 'power3.out' })
      .from(rightRef.current, { x: 70, opacity: 0, duration: 0.85, ease: 'power3.out' }, '<')
      .from('.auth-form-panel > *', { y: 20, opacity: 0, stagger: 0.06, duration: 0.45, ease: 'power2.out' }, '-=0.3')
  }, [])

  useEffect(() => {
    if (!otpCooldown) return undefined

    const timer = window.setInterval(() => {
      setOtpCooldown((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => window.clearInterval(timer)
  }, [otpCooldown])

  const finishAuth = (data) => {
    localStorage.setItem('auth_token', data.token)
    localStorage.setItem('refresh_token', data.refreshToken)
    localStorage.setItem('auth_user', JSON.stringify(data.user))

    confetti({
      particleCount: 120,
      spread: 78,
      origin: { y: 0.62 }
    })

    window.setTimeout(() => {
      curtainTransition(navigate, '/home')
    }, 260)
  }

  const switchTab = (tab) => {
    if (tab === activeTab) return

    setActiveTab(tab)
    setAuthMode('password')
    setFormError('')
    setOtpNotice('')

    const oldContent = tab === 'login' ? registerContentRef.current : loginContentRef.current
    const newContent = tab === 'login' ? loginContentRef.current : registerContentRef.current
    const tabElements = tabsRef.current?.children || []
    const activeIndex = tab === 'login' ? 0 : 1

    if (tabElements.length) {
      gsap.to('.tab-indicator', {
        x: tabElements[activeIndex].offsetLeft,
        width: tabElements[activeIndex].offsetWidth,
        duration: 0.3,
        ease: 'power2.inOut'
      })
    }

    const tl = gsap.timeline()
    tl.to(oldContent, { y: -10, opacity: 0, duration: 0.2 })
      .set(oldContent, { display: 'none' })
      .set(newContent, { display: 'block' })
      .fromTo(newContent, { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.25 })
  }

  const validateRegisterForm = () => {
    if (!USERNAME_REGEX.test(registerForm.username.trim())) {
      return 'Username must start with a letter and use letters, numbers, underscore (3-30 chars).'
    }

    if (!PHONE_REGEX.test(registerForm.phone.trim().replace(/\s|-/g, ''))) {
      return 'Phone must be in international format, e.g. +919876543210.'
    }

    if (!PASSWORD_REGEX.test(registerForm.password)) {
      return 'Password must include uppercase, lowercase, number, special character, and be at least 8 chars.'
    }

    if (registerForm.password !== registerForm.confirm_password) {
      return 'Password and confirm password must match.'
    }

    return ''
  }

  const handleLoginSubmit = async (e) => {
    e.preventDefault()
    setFormError('')
    setIsLoading(true)

    try {
      const payload = {
        email: loginForm.email.trim().toLowerCase(),
        password: loginForm.password
      }
      const { data } = await authAPI.login(payload.email, payload.password)
      finishAuth(data)
    } catch (err) {
      setFormError(err?.response?.data?.detail || 'Unable to login. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegisterSubmit = async (e) => {
    e.preventDefault()
    setFormError('')

    const validationError = validateRegisterForm()
    if (validationError) {
      setFormError(validationError)
      return
    }

    setIsLoading(true)
    try {
      const payload = {
        username: registerForm.username.trim(),
        email: registerForm.email.trim().toLowerCase(),
        phone: registerForm.phone.trim().replace(/\s|-/g, ''),
        password: registerForm.password,
        confirm_password: registerForm.confirm_password
      }
      const { data } = await authAPI.register(payload)
      finishAuth(data)
    } catch (err) {
      setFormError(err?.response?.data?.detail || 'Unable to create account. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendOtp = async () => {
    const email = loginForm.email.trim().toLowerCase()
    if (!EMAIL_REGEX.test(email)) {
      setFormError('Please enter a valid email before OTP verification.')
      return
    }

    setFormError('')
    setIsLoading(true)
    try {
      const { data } = await authAPI.sendOTP(email)
      setOtpEmail(email)
      setAuthMode('otp')
      setOtpCooldown(30)
      const debugLine = data?.debugOtp ? ` Debug OTP: ${data.debugOtp}` : ''
      setOtpNotice(`${data?.message || 'OTP sent.'}${debugLine}`)
    } catch (err) {
      setFormError(err?.response?.data?.detail || 'Could not send OTP. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOtp = async (otp) => {
    if (!otpEmail) {
      setFormError('Please enter your email first.')
      return
    }

    setIsLoading(true)
    setFormError('')

    try {
      const { data } = await authAPI.verifyOTP(otpEmail, otp)
      finishAuth(data)
    } catch (err) {
      setFormError(err?.response?.data?.detail || 'OTP verification failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const resendOtp = () => {
    if (otpCooldown > 0) return
    setOtpNotice('New OTP sent to your email.')
    setOtpCooldown(30)
  }

  return (
    <div className="flex min-h-screen bg-[#f5f4ef]">
      <div ref={leftRef} className="auth-visual relative hidden w-[70%] overflow-hidden lg:block">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster="https://images.unsplash.com/photo-1577803645773-f96470509666?q=80&w=1200&auto=format&fit=crop"
        >
          <source src="https://cdn.coverr.co/videos/coverr-person-adjusting-his-glasses-1579/1080p.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-gradient-to-r from-[#0e1015]/70 via-[#0e1015]/45 to-[#0e1015]/20" />
        <div className="absolute left-10 top-10 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-md">
          Vision Studio 2026
        </div>

        <div className="absolute bottom-12 left-12 max-w-lg rounded-2xl border border-white/25 bg-white/10 p-7 backdrop-blur-xl">
          <p className="mb-3 text-4xl font-semibold leading-tight text-white">
            Better sight,
            <br />
            bolder style.
          </p>
          <p className="text-white/75">
            Join to unlock curated combos for normal specs, sunglasses, lenses, number glasses and cases.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white/85 px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#1a1a1a]">
            <ShieldCheck size={14} />
            Secure Login Experience
          </div>
        </div>
      </div>

      <div
        ref={rightRef}
        className="flex w-full flex-col justify-center border-l border-border-default bg-white px-7 py-10 lg:w-[30%] lg:px-10"
      >
        <div className="auth-form-panel mx-auto w-full max-w-sm">
          <h2 className="mb-2 font-serif text-3xl">Welcome</h2>
          <p className="mb-7 text-text-secondary">Sign in or create your account in one place.</p>

          {formError && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {formError}
            </div>
          )}

          {otpNotice && (
            <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-700">
              {otpNotice}
            </div>
          )}

          <GoogleAuthButton />

          <div className="my-6 flex items-center gap-4 before:h-px before:flex-1 before:bg-border-default after:h-px after:flex-1 after:bg-border-default">
            <span className="text-xs font-semibold uppercase text-text-muted">or</span>
          </div>

          <div className="relative mb-8 flex border-b border-border-default">
            <div ref={tabsRef} className="flex w-full">
              <button
                className={`flex-1 pb-3 text-center text-sm font-semibold transition-colors ${activeTab === 'login' ? 'text-accent-primary' : 'text-text-muted hover:text-text-primary'}`}
                onClick={() => switchTab('login')}
              >
                Login
              </button>
              <button
                className={`flex-1 pb-3 text-center text-sm font-semibold transition-colors ${activeTab === 'register' ? 'text-accent-primary' : 'text-text-muted hover:text-text-primary'}`}
                onClick={() => switchTab('register')}
              >
                Register
              </button>
            </div>
            <div className="tab-indicator absolute bottom-0 left-0 h-0.5 w-1/2 bg-accent-primary" />
          </div>

          <div ref={loginContentRef}>
            {authMode === 'password' ? (
              <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-text-secondary">Email Address</label>
                  <input
                    type="email"
                    className="rounded-lg border border-border-default bg-input-bg px-4 py-3 text-sm focus:border-accent-primary focus:bg-white focus:outline-none"
                    placeholder="name@example.com"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm((prev) => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>

                <div className="relative flex flex-col gap-1">
                  <label className="text-xs font-semibold text-text-secondary">Password</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="rounded-lg border border-border-default bg-input-bg px-4 py-3 pr-10 text-sm focus:border-accent-primary focus:bg-white focus:outline-none"
                    placeholder="••••••••"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm((prev) => ({ ...prev, password: e.target.value }))}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-7 text-text-muted hover:text-accent-primary"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="mt-1 flex h-12 w-full items-center justify-center rounded-lg bg-blue-cta py-3.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  {isLoading ? <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" /> : 'Sign In'}
                </button>

                <button
                  type="button"
                  onClick={handleSendOtp}
                  className="flex items-center justify-center gap-2 rounded-lg border border-border-strong bg-white px-4 py-3 text-sm font-semibold text-text-primary transition-colors hover:bg-section-alt"
                >
                  <Mail size={16} /> Verify with Email OTP
                </button>
              </form>
            ) : (
              <div className="space-y-5">
                <div>
                  <p className="text-sm font-semibold text-text-primary">Verify your email</p>
                  <p className="text-sm text-text-secondary">Code sent to {otpEmail}</p>
                </div>

                <OTPInput onComplete={handleVerifyOtp} />

                <button
                  type="button"
                  onClick={resendOtp}
                  disabled={otpCooldown > 0}
                  className="w-full rounded-lg border border-border-default py-2.5 text-sm font-semibold text-text-primary transition-colors hover:bg-section-alt disabled:cursor-not-allowed disabled:opacity-55"
                >
                  {otpCooldown > 0 ? `Resend in ${otpCooldown}s` : 'Resend OTP'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('password')
                    setOtpNotice('')
                  }}
                  className="w-full text-xs font-semibold uppercase tracking-[0.1em] text-text-muted hover:text-text-primary"
                >
                  Back to password login
                </button>
              </div>
            )}
          </div>

          <div ref={registerContentRef} style={{ display: 'none' }}>
            <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-text-secondary">Username</label>
                <input
                  type="text"
                  className="rounded-lg border border-border-default bg-input-bg px-4 py-3 text-sm focus:border-accent-primary focus:bg-white focus:outline-none"
                  placeholder="john_doe"
                  value={registerForm.username}
                  onChange={(e) => setRegisterForm((prev) => ({ ...prev, username: e.target.value }))}
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-text-secondary">Email</label>
                <input
                  type="email"
                  className="rounded-lg border border-border-default bg-input-bg px-4 py-3 text-sm focus:border-accent-primary focus:bg-white focus:outline-none"
                  placeholder="name@example.com"
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm((prev) => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-text-secondary">Phone</label>
                <input
                  type="tel"
                  className="rounded-lg border border-border-default bg-input-bg px-4 py-3 text-sm focus:border-accent-primary focus:bg-white focus:outline-none"
                  placeholder="+919876543210"
                  value={registerForm.phone}
                  onChange={(e) => setRegisterForm((prev) => ({ ...prev, phone: e.target.value }))}
                  required
                />
              </div>

              <div className="relative flex flex-col gap-1">
                <label className="text-xs font-semibold text-text-secondary">Password</label>
                <input
                  type={showRegisterPassword ? 'text' : 'password'}
                  className="rounded-lg border border-border-default bg-input-bg px-4 py-3 pr-10 text-sm focus:border-accent-primary focus:bg-white focus:outline-none"
                  placeholder="••••••••"
                  value={registerForm.password}
                  onChange={(e) => setRegisterForm((prev) => ({ ...prev, password: e.target.value }))}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                  className="absolute right-3 top-7 text-text-muted hover:text-accent-primary"
                >
                  {showRegisterPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className="relative flex flex-col gap-1">
                <label className="text-xs font-semibold text-text-secondary">Confirm Password</label>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="rounded-lg border border-border-default bg-input-bg px-4 py-3 pr-10 text-sm focus:border-accent-primary focus:bg-white focus:outline-none"
                  placeholder="••••••••"
                  value={registerForm.confirm_password}
                  onChange={(e) => setRegisterForm((prev) => ({ ...prev, confirm_password: e.target.value }))}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-7 text-text-muted hover:text-accent-primary"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <p className="text-xs text-text-muted">
                Password must include uppercase, lowercase, number, and special character.
              </p>

              <button
                type="submit"
                disabled={isLoading}
                className="mt-1 flex h-12 w-full items-center justify-center rounded-lg bg-blue-cta py-3.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {isLoading ? <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" /> : 'Create Account'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthPage
