'use client'

import { FieldTooltip } from './FieldTooltip'
import {
  neighborsAboveLabels, neighborsBelowLabels, entranceGroupLabels,
  doorWidthLabels, basementAccessLabels, floorStructureLabels, facadeTypeLabels
} from '@/lib/validators/audit-schema'
import type { AuditFormValues } from '@/lib/validators/audit-schema'

interface StepProps {
  data: Partial<AuditFormValues>
  onChange: (field: string, value: unknown) => void
  errors: Record<string, string>
}

export function StepConstruction({ data, onChange, errors }: StepProps) {
  return (
    <div className="space-y-6">
      <FieldTooltip label="Соседи сверху" tooltip="Жилые сверху — ограничения по шуму, запрет вывода вытяжки через перекрытие, сложнее получить СЭС">
        <select
          value={data.neighborsAbove || 'residential'}
          onChange={(e) => onChange('neighborsAbove', e.target.value)}
          className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)] text-sm focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none"
        >
          {Object.entries(neighborsAboveLabels).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </FieldTooltip>

      <FieldTooltip label="Соседи снизу" tooltip="Прокладка канализации требует уклона. В подвал — нужна насосная установка (50–150 тыс.)">
        <select
          value={data.neighborsBelow || 'unknown'}
          onChange={(e) => onChange('neighborsBelow', e.target.value)}
          className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)] text-sm focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none"
        >
          {Object.entries(neighborsBelowLabels).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </FieldTooltip>

      <FieldTooltip label="Входная группа" tooltip="СанПиН требует раздельных входов для посетителей и персонала/грузов при определённых форматах">
        <select
          value={data.entranceGroup || 'separate_street'}
          onChange={(e) => onChange('entranceGroup', e.target.value)}
          className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)] text-sm focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none"
        >
          {Object.entries(entranceGroupLabels).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </FieldTooltip>

      <FieldTooltip label="Ширина дверных проёмов" tooltip="Пути эвакуации: ширина не менее 1.2 м при числе мест свыше 50. Пожарная безопасность">
        <select
          value={data.doorWidth || 'unknown'}
          onChange={(e) => onChange('doorWidth', e.target.value)}
          className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)] text-sm focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none"
        >
          {Object.entries(doorWidthLabels).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </FieldTooltip>

      <FieldTooltip label="Наличие подвала/техподполья" tooltip="Подвал = место для трасс вентиляции, канализации, электрощитовой. Существенно влияет на стоимость">
        <select
          value={data.basementAccess || 'unknown'}
          onChange={(e) => onChange('basementAccess', e.target.value)}
          className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)] text-sm focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none"
        >
          {Object.entries(basementAccessLabels).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </FieldTooltip>

      <FieldTooltip label="Тип перекрытий" tooltip="Деревянные — ограничения на мокрые процессы, пожарная категория, сложнее прокладка коммуникаций">
        <select
          value={data.floorStructure || 'unknown'}
          onChange={(e) => onChange('floorStructure', e.target.value)}
          className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)] text-sm focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none"
        >
          {Object.entries(floorStructureLabels).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </FieldTooltip>

      <FieldTooltip label="Фасад здания" tooltip="Влияет на возможность размещения вытяжки, кондиционеров, вывески">
        <select
          value={data.facadeType || 'unknown'}
          onChange={(e) => onChange('facadeType', e.target.value)}
          className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)] text-sm focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none"
        >
          {Object.entries(facadeTypeLabels).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </FieldTooltip>
    </div>
  )
}
