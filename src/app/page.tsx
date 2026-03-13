import Link from 'next/link'
import { ElectricalIcon, VentilationIcon, WaterIcon, FireIcon, SanitaryIcon, PlanningIcon } from '@/components/ui/Icons'
import { ScrollAnimator } from '@/components/ui/ScrollAnimator'

const analysisBlocks = [
  { Icon: ElectricalIcon, title: 'Электроснабжение', desc: 'Мощность, фазность, ВРУ, резерв для расширения', norms: 'СП 256.1325800, ПУЭ', color: 'text-yellow-400', cardClass: 'analysis-card-yellow' },
  { Icon: VentilationIcon, title: 'Вентиляция', desc: 'Воздухообмен, вытяжной канал, вывод вытяжки, приток', norms: 'СП 60.13330, СП 7.13130', color: 'text-sky-400', cardClass: 'analysis-card-sky' },
  { Icon: WaterIcon, title: 'Водоснабжение', desc: 'ГВС/ХВС, канализация, жироуловитель, трапы', norms: 'СП 30.13330', color: 'text-blue-400', cardClass: 'analysis-card-blue' },
  { Icon: FireIcon, title: 'Пожарная безопасность', desc: 'Эвакуация, ширина выходов, дымоудаление', norms: 'СП 1.13130, №123-ФЗ', color: 'text-orange-400', cardClass: 'analysis-card-orange' },
  { Icon: SanitaryIcon, title: 'Санитарные нормы', desc: 'Площади, санузлы, поточность, входы', norms: 'СанПиН 2.3/2.4.3590', color: 'text-emerald-400', cardClass: 'analysis-card-emerald' },
  { Icon: PlanningIcon, title: 'Планировка', desc: 'Зонирование, соседи, режим, алкоголь', norms: 'Региональные нормы', color: 'text-violet-400', cardClass: 'analysis-card-violet' },
]

const stats = [
  { value: '1 200+', label: 'проверок проведено' },
  { value: '340+', label: 'помещений одобрено' },
  { value: '< 2 мин', label: 'среднее время анализа' },
  { value: '6', label: 'блоков нормативов' },
]

const testimonials = [
  {
    text: 'Сэкономили 3 недели и 120 000 ₽ — два помещения отсеяли ещё до выезда инженера.',
    author: 'Алексей М.',
    role: 'Управляющий сети кофеен',
  },
  {
    text: 'Отчёт показал критические проблемы с вентиляцией, которые арендодатель скрывал. Спасибо!',
    author: 'Екатерина В.',
    role: 'Ресторатор',
  },
  {
    text: 'Используем для каждого нового объекта. Быстрее и дешевле, чем вызывать проектировщика на этапе подбора.',
    author: 'Дмитрий К.',
    role: 'Коммерческий брокер',
  },
]

const faqItems = [
  {
    q: 'Насколько точный анализ?',
    a: 'Сервис даёт предварительную оценку на основе российских СП, СанПиН и ПУЭ. Это не заменяет выезд инженера, но позволяет отсеять заведомо неподходящие помещения до подписания аренды.',
  },
  {
    q: 'Какие нормативы используются?',
    a: 'СП 256.1325800 (электрика), СП 60.13330 и СП 7.13130 (вентиляция), СП 30.13330 (водоснабжение), СП 1.13130 и 123-ФЗ (пожарная безопасность), СанПиН 2.3/2.4.3590 (санитария), 171-ФЗ (алкоголь).',
  },
  {
    q: 'Сколько времени занимает анализ?',
    a: 'Обычно 15–30 секунд без плана помещения, до 60 секунд с планом (AI дополнительно распознаёт план).',
  },
  {
    q: 'Можно ли загрузить план помещения?',
    a: 'Да, в тарифе «Расширенный» можно загрузить план в формате PDF, JPG или PNG (до 10 МБ). AI извлечёт из него площади, расположение мокрых точек и выходов.',
  },
  {
    q: 'Как работает возврат?',
    a: 'Возврат средств возможен в течение 14 дней, если отчёт не был сгенерирован. Обратитесь на hot-plan.ru.',
  },
  {
    q: 'Нужна ли регистрация?',
    a: 'Нет. Сервис работает анонимно — достаточно заполнить форму. Для получения отчёта на email можно указать адрес после генерации.',
  },
]

export default function HomePage() {
  return (
    <div>
      <ScrollAnimator />

      {/* Hero */}
      <section className="hero-gradient py-20 md:py-28 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: text */}
            <div className="text-center lg:text-left">
              <div className="animate-fade-in-up inline-block px-4 py-1.5 mb-6 text-sm font-medium bg-[var(--primary)]/10 text-[var(--primary)] rounded-full border border-[var(--primary)]/20">
                AI-аудит за 2 минуты
              </div>
              <h1 className="animate-fade-in-up delay-100 text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight tracking-tight">
                Проверьте помещение для{' '}
                <span className="text-[var(--primary)] relative">
                  общепита
                  <svg className="absolute -bottom-1 left-0 w-full" height="6" viewBox="0 0 200 6" fill="none">
                    <path d="M0 3C50 0.5 150 0.5 200 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.3"/>
                  </svg>
                </span>{' '}
                до подписания аренды
              </h1>
              <p className="animate-fade-in-up delay-200 text-lg md:text-xl text-[var(--muted-foreground)] mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Заполните форму с параметрами помещения — AI проанализирует его по российским нормативам
                и выдаст вердикт: можно ли здесь открыть кафе, ресторан или кофейню.
              </p>
              <div className="animate-fade-in-up delay-300 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  href="/audit"
                  className="px-8 py-3.5 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-xl text-lg font-semibold hover:brightness-110 transition-all shadow-lg shadow-[var(--primary)]/25 animate-pulse-glow"
                >
                  Проверить помещение бесплатно
                </Link>
                <Link
                  href="/pricing"
                  className="px-8 py-3.5 border border-[var(--border)] rounded-xl text-lg font-medium hover:bg-[var(--muted)] hover:border-[var(--primary)]/30 transition-all"
                >
                  Тарифы
                </Link>
              </div>
              <p className="animate-fade-in-up delay-400 mt-4 text-sm text-[var(--muted-foreground)]">
                Бесплатно — краткий вердикт. Без регистрации.
              </p>
            </div>

            {/* Right: report mockup */}
            <div className="animate-fade-in-up delay-300 hidden lg:block">
              <div className="report-mockup bg-[var(--background)] border border-[var(--border)] rounded-2xl p-6 shadow-xl">
                {/* Mockup header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <span className="text-xs text-[var(--muted-foreground)]">Отчёт AI-аудита</span>
                </div>
                {/* Verdict */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="px-3 py-1.5 bg-green-500/15 text-green-600 dark:text-green-400 rounded-lg text-sm font-bold tracking-wide">
                    GO
                  </div>
                  <span className="text-sm text-[var(--muted-foreground)]">Помещение подходит с оговорками</span>
                </div>
                {/* Score bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[var(--muted-foreground)]">Общий рейтинг</span>
                    <span className="font-bold text-[var(--primary)]">78/100</span>
                  </div>
                  <div className="h-2 bg-[var(--muted)] rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[var(--primary)] to-violet-500 rounded-full" style={{ width: '78%' }} />
                  </div>
                </div>
                {/* Mini blocks */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {[
                    { label: 'Электрика', score: 85, color: 'text-yellow-500' },
                    { label: 'Вентиляция', score: 62, color: 'text-sky-500' },
                    { label: 'Пожарка', score: 90, color: 'text-orange-500' },
                  ].map((b) => (
                    <div key={b.label} className="text-center p-2 bg-[var(--muted)] rounded-lg">
                      <div className={`text-lg font-bold ${b.color}`}>{b.score}</div>
                      <div className="text-[10px] text-[var(--muted-foreground)]">{b.label}</div>
                    </div>
                  ))}
                </div>
                {/* Risk line */}
                <div className="flex items-center gap-2 p-2 bg-amber-50 dark:bg-amber-950/20 rounded-lg">
                  <svg className="w-4 h-4 text-amber-500 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                  </svg>
                  <span className="text-xs text-amber-700 dark:text-amber-300">Риск: недостаточная мощность вытяжки</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 md:py-20 px-4 bg-[var(--muted)]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Как это работает</h2>
          <p className="text-center text-[var(--muted-foreground)] mb-12">Три простых шага до результата</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Заполните форму', description: 'Укажите параметры помещения: площадь, этаж, тип кухни, электрическая мощность и другие характеристики.' },
              { step: '2', title: 'AI анализирует', description: 'Искусственный интеллект проверяет помещение по 6 блокам: электрика, вентиляция, водоснабжение, пожарка, санитария, планировка.' },
              { step: '3', title: 'Получите отчёт', description: 'Вердикт GO / NO-GO с обоснованием, список рисков, оценка бюджета на дооснащение и рекомендации.' },
            ].map((item, i) => (
              <div key={item.step} className={`text-center animate-fade-in-up delay-${(i + 1) * 100}`}>
                <div className="w-14 h-14 mx-auto mb-4 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-2xl flex items-center justify-center text-xl font-bold shadow-lg shadow-[var(--primary)]/20">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats + Social proof */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Counters */}
          <div className="scroll-animate grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-[var(--primary)] mb-1">{stat.value}</div>
                <div className="text-sm text-[var(--muted-foreground)]">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Testimonials */}
          <div className="scroll-animate grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.author} className="card-hover p-6 rounded-xl border border-[var(--border)] relative">
                <svg className="w-8 h-8 text-[var(--primary)]/20 absolute top-4 right-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                </svg>
                <p className="text-sm leading-relaxed mb-4 relative z-10">{t.text}</p>
                <div className="border-t border-[var(--border)] pt-3">
                  <div className="font-semibold text-sm">{t.author}</div>
                  <div className="text-xs text-[var(--muted-foreground)]">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Analysis blocks */}
      <section className="py-16 md:py-20 px-4 bg-[var(--muted)]">
        <div className="max-w-5xl mx-auto">
          <h2 className="scroll-animate text-3xl md:text-4xl font-bold text-center mb-4">6 блоков анализа</h2>
          <p className="scroll-animate text-center text-[var(--muted-foreground)] mb-12">
            Каждый блок проверяется по актуальным российским нормативам
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {analysisBlocks.map((block) => (
              <div
                key={block.title}
                className={`scroll-animate card-hover p-6 rounded-xl border transition-all group ${block.cardClass}`}
              >
                <div className={`${block.color} mb-4 group-hover:scale-110 transition-transform`}>
                  <block.Icon size={32} />
                </div>
                <h3 className="font-semibold mb-2">{block.title}</h3>
                <p className="text-sm text-[var(--muted-foreground)] mb-3 leading-relaxed">{block.desc}</p>
                <p className="text-xs text-[var(--primary)] font-medium">{block.norms}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing preview */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="scroll-animate text-3xl md:text-4xl font-bold mb-4">Доступные тарифы</h2>
          <p className="scroll-animate text-[var(--muted-foreground)] mb-12">
            Выезд инженера — от 20 000 ₽ и 3–7 дней. Мы — от 0 ₽ и 2 минуты.
          </p>
          <div className="scroll-animate grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {[
              { name: 'Бесплатно', price: '0 ₽', saving: null, features: ['Краткий вердикт', '3 проверки', 'Без PDF'], cta: 'Попробовать', highlight: false },
              { name: 'Стандарт', price: '3 900 ₽', saving: 'В 5 раз дешевле выезда', features: ['Полный анализ 6 блоков', 'PDF-отчёт', 'Оценка бюджета', 'Топ-3 риска'], cta: 'Выбрать', highlight: true },
              { name: 'Расширенный', price: '7 900 ₽', saving: 'Включает анализ плана', features: ['Всё из Стандарт', 'Анализ плана помещения', 'Рекомендации по ТЗ', 'Детальный бюджет'], cta: 'Выбрать', highlight: false },
            ].map((tier) => (
              <div
                key={tier.name}
                className={`card-hover rounded-xl border-2 bg-[var(--background)] flex flex-col ${
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
                <h3 className="font-semibold text-lg">{tier.name}</h3>
                <div className="text-3xl font-bold my-4">{tier.price}</div>
                {tier.saving && (
                  <div className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-500/10 rounded-full px-3 py-1 mb-4 inline-block mx-auto">
                    {tier.saving}
                  </div>
                )}
                <ul className="text-sm text-[var(--muted-foreground)] space-y-2 mb-6 flex-1 text-left">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-green-500 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/audit"
                  className={`block text-center px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    tier.highlight
                      ? 'bg-[var(--primary)] text-[var(--primary-foreground)] hover:brightness-110 shadow-md shadow-[var(--primary)]/20'
                      : 'border border-[var(--border)] hover:bg-[var(--muted)] hover:border-[var(--primary)]/30'
                  }`}
                >
                  {tier.cta}
                </Link>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <Link href="/compare" className="text-sm text-[var(--primary)] hover:underline font-medium">
              Подробное сравнение тарифов &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-20 px-4 bg-[var(--muted)]">
        <div className="max-w-3xl mx-auto">
          <h2 className="scroll-animate text-3xl md:text-4xl font-bold text-center mb-12">Частые вопросы</h2>
          <div className="space-y-3">
            {faqItems.map((item) => (
              <details
                key={item.q}
                className="group border border-[var(--border)] rounded-xl overflow-hidden card-hover"
              >
                <summary className="flex items-center justify-between p-4 md:p-5 cursor-pointer hover:bg-[var(--muted)] transition-colors select-none">
                  <span className="font-medium text-sm md:text-base">{item.q}</span>
                  <svg
                    className="w-5 h-5 text-[var(--muted-foreground)] group-open:rotate-180 transition-transform duration-200 shrink-0 ml-4"
                    fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </summary>
                <div className="px-4 md:px-5 pb-4 md:pb-5 text-sm text-[var(--muted-foreground)] leading-relaxed">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Не рискуйте арендой вслепую</h2>
          <p className="text-[var(--muted-foreground)] mb-8 text-lg leading-relaxed">
            Выезд инженера стоит 20 000–40 000 ₽ и занимает 3–7 дней.
            Получите предварительную оценку за 2 минуты.
          </p>
          <Link
            href="/audit"
            className="inline-block px-8 py-3.5 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-xl text-lg font-semibold hover:brightness-110 transition-all shadow-lg shadow-[var(--primary)]/25"
          >
            Проверить помещение
          </Link>
        </div>
      </section>
    </div>
  )
}
