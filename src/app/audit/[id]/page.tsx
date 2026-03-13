'use client'

import { useParams } from 'next/navigation'
import { useAuditPolling } from '@/hooks/useAuditPolling'
import { ReportView } from '@/components/report/ReportView'
import { UpgradePrompt } from '@/components/report/UpgradePrompt'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'

const statusMessages: Record<string, { title: string; description: string }> = {
  PENDING: {
    title: 'Ожидание...',
    description: 'Ваш запрос принят и ожидает обработки',
  },
  PROCESSING_OCR: {
    title: 'Анализируем план помещения...',
    description: 'AI распознаёт план: зонирование, мокрые точки, выходы',
  },
  PROCESSING_AI: {
    title: 'AI анализирует помещение...',
    description: 'Проверяем по 6 блокам: электрика, вентиляция, вода, пожарка, санитария, планировка',
  },
  FAILED: {
    title: 'Ошибка анализа',
    description: 'Произошла ошибка при анализе. Попробуйте ещё раз или обратитесь в поддержку.',
  },
}

function ReportSkeleton() {
  return (
    <div className="py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="h-8 w-64 skeleton-shimmer rounded-lg mx-auto mb-8" />

        {/* Verdict skeleton */}
        <div className="p-6 rounded-xl border border-[var(--border)] mb-6">
          <div className="flex flex-col items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full skeleton-shimmer" />
            <div className="space-y-2 w-full max-w-xs">
              <div className="h-6 w-48 mx-auto skeleton-shimmer rounded" />
              <div className="h-4 w-full skeleton-shimmer rounded" />
            </div>
          </div>
          <div className="space-y-2 mt-4">
            <div className="h-3 w-full skeleton-shimmer rounded" />
            <div className="h-3 w-4/5 mx-auto skeleton-shimmer rounded" />
          </div>
        </div>

        {/* Analysis blocks skeleton */}
        <div className="space-y-3 mb-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="p-4 rounded-xl border border-[var(--border)] flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg skeleton-shimmer" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-32 skeleton-shimmer rounded" />
                <div className="h-3 w-20 skeleton-shimmer rounded-full" />
              </div>
            </div>
          ))}
        </div>

        {/* Budget skeleton */}
        <div className="p-6 rounded-xl border border-[var(--border)] mb-6">
          <div className="h-5 w-48 skeleton-shimmer rounded mb-4" />
          <div className="flex items-center justify-between">
            <div className="h-8 w-32 skeleton-shimmer rounded" />
            <div className="flex-1 mx-4 h-2 skeleton-shimmer rounded-full" />
            <div className="h-8 w-32 skeleton-shimmer rounded" />
          </div>
        </div>

        {/* Actions skeleton */}
        <div className="flex gap-3">
          <div className="h-10 w-32 skeleton-shimmer rounded-xl" />
          <div className="h-10 w-28 skeleton-shimmer rounded-xl" />
          <div className="h-10 w-24 skeleton-shimmer rounded-xl" />
        </div>
      </div>
    </div>
  )
}

export default function AuditResultPage() {
  const params = useParams()
  const auditId = params.id as string
  const { data, error, isLoading, isTimedOut } = useAuditPolling(auditId)

  if (isLoading) {
    return <ReportSkeleton />
  }

  if (error) {
    return (
      <div className="py-16 px-4">
        <div className="max-w-2xl mx-auto text-center animate-fade-in-up">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-950/30 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
          </div>
          <h1 className="text-2xl font-bold mb-2">Ошибка</h1>
          <p className="text-[var(--muted-foreground)]">{error}</p>
        </div>
      </div>
    )
  }

  if (!data) return null

  // Timed out while still processing
  if (isTimedOut && data.status !== 'COMPLETED' && data.status !== 'FAILED') {
    return (
      <div className="py-16 px-4">
        <div className="max-w-2xl mx-auto text-center animate-fade-in-up">
          <div className="w-16 h-16 mx-auto mb-4 bg-yellow-100 dark:bg-yellow-950/20 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
          <h1 className="text-2xl font-bold mb-2">Анализ занимает больше времени</h1>
          <p className="text-[var(--muted-foreground)] mb-6">
            Обычно анализ занимает до 30 секунд, но сейчас сервер перегружен.
            Сохраните ссылку — результат появится, когда анализ завершится.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 text-sm font-medium rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] hover:brightness-110 transition-all shadow-md"
            >
              Обновить страницу
            </button>
            <a
              href="/audit"
              className="px-6 py-2.5 text-sm font-medium rounded-xl border border-[var(--border)] hover:bg-[var(--muted)] transition-colors"
            >
              Новый аудит
            </a>
          </div>
        </div>
      </div>
    )
  }

  // Still processing
  if (data.status !== 'COMPLETED') {
    const statusInfo = statusMessages[data.status] || statusMessages.PENDING

    return (
      <div className="py-16 px-4">
        <div className="max-w-2xl mx-auto text-center animate-fade-in-up">
          {data.status === 'FAILED' ? (
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-950/30 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
            </div>
          ) : (
            <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <div className="animate-spin w-12 h-12 border-4 border-[var(--primary)] border-t-transparent rounded-full" />
            </div>
          )}
          <h1 className="text-2xl font-bold mb-2">{statusInfo.title}</h1>
          <p className="text-[var(--muted-foreground)]">{statusInfo.description}</p>

          {data.status !== 'FAILED' && (
            <div className="mt-8">
              <div className="w-full max-w-md mx-auto bg-[var(--muted)] rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-[var(--primary)] rounded-full transition-all duration-1000"
                  style={{ width: data.status === 'PROCESSING_OCR' ? '40%' : '70%', animation: 'progressGrow 1s ease-out' }}
                />
              </div>
              <p className="text-xs text-[var(--muted-foreground)] mt-2">Обычно занимает 15–30 секунд</p>
            </div>
          )}

          {data.status === 'FAILED' && (
            <a
              href="/audit"
              className="inline-block mt-6 px-6 py-2.5 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-xl text-sm font-medium hover:brightness-110 transition-all shadow-md"
            >
              Попробовать снова
            </a>
          )}
        </div>
      </div>
    )
  }

  // Completed — show report
  return (
    <div className="py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <Breadcrumbs items={[
          { label: 'Проверка', href: '/audit' },
          { label: 'Результат' },
        ]} />
        <h1 className="text-3xl font-bold mb-6 text-center animate-fade-in-up">Результат проверки</h1>
        {data.report && (
          <>
            <ReportView report={data.report} auditId={auditId} tier={data.tier} />
            <div className="mt-6">
              <UpgradePrompt auditId={auditId} currentTier={data.tier} />
            </div>
          </>
        )}
      </div>
    </div>
  )
}
