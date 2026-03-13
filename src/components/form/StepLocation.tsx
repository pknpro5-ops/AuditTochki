'use client'

import { FieldTooltip } from './FieldTooltip'
import {
  currentConditionLabels, previousUseLabels
} from '@/lib/validators/audit-schema'
import type { AuditFormValues } from '@/lib/validators/audit-schema'

interface StepProps {
  data: Partial<AuditFormValues>
  onChange: (field: string, value: unknown) => void
  errors: Record<string, string>
}

export function StepLocation({ data, onChange, errors }: StepProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Блок 5. Локация и состояние</h2>
      <p className="text-sm text-[var(--muted-foreground)]">Информация о расположении и текущем состоянии помещения</p>

      <FieldTooltip label="Адрес помещения" tooltip="Точный адрес поможет учесть требования конкретного района — зоны ограничений, близость к школам и т.д.">
        <input
          type="text"
          value={data.address || ''}
          onChange={(e) => onChange('address', e.target.value)}
          placeholder="Например, ул. Ленина, 15"
          maxLength={500}
          className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)] text-sm focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none"
        />
        {errors.address && <p className="text-xs text-red-500 mt-1" data-field-error="true">{errors.address}</p>}
      </FieldTooltip>

      <FieldTooltip label="Район / микрорайон" tooltip="Район может влиять на пешеходный трафик, целевую аудиторию и требования к алкогольной лицензии">
        <input
          type="text"
          value={data.district || ''}
          onChange={(e) => onChange('district', e.target.value)}
          placeholder="Например, Центральный район"
          maxLength={200}
          className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)] text-sm focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none"
        />
        {errors.district && <p className="text-xs text-red-500 mt-1" data-field-error="true">{errors.district}</p>}
      </FieldTooltip>

      <FieldTooltip label="Текущее состояние помещения" tooltip="Shell & Core — голые стены, нужен полный ремонт. После арендатора — частичный ремонт. Это сильно влияет на бюджет.">
        <select
          value={data.currentCondition || 'unknown'}
          onChange={(e) => onChange('currentCondition', e.target.value)}
          className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)] text-sm focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none"
        >
          {Object.entries(currentConditionLabels).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </FieldTooltip>

      <FieldTooltip label="Предыдущее использование" tooltip="Если ранее был общепит — часть инженерных систем может быть на месте. Это существенно снижает стартовые затраты.">
        <select
          value={data.previousUse || 'unknown'}
          onChange={(e) => onChange('previousUse', e.target.value)}
          className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)] text-sm focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none"
        >
          {Object.entries(previousUseLabels).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </FieldTooltip>
    </div>
  )
}
