'use client'

import { useState } from 'react'

interface FieldTooltipProps {
  label: string
  tooltip: string
  required?: boolean
  children: React.ReactNode
}

export function FieldTooltip({ label, tooltip, required, children }: FieldTooltipProps) {
  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5">
        <label className="text-sm font-medium">
          {label}
          {required && <span className="text-[var(--destructive)] ml-0.5">*</span>}
        </label>
        <div className="relative">
          <button
            type="button"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            onClick={() => setShowTooltip(!showTooltip)}
            className="w-4 h-4 rounded-full bg-[var(--muted)] text-[var(--muted-foreground)] text-xs flex items-center justify-center hover:bg-[var(--border)] transition-colors"
            aria-label={`Подсказка: ${tooltip}`}
          >
            ?
          </button>
          {showTooltip && (
            <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 text-xs text-white bg-gray-800 rounded-lg shadow-lg max-w-xs whitespace-normal">
              {tooltip}
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-800 transform rotate-45 -mt-1" />
            </div>
          )}
        </div>
      </div>
      {children}
    </div>
  )
}
