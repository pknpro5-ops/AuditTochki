import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionId } from '@/lib/utils'
import { getCurrentUser } from '@/lib/auth'
import { getEffectiveScore } from '@/lib/utils/score'
import type { AuditReport } from '@/types/audit'

export async function GET() {
  try {
    const sessionId = await getSessionId()
    const user = await getCurrentUser()

    // If logged in, show audits by userId OR sessionId; otherwise just sessionId
    const whereClause = user
      ? {
          OR: [{ userId: user.userId }, { sessionId }],
          status: 'COMPLETED' as const,
          report: { not: null },
        }
      : {
          sessionId,
          status: 'COMPLETED' as const,
          report: { not: null },
        }

    const audits = await prisma.audit.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        formData: true,
        report: true,
        createdAt: true,
        tier: true,
      },
    })

    const items = audits.map((audit) => {
      const formData = JSON.parse(audit.formData) as Record<string, unknown>
      const report = JSON.parse(audit.report!) as AuditReport

      return {
        id: audit.id,
        venueType: formData.venueType as string,
        area: formData.area as number,
        address: (formData.address as string) || '',
        verdict: report.verdict,
        score: getEffectiveScore(report),
        budgetMin: report.budget?.min ?? 0,
        budgetMax: report.budget?.max ?? 0,
        tier: audit.tier,
        blocks: report.blocks.map((b) => ({ id: b.id, title: b.title, status: b.status })),
        topRisks: report.top_risks.slice(0, 3),
        createdAt: audit.createdAt.toISOString(),
      }
    })

    return NextResponse.json({ items })
  } catch (error) {
    console.error('Audit list error:', error)
    return NextResponse.json({ error: 'Ошибка получения списка' }, { status: 500 })
  }
}
