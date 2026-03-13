import { readFile } from 'fs/promises'

// Fallback chain: try models in order until one works
// Fallback chain: try models in order until one works
// Correct model names from ListModels API
const GEMINI_MODELS = [
  'gemini-3-flash-preview',
  'gemini-2.5-flash',
  'gemini-2.0-flash-lite',
  'gemini-2.0-flash',
]

const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models'

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string
      }>
    }
  }>
}

async function callGeminiModel(
  model: string,
  systemPrompt: string,
  userPrompt: string,
  apiKey: string,
  imageBase64?: string,
  imageMimeType?: string
): Promise<string> {
  const parts: Array<Record<string, unknown>> = []

  // Add image if provided
  if (imageBase64 && imageMimeType) {
    parts.push({
      inlineData: {
        mimeType: imageMimeType,
        data: imageBase64,
      },
    })
  }

  // Add text prompt
  parts.push({ text: userPrompt })

  const body = {
    system_instruction: {
      parts: [{ text: systemPrompt }],
    },
    contents: [
      {
        role: 'user',
        parts,
      },
    ],
    generationConfig: {
      temperature: 0,
      maxOutputTokens: 8192,
      responseMimeType: 'application/json',
    },
  }

  const url = `${GEMINI_BASE_URL}/${model}:generateContent?key=${apiKey}`

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Gemini API error ${response.status} (${model}): ${errorText.slice(0, 200)}`)
  }

  const data = (await response.json()) as GeminiResponse
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text

  if (!text) {
    throw new Error(`No response from Gemini (${model})`)
  }

  return text
}

async function callGemini(
  systemPrompt: string,
  userPrompt: string,
  imageBase64?: string,
  imageMimeType?: string
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY not configured')
  }

  // Try each model in the fallback chain
  let lastError: Error | null = null

  for (const model of GEMINI_MODELS) {
    try {
      console.log(`Trying Gemini model: ${model}`)
      const result = await callGeminiModel(model, systemPrompt, userPrompt, apiKey, imageBase64, imageMimeType)
      console.log(`Success with model: ${model}`)
      return result
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))
      const is429 = lastError.message.includes('429')
      console.warn(`Model ${model} failed${is429 ? ' (quota exceeded)' : ''}: ${lastError.message.slice(0, 100)}`)

      // If it's a quota error (429), try next model immediately
      // For other errors, also try next model
      continue
    }
  }

  throw lastError || new Error('All Gemini models failed')
}

export async function analyzeWithGemini(
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  return callGemini(systemPrompt, userPrompt)
}

export async function ocrFloorPlan(filePath: string): Promise<Record<string, unknown> | null> {
  try {
    const fileBuffer = await readFile(filePath)
    const base64 = fileBuffer.toString('base64')

    // Determine MIME type from extension
    const ext = filePath.split('.').pop()?.toLowerCase()
    const mimeTypes: Record<string, string> = {
      pdf: 'application/pdf',
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
    }
    const mimeType = mimeTypes[ext || ''] || 'application/octet-stream'

    const ocrPrompt = `Проанализируй этот план помещения (коммерческого, предназначенного для открытия ресторана/кафе). Извлеки следующие структурированные данные:

1. Общая площадь (м²) — если указана или можно оценить
2. Список помещений с примерными размерами
3. Площадь кухонной зоны (м²)
4. Количество выходов и их примерная ширина
5. Расположение окон
6. Расположение сантехнических точек (раковины, туалеты)
7. Видимые вентиляционные шахты или воздуховоды
8. Расположение электрощита (если видно)
9. Любые текстовые подписи или аннотации на плане

Ответь JSON-объектом. Если значение невозможно определить, укажи null.

{
  "total_area_m2": null,
  "rooms": [{"name": "string", "width_m": null, "length_m": null, "area_m2": null}],
  "kitchen_area_m2": null,
  "exits": [{"location": "string", "width_m": null}],
  "windows": ["описание расположения"],
  "plumbing_fixtures": ["описание"],
  "ventilation_shafts": ["описание"],
  "electrical_panel_location": null,
  "annotations": ["текст"]
}`

    const systemPrompt = 'Ты — эксперт по чтению архитектурных планов помещений. Извлекай данные точно и структурированно.'

    const resultText = await callGemini(systemPrompt, ocrPrompt, base64, mimeType)

    return JSON.parse(resultText) as Record<string, unknown>
  } catch (error) {
    console.error('OCR error:', error)
    return null
  }
}
