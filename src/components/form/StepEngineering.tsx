'use client'

import { FieldTooltip } from './FieldTooltip'
import {
  phaseTypeLabels, exhaustChannelLabels, exhaustOutputLabels,
  hotWaterLabels, sewerageLabels, ventilationLabels
} from '@/lib/validators/audit-schema'
import type { AuditFormValues } from '@/lib/validators/audit-schema'

interface StepProps {
  data: Partial<AuditFormValues>
  onChange: (field: string, value: unknown) => void
  errors: Record<string, string>
}

export function StepEngineering({ data, onChange, errors }: StepProps) {
  const selectClass = "w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)] text-sm focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none"

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Блок 2. Инженерные коммуникации</h2>
      <p className="text-sm text-[var(--muted-foreground)]">Необязательные поля — но они повышают точность анализа</p>

      {/* Электрика */}
      <div className="field-group">
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 10 10-12h-9l1-10z"/></svg>
          <h3 className="font-medium text-sm">Электроснабжение</h3>
        </div>

        <div className="space-y-4">
          <FieldTooltip label="Выделенная электрическая мощность, кВт" tooltip="Горячая кухня от 40 кВт. Фритюр + гриль + пароконвектомат = 60–80 кВт. Дефицит = невозможность открыть">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={data.electricalPowerUnknown || false}
                  onChange={(e) => {
                    onChange('electricalPowerUnknown', e.target.checked)
                    if (e.target.checked) onChange('electricalPower', null)
                  }}
                  className="rounded"
                />
                Неизвестно
              </label>
              {!data.electricalPowerUnknown && (
                <input
                  type="number"
                  value={data.electricalPower ?? ''}
                  onChange={(e) => onChange('electricalPower', e.target.value ? Number(e.target.value) : null)}
                  placeholder="Например, 40"
                  min={0}
                  max={1000}
                  className={selectClass}
                />
              )}
            </div>
          </FieldTooltip>

          <FieldTooltip label="Фазность электросети" tooltip="Трёхфазная — обязательна при мощности свыше 15 кВт. Переключение = отдельные расходы">
            <select value={data.phaseType || 'unknown'} onChange={(e) => onChange('phaseType', e.target.value)} className={selectClass}>
              {Object.entries(phaseTypeLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </FieldTooltip>

          <FieldTooltip label="Газ в здании" tooltip="Газовое оборудование — другой класс требований. Влияет на пожарную категорию помещения">
            <select value={data.hasGas || 'unknown'} onChange={(e) => onChange('hasGas', e.target.value)} className={selectClass}>
              <option value="yes">Да</option>
              <option value="no">Нет</option>
              <option value="unknown">Неизвестно</option>
            </select>
          </FieldTooltip>
        </div>
      </div>

      {/* Вентиляция */}
      <div className="field-group">
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-5 h-5 text-sky-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M9.59 4.59A2 2 0 1111 8H2m10.59 11.41A2 2 0 1014 16H2m15.73-8.27A2.5 2.5 0 1119.5 12H2"/></svg>
          <h3 className="font-medium text-sm">Вентиляция и вытяжка</h3>
        </div>

        <div className="space-y-4">
          <FieldTooltip label="Вытяжной канал для кухни" tooltip="Самый частый блокирующий фактор. Общедомовой нельзя использовать для жира. Отдельный — главное требование">
            <select value={data.exhaustChannel || 'unknown'} onChange={(e) => onChange('exhaustChannel', e.target.value)} className={selectClass}>
              {Object.entries(exhaustChannelLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </FieldTooltip>

          <FieldTooltip label="Возможность вывода вытяжки" tooltip="Без возможности вывода вытяжки горячая кухня невозможна. Ключевой вопрос для жилых домов">
            <select value={data.exhaustOutput || 'unknown'} onChange={(e) => onChange('exhaustOutput', e.target.value)} className={selectClass}>
              {Object.entries(exhaustOutputLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </FieldTooltip>

          <FieldTooltip label="Система вентиляции в помещении" tooltip="Приток воздуха обязателен. Отсутствие притока = духота в зале, проблемы с СЭС">
            <select value={data.ventilationType || 'unknown'} onChange={(e) => onChange('ventilationType', e.target.value)} className={selectClass}>
              {Object.entries(ventilationLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </FieldTooltip>
        </div>
      </div>

      {/* Водоснабжение */}
      <div className="field-group">
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z"/></svg>
          <h3 className="font-medium text-sm">Водоснабжение и канализация</h3>
        </div>

        <div className="space-y-4">
          <FieldTooltip label="Горячее водоснабжение" tooltip="ГВС обязательно в производственных помещениях (СанПиН 2.3.6). Без ГВС = бойлер = доп. мощность">
            <select value={data.hotWater || 'unknown'} onChange={(e) => onChange('hotWater', e.target.value)} className={selectClass}>
              {Object.entries(hotWaterLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </FieldTooltip>

          <FieldTooltip label="Канализационные точки" tooltip="Производственная зона требует раковин и трапов. Переброска канализации — дорого, иногда невозможно">
            <select value={data.seweragePoints || 'unknown'} onChange={(e) => onChange('seweragePoints', e.target.value)} className={selectClass}>
              {Object.entries(sewerageLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </FieldTooltip>
        </div>
      </div>
    </div>
  )
}
