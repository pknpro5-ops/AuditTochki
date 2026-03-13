'use client'

import { useState } from 'react'

interface UpgradePromptProps {
  auditId: string
  currentTier: string
}

const TIERS = [
  {
    id: 'STANDARD',
    name: 'Стандарт',
    price: '3 900 ₽',
    features: [
      'Полный анализ всех 6 блоков',
      'PDF-отчёт',
      'Детальный бюджет',
      'Отправка на email',
    ],
  },
  {
    id: 'EXTENDED',
    name: 'Расширенный',
    price: '7 900 ₽',
    features: [
      'Всё из Стандарт',
      'Анализ плана (AI OCR)',
      'Расширенные рекомендации по ТЗ',
      'Подробная детализация',
    ],
  },
]

export function UpgradePrompt({ auditId, currentTier }: UpgradePromptProps) {
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  if (currentTier !== 'FREE') return null

  const handleUpgrade = async (tier: string) => {
    setLoading(tier)
    setError(null)

    try {
      const res = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ auditId, tier }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Ошибка создания платежа')
      }

      // Redirect to YooKassa payment page
      window.location.href = data.confirmationUrl
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка оплаты')
      setLoading(null)
    }
  }

  return (
    <div className="border-2 border-[var(--primary)] rounded-xl p-6 bg-blue-50/10">
      <div className="text-center mb-4">
        <h3 className="text-lg font-bold">Получите полный отчёт</h3>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">
          Вы используете бесплатный тариф. Оплатите для получения полного анализа с детализацией.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm text-center">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {TIERS.map((tier) => (
          <div
            key={tier.id}
            className="border border-[var(--border)] rounded-lg p-4"
          >
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-semibold">{tier.name}</h4>
              <span className="text-lg font-bold">{tier.price}</span>
            </div>
            <ul className="space-y-1 mb-4">
              {tier.features.map((f) => (
                <li key={f} className="text-sm flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleUpgrade(tier.id)}
              disabled={loading !== null}
              className="w-full py-2 px-4 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading === tier.id ? 'Создание платежа...' : `Оплатить ${tier.price}`}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
