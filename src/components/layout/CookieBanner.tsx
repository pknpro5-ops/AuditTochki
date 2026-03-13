'use client'

import { useState, useEffect } from 'react'

const COOKIE_CONSENT_KEY = 'cookie_consent'

export function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY)
    if (!consent) {
      setVisible(true)
    }
  }, [])

  function accept() {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted')
    setVisible(false)
  }

  function decline() {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'declined')
    setVisible(false)
    // Disable Yandex Metrika if already loaded
    if (typeof window !== 'undefined') {
      (window as unknown as Record<string, unknown>)['yaCounterDisabled'] = true
    }
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 animate-fade-in-up">
      <div className="max-w-2xl mx-auto bg-[var(--background)] border border-[var(--border)] rounded-2xl p-4 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <p className="text-xs text-[var(--muted-foreground)] flex-1">
          Мы используем файлы cookie для работы сервиса и аналитики (Яндекс.Метрика).
          Подробнее в{' '}
          <a href="/legal#privacy" className="text-[var(--primary)] underline">
            Политике конфиденциальности
          </a>.
        </p>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={decline}
            className="px-3 py-1.5 text-xs font-medium rounded-lg border border-[var(--border)] hover:bg-[var(--muted)] transition-colors"
          >
            Только необходимые
          </button>
          <button
            onClick={accept}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] hover:brightness-110 transition-all"
          >
            Принять все
          </button>
        </div>
      </div>
    </div>
  )
}
