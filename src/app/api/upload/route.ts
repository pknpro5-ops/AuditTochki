import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { v4 as uuidv4 } from 'uuid'
import { checkRateLimit, RATE_LIMITS } from '@/lib/rate-limit'

const UPLOAD_DIR = join(process.cwd(), 'uploads')
const MAX_SIZE = 10 * 1024 * 1024 // 10 MB
const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png']

// Allowed file extensions (whitelist)
const ALLOWED_EXTENSIONS = ['pdf', 'jpg', 'jpeg', 'png']

// Magic bytes for file type verification
const MAGIC_BYTES: Record<string, number[][]> = {
  'application/pdf': [[0x25, 0x50, 0x44, 0x46]], // %PDF
  'image/jpeg': [[0xFF, 0xD8, 0xFF]],
  'image/png': [[0x89, 0x50, 0x4E, 0x47]], // .PNG
}

function verifyMagicBytes(buffer: Buffer, mimeType: string): boolean {
  const signatures = MAGIC_BYTES[mimeType]
  if (!signatures) return false

  return signatures.some((sig) =>
    sig.every((byte, i) => buffer[i] === byte)
  )
}

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    const rateLimit = checkRateLimit(`upload:${ip}`, RATE_LIMITS.upload)
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Слишком много загрузок. Попробуйте через минуту.' },
        { status: 429 }
      )
    }

    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'Файл не загружен' }, { status: 400 })
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'Файл слишком большой. Максимум 10 МБ' }, { status: 400 })
    }

    // Check MIME type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Допустимые форматы: PDF, JPG, PNG' }, { status: 400 })
    }

    // Validate extension
    const ext = file.name.split('.').pop()?.toLowerCase() || ''
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return NextResponse.json({ error: 'Недопустимое расширение файла' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    // Verify magic bytes match claimed MIME type
    if (!verifyMagicBytes(buffer, file.type)) {
      return NextResponse.json(
        { error: 'Содержимое файла не соответствует указанному формату' },
        { status: 400 }
      )
    }

    // Create uploads directory
    await mkdir(UPLOAD_DIR, { recursive: true })

    // Generate unique filename with validated extension
    const safeExt = ext // already validated against whitelist
    const fileName = `${uuidv4()}.${safeExt}`
    const filePath = join(UPLOAD_DIR, fileName)

    // Write file
    await writeFile(filePath, buffer)

    return NextResponse.json({
      path: filePath,
      name: file.name,
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Ошибка загрузки файла' },
      { status: 500 }
    )
  }
}
