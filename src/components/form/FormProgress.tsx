'use client'

const steps = [
  { label: 'Базовые параметры', short: 'Базовые' },
  { label: 'Инженерные коммуникации', short: 'Инженерные' },
  { label: 'Конструктив', short: 'Конструктив' },
  { label: 'Концепция и юридика', short: 'Концепция' },
  { label: 'Локация и состояние', short: 'Локация' },
  { label: 'Доп. инженерные', short: 'Доп. инж.' },
  { label: 'Доступность', short: 'Доступность' },
  { label: 'Проверка', short: 'Проверка' },
]

interface FormProgressProps {
  currentStep: number
  onStepClick: (step: number) => void
  completedSteps: Set<number>
}

export function FormProgress({ currentStep, onStepClick, completedSteps }: FormProgressProps) {
  const progressPercent = Math.round(((currentStep) / (steps.length - 1)) * 100)

  return (
    <div className="mb-8">
      {/* Mobile: progress bar */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold">
            {steps[currentStep].label}
          </span>
          <span className="text-xs text-[var(--muted-foreground)]">
            {currentStep + 1}/{steps.length}
          </span>
        </div>
        <div className="h-2 bg-[var(--muted)] rounded-full overflow-hidden mb-2">
          <div
            className="h-full bg-gradient-to-r from-[var(--primary)] to-violet-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-xs text-[var(--muted-foreground)]">
          <span>{progressPercent}% завершено</span>
          {currentStep < 7 && (
            <span>~{Math.max(1, Math.ceil((steps.length - currentStep - 1) * 0.3))} мин до конца</span>
          )}
        </div>
      </div>

      {/* Desktop: step circles */}
      <div className="hidden md:flex items-center justify-between">
        {steps.map((step, index) => {
          const isActive = index === currentStep
          const isCompleted = completedSteps.has(index)
          const isClickable = isCompleted || index <= currentStep

          return (
            <div key={index} className="flex items-center flex-1 last:flex-none min-w-0">
              <button
                onClick={() => isClickable && onStepClick(index)}
                disabled={!isClickable}
                className={`flex items-center gap-1 shrink-0 ${isClickable ? 'cursor-pointer' : 'cursor-not-allowed'} group`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-300 ${
                    isActive
                      ? 'bg-[var(--primary)] text-[var(--primary-foreground)] shadow-md shadow-[var(--primary)]/30 scale-110'
                      : isCompleted
                        ? 'bg-green-500 text-white'
                        : 'bg-[var(--muted)] text-[var(--muted-foreground)]'
                  }`}
                >
                  {isCompleted ? (
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : index + 1}
                </div>
                <span className={`hidden lg:block text-xs transition-colors truncate max-w-[70px] ${
                  isActive ? 'font-semibold text-[var(--foreground)]' : 'text-[var(--muted-foreground)] group-hover:text-[var(--foreground)]'
                }`}>
                  {step.short}
                </span>
              </button>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-1 rounded-full transition-colors duration-300 min-w-[8px] ${isCompleted ? 'bg-green-500' : 'bg-[var(--border)]'}`} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
