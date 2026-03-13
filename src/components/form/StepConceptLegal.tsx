'use client'

import { FieldTooltip } from './FieldTooltip'
import { FileDropZone } from './FileDropZone'
import {
  workingHoursLabels, alcoholLabels, terraceLabels,
  leaseTermLabels, renovationPayerLabels
} from '@/lib/validators/audit-schema'
import type { AuditFormValues } from '@/lib/validators/audit-schema'

interface StepProps {
  data: Partial<AuditFormValues>
  onChange: (field: string, value: unknown) => void
  errors: Record<string, string>
  onFileChange: (file: File | null) => void
  uploadedFileName: string | null
}

export function StepConceptLegal({ data, onChange, errors, onFileChange, uploadedFileName }: StepProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Блок 4. Концепция и юридика</h2>
      <p className="text-sm text-[var(--muted-foreground)]">Дополнительная информация для более точного анализа</p>

      <FieldTooltip label="Режим работы" tooltip="После 23:00 в жилых домах — запрет на работу по Закону о тишине. Требует согласования">
        <select
          value={data.workingHours || 'until_22'}
          onChange={(e) => onChange('workingHours', e.target.value)}
          className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)] text-sm focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none"
        >
          {Object.entries(workingHoursLabels).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </FieldTooltip>

      <FieldTooltip label="Продажа алкоголя" tooltip="Алкогольная лицензия: запрет ближе 100 м от школ, больниц. Влияет на требования к помещению">
        <select
          value={data.alcoholSales || 'undecided'}
          onChange={(e) => onChange('alcoholSales', e.target.value)}
          className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)] text-sm focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none"
        >
          {Object.entries(alcoholLabels).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </FieldTooltip>

      <FieldTooltip label="Планируется ли летняя веранда" tooltip="Летняя веранда = отдельное согласование, требует собственного сан. блока при > 50 мест">
        <select
          value={data.terrace || 'no'}
          onChange={(e) => onChange('terrace', e.target.value)}
          className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)] text-sm focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none"
        >
          {Object.entries(terraceLabels).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </FieldTooltip>

      <FieldTooltip label="Срок аренды" tooltip="Влияет на рекомендации по объёму инвестиций в дооснащение">
        <select
          value={data.leaseTerm || 'unknown'}
          onChange={(e) => onChange('leaseTerm', e.target.value)}
          className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)] text-sm focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none"
        >
          {Object.entries(leaseTermLabels).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </FieldTooltip>

      <FieldTooltip label="Кто платит за дооснащение" tooltip="Влияет на финансовую модель и рекомендации по целесообразности">
        <select
          value={data.renovationPayer || 'unknown'}
          onChange={(e) => onChange('renovationPayer', e.target.value)}
          className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)] text-sm focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none"
        >
          {Object.entries(renovationPayerLabels).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </FieldTooltip>

      <FieldTooltip label="Свободное описание" tooltip="Опишите то, что не покрывают поля. Часто здесь — ключевая информация о проблемах">
        <textarea
          value={data.freeDescription || ''}
          onChange={(e) => onChange('freeDescription', e.target.value)}
          placeholder="Например: помещение ранее использовалось как магазин одежды, есть старая вентиляция..."
          maxLength={2000}
          rows={4}
          className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)] text-sm focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none resize-none"
        />
        <p className="text-xs text-[var(--muted-foreground)]">{(data.freeDescription || '').length}/2000</p>
      </FieldTooltip>

      <FieldTooltip label="Концепция и особые требования" tooltip="Открытая кухня, тандыр, кальянная зона — специфические требования к вентиляции и пожарке">
        <textarea
          value={data.conceptNotes || ''}
          onChange={(e) => onChange('conceptNotes', e.target.value)}
          placeholder="Например: открытая кухня с грилем, кальянная зона на 10 мест..."
          maxLength={1000}
          rows={3}
          className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)] text-sm focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none resize-none"
        />
        <p className="text-xs text-[var(--muted-foreground)]">{(data.conceptNotes || '').length}/1000</p>
      </FieldTooltip>

      <FieldTooltip label="План помещения" tooltip="AI анализирует план: зонирование, расположение мокрых точек, ширину коридоров. PDF, JPG, PNG до 10 МБ">
        <FileDropZone
          onFileChange={onFileChange}
          uploadedFileName={uploadedFileName}
          error={errors._fileError}
        />
      </FieldTooltip>
    </div>
  )
}
