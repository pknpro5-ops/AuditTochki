'use client'

import { FieldTooltip } from './FieldTooltip'
import {
  venueTypeLabels, buildingTypeLabels, floorLabels, kitchenTypeLabels
} from '@/lib/validators/audit-schema'
import type { AuditFormValues } from '@/lib/validators/audit-schema'

interface StepProps {
  data: Partial<AuditFormValues>
  onChange: (field: string, value: unknown) => void
  errors: Record<string, string>
}

const baseInput = "w-full px-3 py-2 border rounded-lg bg-[var(--background)] text-sm focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none transition-colors"
const inputClass = (hasError: boolean) =>
  `${baseInput} ${hasError ? 'border-red-500 bg-red-50/50 dark:bg-red-950/20' : 'border-[var(--border)]'}`

const venueTypeIcons: Record<string, string> = {
  restaurant: '🍽',
  cafe: '☕',
  coffee_shop: '🫖',
  bar: '🍸',
  hookah_lounge: '💨',
  fast_food: '🍔',
  canteen: '🥘',
  bakery: '🥐',
  food_court: '🏬',
}

const kitchenTypeIcons: Record<string, string> = {
  hot_grill: '🔥',
  hot_no_open_fire: '♨️',
  cold_assembly: '🥗',
  bakery: '🥐',
  drinks_snacks: '🥤',
  no_kitchen: '❌',
}

function CardSelect({ field, value, options, icons, error, onChange }: {
  field: string
  value: string | undefined
  options: Record<string, string>
  icons: Record<string, string>
  error?: string
  onChange: (field: string, value: unknown) => void
}) {
  return (
    <div>
      <div className="grid grid-cols-3 gap-2">
        {Object.entries(options).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => onChange(field, key)}
            className={`flex flex-col items-center gap-1 p-3 rounded-xl border text-center transition-all text-sm ${
              value === key
                ? 'border-[var(--primary)] bg-[var(--primary)]/10 ring-2 ring-[var(--primary)]/20 font-medium'
                : `border-[var(--border)] hover:border-[var(--primary)]/40 hover:bg-[var(--muted)] ${error ? 'border-red-300' : ''}`
            }`}
          >
            <span className="text-xl">{icons[key] || ''}</span>
            <span className="leading-tight text-xs">{label}</span>
          </button>
        ))}
      </div>
      {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
    </div>
  )
}

export function StepBasicParams({ data, onChange, errors }: StepProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Блок 1. Базовые параметры</h2>
      <p className="text-sm text-[var(--muted-foreground)]">Обязательные поля для анализа</p>

      <div data-field-error={!!errors.venueType || undefined}>
        <FieldTooltip label="Тип заведения" tooltip="Определяет нормативные требования к вентиляции, санузлам, производственным помещениям" required>
          <CardSelect
            field="venueType"
            value={data.venueType as string | undefined}
            options={venueTypeLabels}
            icons={venueTypeIcons}
            error={errors.venueType}
            onChange={onChange}
          />
        </FieldTooltip>
      </div>

      <div data-field-error={!!errors.area || undefined}>
        <FieldTooltip label="Площадь помещения, м²" tooltip="База для расчёта кратности воздухообмена, количества санузлов, мощности. От 10 до 5000 м²" required>
          <input
            type="number"
            value={data.area ?? ''}
            onChange={(e) => onChange('area', e.target.value ? Number(e.target.value) : undefined)}
            placeholder="Например, 120"
            min={10}
            max={5000}
            className={inputClass(!!errors.area)}
          />
          {errors.area && <p className="text-xs text-red-500 mt-1">{errors.area}</p>}
        </FieldTooltip>
      </div>

      <div data-field-error={!!errors.floor || undefined}>
        <FieldTooltip label="Этаж" tooltip="Подвал — отдельные требования к вентиляции и эвакуации. Выше 1-го — сложнее вытяжка" required>
          <select
            value={data.floor || ''}
            onChange={(e) => onChange('floor', e.target.value)}
            className={inputClass(!!errors.floor)}
          >
            <option value="">Выберите этаж</option>
            {Object.entries(floorLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          {errors.floor && <p className="text-xs text-red-500 mt-1">{errors.floor}</p>}
        </FieldTooltip>
      </div>

      <div data-field-error={!!errors.buildingType || undefined}>
        <FieldTooltip label="Тип здания" tooltip="Жилой дом — строжайшие ограничения по шуму, вентиляции, режиму работы. ТЦ — требования УК" required>
          <select
            value={data.buildingType || ''}
            onChange={(e) => onChange('buildingType', e.target.value)}
            className={inputClass(!!errors.buildingType)}
          >
            <option value="">Выберите тип здания</option>
            {Object.entries(buildingTypeLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          {errors.buildingType && <p className="text-xs text-red-500 mt-1">{errors.buildingType}</p>}
        </FieldTooltip>
      </div>

      <div data-field-error={!!errors.ceilingHeight || undefined}>
        <FieldTooltip label="Высота потолков, м" tooltip="Менее 3.0 м — проблемы с прокладкой вытяжных воздуховодов. Критично для горячей кухни" required>
          <input
            type="number"
            value={data.ceilingHeight ?? ''}
            onChange={(e) => onChange('ceilingHeight', e.target.value ? Number(e.target.value) : undefined)}
            placeholder="Например, 3.2"
            min={2.0}
            max={12.0}
            step={0.1}
            className={inputClass(!!errors.ceilingHeight)}
          />
          {errors.ceilingHeight && <p className="text-xs text-red-500 mt-1">{errors.ceilingHeight}</p>}
        </FieldTooltip>
      </div>

      <div data-field-error={!!errors.kitchenType || undefined}>
        <FieldTooltip label="Тип кухни" tooltip="Ключевой параметр для расчёта вытяжки. Горячая с грилем = до 2000 м³/ч на 1 кг/ч жира" required>
          <CardSelect
            field="kitchenType"
            value={data.kitchenType as string | undefined}
            options={kitchenTypeLabels}
            icons={kitchenTypeIcons}
            error={errors.kitchenType}
            onChange={onChange}
          />
        </FieldTooltip>
      </div>

      <div data-field-error={!!errors.seatingCapacity || undefined}>
        <FieldTooltip label="Посадочных мест в зале" tooltip="Расчёт санузлов: 1 унитаз на 75 посетителей (СанПиН). 0 = нет зала (только доставка/навынос)" required>
          <input
            type="number"
            value={data.seatingCapacity ?? ''}
            onChange={(e) => onChange('seatingCapacity', e.target.value ? Number(e.target.value) : undefined)}
            placeholder="Например, 40"
            min={0}
            max={1000}
            className={inputClass(!!errors.seatingCapacity)}
          />
          {errors.seatingCapacity && <p className="text-xs text-red-500 mt-1">{errors.seatingCapacity}</p>}
        </FieldTooltip>
      </div>
    </div>
  )
}
