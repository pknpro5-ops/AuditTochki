'use client'

import { useState } from 'react'
import type { AnalysisBlock as AnalysisBlockType } from '@/types/audit'
import { ElectricalIcon, VentilationIcon, WaterIcon, FireIcon, SanitaryIcon, PlanningIcon, CheckCircleIcon, AlertTriangleIcon, XCircleIcon } from '@/components/ui/Icons'

const statusConfig = {
  OK: { label: 'OK', bg: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300', Icon: CheckCircleIcon, iconColor: 'text-green-600' },
  WARNING: { label: 'Предупреждение', bg: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300', Icon: AlertTriangleIcon, iconColor: 'text-yellow-600' },
  CRITICAL: { label: 'Критично', bg: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300', Icon: XCircleIcon, iconColor: 'text-red-600' },
}

const blockIconMap: Record<string, typeof ElectricalIcon> = {
  electrical: ElectricalIcon,
  ventilation: VentilationIcon,
  water_sewage: WaterIcon,
  fire_safety: FireIcon,
  sanitation: SanitaryIcon,
  planning: PlanningIcon,
}

const blockColors: Record<string, string> = {
  electrical: 'text-yellow-400',
  ventilation: 'text-sky-400',
  water_sewage: 'text-blue-400',
  fire_safety: 'text-orange-400',
  sanitation: 'text-emerald-400',
  planning: 'text-violet-400',
}

interface AnalysisBlockProps {
  block: AnalysisBlockType
}

export function AnalysisBlock({ block }: AnalysisBlockProps) {
  const [isExpanded, setIsExpanded] = useState(block.status !== 'OK')
  const config = statusConfig[block.status]
  const BlockIcon = blockIconMap[block.id] || PlanningIcon
  const blockColor = blockColors[block.id] || 'text-gray-400'

  return (
    <div className="border border-[var(--border)] rounded-xl overflow-hidden card-hover">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-[var(--muted)] transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className={blockColor}>
            <BlockIcon size={24} />
          </span>
          <div className="text-left">
            <h3 className="font-semibold text-sm">{block.title}</h3>
            <span className={`inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${config.bg}`}>
              <config.Icon size={12} className={config.iconColor} />
              {config.label}
            </span>
          </div>
        </div>
        <svg
          className={`w-5 h-5 transition-transform duration-200 text-[var(--muted-foreground)] ${isExpanded ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && block.findings.length > 0 && (
        <div className="px-4 pb-4 space-y-3 border-t border-[var(--border)] animate-fade-in">
          {block.findings.map((finding, index) => {
            const severityColors = {
              info: 'border-l-blue-400 bg-blue-50 dark:bg-blue-950/20',
              warning: 'border-l-yellow-400 bg-yellow-50 dark:bg-yellow-950/20',
              critical: 'border-l-red-400 bg-red-50 dark:bg-red-950/20',
            }

            return (
              <div key={index} className={`mt-3 border-l-4 rounded-r-lg p-3 ${severityColors[finding.severity]}`}>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{finding.description}</p>
                {finding.recommendation && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {finding.recommendation}
                  </p>
                )}
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  {finding.regulation}
                </p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
