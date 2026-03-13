'use client'

import type { AnalysisBlock } from '@/types/audit'
import { ElectricalIcon, VentilationIcon, WaterIcon, FireIcon, SanitaryIcon, PlanningIcon } from '@/components/ui/Icons'

const blockIconMap: Record<string, typeof ElectricalIcon> = {
  electrical: ElectricalIcon,
  ventilation: VentilationIcon,
  water_sewage: WaterIcon,
  fire_safety: FireIcon,
  sanitation: SanitaryIcon,
  planning: PlanningIcon,
}

const statusStyles = {
  OK: {
    bg: 'bg-green-100 dark:bg-green-900/30',
    border: 'border-green-300 dark:border-green-700',
    text: 'text-green-800 dark:text-green-300',
    icon: 'text-green-600 dark:text-green-400',
    label: 'OK',
  },
  WARNING: {
    bg: 'bg-yellow-100 dark:bg-yellow-900/30',
    border: 'border-yellow-300 dark:border-yellow-700',
    text: 'text-yellow-800 dark:text-yellow-300',
    icon: 'text-yellow-600 dark:text-yellow-400',
    label: 'Внимание',
  },
  CRITICAL: {
    bg: 'bg-red-100 dark:bg-red-900/30',
    border: 'border-red-300 dark:border-red-700',
    text: 'text-red-800 dark:text-red-300',
    icon: 'text-red-600 dark:text-red-400',
    label: 'Критично',
  },
}

interface RiskHeatmapProps {
  blocks: AnalysisBlock[]
}

export function RiskHeatmap({ blocks }: RiskHeatmapProps) {
  return (
    <div className="border border-[var(--border)] rounded-xl p-6 card-hover animate-fade-in-up">
      <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-[var(--primary)]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
        Тепловая карта рисков
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {blocks.map((block) => {
          const style = statusStyles[block.status]
          const BlockIcon = blockIconMap[block.id] || PlanningIcon
          const findingsCount = block.findings.length

          return (
            <div
              key={block.id}
              className={`${style.bg} ${style.border} border rounded-xl p-4 flex flex-col items-center text-center gap-2 transition-all hover:scale-[1.02]`}
            >
              <span className={style.icon}>
                <BlockIcon size={28} />
              </span>
              <span className={`text-xs font-semibold ${style.text}`}>
                {block.title}
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${style.bg} ${style.text} border ${style.border}`}>
                {style.label}
                {findingsCount > 0 && ` · ${findingsCount}`}
              </span>
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-4 text-xs text-[var(--muted-foreground)]">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-green-400" />
          OK
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-yellow-400" />
          Внимание
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-red-400" />
          Критично
        </span>
      </div>
    </div>
  )
}
