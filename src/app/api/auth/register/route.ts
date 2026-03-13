import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { getSessionId } from '@/lib/utils'
import { signToken, setAuthCookie } from '@/lib/auth'
import { checkRateLimit, RATE_LIMITS } from '@/lib/rate-limit'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    const rateLimit = checkRateLimit(`auth-register:${ip}`, RATE_LIMITS.authRegister)
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Слишком много попыток. Попробуйте через минуту.' },
        { status: 429 }
      )
    }

    const { email, password } = await req.json()

    // Validate
    if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email)) {
      return NextResponse.json({ error: 'Укажите корректный email' }, { status: 400 })
    }
    if (!password || typeof password !== 'string' || password.length < 6) {
      return NextResponse.json({ error: 'Пароль должен быть не менее 6 символов' }, { status: 400 })
    }
    if (password.length > 128) {
      return NextResponse.json({ error: 'Пароль слишком длинный' }, { status: 400 })
    }
    if (email.length > 254) {
      return NextResponse.json({ error: 'Email слишком длинный' }, { status: 400 })
    }

    const normalizedEmail = email.toLowerCase().trim()

    // Check uniqueness
    const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } })
    if (existing) {
      return NextResponse.json({ error: 'Этот email уже зарегистрирован' }, { status: 409 })
    }

    // Create user
    const passwordHash = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: { email: normalizedEmail, passwordHash },
    })

    // Link existing anonymous audits to this user
    try {
      const sessionId = await getSessionId()
      await prisma.audit.updateMany({
        where: { sessionId, userId: null },
        data: { userId: user.id },
      })
    } catch {
      // Non-critical
    }

    // Set auth cookie
    const token = signToken({ userId: user.id, email: user.email, role: user.role })
    await setAuthCookie(token)

    return NextResponse.json({
      user: { id: user.id, email: user.email, role: user.role },
    })
  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json({ error: 'Ошибка регистрации' }, { status: 500 })
  }
}
