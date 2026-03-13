import { ImageResponse } from 'next/og'

export const alt = 'АудитТочки — AI-проверка помещения для общепита'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #0a0a0a 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 60,
        }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 40 }}>
          <div
            style={{
              background: '#2563eb',
              color: 'white',
              fontSize: 36,
              fontWeight: 700,
              padding: '8px 16px',
              borderRadius: 12,
            }}
          >
            AT
          </div>
          <span style={{ color: '#3b82f6', fontSize: 42, fontWeight: 700 }}>Аудит</span>
          <span style={{ color: '#ededed', fontSize: 42, fontWeight: 700 }}>Точки</span>
        </div>

        {/* Title */}
        <div
          style={{
            color: '#ffffff',
            fontSize: 52,
            fontWeight: 700,
            textAlign: 'center',
            lineHeight: 1.3,
            marginBottom: 24,
          }}
        >
          AI-проверка помещения
        </div>
        <div
          style={{
            color: '#3b82f6',
            fontSize: 52,
            fontWeight: 700,
            textAlign: 'center',
            lineHeight: 1.3,
            marginBottom: 40,
          }}
        >
          для общепита
        </div>

        {/* Blocks */}
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
          {['Электрика', 'Вентиляция', 'Вода', 'Пожарка', 'Санитария', 'Планировка'].map((block) => (
            <div
              key={block}
              style={{
                background: 'rgba(59, 130, 246, 0.15)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                padding: '8px 20px',
                borderRadius: 20,
                color: '#93c5fd',
                fontSize: 20,
              }}
            >
              {block}
            </div>
          ))}
        </div>

        {/* Subtitle */}
        <div
          style={{
            color: '#9ca3af',
            fontSize: 24,
            marginTop: 40,
          }}
        >
          Вердикт GO / NO-GO за 2 минуты по российским нормативам
        </div>
      </div>
    ),
    { ...size }
  )
}
