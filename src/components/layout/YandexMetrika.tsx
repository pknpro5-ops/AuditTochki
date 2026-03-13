'use client'

import { useEffect } from 'react'

const YM_ID = process.env.NEXT_PUBLIC_YM_ID

export function YandexMetrika() {
  useEffect(() => {
    if (!YM_ID) return

    const consent = localStorage.getItem('cookie_consent')
    if (consent !== 'accepted') return

    // Load Yandex.Metrika only if user accepted cookies
    const win = window as unknown as Record<string, unknown>
    if (win['ym']) return // already loaded

    const script = document.createElement('script')
    script.src = 'https://mc.yandex.ru/metrika/tag.js'
    script.async = true
    script.onload = () => {
      const ym = win['ym'] as (...args: unknown[]) => void
      if (ym) {
        ym(Number(YM_ID), 'init', {
          clickmap: true,
          trackLinks: true,
          accurateTrackBounce: true,
          webvisor: true,
        })
      }
    }
    document.head.appendChild(script)
  }, [])

  return null
}
