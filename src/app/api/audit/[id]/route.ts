import { NextRequest, NextResponse } from 'next/server'
import { getAuditWithAccessCheck } from '@/lib/audit-access'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const audit = await getAuditWithAccessCheck(id)

    if (!audit) {
      return NextResponse.json(
        { error: 'Аудит не найден' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      id: audit.id,
      status: audit.status,
      tier: audit.tier,
      verdict: audit.verdict,
      report: audit.report ? JSON.parse(audit.report) : null,
      formData: JSON.parse(audit.formData),
      createdAt: audit.createdAt,
      analysisCompletedAt: audit.analysisCompletedAt,
    })
  } catch (error) {
    console.error('Audit fetch error:', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}
