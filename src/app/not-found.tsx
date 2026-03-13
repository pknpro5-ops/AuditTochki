import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="py-20 px-4">
      <div className="max-w-md mx-auto text-center animate-fade-in-up">
        <div className="text-8xl font-bold text-[var(--primary)] opacity-20 mb-4">404</div>
        <h1 className="text-2xl font-bold mb-3">Страница не найдена</h1>
        <p className="text-[var(--muted-foreground)] mb-8">
          Возможно, страница была удалена или вы перешли по неверной ссылке.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="px-6 py-2.5 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
          >
            На главную
          </Link>
          <Link
            href="/audit"
            className="px-6 py-2.5 border border-[var(--border)] rounded-lg text-sm font-medium hover:bg-[var(--muted)] transition-colors"
          >
            Проверить помещение
          </Link>
        </div>
      </div>
    </div>
  )
}
