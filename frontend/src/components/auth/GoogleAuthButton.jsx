import React from 'react'
import { authAPI } from '../../services/api'

export function GoogleAuthButton({ onSuccess, onError }) {
  const handleGoogleLogin = async () => {
    // Note: To fully implement Google Auth, you need Firebase SDK or Google Identity Services set up.
    // This is a placeholder for the actual connection.
    try {
      console.log('Initiating Google Auth...')
      // Example call to backend with token (replace 'mock_token' when SDK is added):
      // const response = await authAPI.googleAuth('mock_token')
      // onSuccess(response.data)
      
      // Simulate success for now
      alert('Google Auth requires Firebase or Google Identity Provider setup. See code.')
    } catch (err) {
      console.error(err)
      if (onError) onError(err)
    }
  }

  return (
    <button
      type="button"
      onClick={handleGoogleLogin}
      data-cursor="link"
      className="flex w-full items-center justify-center gap-3 rounded-lg border border-border-strong bg-white px-4 py-3 text-btn font-medium text-text-primary transition-colors hover:bg-input-bg"
    >
      <img
        src="https://www.google.com/favicon.ico"
        alt="Google"
        className="h-5 w-5"
      />
      Continue with Google
    </button>
  )
}

export default GoogleAuthButton
