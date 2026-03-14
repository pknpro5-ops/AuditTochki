import Link from 'next/link'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'

export const metadata = {
  title: 'Тарифы — АудитТочки',
  description: 'Тарифы проверки помещения для общепита: бесплатный, стандарт (1 900 руб) и расширенный (3 900 руб). Акция запуска!',
  alternates: {
    canonical: '/pricing',
  },
}

const tiers = [
  {
    id: 'FREE',
    name: 'Бесплатно',
    price: '0 ₽',
    oldPrice: null as string | null,
    description: 'Быстрая проверка для первого знакомства',
    features: [
      'Краткий вердикт GO / NO-GO',
      '3 бесплатные проверки',
      'Базовый анализ по 6 блокам',
      'Без PDF-отчёта',
    ],
    limitations: ['Сокращённые рекомендации', 'Без детализации бюджета'],
    cta: 'Попробовать бесплатно',
    highlight: false,
    href: '/audit',
  },
  {
    id: 'STANDARD',
    name: 'Стандарт',
    price: '1 900 ₽',
    oldPrice: '3 900 ₽',
    description: 'Полный анализ для принятия решения',
    features: [
      'Полный анализ по 6 блокам',
      'PDF-отчёт с логотипом',
      'Детальная оценка бюджета',
      'Ссылки на нормативы',
      'Отправка на email',
      'Топ-3 риска',
      'Рекомендации по следующим шагам',
    ],
    limitations: [],
    cta: 'Выбрать Стандарт',
    highlight: true,
    href: '/audit?tier=STANDARD',
  },
  {
    id: 'EXTENDED',
    name: 'Расширенный',
    price: '3 900 ₽',
    oldPrice: '7 900 ₽',
    description: 'Максимум информации для опытных',
    features: [
      'Всё из тарифа Стандарт',
      'Анализ плана помещения (AI OCR)',
      'Детальная разбивка бюджета',
      'Расширенные рекомендации по ТЗ',
      'Подробный анализ каждого блока',
    ],
    limitations: [],
    cta: 'Выбрать Расширенный',
    highlight: false,
    href: '/audit?tier=EXTENDED',
  },
]

export default function PricingPage() {
  return (
    <div className="py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <Breadcrumbs items={[{ label: 'Тарифы' }]} />
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 animate-fade-in-up">Тарифы</h1>
          <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto">
            Выберите подходящий тариф. Выезд инженера стоит 20 000–40 000 ₽ и занимает 3–7 дней.
            Мы даём предварительную оценку за 2 минуты.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`rounded-xl border-2 flex flex-col card-hover ${
                tier.highlight
                  ? 'border-[var(--primary)] ring-4 ring-[var(--primary)]/10 relative md:scale-105 md:shadow-xl md:shadow-[var(--primary)]/10 p-7'
                  : 'border-[var(--border)] p-6'
              }`}
            >
              {tier.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[var(--primary)] text-[var(--primary-foreground)] text-xs font-medium rounded-full">
                  Популярный
                </div>
              )}
              <h2 className="text-xl font-bold">{tier.name}</h2>
              <p className="text-sm text-[var(--muted-foreground)] mt-1">{tier.description}</p>
              <div className="mt-4">
                {tier.oldPrice && (
                  <div className="text-lg text-[var(--muted-foreground)] line-through">{tier.oldPrice}</div>
                )}
                <div className="text-4xl font-bold">{tier.price}</div>
                {tier.oldPrice && (
                  <div className="mt-1 inline-block text-xs font-medium text-green-600 dark:text-green-400 bg-green-500/10 rounded-full px-3 py-0.5">
                    Цена запуска
                  </div>
                )}
              </div>
              <p className="text-xs text-[var(--muted-foreground)] mt-1">за одну проверку</p>

              <ul className="mt-6 space-y-2 flex-1">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
                {tier.limitations.map((l) => (
                  <li key={l} className="flex items-start gap-2 text-sm text-[var(--muted-foreground)]">
                    <span className="text-gray-400 mt-0.5">—</span>
                    <span>{l}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={tier.href}
                className={`mt-6 block text-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  tier.highlight
                    ? 'bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90'
                    : 'border border-[var(--border)] hover:bg-[var(--muted)]'
                }`}
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Payment info */}
        <div className="mt-8 text-center text-sm text-[var(--muted-foreground)]">
          <p>Оплата через ЮKассу. Принимаем карты Visa, Mastercard, МИР, СБП, ЮМани.</p>
          <p className="mt-1">Возврат в течение 14 дней, если отчёт не был сгенерирован.</p>
        </div>

        {/* CTA to full service */}
        <div className="mt-16 text-center p-8 border-2 border-dashed border-[var(--border)] rounded-xl">
          <h3 className="text-xl font-bold mb-2">Нужно больше 20 проверок в месяц?</h3>
          <p className="text-[var(--muted-foreground)] mb-4">
            Подписка B2B для брокеров и управляющих компаний — от 14 900 ₽/мес
          </p>
          <a
            href="https://hot-plan.ru"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-2 border border-[var(--primary)] text-[var(--primary)] rounded-lg text-sm font-medium hover:bg-[var(--muted)] transition-colors"
          >
            Связаться с нами
          </a>
        </div>
      </div>
    </div>
  )
}
