/**
 * Generate example PDF report for the landing page
 * Run: npx tsx scripts/generate-example-pdf.ts
 */

import puppeteer from 'puppeteer'
import { writeFileSync } from 'fs'
import { join } from 'path'

// Inline the template logic to avoid path alias issues
const STATUS_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  OK: { bg: '#dcfce7', text: '#166534', label: 'OK' },
  WARNING: { bg: '#fef9c3', text: '#854d0e', label: 'Предупреждение' },
  CRITICAL: { bg: '#fecaca', text: '#991b1b', label: 'Критично' },
}

const VERDICT_STYLES: Record<string, { bg: string; border: string; text: string; label: string }> = {
  GO: { bg: '#dcfce7', border: '#22c55e', text: '#166534', label: 'МОЖНО ОТКРЫВАТЬ' },
  GO_WITH_RESERVATIONS: { bg: '#fef9c3', border: '#eab308', text: '#854d0e', label: 'МОЖНО С ОГОВОРКАМИ' },
  NO_GO: { bg: '#fecaca', border: '#ef4444', text: '#991b1b', label: 'НЕ РЕКОМЕНДУЕТСЯ' },
}

const SEVERITY_STYLES: Record<string, { color: string; icon: string }> = {
  info: { color: '#2563eb', icon: 'ℹ️' },
  warning: { color: '#d97706', icon: '⚠️' },
  critical: { color: '#dc2626', icon: '🚫' },
}

const BLOCK_ICONS: Record<string, string> = {
  electrical: '⚡',
  ventilation: '🌬️',
  water_sewage: '💧',
  fire_safety: '🔥',
  sanitation: '🧹',
  planning: '📐',
}

function formatMoney(n: number): string {
  return n.toLocaleString('ru-RU')
}

function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

interface Finding {
  description: string
  regulation: string
  severity: 'info' | 'warning' | 'critical'
  recommendation: string
}

interface AnalysisBlock {
  id: string
  title: string
  status: string
  findings: Finding[]
}

interface AuditReport {
  verdict: string
  score: number
  summary: string
  blocks: AnalysisBlock[]
  budget: { min: number; max: number; breakdown: { item: string; min: number; max: number }[] }
  top_risks: { rank: number; description: string; severity: string }[]
  next_steps: string[]
  disclaimer: string
}

function buildReportHtml(report: AuditReport, auditDate: string): string {
  const verdict = VERDICT_STYLES[report.verdict] || VERDICT_STYLES.GO_WITH_RESERVATIONS

  const blocksHtml = report.blocks.map((block) => {
    const status = STATUS_COLORS[block.status] || STATUS_COLORS.OK
    const icon = BLOCK_ICONS[block.id] || '📋'
    const findingsHtml = block.findings.map((f) => {
      const sev = SEVERITY_STYLES[f.severity] || SEVERITY_STYLES.info
      return `
      <div style="margin-bottom:10px; padding:8px 12px; border-left:3px solid ${sev.color}; background:#f9fafb; border-radius:0 4px 4px 0;">
        <div style="font-size:13px; color:#111;">${sev.icon} ${escapeHtml(f.description)}</div>
        ${f.recommendation ? `<div style="font-size:12px; color:#4b5563; margin-top:4px;">→ ${escapeHtml(f.recommendation)}</div>` : ''}
        ${f.regulation ? `<div style="font-size:11px; color:#9ca3af; margin-top:2px;">📎 ${escapeHtml(f.regulation)}</div>` : ''}
      </div>`
    }).join('')
    return `
    <div style="margin-bottom:20px; page-break-inside:avoid;">
      <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">
        <span style="font-size:20px;">${icon}</span>
        <span style="font-size:15px; font-weight:600; color:#111;">${escapeHtml(block.title)}</span>
        <span style="padding:2px 10px; border-radius:12px; font-size:11px; font-weight:600; background:${status.bg}; color:${status.text};">${status.label}</span>
      </div>
      ${findingsHtml || '<div style="font-size:13px; color:#6b7280; padding:8px 12px;">Замечаний нет</div>'}
    </div>`
  }).join('')

  const budgetBreakdownHtml = report.budget.breakdown.map((item) =>
    `<tr>
      <td style="padding:6px 8px; font-size:13px; border-bottom:1px solid #e5e7eb;">${escapeHtml(item.item)}</td>
      <td style="padding:6px 8px; font-size:13px; border-bottom:1px solid #e5e7eb; text-align:right; white-space:nowrap;">${formatMoney(item.min)}–${formatMoney(item.max)} тыс. ₽</td>
    </tr>`
  ).join('')

  const risksHtml = report.top_risks.map((risk) => {
    const color = risk.severity === 'critical' ? '#dc2626' : '#d97706'
    const label = risk.severity === 'critical' ? 'Критичный' : 'Высокий'
    return `
    <div style="display:flex; align-items:flex-start; gap:10px; margin-bottom:10px;">
      <span style="flex-shrink:0; width:24px; height:24px; border-radius:50%; background:${color}; color:#fff; font-size:12px; font-weight:700; display:flex; align-items:center; justify-content:center;">${risk.rank}</span>
      <div>
        <div style="font-size:13px; color:#111;">${escapeHtml(risk.description)}</div>
        <span style="font-size:11px; color:${color}; font-weight:600;">${label}</span>
      </div>
    </div>`
  }).join('')

  const nextStepsHtml = report.next_steps.map((step, i) =>
    `<div style="display:flex; gap:8px; margin-bottom:6px;">
      <span style="color:#2563eb; font-weight:600; font-size:13px;">${i + 1}.</span>
      <span style="font-size:13px; color:#374151;">${escapeHtml(step)}</span>
    </div>`
  ).join('')

  return `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body {
    font-family: 'Segoe UI', 'Roboto', 'Noto Sans', Arial, sans-serif;
    color: #111827;
    line-height: 1.5;
    padding: 40px;
    font-size: 14px;
  }
  @page { size: A4; margin: 20mm 15mm; }
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2px solid #2563eb;
    padding-bottom: 12px;
    margin-bottom: 24px;
  }
  .logo { font-size: 22px; font-weight: 700; color: #111; }
  .logo span { color: #2563eb; }
  .date { font-size: 12px; color: #6b7280; }
  .verdict-box {
    text-align: center;
    padding: 20px;
    border-radius: 12px;
    margin-bottom: 24px;
    border: 2px solid;
  }
  .verdict-label { font-size: 22px; font-weight: 800; letter-spacing: 1px; }
  .summary { font-size: 13px; margin-top: 10px; font-style: italic; }
  .section-title {
    font-size: 16px;
    font-weight: 700;
    color: #111827;
    margin: 24px 0 12px;
    padding-bottom: 6px;
    border-bottom: 1px solid #e5e7eb;
  }
  .budget-table { width: 100%; border-collapse: collapse; margin-bottom: 12px; }
  .budget-total {
    display: flex;
    justify-content: space-between;
    font-weight: 700;
    font-size: 15px;
    padding: 8px;
    background: #f3f4f6;
    border-radius: 6px;
    margin-bottom: 20px;
  }
  .disclaimer {
    font-size: 11px;
    color: #9ca3af;
    text-align: center;
    margin-top: 30px;
    padding-top: 16px;
    border-top: 1px solid #e5e7eb;
  }
  .footer {
    text-align: center;
    font-size: 11px;
    color: #9ca3af;
    margin-top: 12px;
  }
  .watermark {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(-35deg);
    font-size: 72px;
    font-weight: 900;
    color: rgba(37, 99, 235, 0.06);
    white-space: nowrap;
    pointer-events: none;
    z-index: -1;
  }
</style>
</head>
<body>

<div class="watermark">ПРИМЕР ОТЧЁТА</div>

<div class="header">
  <div class="logo">Аудит<span>Точки</span></div>
  <div class="date">Дата проверки: ${escapeHtml(auditDate)}</div>
</div>

<div class="verdict-box" style="background:${verdict.bg}; border-color:${verdict.border};">
  <div class="verdict-label" style="color:${verdict.text};">${verdict.label}</div>
  <div class="summary" style="color:${verdict.text};">${escapeHtml(report.summary)}</div>
</div>

<div class="section-title">Анализ по 6 блокам</div>
${blocksHtml}

<div class="section-title" style="page-break-before:auto;">Оценка бюджета на дооснащение</div>
<table class="budget-table">
  ${budgetBreakdownHtml}
</table>
<div class="budget-total">
  <span>Итого:</span>
  <span>${formatMoney(report.budget.min)}–${formatMoney(report.budget.max)} тыс. ₽</span>
</div>

${report.top_risks.length > 0 ? `
<div class="section-title">Ключевые риски</div>
${risksHtml}
` : ''}

${report.next_steps.length > 0 ? `
<div class="section-title">Следующие шаги</div>
${nextStepsHtml}
` : ''}

<div class="disclaimer">
  ${escapeHtml(report.disclaimer)}
</div>

<div class="footer">
  © 2026 АудитТочки. Проект hot-plan.ru
</div>

</body>
</html>`
}

// Realistic example report for a cafe in a residential building ground floor
const exampleReport: AuditReport = {
  verdict: 'GO_WITH_RESERVATIONS',
  score: 68,
  summary: 'Помещение подходит для открытия кафе, но требует значительных доработок по вентиляции и пожарной безопасности. Наличие отдельного входа с улицы и достаточная площадь — ключевые преимущества. Рекомендуется решить вопрос с вытяжкой до подписания договора аренды.',
  blocks: [
    {
      id: 'electrical',
      title: 'Электроснабжение',
      status: 'WARNING',
      findings: [
        {
          description: 'Выделенная мощность 15 кВт недостаточна для кафе с горячей кухней. Рекомендуемая мощность для данного типа заведения — не менее 25–30 кВт.',
          regulation: 'СП 31-110-2003 «Проектирование и монтаж электроустановок жилых и общественных зданий»',
          severity: 'warning',
          recommendation: 'Подайте заявку в энергосбытовую компанию на увеличение мощности до 30 кВт. Стоимость подключения зависит от региона и доступности мощности в здании.',
        },
        {
          description: 'Однофазное подключение 220В ограничивает выбор профессионального оборудования. Многие конвектоматы и плиты требуют трёхфазного питания 380В.',
          regulation: 'ПУЭ 7-е изд., п. 7.1.37',
          severity: 'warning',
          recommendation: 'При увеличении мощности запросите переход на трёхфазную сеть 380В. Это расширит выбор оборудования и снизит нагрузку на фазу.',
        },
      ],
    },
    {
      id: 'ventilation',
      title: 'Вентиляция и вытяжка',
      status: 'CRITICAL',
      findings: [
        {
          description: 'Отсутствует выделенный вентиляционный канал для вытяжки горячего цеха. Использование общедомовой вентиляции для заведений общепита запрещено.',
          regulation: 'СП 60.13330.2020 «Отопление, вентиляция и кондиционирование воздуха», п. 7.1.10',
          severity: 'critical',
          recommendation: 'Необходимо проектирование и монтаж отдельного вентиляционного канала с выводом на крышу или через фасад (при согласовании с УК).',
        },
        {
          description: 'Вывод вытяжки через фасад возможен, но требует согласования с управляющей компанией и жильцами. При наличии жилых помещений сверху могут быть ограничения.',
          regulation: 'Постановление Правительства РФ № 491, ЖК РФ ст. 36',
          severity: 'warning',
          recommendation: 'Получите письменное согласие УК на вывод вентиляции через фасад. Рассмотрите вариант вывода через крышу — он надёжнее с точки зрения согласований.',
        },
      ],
    },
    {
      id: 'water_sewage',
      title: 'Водоснабжение и канализация',
      status: 'OK',
      findings: [
        {
          description: 'Централизованное горячее и холодное водоснабжение обеспечивает потребности кафе. Точки подключения расположены в нужных местах.',
          regulation: 'СП 30.13330.2020 «Внутренний водопровод и канализация зданий»',
          severity: 'info',
          recommendation: 'При проектировании кухни учтите необходимость установки жироуловителя на канализационном выпуске.',
        },
        {
          description: 'Рекомендуется установить жироуловитель перед подключением к общедомовой канализации — это обязательное требование для предприятий общепита.',
          regulation: 'СанПиН 2.3/2.4.3590-20, п. 3.7',
          severity: 'info',
          recommendation: 'Заложите в бюджет жироуловитель производительностью не менее 1.0 л/с. Стоимость оборудования — от 25 до 80 тыс. ₽.',
        },
      ],
    },
    {
      id: 'fire_safety',
      title: 'Пожарная безопасность',
      status: 'WARNING',
      findings: [
        {
          description: 'Ширина входной двери менее 0.9 м не соответствует требованиям для заведений общепита с числом посадочных мест более 25.',
          regulation: 'СП 1.13130.2020 «Системы противопожарной защиты. Эвакуационные пути и выходы», п. 4.2.5',
          severity: 'warning',
          recommendation: 'Расширьте дверной проём до минимум 0.9 м (рекомендуется 1.2 м). Согласуйте перепланировку с БТИ и управляющей компанией.',
        },
        {
          description: 'Необходима установка автоматической пожарной сигнализации (АПС) и системы оповещения и управления эвакуацией (СОУЭ) не ниже 2-го типа.',
          regulation: 'Федеральный закон №123-ФЗ «Технический регламент о требованиях пожарной безопасности»',
          severity: 'info',
          recommendation: 'Закажите проект пожарной сигнализации в лицензированной организации. Ориентировочная стоимость проекта + монтаж — 80–150 тыс. ₽.',
        },
      ],
    },
    {
      id: 'sanitation',
      title: 'Санитарные нормы',
      status: 'OK',
      findings: [
        {
          description: 'Высота потолков 3.0 м соответствует требованиям для предприятий общественного питания (минимум 2.7 м).',
          regulation: 'СанПиН 2.3/2.4.3590-20, п. 2.2',
          severity: 'info',
          recommendation: 'Запас по высоте позволяет разместить подвесные потолки для скрытой прокладки коммуникаций.',
        },
        {
          description: 'Один санузел достаточен для кафе с посадкой до 50 мест. При увеличении числа мест потребуется второй санузел.',
          regulation: 'СП 44.13330.2011 «Административные и бытовые здания», п. 5.2',
          severity: 'info',
          recommendation: 'Предусмотрите раздельные санузлы для персонала и посетителей при числе посадочных мест более 25.',
        },
      ],
    },
    {
      id: 'planning',
      title: 'Планировка и зонирование',
      status: 'OK',
      findings: [
        {
          description: 'Площадь 85 м² позволяет разместить кафе на 30 мест с полноценной кухней. Рекомендуемое соотношение: 40% кухня и подсобные, 60% зал.',
          regulation: 'СП 118.13330.2022 «Общественные здания и сооружения»',
          severity: 'info',
          recommendation: 'Закажите профессиональную планировку с разделением на зоны: горячий цех, холодный цех, мойка, склад, зал, санузлы.',
        },
        {
          description: 'Отдельный вход с улицы — существенное преимущество. Обеспечивает удобный доступ для посетителей и соответствует требованиям для первого этажа жилого дома.',
          regulation: 'ЖК РФ ст. 22, п. 2',
          severity: 'info',
          recommendation: 'Рассмотрите установку летней веранды у входа — это увеличит посадку на 8–12 мест в тёплый сезон.',
        },
      ],
    },
  ],
  budget: {
    min: 850,
    max: 1450,
    breakdown: [
      { item: 'Вентиляция (проект + монтаж вытяжного канала)', min: 250, max: 450 },
      { item: 'Электрика (увеличение мощности до 30 кВт, трёхфазка)', min: 80, max: 150 },
      { item: 'Пожарная сигнализация (проект + монтаж АПС и СОУЭ)', min: 80, max: 150 },
      { item: 'Расширение дверного проёма', min: 40, max: 80 },
      { item: 'Водоснабжение (жироуловитель, разводка)', min: 50, max: 100 },
      { item: 'Проектная документация (все разделы)', min: 100, max: 180 },
      { item: 'Согласования (УК, Роспотребнадзор, МЧС)', min: 50, max: 90 },
      { item: 'Непредвиденные расходы (10–15%)', min: 100, max: 250 },
    ],
  },
  top_risks: [
    {
      rank: 1,
      description: 'Отказ управляющей компании согласовать вывод вытяжки через фасад. Без решения вопроса с вентиляцией открытие кафе с горячей кухней невозможно.',
      severity: 'critical',
    },
    {
      rank: 2,
      description: 'Недостаточная электрическая мощность здания — увеличение до 30 кВт может быть невозможно без реконструкции внутридомовых сетей.',
      severity: 'high',
    },
    {
      rank: 3,
      description: 'Жалобы жильцов на шум и запахи при работе вытяжной системы. Необходимо предусмотреть шумоглушители и фильтры очистки воздуха.',
      severity: 'high',
    },
    {
      rank: 4,
      description: 'Срок аренды до 3 лет может не окупить вложения в инженерные системы (850–1450 тыс. ₽). Рекомендуется договор на 5+ лет.',
      severity: 'high',
    },
  ],
  next_steps: [
    'Получите технические условия на увеличение электрической мощности до 30 кВт (обращение в энергосбытовую компанию)',
    'Согласуйте с управляющей компанией возможность вывода вентиляции через фасад или крышу',
    'Закажите проект вентиляции у лицензированной организации (HVAC-проектирование)',
    'Заключите договор аренды на срок не менее 5 лет для окупаемости инвестиций',
    'Подготовьте проект перепланировки и согласуйте его в БТИ',
    'Закажите проект пожарной сигнализации и получите согласование МЧС',
    'Уведомите Роспотребнадзор о начале деятельности предприятия общепита',
  ],
  disclaimer: 'Данный отчёт является предварительной AI-оценкой и не заменяет полноценного инженерного обследования. Для принятия финальных решений рекомендуется привлечь квалифицированных специалистов. Сервис АудитТочки не несёт ответственности за решения, принятые на основе данного отчёта.',
}

async function main() {
  console.log('Generating example PDF report...')

  const html = buildReportHtml(exampleReport, '14 марта 2026')

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  })

  try {
    const page = await browser.newPage()
    await page.setContent(html, { waitUntil: 'networkidle0' })

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '15mm', bottom: '15mm', left: '12mm', right: '12mm' },
    })

    const outputPath = join(__dirname, '..', 'public', 'example-report.pdf')
    writeFileSync(outputPath, pdfBuffer)
    console.log(`PDF saved to: ${outputPath}`)
  } finally {
    await browser.close()
  }
}

main().catch(console.error)
