import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit, RATE_LIMITS } from '@/lib/rate-limit'
import { chatWithGemini, type ChatMessage } from '@/lib/ai/gemini'
import { buildChatSystemPrompt } from '@/lib/ai/prompts/chat-prompt'
import { getCurrentUser } from '@/lib/auth'

const MAX_MESSAGES = 20
const MAX_MESSAGE_LENGTH = 500

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser()
    const isAdmin = user?.role === 'ADMIN'

    // Rate limiting (skip for admin)
    if (!isAdmin) {
      const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
      const rateLimit = checkRateLimit(`chat:${ip}`, RATE_LIMITS.chat)
      if (!rateLimit.allowed) {
        return NextResponse.json(
          { error: 'Слишком много сообщений. Подождите немного.' },
          { status: 429 }
        )
      }
    }

    const body = await req.json()
    const { messages } = body

    // Validate messages
    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Сообщения не предоставлены.' },
        { status: 400 }
      )
    }

    // Validate each message and trim to limits
    const trimmedMessages = messages.slice(-MAX_MESSAGES)
    const chatMessages: ChatMessage[] = []

    for (const msg of trimmedMessages) {
      if (!msg.role || !msg.content || typeof msg.content !== 'string') {
        return NextResponse.json(
          { error: 'Неверный формат сообщения.' },
          { status: 400 }
        )
      }

      if (msg.role !== 'user' && msg.role !== 'assistant') {
        return NextResponse.json(
          { error: 'Неверная роль сообщения.' },
          { status: 400 }
        )
      }

      chatMessages.push({
        role: msg.role === 'assistant' ? 'model' : 'user',
        text: msg.content.slice(0, MAX_MESSAGE_LENGTH),
      })
    }

    // Last message must be from user
    if (chatMessages[chatMessages.length - 1].role !== 'user') {
      return NextResponse.json(
        { error: 'Последнее сообщение должно быть от пользователя.' },
        { status: 400 }
      )
    }

    const systemPrompt = buildChatSystemPrompt()
    const reply = await chatWithGemini(systemPrompt, chatMessages)

    return NextResponse.json({ reply })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Не удалось получить ответ. Попробуйте ещё раз.' },
      { status: 500 }
    )
  }
}
