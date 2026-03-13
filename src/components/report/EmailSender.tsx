'use client'

import { useState } from 'react'

interface EmailSenderProps {
  auditId: string
}

export function EmailSender({ auditId }: EmailSenderProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [consent, setConsent] = useState(false)

  const handleSend = async () => {
    if (!email || !email.includes('@')) {
      setErrorMsg('Введите корректный email')
      setStatus('error')
      return
    }

    if (!consent) {
      setErrorMsg('Необходимо дать согласие на обработку данных')
      setStatus('error')
      return
    }

    setStatus('sending')
    setErrorMsg('')

    try {
      const res = await fetch('/api/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ auditId, email }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Ошибка отправки')
      }

      setStatus('sent')
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Ошибка')
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <div className="flex items-center gap-2 p-3 bg-green-100 text-green-700 rounded-lg text-sm">
        <span>✅</span>
        <span>Отчёт отправлен на {email}</span>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (status === 'error') setStatus('idle')
          }}
          placeholder="your@email.com"
          className={`flex-1 px-4 py-2 rounded-lg border text-sm bg-[var(--background)] ${
            status === 'error' ? 'border-red-400' : 'border-[var(--border)]'
          } focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50`}
        />
        <button
          onClick={handleSend}
          disabled={status === 'sending' || !consent}
          className="px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 whitespace-nowrap"
        >
          {status === 'sending' ? 'Отправка...' : 'Отправить на email'}
        </button>
      </div>
      <label className="flex items-start gap-2 cursor-pointer group">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => {
            setConsent(e.target.checked)
            if (status === 'error') setStatus('idle')
          }}
          className="mt-0.5 w-3.5 h-3.5 rounded border-[var(--border)] accent-[var(--primary)] shrink-0"
        />
        <span className="text-[11px] text-[var(--muted-foreground)] group-hover:text-[var(--foreground)] transition-colors leading-tight">
          Даю согласие на обработку email в соответствии с{' '}
          <a href="/legal#privacy" target="_blank" className="text-[var(--primary)] underline">
            Политикой конфиденциальности
          </a>
        </span>
      </label>
      {status === 'error' && errorMsg && (
        <p className="text-xs text-red-500">{errorMsg}</p>
      )}
    </div>
  )
}
