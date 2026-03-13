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

const TOTAL_STEPS = 8 // 7 data steps + 1 review

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
    if (step >= 7) return true // review step
    const schemas = [step1Schema, step2Schema, step3Schema, step4Schema, step5Schema, step6Schema, step7Schema]
    const schema = schemas[step]
    // Clean empty strings to undefined so Zod defaults kick in
    const cleanData = Object.fromEntries(
      Object.entries(formData as Record<string, unknown>).map(([k, v]) => [k, v === '' ? undefined : v])
    )
    const result = schema.safeParse(cleanData)

    if (!result.success) {
      const newErrors: Record<string, string> = {}
      for (const issue of result.error.issues) {
        const field = issue.path[0]?.toString()
        if (field) newErrors[field] = issue.message
      }
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

  // Count filled required fields for current step
  const requiredStep1 = ['venueType', 'area', 'floor', 'buildingType', 'ceilingHeight', 'kitchenType', 'seatingCapacity']
  const filledCount = currentStep === 0
    ? requiredStep1.filter(f => {
        const v = (formData as Record<string, unknown>)[f]
        return v !== undefined && v !== null && v !== ''
      }).length
    : 0

  return (
    <div className="max-w-2xl mx-auto">
      <FormProgress
        currentStep={currentStep}
        onStepClick={handleStepClick}
        completedSteps={completedSteps}
      />

      {/* Field progress for step 1 */}
      {currentStep === 0 && (
        <div className="mb-4 flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-[var(--muted)] rounded-full overflow-hidden">
            <div
              className="h-full bg-[var(--primary)] rounded-full transition-all duration-300"
              style={{ width: `${(filledCount / requiredStep1.length) * 100}%` }}
            />
          </div>
          <span className="text-xs text-[var(--muted-foreground)] shrink-0">
            {filledCount}/{requiredStep1.length} обязательных
          </span>
        </div>
      )}

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
          {currentStep === 0 && (
            <StepBasicParams data={formData} onChange={handleChange} errors={errors} />
          )}
          {currentStep === 1 && (
            <StepEngineering data={formData} onChange={handleChange} errors={errors} />
          )}
          {currentStep === 2 && (
            <StepConstruction data={formData} onChange={handleChange} errors={errors} />
          )}
          {currentStep === 3 && (
            <StepConceptLegal
              data={formData}
              onChange={handleChange}
              errors={errors}
              onFileChange={setFloorPlanFile}
              uploadedFileName={floorPlanFile?.name || null}
            />
          )}
          {currentStep === 4 && (
            <StepLocation data={formData} onChange={handleChange} errors={errors} />
          )}
          {currentStep === 5 && (
            <StepAdditionalEngineering data={formData} onChange={handleChange} errors={errors} />
          )}
          {currentStep === 6 && (
            <StepAccessibility data={formData} onChange={handleChange} errors={errors} />
          )}
          {currentStep === 7 && (
            <StepReview
              data={formData}
              uploadedFileName={floorPlanFile?.name || null}
              onEditStep={(step) => {
                setSlideDir('right')
                setCurrentStep(step)
              }}
            />
          )}
        </div>

        {/* Consent checkbox on review step */}
        {currentStep === 7 && (
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

          {currentStep < 6 ? (
            <button
              onClick={handleNext}
              className="px-6 py-2.5 text-sm font-medium rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] hover:brightness-110 transition-all shadow-md shadow-[var(--primary)]/20"
            >
              Далее
            </button>
          ) : currentStep === 6 ? (
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
