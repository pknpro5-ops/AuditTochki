'use client'

interface RatingGaugeProps {
  score: number // 0-100
}

function getScoreColor(score: number): string {
  if (score >= 85) return '#22c55e' // green-500
  if (score >= 70) return '#84cc16' // lime-500
  if (score >= 50) return '#eab308' // yellow-500
  if (score >= 30) return '#f97316' // orange-500
  return '#ef4444' // red-500
}

function getScoreLabel(score: number): string {
  if (score >= 85) return 'Отлично'
  if (score >= 70) return 'Хорошо'
  if (score >= 50) return 'Удовлетворительно'
  if (score >= 30) return 'Проблемное'
  return 'Непригодно'
}

function getScoreDescription(score: number): string {
  if (score >= 85) return 'Минимальные доработки для открытия'
  if (score >= 70) return 'Посильные доработки, помещение подходит'
  if (score >= 50) return 'Потребуются значительные вложения'
  if (score >= 30) return 'Крупные вложения и высокие риски'
  return 'Критические проблемы, рекомендуется искать другое'
}

export function RatingGauge({ score }: RatingGaugeProps) {
  const clampedScore = Math.max(0, Math.min(100, Math.round(score)))
  const color = getScoreColor(clampedScore)
  const label = getScoreLabel(clampedScore)
  const description = getScoreDescription(clampedScore)

  // Semi-circle gauge: arc from 180° to 0° (left to right)
  const radius = 80
  const strokeWidth = 12
  const cx = 100
  const cy = 95
  const circumference = Math.PI * radius // half circle
  const progress = (clampedScore / 100) * circumference

  // Arc path for the background (180° arc)
  const arcPath = `M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`

  // Color stops for the gradient track
  const gradientStops = [
    { offset: '0%', color: '#ef4444' },
    { offset: '25%', color: '#f97316' },
    { offset: '50%', color: '#eab308' },
    { offset: '75%', color: '#84cc16' },
    { offset: '100%', color: '#22c55e' },
  ]

  return (
    <div className="border border-[var(--border)] rounded-xl p-6 card-hover animate-fade-in-up">
      <h3 className="font-semibold text-lg mb-2 text-center">Рейтинг помещения</h3>

      <div className="flex flex-col items-center">
        {/* SVG Gauge */}
        <svg width="200" height="120" viewBox="0 0 200 120" className="overflow-visible">
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              {gradientStops.map((stop) => (
                <stop key={stop.offset} offset={stop.offset} stopColor={stop.color} />
              ))}
            </linearGradient>
          </defs>

          {/* Background track */}
          <path
            d={arcPath}
            fill="none"
            stroke="var(--muted)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Colored progress arc */}
          <path
            d={arcPath}
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={`${progress} ${circumference}`}
            className="transition-all duration-1000 ease-out"
          />

          {/* Needle indicator */}
          {(() => {
            const angle = Math.PI - (clampedScore / 100) * Math.PI
            const needleLen = radius - 20
            const nx = cx + needleLen * Math.cos(angle)
            const ny = cy - needleLen * Math.sin(angle)
            return (
              <>
                <circle cx={cx} cy={cy} r={4} fill={color} />
                <line
                  x1={cx}
                  y1={cy}
                  x2={nx}
                  y2={ny}
                  stroke={color}
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </>
            )
          })()}

          {/* Score number */}
          <text
            x={cx}
            y={cy - 20}
            textAnchor="middle"
            fill="currentColor"
            fontSize="36"
            fontWeight="700"
          >
            {clampedScore}
          </text>
          <text
            x={cx}
            y={cy - 5}
            textAnchor="middle"
            fill="var(--muted-foreground)"
            fontSize="11"
          >
            из 100
          </text>

          {/* Min/Max labels */}
          <text x={cx - radius - 2} y={cy + 16} textAnchor="middle" fill="var(--muted-foreground)" fontSize="10">0</text>
          <text x={cx + radius + 2} y={cy + 16} textAnchor="middle" fill="var(--muted-foreground)" fontSize="10">100</text>
        </svg>

        {/* Label and description */}
        <div
          className="mt-2 px-4 py-1.5 rounded-full text-sm font-semibold"
          style={{ backgroundColor: `${color}20`, color }}
        >
          {label}
        </div>
        <p className="text-sm text-[var(--muted-foreground)] text-center mt-2 max-w-xs">
          {description}
        </p>

        {/* Color scale legend */}
        <div className="mt-4 w-full max-w-xs">
          <div className="h-2 rounded-full overflow-hidden flex">
            <div className="flex-1 bg-red-500" />
            <div className="flex-1 bg-orange-500" />
            <div className="flex-1 bg-yellow-500" />
            <div className="flex-1 bg-lime-500" />
            <div className="flex-1 bg-green-500" />
          </div>
          <div className="flex justify-between mt-1 text-[10px] text-[var(--muted-foreground)]">
            <span>Непригодно</span>
            <span>Проблемно</span>
            <span>Средне</span>
            <span>Хорошо</span>
            <span>Отлично</span>
          </div>
        </div>
      </div>
    </div>
  )
}
