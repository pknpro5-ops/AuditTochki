'use client'

import { useState } from 'react'

type Tab = 'login' | 'register'

export default function AuthPage() {
  const [tab, setTab] = useState<Tab>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [consent, setConsent] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (tab === 'register' && !consent) {
      setError('Необходимо дать согласие на обработку персональных данных')
      return
    }

    setLoading(true)

    try {
      const endpoint = tab === 'login' ? '/api/auth/login' : '/api/auth/register'
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Произошла ошибка')
        return
      }

      window.location.href = '/audit'
    } catch {
      setError('Ошибка сети. Попробуйте ещё раз.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="py-16 px-4">
      <div className="max-w-md mx-auto animate-fade-in-up">
        <h1 className="text-3xl font-bold mb-8 text-center">
          {tab === 'login' ? 'Вход' : 'Регистрация'}
        </h1>

        {/* Tabs */}
        <div className="flex rounded-xl border border-[var(--border)] overflow-hidden mb-6">
          <button
            type="button"
            onClick={() => { setTab('login'); setError('') }}
            className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
              tab === 'login'
                ? 'bg-[var(--primary)] text-[var(--primary-foreground)]'
                : 'hover:bg-[var(--muted)]'
            }`}
          >
            Вход
          </button>
          <button
            type="button"
            onClick={() => { setTab('register'); setError('') }}
            className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
              tab === 'register'
                ? 'bg-[var(--primary)] text-[var(--primary-foreground)]'
                : 'hover:bg-[var(--muted)]'
            }`}
          >
            Регистрация
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1.5">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--background)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)] transition-shadow"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1.5">
              Пароль
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={tab === 'register' ? 'Минимум 6 символов' : '••••••••'}
              className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--background)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)] transition-shadow"
            />
          </div>

          {/* Consent checkbox for registration */}
          {tab === 'register' && (
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-[var(--border)] accent-[var(--primary)] shrink-0"
              />
              <span className="text-xs text-[var(--muted-foreground)] group-hover:text-[var(--foreground)] transition-colors">
                Я даю согласие на обработку персональных данных в соответствии с{' '}
                <a href="/legal#privacy" target="_blank" className="text-[var(--primary)] underline">
                  Политикой конфиденциальности
                </a>{' '}
                и принимаю условия{' '}
                <a href="/legal#offer" target="_blank" className="text-[var(--primary)] underline">
                  Публичной оферты
                </a>.
              </span>
            </label>
          )}

          {error && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || (tab === 'register' && !consent)}
            className="w-full py-2.5 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] text-sm font-medium hover:brightness-110 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                {tab === 'login' ? 'Вход...' : 'Регистрация...'}
              </span>
            ) : (
              tab === 'login' ? 'Войти' : 'Зарегистрироваться'
            )}
          </button>
        </form>

        <p className="text-xs text-[var(--muted-foreground)] text-center mt-6">
          {tab === 'login'
            ? 'Нет аккаунта? Переключитесь на «Регистрация» выше.'
            : 'Уже есть аккаунт? Переключитесь на «Вход» выше.'}
        </p>
      </div>
    </div>
  )
}
