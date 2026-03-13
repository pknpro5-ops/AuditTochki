'use client'

import type { RiskItem } from '@/types/audit'
import { AlertOctagonIcon } from '@/components/ui/Icons'

interface RisksListProps {
  risks: RiskItem[]
}

export function RisksList({ risks }: RisksListProps) {
  if (!risks || risks.length === 0) return null

  return (
    <div className="border border-[var(--border)] rounded-xl p-6 card-hover">
      <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
        <AlertOctagonIcon size={20} className="text-red-500" />
        Ключевые риски
      </h3>
      <div className="space-y-3">
        {risks.map((risk) => (
          <div
            key={risk.rank}
            className={`flex items-start gap-3 p-3 rounded-lg ${
              risk.severity === 'critical'
                ? 'bg-red-50 dark:bg-red-950/20'
                : 'bg-yellow-50 dark:bg-yellow-950/20'
            }`}
          >
            <span className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold text-white ${
              risk.severity === 'critical' ? 'bg-red-500' : 'bg-yellow-500'
            }`}>
              {risk.rank}
            </span>
            <div>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{risk.description}</p>
              <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-medium ${
                risk.severity === 'critical'
                  ? 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300'
                  : 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300'
              }`}>
                {risk.severity === 'critical' ? 'Критический' : 'Высокий'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
