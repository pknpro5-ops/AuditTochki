import type { AuditReport } from '@/types/audit'

/**
 * Calculate fallback score from block statuses if AI didn't provide one.
 * Used in ReportView and audit list API.
 */
export function calculateFallbackScore(report: AuditReport): number {
  let score = 100
  for (const block of report.blocks) {
    if (block.status === 'CRITICAL') score -= 20
    else if (block.status === 'WARNING') score -= 8
  }
  if (report.verdict === 'NO_GO') score = Math.min(score, 30)
  else if (report.verdict === 'GO_WITH_RESERVATIONS') score = Math.min(score, 75)
  return Math.max(0, Math.min(100, score))
}

/**
 * Get the effective score — AI-provided or fallback.
 */
export function getEffectiveScore(report: AuditReport): number {
  return report.score ?? calculateFallbackScore(report)
}
