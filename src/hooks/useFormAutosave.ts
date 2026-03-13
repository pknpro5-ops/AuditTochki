'use client'

import { useEffect, useRef, useCallback } from 'react'

const STORAGE_KEY = 'audittochki_form_data'
const DEBOUNCE_MS = 1000

export function useFormAutosave<T extends Record<string, unknown>>(
  data: T,
  setData: (data: T) => void
) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const initialLoadDone = useRef(false)

  // Load from localStorage on mount
  useEffect(() => {
    if (initialLoadDone.current) return
    initialLoadDone.current = true

    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved) as Record<string, unknown>
        // Remove empty string values so defaults are preserved
        const cleaned = Object.fromEntries(
          Object.entries(parsed).filter(([, v]) => v !== '' && v !== null)
        ) as T
        // Merge with current defaults to preserve any new fields
        setData({ ...data, ...cleaned })
      }
    } catch {
      // ignore parse errors
    }
  }, [setData])

  // Save to localStorage with debounce
  useEffect(() => {
    if (!initialLoadDone.current) return

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
      } catch {
        // ignore storage errors
      }
    }, DEBOUNCE_MS)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [data])

  const clearSaved = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      // ignore
    }
  }, [])

  return { clearSaved }
}
