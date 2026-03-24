const RESEND_API_URL = 'https://api.resend.com/emails'

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
  const apiKey = process.env.RESEND_API_KEY

  if (!apiKey) {
    throw new Error('RESEND_API_KEY не настроен')
  }

  const body: Record<string, unknown> = {
    from: 'АудитТочки <onboarding@resend.dev>',
    to: [params.to],
    subject: params.subject,
    html: params.html,
  }

  if (params.attachments && params.attachments.length > 0) {
    body.attachments = params.attachments.map((a) => ({
      content: a.content,
      filename: a.filename,
    }))
  }

  const response = await fetch(RESEND_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Resend error ${response.status}: ${errorText}`)
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
