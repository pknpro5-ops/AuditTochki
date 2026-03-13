import { prisma } from '@/lib/prisma'
import { getSessionId } from '@/lib/utils'
import { getCurrentUser } from '@/lib/auth'

/**
 * Check if the current user/session has access to an audit.
 * Returns the audit if access is granted, null otherwise.
 */
export async function getAuditWithAccessCheck(auditId: string) {
  const audit = await prisma.audit.findUnique({
    where: { id: auditId },
  })

  if (!audit) return null

  const user = await getCurrentUser()
  const sessionId = await getSessionId()

  // Admin can access any audit
  if (user?.role === 'ADMIN') return audit

  // Owner by userId
  if (user && audit.userId && audit.userId === user.userId) return audit

  // Owner by sessionId (anonymous or same session)
  if (audit.sessionId === sessionId) return audit

  // No access
  return null
}
