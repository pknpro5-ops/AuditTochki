import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ToastProvider } from '@/components/ui/Toast'
import { CookieBanner } from '@/components/layout/CookieBanner'
import { YandexMetrika } from '@/components/layout/YandexMetrika'

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-inter',
})

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://audittochki.ru'

export const metadata: Metadata = {
  title: 'АудитТочки — AI-оценка помещения для общепита',
  description: 'Проверьте помещение для кафе или ресторана за 2 минуты. AI-анализ по 6 блокам нормативов. Бесплатный вердикт — без регистрации.',
  keywords: ['аудит помещения', 'общепит', 'кафе', 'ресторан', 'проверка помещения', 'вентиляция', 'СанПиН', 'пожарная безопасность', 'открыть кафе'],
  metadataBase: new URL(baseUrl),
  openGraph: {
    title: 'АудитТочки — AI-проверка помещения для общепита',
    description: 'Бесплатная AI-проверка помещения за 2 минуты. Вердикт GO/NO-GO по 6 блокам нормативов. Без регистрации → audittochki.ru',
    url: baseUrl,
    siteName: 'АудитТочки',
    locale: 'ru_RU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'АудитТочки — AI-проверка помещения для общепита',
    description: 'AI-аудит помещения для кафе за 2 минуты по российским нормативам.',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: baseUrl,
  },
}

// JSON-LD Schema.org structured data
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'АудитТочки',
  url: baseUrl,
  description: 'AI-сервис предварительной оценки помещения для открытия общепита по российским нормативам.',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  offers: [
    {
      '@type': 'Offer',
      name: 'Бесплатная проверка',
      price: '0',
      priceCurrency: 'RUB',
    },
    {
      '@type': 'Offer',
      name: 'Стандарт',
      price: '1900',
      priceCurrency: 'RUB',
    },
    {
      '@type': 'Offer',
      name: 'Расширенный',
      price: '3900',
      priceCurrency: 'RUB',
    },
  ],
}

// Organization schema
const orgJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'АудитТочки',
  url: baseUrl,
  logo: `${baseUrl}/icon`,
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+7-499-938-66-15',
    email: 'mail@hot-plan.ru',
    contactType: 'customer service',
    availableLanguage: 'Russian',
  },
  sameAs: ['https://t.me/hotplanru', 'https://hot-plan.ru'],
}

// FAQ schema
const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Насколько точный анализ?',
      acceptedAnswer: { '@type': 'Answer', text: 'Сервис даёт предварительную оценку на основе российских СП, СанПиН и ПУЭ. Это не заменяет выезд инженера, но позволяет отсеять неподходящие помещения до подписания аренды.' },
    },
    {
      '@type': 'Question',
      name: 'Сколько времени занимает анализ?',
      acceptedAnswer: { '@type': 'Answer', text: 'Обычно 15–30 секунд без плана помещения, до 60 секунд с планом.' },
    },
    {
      '@type': 'Question',
      name: 'Нужна ли регистрация?',
      acceptedAnswer: { '@type': 'Answer', text: 'Нет. Сервис работает анонимно — достаточно заполнить форму.' },
    },
    {
      '@type': 'Question',
      name: 'Как работает возврат?',
      acceptedAnswer: { '@type': 'Answer', text: 'Возврат средств возможен в течение 14 дней, если отчёт не был сгенерирован.' },
    },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <head>
        {/* Schema.org JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
        {/* Yandex.Metrika loaded via client component after cookie consent */}
      </head>
      <body className={`${inter.variable} min-h-screen flex flex-col`}>
        <ToastProvider>
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <CookieBanner />
          <YandexMetrika />
        </ToastProvider>
      </body>
    </html>
  )
}
