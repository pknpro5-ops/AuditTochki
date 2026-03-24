// Unisender Go API — серверы в РФ, соответствие ФЗ-152
const UNISENDER_API_URL = 'https://goapi.unisender.ru/ru/transactional/api/v1/email/send.json'

interface SendEmailParams {
  to: string
  subject: string
  html: string
  attachments?: Array<{
    content: string // base64
    filename: string
    type: string
  }>
}

export async function sendEmail(params: SendEmailParams): Promise<void> {
  const apiKey = process.env.UNISENDER_API_KEY
  const fromEmail = process.env.UNISENDER_FROM_EMAIL || 'noreply@audittochki.ru'

  if (!apiKey) {
    throw new Error('UNISENDER_API_KEY не настроен')
  }

  const message: Record<string, unknown> = {
    recipients: [{ email: params.to }],
    subject: params.subject,
    from_email: fromEmail,
    from_name: 'АудитТочки',
    body: {
      html: params.html,
    },
    // skip_unsubscribe требует специального флага на аккаунте
  }

  if (params.attachments && params.attachments.length > 0) {
    message.attachments = params.attachments.map((a) => ({
      type: a.type,
      name: a.filename.replace(/\//g, '-'), // "/" запрещены в именах
      content: a.content,
    }))
  }

  const response = await fetch(UNISENDER_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-API-KEY': apiKey,
    },
    body: JSON.stringify({ message }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Unisender error ${response.status}: ${errorText}`)
  }

  const data = await response.json() as { status?: string; failed_emails?: Record<string, string> }

  if (data.failed_emails && Object.keys(data.failed_emails).length > 0) {
    const reasons = Object.values(data.failed_emails).join(', ')
    throw new Error(`Unisender: письмо не доставлено — ${reasons}`)
  }
}

export function buildReportEmailHtml(auditId: string, verdict: string): string {
  const verdictLabels: Record<string, string> = {
    GO: 'МОЖНО ОТКРЫВАТЬ',
    GO_WITH_RESERVATIONS: 'МОЖНО С ОГОВОРКАМИ',
    NO_GO: 'НЕ РЕКОМЕНДУЕТСЯ',
  }

  const verdictColors: Record<string, string> = {
    GO: '#22c55e',
    GO_WITH_RESERVATIONS: '#eab308',
    NO_GO: '#ef4444',
  }

  const label = verdictLabels[verdict] || verdict
  const color = verdictColors[verdict] || '#6b7280'
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://audittochki.ru'

  return `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #111;">
  <div style="text-align: center; padding: 20px 0; border-bottom: 2px solid #2563eb;">
    <h1 style="font-size: 24px; margin: 0;">Аудит<span style="color: #2563eb;">Точки</span></h1>
  </div>

  <div style="text-align: center; padding: 30px 0;">
    <h2 style="margin: 0 0 10px;">Ваш отчёт готов!</h2>
    <div style="display: inline-block; padding: 8px 24px; border-radius: 8px; background: ${color}20; color: ${color}; font-weight: 700; font-size: 18px; border: 2px solid ${color};">
      ${label}
    </div>
  </div>

  <div style="text-align: center; padding: 20px 0;">
    <a href="${appUrl}/audit/${auditId}" style="display: inline-block; padding: 12px 32px; background: #2563eb; color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">
      Посмотреть полный отчёт
    </a>
  </div>

  <div style="text-align: center; font-size: 12px; color: #9ca3af; padding-top: 20px; border-top: 1px solid #e5e7eb;">
    <p>Это письмо отправлено сервисом АудитТочки.</p>
    <p>Результаты являются предварительной оценкой.</p>
    <p>© 2026 АудитТочки. Проект <a href="https://hot-plan.ru" style="color: #2563eb;">hot-plan.ru</a></p>
  </div>
</body>
</html>`
}
