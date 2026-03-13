import { NextRequest, NextResponse } from 'next/server'
import { getAuditWithAccessCheck } from '@/lib/audit-access'
import ExcelJS from 'exceljs'
import type { AuditReport } from '@/types/audit'

const verdictLabels: Record<string, string> = {
  GO: 'Можно открывать',
  GO_WITH_RESERVATIONS: 'Можно с оговорками',
  NO_GO: 'Не рекомендуется',
}

const statusLabels: Record<string, string> = {
  OK: 'OK',
  WARNING: 'Предупреждение',
  CRITICAL: 'Критично',
}

const statusColors: Record<string, string> = {
  OK: '22c55e',
  WARNING: 'eab308',
  CRITICAL: 'ef4444',
}

function applyHeaderStyle(row: ExcelJS.Row) {
  row.eachCell((cell) => {
    cell.font = { bold: true, size: 12, color: { argb: 'FFFFFFFF' } }
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4338ca' } }
    cell.alignment = { vertical: 'middle', horizontal: 'center' }
    cell.border = {
      top: { style: 'thin' },
      bottom: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' },
    }
  })
}

function applyCellBorder(row: ExcelJS.Row) {
  row.eachCell((cell) => {
    cell.border = {
      top: { style: 'thin' },
      bottom: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' },
    }
  })
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const audit = await getAuditWithAccessCheck(id)

    if (!audit) {
      return NextResponse.json({ error: 'Аудит не найден' }, { status: 404 })
    }

    if (audit.status !== 'COMPLETED' || !audit.report) {
      return NextResponse.json({ error: 'Отчёт ещё не готов' }, { status: 400 })
    }

    const report = JSON.parse(audit.report) as AuditReport
    const auditDate = audit.analysisCompletedAt
      ? new Date(audit.analysisCompletedAt).toLocaleDateString('ru-RU', {
          day: '2-digit', month: '2-digit', year: 'numeric',
        })
      : new Date().toLocaleDateString('ru-RU')

    const workbook = new ExcelJS.Workbook()
    workbook.creator = 'АудитТочки'
    workbook.created = new Date()

    // Sheet 1: Summary
    const summarySheet = workbook.addWorksheet('Сводка')
    summarySheet.columns = [
      { header: 'Параметр', key: 'param', width: 30 },
      { header: 'Значение', key: 'value', width: 50 },
    ]
    applyHeaderStyle(summarySheet.getRow(1))

    const summaryRows = [
      { param: 'Дата аудита', value: auditDate },
      { param: 'Вердикт', value: verdictLabels[report.verdict] || report.verdict },
      { param: 'Рейтинг', value: `${report.score}/100` },
      { param: 'Резюме', value: report.summary },
      { param: 'Бюджет (мин)', value: `${report.budget.min} тыс. ₽` },
      { param: 'Бюджет (макс)', value: `${report.budget.max} тыс. ₽` },
    ]
    summaryRows.forEach((row) => {
      const r = summarySheet.addRow(row)
      applyCellBorder(r)
      r.getCell('param').font = { bold: true }
    })
    // Color verdict cell
    const verdictRow = summarySheet.getRow(3)
    const verdictColor = report.verdict === 'GO' ? '22c55e' : report.verdict === 'NO_GO' ? 'ef4444' : 'eab308'
    verdictRow.getCell('value').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: `FF${verdictColor}` } }
    verdictRow.getCell('value').font = { bold: true, color: { argb: 'FFFFFFFF' } }

    // Sheet 2: Input data (from audit.formData)
    if (audit.formData) {
      const inputSheet = workbook.addWorksheet('Входные данные')
      inputSheet.columns = [
        { header: 'Параметр', key: 'param', width: 35 },
        { header: 'Значение', key: 'value', width: 40 },
      ]
      applyHeaderStyle(inputSheet.getRow(1))

      const formData = JSON.parse(audit.formData) as Record<string, unknown>
      Object.entries(formData).forEach(([key, val]) => {
        if (val !== null && val !== undefined && val !== '') {
          const r = inputSheet.addRow({ param: key, value: String(val) })
          applyCellBorder(r)
        }
      })
    }

    // Sheet 3: Analysis blocks
    const blocksSheet = workbook.addWorksheet('Анализ по блокам')
    blocksSheet.columns = [
      { header: 'Блок', key: 'block', width: 25 },
      { header: 'Статус', key: 'status', width: 15 },
      { header: 'Замечание', key: 'description', width: 50 },
      { header: 'Норматив', key: 'regulation', width: 30 },
      { header: 'Серьёзность', key: 'severity', width: 15 },
      { header: 'Рекомендация', key: 'recommendation', width: 50 },
    ]
    applyHeaderStyle(blocksSheet.getRow(1))

    report.blocks.forEach((block) => {
      if (block.findings.length === 0) {
        const r = blocksSheet.addRow({
          block: block.title,
          status: statusLabels[block.status],
          description: 'Замечаний нет',
          regulation: '',
          severity: '',
          recommendation: '',
        })
        applyCellBorder(r)
        r.getCell('status').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: `FF${statusColors[block.status]}` } }
        r.getCell('status').font = { bold: true, color: { argb: 'FFFFFFFF' } }
      } else {
        block.findings.forEach((finding, i) => {
          const r = blocksSheet.addRow({
            block: i === 0 ? block.title : '',
            status: i === 0 ? statusLabels[block.status] : '',
            description: finding.description,
            regulation: finding.regulation,
            severity: finding.severity,
            recommendation: finding.recommendation,
          })
          applyCellBorder(r)
          if (i === 0) {
            r.getCell('status').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: `FF${statusColors[block.status]}` } }
            r.getCell('status').font = { bold: true, color: { argb: 'FFFFFFFF' } }
          }
        })
      }
    })

    // Sheet 4: Budget
    const budgetSheet = workbook.addWorksheet('Бюджет')
    budgetSheet.columns = [
      { header: 'Статья расходов', key: 'item', width: 40 },
      { header: 'Мин (тыс. ₽)', key: 'min', width: 18 },
      { header: 'Макс (тыс. ₽)', key: 'max', width: 18 },
    ]
    applyHeaderStyle(budgetSheet.getRow(1))

    report.budget.breakdown.forEach((item) => {
      const r = budgetSheet.addRow({ item: item.item, min: item.min, max: item.max })
      applyCellBorder(r)
    })
    const totalRow = budgetSheet.addRow({ item: 'ИТОГО', min: report.budget.min, max: report.budget.max })
    totalRow.eachCell((cell) => {
      cell.font = { bold: true, size: 12 }
      cell.border = { top: { style: 'double' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } }
    })

    // Sheet 5: Risks
    const risksSheet = workbook.addWorksheet('Риски')
    risksSheet.columns = [
      { header: '№', key: 'rank', width: 8 },
      { header: 'Описание', key: 'description', width: 60 },
      { header: 'Серьёзность', key: 'severity', width: 15 },
    ]
    applyHeaderStyle(risksSheet.getRow(1))

    report.top_risks.forEach((risk) => {
      const r = risksSheet.addRow({ rank: risk.rank, description: risk.description, severity: risk.severity === 'critical' ? 'Критично' : 'Высокий' })
      applyCellBorder(r)
      if (risk.severity === 'critical') {
        r.getCell('severity').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFef4444' } }
        r.getCell('severity').font = { bold: true, color: { argb: 'FFFFFFFF' } }
      }
    })

    // Sheet 6: Next steps
    const stepsSheet = workbook.addWorksheet('Следующие шаги')
    stepsSheet.columns = [
      { header: '№', key: 'num', width: 8 },
      { header: 'Шаг', key: 'step', width: 70 },
    ]
    applyHeaderStyle(stepsSheet.getRow(1))

    report.next_steps.forEach((step, i) => {
      const r = stepsSheet.addRow({ num: i + 1, step })
      applyCellBorder(r)
    })

    const buffer = await workbook.xlsx.writeBuffer()

    return new NextResponse(new Uint8Array(buffer as ArrayBuffer), {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="audit-${id}.xlsx"`,
        'Content-Length': (buffer as ArrayBuffer).byteLength.toString(),
      },
    })
  } catch (error) {
    console.error('Excel generation error:', error)
    return NextResponse.json({ error: 'Ошибка генерации Excel' }, { status: 500 })
  }
}
