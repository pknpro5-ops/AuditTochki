import { v4 as uuidv4 } from 'uuid'

const YOOKASSA_API_URL = 'https://api.yookassa.ru/v3'

interface CreatePaymentParams {
  amount: number
  description: string
  returnUrl: string
  metadata?: Record<string, string>
}

interface YookassaPayment {
  id: string
  status: 'pending' | 'waiting_for_capture' | 'succeeded' | 'canceled'
  amount: {
    value: string
    currency: string
  }
  confirmation?: {
    type: string
    confirmation_url?: string
  }
  metadata?: Record<string, string>
}

function getCredentials() {
  const shopId = process.env.YOOKASSA_SHOP_ID
  const secretKey = process.env.YOOKASSA_SECRET_KEY

  if (!shopId || !secretKey) {
    throw new Error('YooKassa credentials not configured (YOOKASSA_SHOP_ID, YOOKASSA_SECRET_KEY)')
  }

  return { shopId, secretKey }
}

function getAuthHeader() {
  const { shopId, secretKey } = getCredentials()
  const credentials = Buffer.from(`${shopId}:${secretKey}`).toString('base64')
  return `Basic ${credentials}`
}

export async function createPayment(params: CreatePaymentParams): Promise<YookassaPayment> {
  const idempotenceKey = uuidv4()

  const body = {
    amount: {
      value: params.amount.toFixed(2),
      currency: 'RUB',
    },
    confirmation: {
      type: 'redirect',
      return_url: params.returnUrl,
    },
    capture: true,
    description: params.description,
    metadata: params.metadata || {},
  }

  const response = await fetch(`${YOOKASSA_API_URL}/payments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': getAuthHeader(),
      'Idempotence-Key': idempotenceKey,
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`YooKassa API error ${response.status}: ${errorText}`)
  }

  return (await response.json()) as YookassaPayment
}

export async function getPayment(paymentId: string): Promise<YookassaPayment> {
  const response = await fetch(`${YOOKASSA_API_URL}/payments/${paymentId}`, {
    headers: {
      'Authorization': getAuthHeader(),
    },
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`YooKassa API error ${response.status}: ${errorText}`)
  }

  return (await response.json()) as YookassaPayment
}

export function verifyWebhookIp(ip: string): boolean {
  // YooKassa webhook IPs (as per documentation)
  const allowedIps = [
    '185.71.76.0/27',
    '185.71.77.0/27',
    '77.75.153.0/25',
    '77.75.156.11',
    '77.75.156.35',
    '77.75.154.128/25',
    '2a02:5180::/32',
  ]

  // For development, allow localhost
  if (ip === '127.0.0.1' || ip === '::1' || ip === 'localhost') {
    return true
  }

  // Simple check - in production, use a proper CIDR matching library
  for (const allowed of allowedIps) {
    if (ip === allowed || ip.startsWith(allowed.split('/')[0].slice(0, -1))) {
      return true
    }
  }

  return false
}

export const TIER_PRICES: Record<string, number> = {
  STANDARD: 3900,
  EXTENDED: 7900,
}

export const TIER_NAMES: Record<string, string> = {
  STANDARD: 'Стандарт',
  EXTENDED: 'Расширенный',
}
