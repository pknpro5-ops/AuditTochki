'use client'

import Link from 'next/link'
import { ChevronRightIcon, HomeIcon } from './Icons'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center gap-1.5 text-sm text-[var(--muted-foreground)]">
        <li>
          <Link href="/" className="hover:text-[var(--foreground)] transition-colors flex items-center gap-1">
            <HomeIcon size={14} />
            <span className="sr-only sm:not-sr-only">Главная</span>
          </Link>
        </li>
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1.5">
            <ChevronRightIcon size={14} className="opacity-50" />
            {item.href ? (
              <Link href={item.href} className="hover:text-[var(--foreground)] transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="text-[var(--foreground)] font-medium">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
