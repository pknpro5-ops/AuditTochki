import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auditFormSchema } from '@/lib/validators/audit-schema'
import { getSessionId } from '@/lib/utils'
import { getCurrentUser } from '@/lib/auth'
import { runAnalysis } from '@/lib/ai/analyze'
import { checkRateLimit, RATE_LIMITS } from '@/lib/rate-limit'

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    const rateLimit = checkRateLimit(`audit:${ip}`, RATE_LIMITS.audit)
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Слишком много запросов. Попробуйте через минуту.' },
        { status: 429 }
      )
    }

    const body = await req.json()
    const { formData, floorPlanPath, floorPlanName } = body

    // Validate form data
    const validation = auditFormSchema.safeParse(formData)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Некорректные данные формы', details: validation.error.issues },
        { status: 400 }
      )
    }

    const sessionId = await getSessionId()
    const user = await getCurrentUser()
    const isAdmin = user?.role === 'ADMIN'

    // Check free usage limit (skip for admin)
    if (!isAdmin) {
      let freeUsage = await prisma.freeUsage.findUnique({
        where: { sessionId },
      })

      if (!freeUsage) {
        freeUsage = await prisma.freeUsage.create({
          data: { sessionId, usageCount: 0 },
        })
      }

      if (freeUsage.usageCount >= 3) {
        return NextResponse.json(
          { error: 'Лимит бесплатных проверок исчерпан (3 из 3). Выберите платный тариф.' },
          { status: 402 }
        )
      }
    }

    // Create audit record
    const audit = await prisma.audit.create({
      data: {
        formData: JSON.stringify(validation.data),
        floorPlanPath: floorPlanPath || null,
        floorPlanName: floorPlanName || null,
        floorPlanExpiresAt: floorPlanPath
          ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          : null,
        status: 'PROCESSING_AI',
        tier: 'FREE',
        sessionId,
        userId: user?.userId ?? null,
        analysisStartedAt: new Date(),
      },
    })

    // Increment free usage (skip for admin)
    if (!isAdmin) {
      const freeUsage = await prisma.freeUsage.findUnique({
        where: { sessionId },
      })
      if (freeUsage) {
        await prisma.freeUsage.update({
          where: { sessionId },
          data: { usageCount: freeUsage.usageCount + 1 },
        })
      }
    }

    // Run analysis in background (non-blocking)
    runAnalysis(audit.id, validation.data, floorPlanPath).catch((err) => {
      console.error('Analysis failed for audit:', audit.id, err)
      prisma.audit.update({
        where: { id: audit.id },
        data: { status: 'FAILED' },
      }).catch(console.error)
    })

    return NextResponse.json({ id: audit.id })
  } catch (error) {
    console.error('Audit creation error:', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}
