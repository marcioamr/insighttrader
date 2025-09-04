"use client"

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { Toast } from '../components/ui/toast'

export interface ToastData {
  id: string
  variant?: 'default' | 'success' | 'error' | 'warning' | 'info'
  title?: string
  description?: string
  duration?: number
  action?: ReactNode
}

interface ToastContextType {
  toasts: ToastData[]
  addToast: (toast: Omit<ToastData, 'id'>) => string
  removeToast: (id: string) => void
  success: (title: string, description?: string) => void
  error: (title: string, description?: string) => void
  warning: (title: string, description?: string) => void
  info: (title: string, description?: string) => void
  clear: () => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastData[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const addToast = useCallback((toast: Omit<ToastData, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast: ToastData = {
      id,
      duration: 5000,
      ...toast
    }

    setToasts(prev => [...prev, newToast])

    // Auto remove após duração especificada
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, newToast.duration)
    }

    return id
  }, [removeToast])

  const success = useCallback((title: string, description?: string) => {
    addToast({
      variant: 'success',
      title,
      description
    })
  }, [addToast])

  const error = useCallback((title: string, description?: string) => {
    addToast({
      variant: 'error',
      title,
      description,
      duration: 7000 // Erros ficam mais tempo
    })
  }, [addToast])

  const warning = useCallback((title: string, description?: string) => {
    addToast({
      variant: 'warning',
      title,
      description
    })
  }, [addToast])

  const info = useCallback((title: string, description?: string) => {
    addToast({
      variant: 'info',
      title,
      description
    })
  }, [addToast])

  const clear = useCallback(() => {
    setToasts([])
  }, [])

  const value: ToastContextType = {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
    clear
  }

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  )
}

function ToastContainer() {
  const { toasts, removeToast } = useToast()

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm space-y-2">
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          variant={toast.variant}
          title={toast.title}
          description={toast.description}
          action={toast.action}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

// Função utilitária para usar sem hook (para casos específicos)
let toastInstance: ToastContextType | null = null

export function setToastInstance(instance: ToastContextType) {
  toastInstance = instance
}

export const toast = {
  success: (title: string, description?: string) => {
    if (toastInstance) toastInstance.success(title, description)
  },
  error: (title: string, description?: string) => {
    if (toastInstance) toastInstance.error(title, description)
  },
  warning: (title: string, description?: string) => {
    if (toastInstance) toastInstance.warning(title, description)
  },
  info: (title: string, description?: string) => {
    if (toastInstance) toastInstance.info(title, description)
  }
}