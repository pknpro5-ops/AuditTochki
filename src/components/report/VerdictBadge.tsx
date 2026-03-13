'use client'

import type { Verdict } from '@/types/audit'
import { CheckCircleIcon, AlertTriangleIcon, XCircleIcon } from '@/components/ui/Icons'

const verdictConfig: Record<Verdict, { label: string; sublabel: string; bg: string; text: string; iconColor: string; Icon: typeof CheckCircleIcon }> = {
  GO: {
    label: 'МОЖНО ОТКРЫВАТЬ',
    sublabel: 'Помещение подходит для вашего формата',
    bg: 'bg-green-50 dark:bg-green-950/30 border-green-300 dark:border-green-700',
    text: 'text-green-700 dark:text-green-400',
    iconColor: 'text-green-500',
    Icon: CheckCircleIcon,
  },
  GO_WITH_RESERVATIONS: {
    label: 'МОЖНО С ОГОВОРКАМИ',
    sublabel: 'Есть проблемы, которые можно решить',
    bg: 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-300 dark:border-yellow-700',
    text: 'text-yellow-700 dark:text-yellow-400',
    iconColor: 'text-yellow-500',
    Icon: AlertTriangleIcon,
  },
  NO_GO: {
    label: 'НЕ РЕКОМЕНДУЕТСЯ',
    sublabel: 'Есть критические проблемы',
    bg: 'bg-red-50 dark:bg-red-950/20 border-red-300 dark:border-red-700',
    text: 'text-red-700 dark:text-red-400',
    iconColor: 'text-red-500',
    Icon: XCircleIcon,
  },
}

interface VerdictBadgeProps {
  verdict: Verdict
  summary: string
}

export function VerdictBadge({ verdict, summary }: VerdictBadgeProps) {
  const config = verdictConfig[verdict]

  return (
    <div className={`rounded-xl border-2 p-6 md:p-8 ${config.bg}`}>
      <div className="text-center">
        <div className={`${config.iconColor} mb-3 flex justify-center`}>
          <config.Icon size={48} />
        </div>
        <h2 className={`text-2xl md:text-3xl font-bold ${config.text}`}>
          {config.label}
        </h2>
        <p className={`text-sm mt-1 ${config.text} opacity-80`}>
          {config.sublabel}
        </p>
      </div>
      <p className="mt-4 text-center text-gray-700 dark:text-gray-300 leading-relaxed">{summary}</p>
    </div>
  )
}
