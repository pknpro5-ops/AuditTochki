import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createPayment, TIER_PRICES, TIER_NAMES } from '@/lib/payment/yookassa'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { auditId, tier } = body as { auditId: string; tier: string }

    // Validate tier
    if (!tier || !TIER_PRICES[tier]) {
      return NextResponse.json(
        { error: 'Некорректный тариф' },
        { status: 400 }
      )
    }

    // Validate audit exists
    const audit = await prisma.audit.findUnique({
      where: { id: auditId },
    })

    if (!audit) {
      return NextResponse.json(
        { error: 'Аудит не найден' },
        { status: 404 }
      )
    }

    const amount = TIER_PRICES[tier]
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    // Create YooKassa payment
    const payment = await createPayment({
      amount,
      description: `АудитТочки — тариф ${TIER_NAMES[tier]}`,
      returnUrl: `${appUrl}/audit/${auditId}?payment=success`,
      metadata: {
        auditId,
        tier,
      },
    })

    // Save payment to DB
    await prisma.payment.create({
      data: {
        auditId,
        yookassaId: payment.id,
        amount,
        status: 'PENDING',
        tier,
      },
    })

    // Return confirmation URL
    const confirmationUrl = payment.confirmation?.confirmation_url
    if (!confirmationUrl) {
      throw new Error('No confirmation URL from YooKassa')
    }

    return NextResponse.json({ confirmationUrl })
  } catch (error) {
    console.error('Payment creation error:', error)
    const message = error instanceof Error ? error.message : 'Ошибка создания платежа'
    return NextResponse.json(
      { error: message },
      { status: 500 }
    )
  }
}
