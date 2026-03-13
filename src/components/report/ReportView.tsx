'use client'

import { useCallback, useState } from 'react'
import type { AuditReport } from '@/types/audit'
import { getEffectiveScore } from '@/lib/utils/score'
import { VerdictBadge } from './VerdictBadge'
import { AnalysisBlock } from './AnalysisBlock'
import { BudgetEstimate } from './BudgetEstimate'
import { RisksList } from './RisksList'
import { RatingGauge } from './RatingGauge'
import { RiskHeatmap } from './RiskHeatmap'
import { EmailSender } from './EmailSender'
import { ClipboardIcon, PrinterIcon, ExcelIcon, CompareIcon } from '@/components/ui/Icons'

interface ReportViewProps {
  report: AuditReport
  auditId: string
  tier?: string
}

export function ReportView({ report, auditId, tier = 'FREE' }: ReportViewProps) {
  const isPaid = tier !== 'FREE'
  const effectiveScore = getEffectiveScore(report)
  const [moreOpen, setMoreOpen] = useState(false)

  const handleCopyReport = useCallback(async () => {
    const text = `Вердикт: ${report.verdict}\nРейтинг: ${effectiveScore}/100\n${report.summary}\n\nРиски:\n${
      report.top_risks.map(r => `${r.rank}. ${r.description}`).join('\n')
    }\n\nСледующие шаги:\n${
      (report.next_steps || []).map((s, i) => `${i + 1}. ${s}`).join('\n')
    }`
    try {
      await navigator.clipboard.writeText(text)
    } catch {}
  }, [report])

  const handlePrint = useCallback(() => {
    window.print()
  }, [])

  return (
    <div className="space-y-6">
      {/* Verdict + Rating */}
      <div className="animate-fade-in-up">
        <VerdictBadge verdict={report.verdict} summary={report.summary} />
      </div>

      {/* Rating Gauge */}
      <div className="animate-fade-in-up delay-50">
        <RatingGauge score={effectiveScore} />
      </div>

      {/* Risk Heatmap */}
      <div className="animate-fade-in-up delay-75">
        <RiskHeatmap blocks={report.blocks} />
      </div>

      {/* Analysis Blocks */}
      <div className="animate-fade-in-up delay-100">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-[var(--primary)]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 3v18"/>
          </svg>
          Анализ по 6 блокам
        </h2>
        <div className="space-y-3">
          {report.blocks.map((block) => (
            <AnalysisBlock key={block.id} block={block} />
          ))}
        </div>
      </div>

      {/* Budget */}
      <div className="animate-fade-in-up delay-200">
        <BudgetEstimate budget={report.budget} />
      </div>

      {/* Risks */}
      <div className="animate-fade-in-up delay-300">
        <RisksList risks={report.top_risks} />
      </div>

      {/* Next Steps */}
      {report.next_steps && report.next_steps.length > 0 && (
        <div className="animate-fade-in-up delay-400 border border-[var(--border)] rounded-xl p-6 card-hover">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-[var(--primary)]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
              <path d="M9 14l2 2 4-4"/>
            </svg>
            Следующие шаги
          </h3>
          <ol className="space-y-3">
            {report.next_steps.map((step, index) => (
              <li key={index} className="flex gap-3 text-sm">
                <span className="flex-shrink-0 w-7 h-7 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg flex items-center justify-center text-xs font-bold">
                  {index + 1}
                </span>
                <span className="pt-1">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Actions - sticky on mobile */}
      <div className="animate-fade-in-up delay-500">
        {/* Desktop: all visible */}
        <div className="hidden md:flex flex-wrap gap-3">
          {isPaid ? (
            <a
              href={`/api/audit/${auditId}/pdf`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-xl text-sm font-medium hover:brightness-110 transition-all shadow-md shadow-[var(--primary)]/20 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
              Скачать PDF
            </a>
          ) : (
            <span className="px-6 py-2.5 bg-gray-400/30 text-[var(--muted-foreground)] rounded-xl text-sm font-medium cursor-not-allowed flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
              PDF доступен в платном тарифе
            </span>
          )}
          <a href="/audit" className="px-5 py-2.5 border border-[var(--border)] rounded-xl text-sm font-medium hover:bg-[var(--muted)] transition-all">
            Новая проверка
          </a>
          <button onClick={handleCopyReport} className="px-5 py-2.5 border border-[var(--border)] rounded-xl text-sm font-medium hover:bg-[var(--muted)] transition-all flex items-center gap-2">
            <ClipboardIcon size={16} /> Копировать
          </button>
          <button onClick={handlePrint} className="px-5 py-2.5 border border-[var(--border)] rounded-xl text-sm font-medium hover:bg-[var(--muted)] transition-all flex items-center gap-2">
            <PrinterIcon size={16} /> Печать
          </button>
          <a href={`/api/audit/${auditId}/excel`} target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 border border-[var(--border)] rounded-xl text-sm font-medium hover:bg-[var(--muted)] transition-all flex items-center gap-2">
            <ExcelIcon size={16} /> Excel
          </a>
          <a href="/compare" className="px-5 py-2.5 border border-[var(--border)] rounded-xl text-sm font-medium hover:bg-[var(--muted)] transition-all flex items-center gap-2">
            <CompareIcon size={16} /> Сравнить
          </a>
        </div>

        {/* Mobile: sticky bottom bar */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[var(--background)]/95 backdrop-blur border-t border-[var(--border)] p-3 z-40 flex gap-2">
          {isPaid ? (
            <a
              href={`/api/audit/${auditId}/pdf`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2.5 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-xl text-sm font-medium text-center shadow-md"
            >
              Скачать PDF
            </a>
          ) : (
            <a href="/audit" className="flex-1 py-2.5 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-xl text-sm font-medium text-center shadow-md">
              Новая проверка
            </a>
          )}
          <div className="relative">
            <button
              onClick={() => setMoreOpen(!moreOpen)}
              className="py-2.5 px-3 border border-[var(--border)] rounded-xl text-sm font-medium hover:bg-[var(--muted)] transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
            </button>
            {moreOpen && (
              <div className="absolute bottom-full right-0 mb-2 w-48 bg-[var(--background)] border border-[var(--border)] rounded-xl shadow-lg overflow-hidden animate-scale-in">
                <button onClick={() => { handleCopyReport(); setMoreOpen(false) }} className="w-full px-4 py-2.5 text-sm text-left hover:bg-[var(--muted)] flex items-center gap-2">
                  <ClipboardIcon size={14} /> Копировать
                </button>
                <button onClick={() => { handlePrint(); setMoreOpen(false) }} className="w-full px-4 py-2.5 text-sm text-left hover:bg-[var(--muted)] flex items-center gap-2">
                  <PrinterIcon size={14} /> Печать
                </button>
                <a href={`/api/audit/${auditId}/excel`} target="_blank" rel="noopener noreferrer" className="block px-4 py-2.5 text-sm hover:bg-[var(--muted)] flex items-center gap-2">
                  <ExcelIcon size={14} /> Excel
                </a>
                <a href="/compare" className="block px-4 py-2.5 text-sm hover:bg-[var(--muted)] flex items-center gap-2">
                  <CompareIcon size={14} /> Сравнить
                </a>
                {isPaid && (
                  <a href="/audit" className="block px-4 py-2.5 text-sm hover:bg-[var(--muted)] border-t border-[var(--border)]">
                    Новая проверка
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
        {/* Spacer for sticky bar on mobile */}
        <div className="md:hidden h-16" />
      </div>

      {/* Email */}
      <div className="border border-[var(--border)] rounded-xl p-4 card-hover">
        <h3 className="font-medium text-sm mb-3 flex items-center gap-2">
          <svg className="w-4 h-4 text-[var(--primary)]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          Отправить отчёт на email
        </h3>
        <EmailSender auditId={auditId} />
      </div>

      {/* Disclaimer */}
      <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl text-xs">
        <p className="font-medium mb-1 text-amber-800 dark:text-amber-200 flex items-center gap-1.5">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          Дисклеймер
        </p>
        <p className="text-amber-700 dark:text-amber-300">{report.disclaimer}</p>
      </div>

      {/* CTA for full service */}
      <div className="border-2 border-[var(--primary)]/30 bg-[var(--primary)]/5 rounded-xl p-6 text-center">
        <h3 className="font-semibold text-lg mb-2">Нужен детальный проект?</h3>
        <p className="text-sm text-[var(--muted-foreground)] mb-4">
          Закажите полноценное ТЗ на инженерные системы от профессиональных проектировщиков
        </p>
        <a
          href="https://hot-plan.ru"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-6 py-2.5 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-xl text-sm font-medium hover:brightness-110 transition-all shadow-md shadow-[var(--primary)]/20"
        >
          Получить ТЗ от проектировщика &rarr;
        </a>
      </div>
    </div>
  )
}
