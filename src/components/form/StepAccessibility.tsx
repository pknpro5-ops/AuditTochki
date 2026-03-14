'use client'

import { FieldTooltip } from './FieldTooltip'
import {
  parkingTypeLabels, wheelchairAccessLabels, loadingZoneLabels
} from '@/lib/validators/audit-schema'
import type { AuditFormValues } from '@/lib/validators/audit-schema'

interface StepProps {
  data: Partial<AuditFormValues>
  onChange: (field: string, value: unknown) => void
  errors: Record<string, string>
}

export function StepAccessibility({ data, onChange, errors }: StepProps) {
  return (
    <div className="space-y-6">
      <FieldTooltip label="Парковка" tooltip="Наличие парковки влияет на проходимость и удобство для гостей. Важно для ресторанов и заведений с доставкой.">
        <select
          value={data.parkingType || 'unknown'}
          onChange={(e) => onChange('parkingType', e.target.value)}
          className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)] text-sm focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none"
        >
          {Object.entries(parkingTypeLabels).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </FieldTooltip>

      {data.parkingType && data.parkingType !== 'none' && data.parkingType !== 'unknown' && (
        <FieldTooltip label="Количество парковочных мест" tooltip="Укажите приблизительное количество мест для парковки рядом с заведением">
          <input
            type="number"
            value={data.parkingSpaces ?? ''}
            onChange={(e) => onChange('parkingSpaces', e.target.value ? Number(e.target.value) : null)}
            placeholder="Например, 10"
            min={0}
            max={500}
            className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)] text-sm focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none"
          />
          {errors.parkingSpaces && <p className="text-xs text-red-500 mt-1" data-field-error="true">{errors.parkingSpaces}</p>}
        </FieldTooltip>
      )}

      <FieldTooltip label="Доступ для маломобильных групп (МГН)" tooltip="По закону общепит должен быть доступен для инвалидов. Отсутствие пандуса/подъёмника = предписание и штраф.">
        <select
          value={data.wheelchairAccess || 'unknown'}
          onChange={(e) => onChange('wheelchairAccess', e.target.value)}
          className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)] text-sm focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none"
        >
          {Object.entries(wheelchairAccessLabels).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </FieldTooltip>

      <FieldTooltip label="Зона разгрузки" tooltip="Отдельный вход для разгрузки — требование СанПиН. Разгрузка через зал с гостями запрещена.">
        <select
          value={data.loadingZone || 'unknown'}
          onChange={(e) => onChange('loadingZone', e.target.value)}
          className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)] text-sm focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none"
        >
          {Object.entries(loadingZoneLabels).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </FieldTooltip>
    </div>
  )
}
