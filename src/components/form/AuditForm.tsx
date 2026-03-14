'use client'

import { useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { FormProgress } from './FormProgress'
import { StepBasicParams } from './StepBasicParams'
import { StepEngineering } from './StepEngineering'
import { StepConstruction } from './StepConstruction'
import { StepConceptLegal } from './StepConceptLegal'
import { StepLocation } from './StepLocation'
import { StepAdditionalEngineering } from './StepAdditionalEngineering'
import { StepAccessibility } from './StepAccessibility'
import { StepReview } from './StepReview'
import { useFormAutosave } from '@/hooks/useFormAutosave'
import { step1Schema, step2Schema, step3Schema, step4Schema, step5Schema, step6Schema, step7Schema } from '@/lib/validators/audit-schema'
import type { AuditFormValues } from '@/lib/validators/audit-schema'

const defaultFormData: Partial<AuditFormValues> = {
  electricalPowerUnknown: false,
  electricalPower: null,
  phaseType: 'unknown',
  exhaustChannel: 'unknown',
  exhaustOutput: 'unknown',
  hotWater: 'unknown',
  seweragePoints: 'unknown',
  hasGas: 'unknown',
  ventilationType: 'unknown',
  neighborsAbove: 'residential',
  neighborsBelow: 'unknown',
  entranceGroup: 'separate_street',
  doorWidth: 'unknown',
  basementAccess: 'unknown',
  floorStructure: 'unknown',
  facadeType: 'unknown',
  workingHours: 'until_22',
  alcoholSales: 'undecided',
  terrace: 'no',
  leaseTerm: 'unknown',
  renovationPayer: 'unknown',
  freeDescription: '',
  conceptNotes: '',
  address: '',
  district: '',
  currentCondition: 'unknown',
  previousUse: 'unknown',
  airConditioning: 'unknown',
  restroomCount: 0,
  internetType: 'unknown',
  parkingType: 'unknown',
  parkingSpaces: null,
  wheelchairAccess: 'unknown',
  loadingZone: 'unknown',
}

// 4 steps: 3 data + 1 review
const TOTAL_STEPS = 4

// Validation schemas for each merged step
const stepValidationSchemas = [
  [step1Schema, step3Schema],           // Step 0: Помещение = Basic + Construction
  [step2Schema, step6Schema],           // Step 1: Инженерия = Engineering + Additional
  [step4Schema, step5Schema, step7Schema], // Step 2: Концепция = Concept + Location + Accessibility
  [],                                    // Step 3: Review
]

export function AuditForm() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<Partial<AuditFormValues>>(defaultFormData)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())
  const [floorPlanFile, setFloorPlanFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [consentGiven, setConsentGiven] = useState(false)
  const [slideDir, setSlideDir] = useState<'left' | 'right'>('left')
  const formRef = useRef<HTMLDivElement>(null)

  const { clearSaved } = useFormAutosave(
    formData as Record<string, unknown>,
    (saved) => setFormData(saved as Partial<AuditFormValues>)
  )

  const handleChange = useCallback((field: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => {
      const next = { ...prev }
      delete next[field]
      return next
    })
  }, [])

  const scrollToFirstError = useCallback(() => {
    setTimeout(() => {
      const firstError = formRef.current?.querySelector('[data-field-error="true"]')
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }, 50)
  }, [])

  const validateStep = (step: number): boolean => {
    if (step >= 3) return true // review step
    const schemas = stepValidationSchemas[step]

    const cleanData = Object.fromEntries(
      Object.entries(formData as Record<string, unknown>).map(([k, v]) => [k, v === '' ? undefined : v])
    )

    const newErrors: Record<string, string> = {}
    for (const schema of schemas) {
      const result = schema.safeParse(cleanData)
      if (!result.success) {
        for (const issue of result.error.issues) {
          const field = issue.path[0]?.toString()
          if (field) newErrors[field] = issue.message
        }
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      scrollToFirstError()
      return false
    }

    setErrors({})
    return true
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCompletedSteps((prev) => new Set([...prev, currentStep]))
      setSlideDir('left')
      setCurrentStep((prev) => Math.min(prev + 1, TOTAL_STEPS - 1))
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handlePrev = () => {
    setSlideDir('right')
    setCurrentStep((prev) => Math.max(prev - 1, 0))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleStepClick = (step: number) => {
    if (step < currentStep || completedSteps.has(step)) {
      setSlideDir(step < currentStep ? 'right' : 'left')
      setCurrentStep(step)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setSubmitError(null)
    try {
      let floorPlanPath: string | null = null
      let floorPlanName: string | null = null

      if (floorPlanFile) {
        const uploadData = new FormData()
        uploadData.append('file', floorPlanFile)

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: uploadData,
        })

        if (uploadRes.ok) {
          const uploadResult = await uploadRes.json()
          floorPlanPath = uploadResult.path
          floorPlanName = uploadResult.name
        }
      }

      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formData, floorPlanPath, floorPlanName }),
      })

      if (res.ok) {
        const result = await res.json()
        clearSaved()
        router.push(`/audit/${result.id}`)
      } else {
        const errorData = await res.json()
        setSubmitError(errorData.error || 'Произошла ошибка. Попробуйте ещё раз.')
      }
    } catch (error) {
      console.error('Submit error:', error)
      setSubmitError('Произошла ошибка. Проверьте подключение к интернету.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <FormProgress
        currentStep={currentStep}
        onStepClick={handleStepClick}
        completedSteps={completedSteps}
      />

      {submitError && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3 animate-scale-in">
          <span className="text-red-500 text-lg shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </span>
          <div className="flex-1">
            <p className="text-sm font-medium text-red-800 dark:text-red-200">{submitError}</p>
          </div>
          <button
            onClick={() => setSubmitError(null)}
            className="text-red-400 hover:text-red-600 text-lg leading-none"
            aria-label="Закрыть"
          >
            &times;
          </button>
        </div>
      )}

      <div ref={formRef} className="bg-[var(--background)] border border-[var(--border)] rounded-xl p-6 md:p-8 shadow-sm">
        <div key={currentStep} className={slideDir === 'left' ? 'animate-slide-in-left' : 'animate-slide-in-right'}>
          {/* Step 0: Помещение = Basic + Construction */}
          {currentStep === 0 && (
            <div className="space-y-8">
              <StepBasicParams data={formData} onChange={handleChange} errors={errors} />
              <div className="border-t border-[var(--border)] pt-6">
                <h3 className="text-lg font-semibold mb-1">Конструктив здания</h3>
                <p className="text-sm text-[var(--muted-foreground)] mb-4">Характеристики здания и входной группы</p>
                <StepConstruction data={formData} onChange={handleChange} errors={errors} />
              </div>
            </div>
          )}

          {/* Step 1: Инженерные системы = Engineering + Additional */}
          {currentStep === 1 && (
            <div className="space-y-8">
              <StepEngineering data={formData} onChange={handleChange} errors={errors} />
              <div className="border-t border-[var(--border)] pt-6">
                <h3 className="text-lg font-semibold mb-1">Дополнительно</h3>
                <p className="text-sm text-[var(--muted-foreground)] mb-4">Кондиционирование, санузлы, интернет</p>
                <StepAdditionalEngineering data={formData} onChange={handleChange} errors={errors} />
              </div>
            </div>
          )}

          {/* Step 2: Концепция и расположение = Concept + Location + Accessibility */}
          {currentStep === 2 && (
            <div className="space-y-8">
              <StepConceptLegal
                data={formData}
                onChange={handleChange}
                errors={errors}
                onFileChange={setFloorPlanFile}
                uploadedFileName={floorPlanFile?.name || null}
              />
              <div className="border-t border-[var(--border)] pt-6">
                <h3 className="text-lg font-semibold mb-1">Расположение</h3>
                <p className="text-sm text-[var(--muted-foreground)] mb-4">Адрес и текущее состояние помещения</p>
                <StepLocation data={formData} onChange={handleChange} errors={errors} />
              </div>
              <div className="border-t border-[var(--border)] pt-6">
                <h3 className="text-lg font-semibold mb-1">Доступность и логистика</h3>
                <p className="text-sm text-[var(--muted-foreground)] mb-4">Парковка, доступная среда, разгрузка</p>
                <StepAccessibility data={formData} onChange={handleChange} errors={errors} />
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {currentStep === 3 && (
            <StepReview
              data={formData}
              uploadedFileName={floorPlanFile?.name || null}
              onEditStep={(step) => {
                // Map old step indices to new merged steps
                const stepMapping: Record<number, number> = {
                  0: 0, // Basic → Помещение
                  1: 1, // Engineering → Инженерия
                  2: 0, // Construction → Помещение
                  3: 2, // Concept → Концепция
                  4: 2, // Location → Концепция
                  5: 1, // Additional → Инженерия
                  6: 2, // Accessibility → Концепция
                }
                setSlideDir('right')
                setCurrentStep(stepMapping[step] ?? 0)
              }}
            />
          )}
        </div>

        {/* Consent checkbox on review step */}
        {currentStep === 3 && (
          <div className="mt-6 pt-4 border-t border-[var(--border)]">
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={consentGiven}
                onChange={(e) => setConsentGiven(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-[var(--border)] accent-[var(--primary)] shrink-0"
              />
              <span className="text-xs text-[var(--muted-foreground)] group-hover:text-[var(--foreground)] transition-colors">
                Я даю согласие на обработку моих персональных данных в соответствии с{' '}
                <a href="/legal#privacy" target="_blank" className="text-[var(--primary)] underline">
                  Политикой конфиденциальности
                </a>{' '}
                и принимаю условия{' '}
                <a href="/legal#offer" target="_blank" className="text-[var(--primary)] underline">
                  Публичной оферты
                </a>.
              </span>
            </label>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-6 border-t border-[var(--border)]">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="px-6 py-2.5 text-sm font-medium rounded-xl border border-[var(--border)] hover:bg-[var(--muted)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Назад
          </button>

          {currentStep < 2 ? (
            <button
              onClick={handleNext}
              className="px-6 py-2.5 text-sm font-medium rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] hover:brightness-110 transition-all shadow-md shadow-[var(--primary)]/20"
            >
              Далее
            </button>
          ) : currentStep === 2 ? (
            <button
              onClick={handleNext}
              className="px-6 py-2.5 text-sm font-medium rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] hover:brightness-110 transition-all shadow-md shadow-[var(--primary)]/20"
            >
              Проверить данные
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !consentGiven}
              className="px-8 py-2.5 text-sm font-medium rounded-xl bg-green-600 text-white hover:bg-green-500 transition-all shadow-md shadow-green-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4}/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                  Отправка...
                </>
              ) : 'Получить анализ'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
