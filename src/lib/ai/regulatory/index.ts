import { electricalRegulations } from './electrical'
import { ventilationRegulations } from './ventilation'
import { waterSewageRegulations } from './water-sewage'
import { fireSafetyRegulations } from './fire-safety'
import { sanitationRegulations } from './sanitation'
import { planningRegulations } from './planning'

export const allRegulations = {
  electrical: electricalRegulations,
  ventilation: ventilationRegulations,
  water_sewage: waterSewageRegulations,
  fire_safety: fireSafetyRegulations,
  sanitation: sanitationRegulations,
  planning: planningRegulations,
}

export function buildRegulatoryContext(): string {
  const sections = Object.values(allRegulations).map((reg) => {
    const rulesText = reg.rules
      .map((r) => `[${r.id}] ${r.rule}\n${r.details}\nНорматив: ${r.regulation}`)
      .join('\n\n')

    return `### ${reg.title}\nИсточники: ${reg.sources.join('; ')}\n\n${rulesText}`
  })

  return sections.join('\n\n---\n\n')
}
