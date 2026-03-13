import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Результат проверки — АудитТочки',
  description: 'AI-отчёт проверки помещения для общепита: вердикт, рейтинг, анализ по 6 блокам, бюджет и рекомендации.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function AuditResultLayout({ children }: { children: React.ReactNode }) {
  return children
}
