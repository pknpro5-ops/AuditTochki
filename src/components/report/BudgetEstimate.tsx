'use client'

import type { AuditReport } from '@/types/audit'

interface BudgetEstimateProps {
  budget: AuditReport['budget']
}

export function BudgetEstimate({ budget }: BudgetEstimateProps) {
  return (
    <div className="border border-[var(--border)] rounded-xl p-6 card-hover">
      <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-[var(--primary)]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
        Оценка бюджета на дооснащение
      </h3>

      <div className="flex items-center justify-between mb-4">
        <div className="text-center">
          <p className="text-sm text-[var(--muted-foreground)]">Минимум</p>
          <p className="text-2xl font-bold text-green-600">{budget.min.toLocaleString('ru')} тыс. ₽</p>
        </div>
        <div className="flex-1 mx-4 h-2 bg-gradient-to-r from-green-200 via-yellow-200 to-red-200 rounded-full" />
        <div className="text-center">
          <p className="text-sm text-[var(--muted-foreground)]">Максимум</p>
          <p className="text-2xl font-bold text-red-600">{budget.max.toLocaleString('ru')} тыс. ₽</p>
        </div>
      </div>

      {budget.breakdown && budget.breakdown.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2 text-[var(--muted-foreground)]">Разбивка по статьям:</h4>
          <div className="space-y-2">
            {budget.breakdown.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm py-1 border-b border-[var(--border)] last:border-0">
                <span>{item.item}</span>
                <span className="font-medium">{item.min}–{item.max} тыс. ₽</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
