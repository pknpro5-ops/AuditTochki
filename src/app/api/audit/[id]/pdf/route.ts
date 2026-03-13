import { NextRequest, NextResponse } from 'next/server'
import { getAuditWithAccessCheck } from '@/lib/audit-access'
import { generatePdf } from '@/lib/pdf/generate'
import type { AuditReport } from '@/types/audit'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const audit = await getAuditWithAccessCheck(id)

    if (!audit) {
      return NextResponse.json({ error: 'Аудит не найден' }, { status: 404 })
    }

    if (audit.status !== 'COMPLETED' || !audit.report) {
      return NextResponse.json(
        { error: 'Отчёт ещё не готов' },
        { status: 400 }
      )
    }

    const report = JSON.parse(audit.report) as AuditReport
    const auditDate = audit.analysisCompletedAt
      ? new Date(audit.analysisCompletedAt).toLocaleDateString('ru-RU', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        })
      : new Date().toLocaleDateString('ru-RU')

    const pdfBuffer = await generatePdf(report, auditDate)

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="audit-${id}.pdf"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    })
  } catch (error) {
    console.error('PDF generation error:', error)
    return NextResponse.json(
      { error: 'Ошибка генерации PDF' },
      { status: 500 }
    )
  }
}
