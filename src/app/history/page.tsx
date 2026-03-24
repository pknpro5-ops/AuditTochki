'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface AuditItem {
  id: string
  venueType: string
  area: number
  address: string
  verdict: 'GO' | 'GO_WITH_RESERVATIONS' | 'NO_GO'
  score: number
  budgetMin: number
  budgetMax: number
  tier: string
  blocks: { id: string; title: string; status: string }[]
  topRisks: { rank: number; description: string; severity: string }[]
  createdAt: string
}

const verdictLabels: Record<string, string> = {
  GO: 'Можно открывать',
  GO_WITH_RESERVATIONS: 'С оговорками',
  NO_GO: 'Не рекомендуется',
}

const verdictColors: Record<string, string> = {
  GO: 'bg-green-500/15 text-green-400 border-green-500/30',
  GO_WITH_RESERVATIONS: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
  NO_GO: 'bg-red-500/15 text-red-400 border-red-500/30',
}

const venueLabels: Record<string, string> = {
  cafe: 'Кафе',
  restaurant: 'Ресторан',
  bar: 'Бар',
  coffee_shop: 'Кофейня',
  bakery: 'Пекарня',
  fast_food: 'Фастфуд',
  canteen: 'Столовая',
  other: 'Другое',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatBudget(min: number, max: number) {
  const fmt = (n: number) => {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}М`
    if (n >= 1_000) return `${Math.round(n / 1_000)}т`
    return String(n)
  }
  return `${fmt(min)} – ${fmt(max)} ₽`
}

function ScoreRing({ score }: { score: number }) {
  const color = score >= 70 ? '#22c55e' : score >= 40 ? '#eab308' : '#ef4444'
  const circumference = 2 * Math.PI * 18
  const offset = circumference - (score / 100) * circumference

  return (
    <div className="relative w-12 h-12 flex-shrink-0">
      <svg className="w-12 h-12 -rotate-90" viewBox="0 0 40 40">
        <circle cx="20" cy="20" r="18" fill="none" stroke="currentColor" strokeWidth="3" className="text-[var(--muted)]" />
        <circle
          cx="20" cy="20" r="18" fill="none"
          stroke={color} strokeWidth="3"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-xs font-bold" style={{ color }}>
        {score}
      </span>
    </div>
  )
}

function BlockDots({ blocks }: { blocks: AuditItem['blocks'] }) {
  const colors: Record<string, string> = {
    OK: 'bg-green-500',
    WARNING: 'bg-yellow-500',
    CRITICAL: 'bg-red-500',
  }

  return (
    <div className="flex gap-1">
      {blocks.map((b) => (
        <div
          key={b.id}
          className={`w-2 h-2 rounded-full ${colors[b.status] || 'bg-gray-500'}`}
          title={`${b.title}: ${b.status}`}
        />
      ))}
    </div>
  )
}

export default function HistoryPage() {
  const [audits, setAudits] = useState<AuditItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/audit/list')
      .then((res) => {
        if (!res.ok) throw new Error('Ошибка загрузки')
        return res.json()
      })
      .then((data) => {
        setAudits(data.items || [])
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-8">Мои проверки</h1>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 rounded-xl bg-[var(--muted)] animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Мои проверки</h1>
        <p className="text-red-400">{error}</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Мои проверки</h1>
          <p className="text-[var(--muted-foreground)] mt-1">
            {audits.length > 0
              ? `${audits.length} ${audits.length === 1 ? 'проверка' : audits.length < 5 ? 'проверки' : 'проверок'}`
              : 'Пока нет проверок'}
          </p>
        </div>
        <div className="flex gap-3">
          {audits.length >= 2 && (
            <Link
              href="/compare"
              className="px-4 py-2 rounded-lg border border-[var(--border)] text-sm font-medium hover:bg-[var(--muted)] transition-colors"
            >
              Сравнить
            </Link>
          )}
          <Link
            href="/audit"
            className="px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
          >
            + Новая проверка
          </Link>
        </div>
      </div>

      {audits.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-[var(--border)] rounded-2xl">
          <div className="text-5xl mb-4">📋</div>
          <h2 className="text-xl font-semibold mb-2">Пока нет проверок</h2>
          <p className="text-[var(--muted-foreground)] mb-6">
            Проверьте помещение — результат появится здесь
          </p>
          <Link
            href="/audit"
            className="inline-block px-6 py-3 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Проверить помещение
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {audits.map((audit) => (
            <Link
              key={audit.id}
              href={`/audit/${audit.id}`}
              className="block border border-[var(--border)] rounded-xl p-5 hover:border-[var(--primary)]/50 hover:bg-[var(--muted)]/30 transition-all group"
            >
              <div className="flex items-start gap-4">
                <ScoreRing score={audit.score} />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="font-semibold text-lg">
                      {venueLabels[audit.venueType] || audit.venueType}
                      <span className="text-[var(--muted-foreground)] font-normal ml-2">{audit.area} м²</span>
                    </h3>
                    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${verdictColors[audit.verdict]}`}>
                      {verdictLabels[audit.verdict]}
                    </span>
                  </div>

                  {audit.address && (
                    <p className="text-sm text-[var(--muted-foreground)] mt-1 truncate">{audit.address}</p>
                  )}

                  <div className="flex items-center gap-4 mt-3 text-sm text-[var(--muted-foreground)]">
                    <BlockDots blocks={audit.blocks} />
                    <span>{formatBudget(audit.budgetMin, audit.budgetMax)}</span>
                    <span className="hidden sm:inline">{formatDate(audit.createdAt)}</span>
                  </div>

                  {audit.topRisks.length > 0 && (
                    <p className="text-xs text-[var(--muted-foreground)] mt-2 truncate">
                      ⚠ {audit.topRisks[0].description}
                    </p>
                  )}
                </div>

                <svg className="w-5 h-5 text-[var(--muted-foreground)] group-hover:text-[var(--primary)] transition-colors flex-shrink-0 mt-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
