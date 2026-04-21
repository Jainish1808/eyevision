import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { setApiToken, clearApiToken } from '../services/apiClient'

const AuthContext = createContext(null)

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [mfaRequired, setMfaRequired] = useState(false)
  const [tempToken, setTempToken] = useState(null)
  
  // Store access token in memory (useRef) - NEVER in localStorage
  const accessTokenRef = useRef(null)
  const navigate = useNavigate()

  const getAccessToken = useCallback(() => accessTokenRef.current, [])
  const setAccessToken = useCallback((token) => { 
    accessTokenRef.current = token
    setApiToken(token)
  }, [])
  const clearAccessToken = useCallback(() => { 
    accessTokenRef.current = null
    clearApiToken()
  }, [])

  const refreshAccessToken = useCallback(async () => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/refresh`,
        {},
        { withCredentials: true, headers: { 'X-Requested-With': 'XMLHttpRequest' } }
      )

      const { access_token, user: userData } = response.data
      setAccessToken(access_token)
      
      if (userData) {
        setUser(userData)
        setIsAuthenticated(true)
      }

      return access_token
    } catch (error) {
      clearAccessToken()
      setUser(null)
      setIsAuthenticated(false)
      return null
    }
  }, [setAccessToken, clearAccessToken])

  const login = useCallback(async (email, password) => {
    const response = await axios.post(
      `${API_BASE_URL}/auth/login`,
      { email, password },
      { withCredentials: true, headers: { 'X-Requested-With': 'XMLHttpRequest' } }
    )

    if (response.data.mfa_required) {
      setMfaRequired(true)
      setTempToken(response.data.temp_token)
      return { mfaRequired: true }
    }

    const { access_token, user: userData } = response.data
    setAccessToken(access_token)
    setUser(userData)
    setIsAuthenticated(true)
    return { success: true, user: userData }
  }, [setAccessToken])

  const verifyMFA = useCallback(async (code) => {
    const response = await axios.post(
      `${API_BASE_URL}/auth/mfa/login`,
      { code },
      { withCredentials: true, headers: { 'Authorization': `Bearer ${tempToken}`, 'X-Requested-With': 'XMLHttpRequest' } }
    )

    const { access_token, user: userData } = response.data
    setAccessToken(access_token)
    setUser(userData)
    setIsAuthenticated(true)
    setMfaRequired(false)
    setTempToken(null)
    return { success: true, user: userData }
  }, [tempToken, setAccessToken])

  const register = useCallback(async (userData) => {
    const response = await axios.post(
      `${API_BASE_URL}/auth/register`,
      userData,
      { withCredentials: true, headers: { 'X-Requested-With': 'XMLHttpRequest' } }
    )

    const { access_token, user: newUser } = response.data
    setAccessToken(access_token)
    setUser(newUser)
    setIsAuthenticated(true)
    return { success: true, user: newUser }
  }, [setAccessToken])

  const logout = useCallback(async () => {
    try {
      const token = getAccessToken()
      if (token) {
        // Call backend to blacklist the token
        await axios.post(
          `${API_BASE_URL}/auth/logout`,
          {},
          { withCredentials: true, headers: { 'Authorization': `Bearer ${token}`, 'X-Requested-With': 'XMLHttpRequest' } }
        )
      }
    } catch (error) {
      // Ignore logout errors - still clear local state
      console.error('Logout error:', error)
    } finally {
      // Clear all auth state
      clearAccessToken()
      setUser(null)
      setIsAuthenticated(false)
      setMfaRequired(false)
      setTempToken(null)
      // Redirect to landing page
      navigate('/')
    }
  }, [getAccessToken, clearAccessToken, navigate])

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true)
      const token = await refreshAccessToken()
      
      if (token) {
        try {
          const response = await axios.get(`${API_BASE_URL}/auth/me`, {
            headers: { 'Authorization': `Bearer ${token}`, 'X-Requested-With': 'XMLHttpRequest' }
          })
          setUser(response.data)
          setIsAuthenticated(true)
        } catch (error) {
          clearAccessToken()
          setUser(null)
          setIsAuthenticated(false)
        }
      }
      
      setIsLoading(false)
    }

    checkAuth()
  }, [refreshAccessToken, clearAccessToken])

  useEffect(() => {
    if (!isAuthenticated) return
    const interval = setInterval(() => refreshAccessToken(), 13 * 60 * 1000)
    return () => clearInterval(interval)
  }, [isAuthenticated, refreshAccessToken])

  const value = {
    user,
    isAuthenticated,
    isLoading,
    mfaRequired,
    login,
    verifyMFA,
    register,
    logout,
    getAccessToken,
    refreshAccessToken,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
