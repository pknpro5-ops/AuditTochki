'use client'

import type { AuditFormValues } from '@/lib/validators/audit-schema'
import {
  venueTypeLabels, buildingTypeLabels, kitchenTypeLabels,
  phaseTypeLabels, exhaustChannelLabels, exhaustOutputLabels,
  hotWaterLabels, sewerageLabels, ventilationLabels,
  neighborsAboveLabels, neighborsBelowLabels, entranceGroupLabels,
  doorWidthLabels, basementAccessLabels, floorStructureLabels,
  facadeTypeLabels, workingHoursLabels, alcoholLabels, terraceLabels,
  leaseTermLabels, renovationPayerLabels,
  currentConditionLabels, previousUseLabels,
  airConditioningLabels, internetTypeLabels,
  parkingTypeLabels, wheelchairAccessLabels, loadingZoneLabels,
} from '@/lib/validators/audit-schema'

interface StepReviewProps {
  data: Partial<AuditFormValues>
  uploadedFileName: string | null
  onEditStep: (step: number) => void
}

const labelMaps: Record<string, Record<string, string>> = {
  venueType: venueTypeLabels,
  buildingType: buildingTypeLabels,
  kitchenType: kitchenTypeLabels,
  phaseType: phaseTypeLabels,
  exhaustChannel: exhaustChannelLabels,
  exhaustOutput: exhaustOutputLabels,
  hotWater: hotWaterLabels,
  seweragePoints: sewerageLabels,
  hasGas: { yes: 'Да', no: 'Нет', unknown: 'Неизвестно' },
  ventilationType: ventilationLabels,
  neighborsAbove: neighborsAboveLabels,
  neighborsBelow: neighborsBelowLabels,
  entranceGroup: entranceGroupLabels,
  doorWidth: doorWidthLabels,
  basementAccess: basementAccessLabels,
  floorStructure: floorStructureLabels,
  facadeType: facadeTypeLabels,
  workingHours: workingHoursLabels,
  alcoholSales: alcoholLabels,
  terrace: terraceLabels,
  leaseTerm: leaseTermLabels,
  renovationPayer: renovationPayerLabels,
  currentCondition: currentConditionLabels,
  previousUse: previousUseLabels,
  airConditioning: airConditioningLabels,
  internetType: internetTypeLabels,
  parkingType: parkingTypeLabels,
  wheelchairAccess: wheelchairAccessLabels,
  loadingZone: loadingZoneLabels,
}

function displayValue(field: string, value: unknown): string {
  if (value === null || value === undefined || value === '') return '—'
  if (typeof value === 'boolean') return value ? 'Да' : 'Нет'
  const map = labelMaps[field]
  if (map && typeof value === 'string' && map[value]) return map[value]
  return String(value)
}

const sections = [
  {
    title: 'Базовые параметры',
    step: 0,
    fields: [
      { key: 'venueType', label: 'Тип заведения' },
      { key: 'area', label: 'Площадь, м\u00b2' },
      { key: 'floor', label: 'Этаж' },
      { key: 'buildingType', label: 'Тип здания' },
      { key: 'ceilingHeight', label: 'Высота потолков, м' },
      { key: 'kitchenType', label: 'Тип кухни' },
      { key: 'seatingCapacity', label: 'Посадочных мест' },
    ],
  },
  {
    title: 'Инженерные коммуникации',
    step: 1,
    fields: [
      { key: 'electricalPower', label: 'Электрическая мощность, кВт' },
      { key: 'phaseType', label: 'Фазность' },
      { key: 'exhaustChannel', label: 'Вытяжной канал' },
      { key: 'exhaustOutput', label: 'Вывод вытяжки' },
      { key: 'hotWater', label: 'Горячее водоснабжение' },
      { key: 'seweragePoints', label: 'Канализация' },
      { key: 'hasGas', label: 'Газ в здании' },
      { key: 'ventilationType', label: 'Вентиляция' },
    ],
  },
  {
    title: 'Конструктив',
    step: 2,
    fields: [
      { key: 'neighborsAbove', label: 'Соседи сверху' },
      { key: 'neighborsBelow', label: 'Соседи снизу' },
      { key: 'entranceGroup', label: 'Входная группа' },
      { key: 'doorWidth', label: 'Ширина дверей' },
      { key: 'basementAccess', label: 'Доступ в подвал' },
      { key: 'floorStructure', label: 'Перекрытия' },
      { key: 'facadeType', label: 'Фасад' },
    ],
  },
  {
    title: 'Концепция и юридика',
    step: 3,
    fields: [
      { key: 'workingHours', label: 'Режим работы' },
      { key: 'alcoholSales', label: 'Алкоголь' },
      { key: 'terrace', label: 'Летняя веранда' },
      { key: 'leaseTerm', label: 'Срок аренды' },
      { key: 'renovationPayer', label: 'Кто платит за дооснащение' },
    ],
  },
  {
    title: 'Локация и состояние',
    step: 4,
    fields: [
      { key: 'address', label: 'Адрес' },
      { key: 'district', label: 'Район' },
      { key: 'currentCondition', label: 'Состояние помещения' },
      { key: 'previousUse', label: 'Предыдущее использование' },
    ],
  },
  {
    title: 'Дополнительные инженерные',
    step: 5,
    fields: [
      { key: 'airConditioning', label: 'Кондиционирование' },
      { key: 'restroomCount', label: 'Количество санузлов' },
      { key: 'internetType', label: 'Интернет' },
    ],
  },
  {
    title: 'Доступность и логистика',
    step: 6,
    fields: [
      { key: 'parkingType', label: 'Парковка' },
      { key: 'parkingSpaces', label: 'Парковочных мест' },
      { key: 'wheelchairAccess', label: 'Доступ для МГН' },
      { key: 'loadingZone', label: 'Зона разгрузки' },
    ],
  },
]

export function StepReview({ data, uploadedFileName, onEditStep }: StepReviewProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Проверьте данные</h2>
      <p className="text-sm text-[var(--muted-foreground)]">Убедитесь, что всё заполнено верно, перед отправкой на анализ</p>

      {sections.map((section) => (
        <div key={section.title} className="border border-[var(--border)] rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-[var(--muted)]">
            <h3 className="text-sm font-semibold">{section.title}</h3>
            <button
              type="button"
              onClick={() => onEditStep(section.step)}
              className="text-xs text-[var(--primary)] hover:underline font-medium"
            >
              Изменить
            </button>
          </div>
          <div className="divide-y divide-[var(--border)]">
            {section.fields.map(({ key, label }) => {
              const val = (data as Record<string, unknown>)[key]
              return (
                <div key={key} className="flex justify-between px-4 py-2.5 text-sm">
                  <span className="text-[var(--muted-foreground)]">{label}</span>
                  <span className="font-medium text-right max-w-[50%]">{displayValue(key, val)}</span>
                </div>
              )
            })}
          </div>
        </div>
      ))}

      {/* Free text fields */}
      {(data.freeDescription || data.conceptNotes || uploadedFileName) && (
        <div className="border border-[var(--border)] rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-[var(--muted)]">
            <h3 className="text-sm font-semibold">Дополнительно</h3>
            <button type="button" onClick={() => onEditStep(3)} className="text-xs text-[var(--primary)] hover:underline font-medium">Изменить</button>
          </div>
          <div className="px-4 py-3 space-y-3 text-sm">
            {data.freeDescription && (
              <div>
                <p className="text-xs text-[var(--muted-foreground)] mb-1">Свободное описание:</p>
                <p className="text-sm">{data.freeDescription}</p>
              </div>
            )}
            {data.conceptNotes && (
              <div>
                <p className="text-xs text-[var(--muted-foreground)] mb-1">Концепция:</p>
                <p className="text-sm">{data.conceptNotes}</p>
              </div>
            )}
            {uploadedFileName && (
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>
                <span>План: {uploadedFileName}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
