import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendEmail, buildReportEmailHtml } from '@/lib/email/send'
import { generatePdf } from '@/lib/pdf/generate'
import type { AuditReport } from '@/types/audit'
import { checkRateLimit, RATE_LIMITS } from '@/lib/rate-limit'

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    const rateLimit = checkRateLimit(`email:${ip}`, RATE_LIMITS.email)
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Слишком много запросов. Попробуйте через минуту.' },
        { status: 429 }
      )
    }

    const body = await req.json()
    const { auditId, email } = body as { auditId: string; email: string }

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Некорректный email' },
        { status: 400 }
      )
    }

    const audit = await prisma.audit.findUnique({
      where: { id: auditId },
    })

    if (!audit || audit.status !== 'COMPLETED' || !audit.report) {
      return NextResponse.json(
        { error: 'Отчёт не найден или не готов' },
        { status: 404 }
      )
    }

    const report = JSON.parse(audit.report) as AuditReport
    const isPaid = audit.tier !== 'FREE'

    // Build email
    const html = buildReportEmailHtml(auditId, report.verdict)

    // Generate PDF attachment for paid tiers
    const attachments: Array<{ content: string; filename: string; type: string }> = []

    if (isPaid) {
      const auditDate = audit.analysisCompletedAt
        ? new Date(audit.analysisCompletedAt).toLocaleDateString('ru-RU')
        : new Date().toLocaleDateString('ru-RU')

      const pdfBuffer = await generatePdf(report, auditDate)
      attachments.push({
        content: pdfBuffer.toString('base64'),
        filename: `audit-${auditId}.pdf`,
        type: 'application/pdf',
      })
    }

    await sendEmail({
      to: email,
      subject: `Результат проверки помещения — АудитТочки`,
      html,
      attachments: attachments.length > 0 ? attachments : undefined,
    })

    // Save email to audit
    await prisma.audit.update({
      where: { id: auditId },
      data: { email },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Email sending error:', error)
    const message = error instanceof Error ? error.message : 'Ошибка отправки'
    return NextResponse.json(
      { error: message },
      { status: 500 }
    )
  }
}
