import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--muted)]">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="font-bold text-lg mb-2">
              <span className="text-[var(--primary)]">Аудит</span>Точки
            </div>
            <p className="text-sm text-[var(--muted-foreground)] mb-4">
              AI-сервис предварительной оценки помещения для открытия общепита по российским нормативам.
            </p>
            {/* Social links */}
            <div className="flex items-center gap-3">
              <a href="https://t.me/hotplanru" target="_blank" rel="noopener noreferrer" className="w-8 h-8 flex items-center justify-center rounded-lg bg-[var(--background)] border border-[var(--border)] hover:border-[var(--primary)]/50 hover:text-[var(--primary)] transition-all" aria-label="Telegram">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
              </a>
              <a href="mailto:info@hot-plan.ru" className="w-8 h-8 flex items-center justify-center rounded-lg bg-[var(--background)] border border-[var(--border)] hover:border-[var(--primary)]/50 hover:text-[var(--primary)] transition-all" aria-label="Email">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-3">Сервис</h3>
            <ul className="space-y-2 text-sm text-[var(--muted-foreground)]">
              <li><Link href="/audit" className="hover:text-[var(--foreground)] transition-colors">Проверить помещение</Link></li>
              <li><Link href="/pricing" className="hover:text-[var(--foreground)] transition-colors">Тарифы</Link></li>
              <li><Link href="/pricing" className="hover:text-[var(--foreground)] transition-colors">Сравнить тарифы</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-3">Информация</h3>
            <ul className="space-y-2 text-sm text-[var(--muted-foreground)]">
              <li><Link href="/legal" className="hover:text-[var(--foreground)] transition-colors">Политика конфиденциальности</Link></li>
              <li><Link href="/legal" className="hover:text-[var(--foreground)] transition-colors">Публичная оферта</Link></li>
              <li>
                <a href="https://hot-plan.ru" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--foreground)] transition-colors">
                  hot-plan.ru
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-3">Контакты</h3>
            <ul className="space-y-2 text-sm text-[var(--muted-foreground)]">
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                <a href="mailto:info@hot-plan.ru" className="hover:text-[var(--foreground)] transition-colors">info@hot-plan.ru</a>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
                <a href="https://t.me/hotplanru" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--foreground)] transition-colors">@hotplanru</a>
              </li>
              <li className="text-xs mt-2 pt-2 border-t border-[var(--border)]">
                ИП Иванов И.И.<br />
                ИНН: 000000000000<br />
                ОГРНИП: 000000000000000
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-[var(--border)] text-center text-xs text-[var(--muted-foreground)]">
          <p>Сервис предоставляет предварительную оценку и не является экспертным заключением.</p>
          <p className="mt-1">&copy; {new Date().getFullYear()} АудитТочки. Проект hot-plan.ru</p>
        </div>
      </div>
    </footer>
  )
}
