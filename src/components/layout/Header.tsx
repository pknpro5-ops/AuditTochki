'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

interface AuthUser {
  userId: string
  email: string
  role: string
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [user, setUser] = useState<AuthUser | null>(null)

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setUser(data.user)
      })
      .catch(() => {})
  }, [])

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
    window.location.reload()
  }

  return (
    <header className="border-b border-[var(--border)] bg-[var(--background)]/95 backdrop-blur supports-[backdrop-filter]:bg-[var(--background)]/60 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <span className="text-[var(--primary)]">Аудит</span>
          <span>Точки</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/audit" className="text-sm font-medium hover:text-[var(--primary)] transition-colors">
            Проверить помещение
          </Link>
          <Link href="/pricing" className="text-sm font-medium hover:text-[var(--primary)] transition-colors">
            Тарифы
          </Link>
          <Link href="/compare" className="text-sm font-medium hover:text-[var(--primary)] transition-colors">
            Сравнить
          </Link>
          <Link href="/history" className="text-sm font-medium hover:text-[var(--primary)] transition-colors">
            Мои проверки
          </Link>

          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-xs text-[var(--muted-foreground)] max-w-[140px] truncate">
                {user.email}
              </span>
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 text-xs font-medium rounded-lg border border-[var(--border)] hover:bg-[var(--muted)] transition-colors"
              >
                Выйти
              </button>
            </div>
          ) : (
            <Link
              href="/auth"
              className="px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Войти
            </Link>
          )}
        </nav>

        {/* Mobile menu button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2"
          aria-label="Меню"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-[var(--border)] px-4 py-4 space-y-3 mobile-menu-enter">
          <Link href="/audit" className="block text-sm font-medium" onClick={() => setMenuOpen(false)}>
            Проверить помещение
          </Link>
          <Link href="/pricing" className="block text-sm font-medium" onClick={() => setMenuOpen(false)}>
            Тарифы
          </Link>
          <Link href="/compare" className="block text-sm font-medium" onClick={() => setMenuOpen(false)}>
            Сравнить
          </Link>
          <Link href="/history" className="block text-sm font-medium" onClick={() => setMenuOpen(false)}>
            Мои проверки
          </Link>

          {user ? (
            <div className="flex items-center justify-between pt-2 border-t border-[var(--border)]">
              <span className="text-xs text-[var(--muted-foreground)] truncate max-w-[180px]">
                {user.email}
              </span>
              <button
                onClick={() => { handleLogout(); setMenuOpen(false) }}
                className="px-3 py-1.5 text-xs font-medium rounded-lg border border-[var(--border)] hover:bg-[var(--muted)] transition-colors"
              >
                Выйти
              </button>
            </div>
          ) : (
            <Link
              href="/auth"
              className="block text-center px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg text-sm font-medium"
              onClick={() => setMenuOpen(false)}
            >
              Войти
            </Link>
          )}
        </div>
      )}
    </header>
  )
}
