import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { runAnalysis } from '@/lib/ai/analyze'
import { verifyWebhookIp, getPayment } from '@/lib/payment/yookassa'
import type { AuditFormValues } from '@/lib/validators/audit-schema'

interface YookassaWebhookEvent {
  type: string
  event: string
  object: {
    id: string
    status: string
    amount: {
      value: string
      currency: string
    }
    metadata?: {
      auditId?: string
      tier?: string
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    // 1. Verify webhook source IP
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || req.headers.get('x-real-ip')
      || 'unknown'

    if (!verifyWebhookIp(ip)) {
      console.warn('Webhook from unauthorized IP:', ip)
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = (await req.json()) as YookassaWebhookEvent
    const { object } = body

    if (!object || !object.id) {
      return NextResponse.json({ error: 'Invalid webhook payload' }, { status: 400 })
    }

    const yookassaId = object.id

    // 2. Verify payment status by calling YooKassa API directly (don't trust webhook body)
    let verifiedPayment
    try {
      verifiedPayment = await getPayment(yookassaId)
    } catch (err) {
      console.error('Failed to verify payment with YooKassa API:', err)
      return NextResponse.json({ error: 'Payment verification failed' }, { status: 400 })
    }

    const status = verifiedPayment.status
    const auditId = verifiedPayment.metadata?.auditId
    const tier = verifiedPayment.metadata?.tier

    // 3. Find payment in our DB
    const payment = await prisma.payment.findFirst({
      where: { yookassaId },
    })

    if (!payment) {
      console.warn('Payment not found for yookassaId:', yookassaId)
      return NextResponse.json({ status: 'ok' })
    }

    // 4. Validate tier value
    const validTiers = ['STANDARD', 'EXTENDED']

    if (status === 'succeeded') {
      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: 'SUCCEEDED' },
      })

      if (auditId && tier && validTiers.includes(tier)) {
        const audit = await prisma.audit.findUnique({
          where: { id: auditId },
        })

        if (audit) {
          await prisma.audit.update({
            where: { id: auditId },
            data: {
              tier: tier as 'STANDARD' | 'EXTENDED',
              status: 'PROCESSING_AI',
            },
          })

          const formData = JSON.parse(audit.formData) as AuditFormValues
          runAnalysis(auditId, formData, audit.floorPlanPath).catch((err) => {
            console.error('Re-analysis failed for paid audit:', auditId, err)
            prisma.audit.update({
              where: { id: auditId },
              data: { status: 'FAILED' },
            }).catch(console.error)
          })
        }
      }
    } else if (status === 'canceled') {
      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: 'CANCELED' },
      })
    }

    return NextResponse.json({ status: 'ok' })
  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json({ status: 'ok' })
  }
}
