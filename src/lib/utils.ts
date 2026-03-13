import { v4 as uuidv4 } from 'uuid'
import { cookies } from 'next/headers'

export async function getSessionId(): Promise<string> {
  const cookieStore = await cookies()
  let sessionId = cookieStore.get('session_id')?.value

  if (!sessionId) {
    sessionId = uuidv4()
    cookieStore.set('session_id', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: '/',
    })
  }

  return sessionId
}

/**
 * Sanitize user text input - strip HTML tags and limit length
 */
export function sanitizeText(input: string, maxLength = 2000): string {
  if (!input || typeof input !== 'string') return ''
  return input
    .replace(/<[^>]*>/g, '') // strip HTML tags
    .replace(/[<>]/g, '')    // extra safety
    .trim()
    .slice(0, maxLength)
}
