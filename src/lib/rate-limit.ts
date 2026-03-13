// Simple in-memory rate limiter for MVP
// In production, replace with Redis-based solution

interface RateLimitEntry {
  count: number
  resetAt: number
}

const store = new Map<string, RateLimitEntry>()

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of store) {
    if (entry.resetAt < now) {
      store.delete(key)
    }
  }
}, 5 * 60 * 1000)

interface RateLimitOptions {
  windowMs: number  // time window in milliseconds
  maxRequests: number  // max requests per window
}

interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetAt: number
}

export function checkRateLimit(
  key: string,
  options: RateLimitOptions
): RateLimitResult {
  const now = Date.now()
  const entry = store.get(key)

  if (!entry || entry.resetAt < now) {
    // New window
    store.set(key, {
      count: 1,
      resetAt: now + options.windowMs,
    })
    return {
      allowed: true,
      remaining: options.maxRequests - 1,
      resetAt: now + options.windowMs,
    }
  }

  entry.count++

  if (entry.count > options.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: entry.resetAt,
    }
  }

  return {
    allowed: true,
    remaining: options.maxRequests - entry.count,
    resetAt: entry.resetAt,
  }
}

// Predefined rate limit configs
export const RATE_LIMITS = {
  // Audit creation: 10 per minute per IP
  audit: { windowMs: 60 * 1000, maxRequests: 10 },
  // PDF generation: 20 per minute per IP
  pdf: { windowMs: 60 * 1000, maxRequests: 20 },
  // Email sending: 5 per minute per IP
  email: { windowMs: 60 * 1000, maxRequests: 5 },
  // Payment: 10 per minute per IP
  payment: { windowMs: 60 * 1000, maxRequests: 10 },
  // Upload: 10 per minute per IP
  upload: { windowMs: 60 * 1000, maxRequests: 10 },
  // Auth login: 5 per minute per IP (brute-force protection)
  authLogin: { windowMs: 60 * 1000, maxRequests: 5 },
  // Auth register: 3 per minute per IP
  authRegister: { windowMs: 60 * 1000, maxRequests: 3 },
}
