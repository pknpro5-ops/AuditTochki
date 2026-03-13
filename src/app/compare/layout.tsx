import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Сравнить помещения — АудитТочки',
  description: 'Сравните результаты аудита нескольких помещений side-by-side: вердикт, рейтинг, статус по 6 блокам, бюджет и риски.',
  alternates: {
    canonical: '/compare',
  },
}

export default function CompareLayout({ children }: { children: React.ReactNode }) {
  return children
}
