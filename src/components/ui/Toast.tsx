'use client'

import { useState, useEffect, useCallback, createContext, useContext } from 'react'

type ToastType = 'success' | 'error' | 'info' | 'warning'

interface Toast {
  id: string
  message: string
  type: ToastType
  exiting?: boolean
}

interface ToastContextType {
  addToast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextType>({ addToast: () => {} })

export function useToast() {
  return useContext(ToastContext)
}

const icons: Record<ToastType, string> = {
  success: '\u2713',
  error: '\u2717',
  info: 'i',
  warning: '!',
}

const colors: Record<ToastType, { bg: string; border: string; icon: string }> = {
  success: { bg: 'bg-green-50 dark:bg-green-950/40', border: 'border-green-200 dark:border-green-800', icon: 'bg-green-500' },
  error: { bg: 'bg-red-50 dark:bg-red-950/40', border: 'border-red-200 dark:border-red-800', icon: 'bg-red-500' },
  info: { bg: 'bg-blue-50 dark:bg-blue-950/40', border: 'border-blue-200 dark:border-blue-800', icon: 'bg-blue-500' },
  warning: { bg: 'bg-yellow-50 dark:bg-yellow-950/40', border: 'border-yellow-200 dark:border-yellow-800', icon: 'bg-yellow-500' },
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.map(t => t.id === id ? { ...t, exiting: true } : t))
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 200)
  }, [])

  const addToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).slice(2)
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => removeToast(id), 4000)
  }, [removeToast])

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {/* Toast container */}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map(toast => {
          const c = colors[toast.type]
          return (
            <div
              key={toast.id}
              className={`pointer-events-auto ${c.bg} ${c.border} border rounded-xl px-4 py-3 shadow-lg flex items-center gap-3 ${
                toast.exiting ? 'animate-toast-out' : 'animate-toast-in'
              }`}
            >
              <span className={`${c.icon} text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0`}>
                {icons[toast.type]}
              </span>
              <p className="text-sm font-medium text-[var(--foreground)] flex-1">{toast.message}</p>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] text-lg leading-none shrink-0"
              >
                \u00d7
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}
