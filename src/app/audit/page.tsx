import { AuditForm } from '@/components/form/AuditForm'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'

export const metadata = {
  title: 'Проверить помещение — АудитТочки',
  description: 'Заполните форму с параметрами помещения для AI-анализа по российским нормативам: электрика, вентиляция, пожарная безопасность, СанПиН.',
  alternates: {
    canonical: '/audit',
  },
}

export default function AuditPage() {
  return (
    <div className="py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Breadcrumbs items={[{ label: 'Проверка помещения' }]} />
      </div>
      <div className="max-w-2xl mx-auto mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2 animate-fade-in-up">Проверка помещения</h1>
        <p className="text-[var(--muted-foreground)] animate-fade-in-up delay-100">
          Заполните параметры помещения — AI проанализирует его по российским нормативам
        </p>
      </div>
      <AuditForm />
    </div>
  )
}
