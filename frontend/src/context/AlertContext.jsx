import React, { createContext, useContext, useState, useCallback } from 'react'
import { AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react'

const AlertContext = createContext(null)

const ALERT_VARIANTS = {
  info: { icon: Info, className: 'text-blue-600 bg-blue-50 border-blue-200' },
  success: { icon: CheckCircle, className: 'text-green-600 bg-green-50 border-green-200' },
  warning: { icon: AlertTriangle, className: 'text-yellow-600 bg-yellow-50 border-yellow-200' },
  danger: { icon: XCircle, className: 'text-red-600 bg-red-50 border-red-200' },
}

export const AlertProvider = ({ children }) => {
  const [alert, setAlert] = useState(null)

  const showAlert = useCallback(({ title, message, variant = 'info', confirmLabel = 'OK', onConfirm }) => {
    return new Promise((resolve) => {
      setAlert({
        title,
        message,
        variant,
        confirmLabel,
        onConfirm: () => {
          onConfirm?.()
          resolve(true)
          setAlert(null)
        },
        onClose: () => {
          resolve(false)
          setAlert(null)
        }
      })
    })
  }, [])

  const showConfirm = useCallback(({ title, message, variant = 'warning', confirmLabel = 'Confirm', cancelLabel = 'Cancel', onConfirm, onCancel }) => {
    return new Promise((resolve) => {
      setAlert({
        title,
        message,
        variant,
        confirmLabel,
        cancelLabel,
        isConfirm: true,
        onConfirm: () => {
          onConfirm?.()
          resolve(true)
          setAlert(null)
        },
        onCancel: () => {
          onCancel?.()
          resolve(false)
          setAlert(null)
        },
        onClose: () => {
          resolve(false)
          setAlert(null)
        }
      })
    })
  }, [])

  const closeAlert = useCallback(() => {
    setAlert(null)
  }, [])

  return (
    <AlertContext.Provider value={{ showAlert, showConfirm, closeAlert }}>
      {children}
      {alert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 animate-scale-in">
            <div className={`p-6 border-l-4 ${ALERT_VARIANTS[alert.variant].className}`}>
              <div className="flex items-start gap-4">
                {React.createElement(ALERT_VARIANTS[alert.variant].icon, { className: 'w-6 h-6 flex-shrink-0 mt-0.5' })}
                <div className="flex-1">
                  {alert.title && <h3 className="font-semibold text-lg mb-2">{alert.title}</h3>}
                  <p className="text-gray-700">{alert.message}</p>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3 rounded-b-lg">
              {alert.isConfirm && (
                <button
                  onClick={alert.onCancel}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition"
                >
                  {alert.cancelLabel}
                </button>
              )}
              <button
                onClick={alert.onConfirm}
                className={`px-4 py-2 text-white rounded-lg transition ${
                  alert.variant === 'danger' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {alert.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </AlertContext.Provider>
  )
}

export const useAlert = () => {
  const context = useContext(AlertContext)
  if (!context) throw new Error('useAlert must be used within AlertProvider')
  return context
}
