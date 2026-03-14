'use client'

import { FieldTooltip } from './FieldTooltip'
import {
  airConditioningLabels, internetTypeLabels
} from '@/lib/validators/audit-schema'
import type { AuditFormValues } from '@/lib/validators/audit-schema'

interface StepProps {
  data: Partial<AuditFormValues>
  onChange: (field: string, value: unknown) => void
  errors: Record<string, string>
}

export function StepAdditionalEngineering({ data, onChange, errors }: StepProps) {
  return (
    <div className="space-y-6">
      <FieldTooltip label="Кондиционирование" tooltip="Кондиционирование обязательно в зале. Установка сплит-систем может быть ограничена фасадными правилами.">
        <select
          value={data.airConditioning || 'unknown'}
          onChange={(e) => onChange('airConditioning', e.target.value)}
          className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)] text-sm focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none"
        >
          {Object.entries(airConditioningLabels).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </FieldTooltip>

      <FieldTooltip label="Количество санузлов" tooltip="По СанПиН минимум 1 для персонала + 1 для посетителей. При 50+ мест — раздельные М/Ж.">
        <input
          type="number"
          value={data.restroomCount ?? 0}
          onChange={(e) => onChange('restroomCount', e.target.value ? Number(e.target.value) : 0)}
          placeholder="0"
          min={0}
          max={10}
          className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)] text-sm focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none"
        />
        {errors.restroomCount && <p className="text-xs text-red-500 mt-1" data-field-error="true">{errors.restroomCount}</p>}
      </FieldTooltip>

      <FieldTooltip label="Интернет" tooltip="Оптоволокно — для стабильной работы кассовых систем, видеонаблюдения и онлайн-заказов.">
        <select
          value={data.internetType || 'unknown'}
          onChange={(e) => onChange('internetType', e.target.value)}
          className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)] text-sm focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none"
        >
          {Object.entries(internetTypeLabels).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </FieldTooltip>
    </div>
  )
}
