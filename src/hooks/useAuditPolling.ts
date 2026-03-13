'use client'

import { useState, useEffect, useRef } from 'react'
import type { AuditReport, AuditStatus, Verdict } from '@/types/audit'

interface AuditResult {
  id: string
  status: AuditStatus
  tier: string
  verdict: Verdict | null
  report: AuditReport | null
  formData: Record<string, unknown>
  createdAt: string
  analysisCompletedAt: string | null
}

const POLL_INTERVAL = 3000 // 3 seconds
const POLL_TIMEOUT = 120000 // 2 minutes

export function useAuditPolling(auditId: string) {
  const [data, setData] = useState<AuditResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isTimedOut, setIsTimedOut] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    let cancelled = false

    const stopPolling = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }

    const fetchAudit = async () => {
      try {
        const res = await fetch(`/api/audit/${auditId}`)
        if (!res.ok) {
          throw new Error('Не удалось загрузить результат')
        }
        const result = await res.json() as AuditResult

        if (!cancelled) {
          setData(result)
          setIsLoading(false)

          // Stop polling when analysis is complete or failed
          if (result.status === 'COMPLETED' || result.status === 'FAILED') {
            stopPolling()
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Ошибка')
          setIsLoading(false)
        }
      }
    }

    // Initial fetch
    fetchAudit()

    // Start polling
    intervalRef.current = setInterval(fetchAudit, POLL_INTERVAL)

    // Set timeout to stop polling after 2 minutes
    timeoutRef.current = setTimeout(() => {
      if (!cancelled) {
        stopPolling()
        setIsTimedOut(true)
      }
    }, POLL_TIMEOUT)

    return () => {
      cancelled = true
      stopPolling()
    }
  }, [auditId])

  return { data, error, isLoading, isTimedOut }
}
