'use client'

import { useState, useEffect } from 'react'
import { venueTypeLabels } from '@/lib/validators/audit-schema'

interface BlockSummary {
  id: string
  title: string
  status: 'OK' | 'WARNING' | 'CRITICAL'
}

interface RiskSummary {
  rank: number
  description: string
  severity: 'high' | 'critical'
}

interface AuditItem {
  id: string
  venueType: string
  area: number
  address: string
  verdict: string
  score: number
  budgetMin: number
  budgetMax: number
  blocks: BlockSummary[]
  topRisks: RiskSummary[]
  createdAt: string
}

const verdictLabels: Record<string, string> = {
  GO: 'Можно открывать',
  GO_WITH_RESERVATIONS: 'С оговорками',
  NO_GO: 'Не рекомендуется',
}

const verdictColors: Record<string, string> = {
  GO: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  GO_WITH_RESERVATIONS: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  NO_GO: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
}

const statusColors: Record<string, string> = {
  OK: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  WARNING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  CRITICAL: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
}

const statusLabels: Record<string, string> = {
  OK: 'OK',
  WARNING: 'Внимание',
  CRITICAL: 'Критично',
}

function getScoreColor(score: number): string {
  if (score >= 85) return 'text-green-600'
  if (score >= 70) return 'text-lime-600'
  if (score >= 50) return 'text-yellow-600'
  if (score >= 30) return 'text-orange-600'
  return 'text-red-600'
}

export default function ComparePage() {
  const [audits, setAudits] = useState<AuditItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [comparing, setComparing] = useState(false)

  useEffect(() => {
    fetch('/api/audit/list')
      .then((res) => res.json())
      .then((data) => {
        setAudits(data.items || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const toggleSelection = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else if (next.size < 3) {
        next.add(id)
      }
      return next
    })
  }

  const selectedAudits = audits.filter((a) => selected.has(a.id))
  const blockIds = ['electrical', 'ventilation', 'water_sewage', 'fire_safety', 'sanitation', 'planning']
  const blockTitles: Record<string, string> = {
    electrical: 'Электрика',
    ventilation: 'Вентиляция',
    water_sewage: 'Водоснабжение',
    fire_safety: 'Пожарная безопасность',
    sanitation: 'Санитария',
    planning: 'Планировка',
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-[var(--muted)] rounded-lg w-48" />
          <div className="h-4 bg-[var(--muted)] rounded w-72" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-[var(--muted)] rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (audits.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Сравнение помещений</h1>
        <p className="text-[var(--muted-foreground)] mb-6">
          У вас пока нет завершённых аудитов для сравнения.
        </p>
        <a
          href="/audit"
          className="inline-block px-6 py-2.5 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-xl text-sm font-medium hover:brightness-110 transition-all"
        >
          Создать аудит
        </a>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <a href="/" className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
          ← На главную
        </a>
      </div>

      <h1 className="text-2xl font-bold mb-2">Сравнение помещений</h1>

      {!comparing ? (
        <>
          <p className="text-sm text-[var(--muted-foreground)] mb-6">
            Выберите 2–3 аудита для сравнения ({selected.size}/3)
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {audits.map((audit) => {
              const isSelected = selected.has(audit.id)
              const date = new Date(audit.createdAt).toLocaleDateString('ru-RU', {
                day: '2-digit', month: '2-digit', year: 'numeric',
              })

              return (
                <button
                  key={audit.id}
                  onClick={() => toggleSelection(audit.id)}
                  className={`text-left border rounded-xl p-4 transition-all ${
                    isSelected
                      ? 'border-[var(--primary)] bg-[var(--primary)]/5 shadow-md shadow-[var(--primary)]/10'
                      : 'border-[var(--border)] hover:border-[var(--primary)]/50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className="text-sm font-semibold">
                        {venueTypeLabels[audit.venueType] || audit.venueType}
                      </span>
                      <span className="text-xs text-[var(--muted-foreground)] ml-2">{audit.area} м²</span>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      isSelected
                        ? 'border-[var(--primary)] bg-[var(--primary)]'
                        : 'border-[var(--border)]'
                    }`}>
                      {isSelected && (
                        <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </div>
                  </div>
                  {audit.address && (
                    <p className="text-xs text-[var(--muted-foreground)] mb-2 truncate">{audit.address}</p>
                  )}
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${verdictColors[audit.verdict]}`}>
                      {verdictLabels[audit.verdict]}
                    </span>
                    <span className={`text-sm font-bold ${getScoreColor(audit.score)}`}>
                      {audit.score}/100
                    </span>
                    <span className="text-xs text-[var(--muted-foreground)] ml-auto">{date}</span>
                  </div>
                </button>
              )
            })}
          </div>

          {selected.size >= 2 && (
            <div className="text-center">
              <button
                onClick={() => setComparing(true)}
                className="px-8 py-3 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-xl text-sm font-medium hover:brightness-110 transition-all shadow-md shadow-[var(--primary)]/20"
              >
                Сравнить выбранные ({selected.size})
              </button>
            </div>
          )}
        </>
      ) : (
        <>
          <button
            onClick={() => setComparing(false)}
            className="text-sm text-[var(--primary)] hover:underline mb-6 inline-block"
          >
            ← Назад к выбору
          </button>

          {/* Comparison table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[600px]">
              <thead>
                <tr>
                  <th className="text-left p-3 border-b border-[var(--border)] text-sm font-semibold text-[var(--muted-foreground)] sticky left-0 bg-[var(--background)] z-10 min-w-[120px]">
                    Параметр
                  </th>
                  {selectedAudits.map((audit) => (
                    <th key={audit.id} className="p-3 border-b border-[var(--border)] text-center">
                      <div className="text-sm font-semibold">
                        {venueTypeLabels[audit.venueType] || audit.venueType}
                      </div>
                      <div className="text-xs text-[var(--muted-foreground)]">
                        {audit.area} м²
                        {audit.address && ` · ${audit.address.slice(0, 30)}`}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Verdict */}
                <tr>
                  <td className="p-3 border-b border-[var(--border)] text-sm font-medium sticky left-0 bg-[var(--background)] z-10">Вердикт</td>
                  {selectedAudits.map((audit) => (
                    <td key={audit.id} className="p-3 border-b border-[var(--border)] text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${verdictColors[audit.verdict]}`}>
                        {verdictLabels[audit.verdict]}
                      </span>
                    </td>
                  ))}
                </tr>

                {/* Score */}
                <tr>
                  <td className="p-3 border-b border-[var(--border)] text-sm font-medium sticky left-0 bg-[var(--background)] z-10">Рейтинг</td>
                  {selectedAudits.map((audit) => (
                    <td key={audit.id} className="p-3 border-b border-[var(--border)] text-center">
                      <span className={`text-2xl font-bold ${getScoreColor(audit.score)}`}>
                        {audit.score}
                      </span>
                      <span className="text-xs text-[var(--muted-foreground)]">/100</span>
                    </td>
                  ))}
                </tr>

                {/* Blocks */}
                {blockIds.map((blockId) => (
                  <tr key={blockId}>
                    <td className="p-3 border-b border-[var(--border)] text-sm font-medium sticky left-0 bg-[var(--background)] z-10">
                      {blockTitles[blockId]}
                    </td>
                    {selectedAudits.map((audit) => {
                      const block = audit.blocks.find((b) => b.id === blockId)
                      const status = block?.status || 'OK'
                      return (
                        <td key={audit.id} className="p-3 border-b border-[var(--border)] text-center">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[status]}`}>
                            {statusLabels[status]}
                          </span>
                        </td>
                      )
                    })}
                  </tr>
                ))}

                {/* Budget */}
                <tr>
                  <td className="p-3 border-b border-[var(--border)] text-sm font-medium sticky left-0 bg-[var(--background)] z-10">Бюджет</td>
                  {selectedAudits.map((audit) => (
                    <td key={audit.id} className="p-3 border-b border-[var(--border)] text-center text-sm">
                      <span className="font-semibold">{audit.budgetMin}–{audit.budgetMax}</span>
                      <span className="text-xs text-[var(--muted-foreground)]"> тыс. ₽</span>
                    </td>
                  ))}
                </tr>

                {/* Top risks */}
                <tr>
                  <td className="p-3 border-b border-[var(--border)] text-sm font-medium align-top sticky left-0 bg-[var(--background)] z-10">Топ-3 риска</td>
                  {selectedAudits.map((audit) => (
                    <td key={audit.id} className="p-3 border-b border-[var(--border)] text-sm">
                      <ol className="space-y-1">
                        {audit.topRisks.map((risk) => (
                          <li key={risk.rank} className="flex gap-1.5 text-xs">
                            <span className={`shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${
                              risk.severity === 'critical' ? 'bg-red-500' : 'bg-orange-500'
                            }`}>
                              {risk.rank}
                            </span>
                            <span>{risk.description}</span>
                          </li>
                        ))}
                      </ol>
                    </td>
                  ))}
                </tr>

                {/* Links */}
                <tr>
                  <td className="p-3 text-sm font-medium sticky left-0 bg-[var(--background)] z-10">Отчёт</td>
                  {selectedAudits.map((audit) => (
                    <td key={audit.id} className="p-3 text-center">
                      <a
                        href={`/audit/${audit.id}`}
                        className="text-sm text-[var(--primary)] hover:underline font-medium"
                      >
                        Открыть →
                      </a>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
