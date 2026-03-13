import puppeteer from 'puppeteer'
import { buildReportHtml } from './template'
import type { AuditReport } from '@/types/audit'

export async function generatePdf(
  report: AuditReport,
  auditDate: string
): Promise<Buffer> {
  const html = buildReportHtml(report, auditDate)

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  })

  try {
    const page = await browser.newPage()

    await page.setContent(html, {
      waitUntil: 'networkidle0',
    })

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '15mm',
        bottom: '15mm',
        left: '12mm',
        right: '12mm',
      },
    })

    return Buffer.from(pdfBuffer)
  } finally {
    await browser.close()
  }
}
