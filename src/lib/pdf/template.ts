import type { AuditReport } from '@/types/audit'

const STATUS_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  OK: { bg: '#dcfce7', text: '#166534', label: 'OK' },
  WARNING: { bg: '#fef9c3', text: '#854d0e', label: 'Предупреждение' },
  CRITICAL: { bg: '#fecaca', text: '#991b1b', label: 'Критично' },
}

const VERDICT_STYLES: Record<string, { bg: string; border: string; text: string; label: string }> = {
  GO: {
    bg: '#dcfce7',
    border: '#22c55e',
    text: '#166534',
    label: 'МОЖНО ОТКРЫВАТЬ',
  },
  GO_WITH_RESERVATIONS: {
    bg: '#fef9c3',
    border: '#eab308',
    text: '#854d0e',
    label: 'МОЖНО С ОГОВОРКАМИ',
  },
  NO_GO: {
    bg: '#fecaca',
    border: '#ef4444',
    text: '#991b1b',
    label: 'НЕ РЕКОМЕНДУЕТСЯ',
  },
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

export function buildReportHtml(report: AuditReport, auditDate: string): string {
  const verdict = VERDICT_STYLES[report.verdict] || VERDICT_STYLES.GO_WITH_RESERVATIONS

  const blocksHtml = report.blocks
    .map((block) => {
      const status = STATUS_COLORS[block.status] || STATUS_COLORS.OK
      const icon = BLOCK_ICONS[block.id] || '📋'

      const findingsHtml = block.findings
        .map((f) => {
          const sev = SEVERITY_STYLES[f.severity] || SEVERITY_STYLES.info
          return `
          <div style="margin-bottom:10px; padding:8px 12px; border-left:3px solid ${sev.color}; background:#f9fafb; border-radius:0 4px 4px 0;">
            <div style="font-size:13px; color:#111;">${sev.icon} ${escapeHtml(f.description)}</div>
            ${f.recommendation ? `<div style="font-size:12px; color:#4b5563; margin-top:4px;">→ ${escapeHtml(f.recommendation)}</div>` : ''}
            ${f.regulation ? `<div style="font-size:11px; color:#9ca3af; margin-top:2px;">📎 ${escapeHtml(f.regulation)}</div>` : ''}
          </div>`
        })
        .join('')

      return `
      <div style="margin-bottom:20px; page-break-inside:avoid;">
        <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">
          <span style="font-size:20px;">${icon}</span>
          <span style="font-size:15px; font-weight:600; color:#111;">${escapeHtml(block.title)}</span>
          <span style="padding:2px 10px; border-radius:12px; font-size:11px; font-weight:600; background:${status.bg}; color:${status.text};">${status.label}</span>
        </div>
        ${findingsHtml || '<div style="font-size:13px; color:#6b7280; padding:8px 12px;">Замечаний нет</div>'}
      </div>`
    })
    .join('')

  const budgetBreakdownHtml = report.budget.breakdown
    .map(
      (item) =>
        `<tr>
        <td style="padding:6px 8px; font-size:13px; border-bottom:1px solid #e5e7eb;">${escapeHtml(item.item)}</td>
        <td style="padding:6px 8px; font-size:13px; border-bottom:1px solid #e5e7eb; text-align:right; white-space:nowrap;">${formatMoney(item.min)}–${formatMoney(item.max)} тыс. ₽</td>
      </tr>`
    )
    .join('')

  const risksHtml = report.top_risks
    .map((risk) => {
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
    })
    .join('')

  const nextStepsHtml = report.next_steps
    .map(
      (step, i) =>
        `<div style="display:flex; gap:8px; margin-bottom:6px;">
        <span style="color:#2563eb; font-weight:600; font-size:13px;">${i + 1}.</span>
        <span style="font-size:13px; color:#374151;">${escapeHtml(step)}</span>
      </div>`
    )
    .join('')

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
  @page {
    size: A4;
    margin: 20mm 15mm;
  }
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
  .budget-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 12px;
  }
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
</style>
</head>
<body>

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
  ${escapeHtml(report.disclaimer || 'Данный отчёт является предварительной оценкой и не заменяет полноценного инженерного обследования.')}
</div>

<div class="footer">
  © 2026 АудитТочки. Проект hot-plan.ru
</div>

</body>
</html>`
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
