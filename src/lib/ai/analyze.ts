import { prisma } from '@/lib/prisma'
import { analyzeWithGemini, ocrFloorPlan } from './gemini'
import { buildSystemPrompt } from './prompts/system-prompt'
import { buildAnalysisPrompt } from './prompts/analysis-prompt'
import type { AuditFormValues } from '@/lib/validators/audit-schema'
import type { AuditReport } from '@/types/audit'

const MAX_RETRIES = 2

export async function runAnalysis(
  auditId: string,
  formData: AuditFormValues,
  floorPlanPath: string | null
): Promise<void> {
  try {
    // Step 1: OCR floor plan if provided
    let ocrData: Record<string, unknown> | null = null

    if (floorPlanPath) {
      await prisma.audit.update({
        where: { id: auditId },
        data: { status: 'PROCESSING_OCR' },
      })

      ocrData = await ocrFloorPlan(floorPlanPath)

      if (ocrData) {
        await prisma.audit.update({
          where: { id: auditId },
          data: { ocrData: JSON.stringify(ocrData) },
        })
      }
    }

    // Step 2: AI Analysis
    await prisma.audit.update({
      where: { id: auditId },
      data: { status: 'PROCESSING_AI' },
    })

    const audit = await prisma.audit.findUnique({ where: { id: auditId } })
    const tier = (audit?.tier || 'FREE') as 'FREE' | 'STANDARD' | 'EXTENDED'

    const systemPrompt = buildSystemPrompt()
    const userPrompt = buildAnalysisPrompt(formData, ocrData, tier)

    let reportJson: string | null = null
    let lastError: Error | null = null

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        reportJson = await analyzeWithGemini(systemPrompt, userPrompt)
        break
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error))
        console.warn(`Gemini attempt ${attempt + 1} failed:`, lastError.message)
        if (attempt < MAX_RETRIES) {
          // Wait longer for 429 quota errors (17-30 seconds as suggested by API)
          const is429 = lastError.message.includes('429')
          const delay = is429 ? 18000 * (attempt + 1) : 3000 * (attempt + 1)
          console.log(`Retrying in ${delay / 1000}s...`)
          await new Promise((resolve) => setTimeout(resolve, delay))
        }
      }
    }

    if (!reportJson) {
      throw lastError || new Error('AI analysis failed after retries')
    }

    // Parse and validate report
    const report = JSON.parse(reportJson) as AuditReport

    // Update audit with results
    await prisma.audit.update({
      where: { id: auditId },
      data: {
        report: JSON.stringify(report),
        verdict: report.verdict,
        status: 'COMPLETED',
        analysisCompletedAt: new Date(),
      },
    })
  } catch (error) {
    console.error('Analysis error for audit:', auditId, error)
    await prisma.audit.update({
      where: { id: auditId },
      data: { status: 'FAILED' },
    }).catch(console.error)
    throw error
  }
}
