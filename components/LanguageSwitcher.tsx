'use client'

import { useParams } from 'next/navigation'

import { buttonVariants } from './ui/button'

import { Link, usePathname } from '@/lib/routing'
import { cn } from '@/lib/utils'

const locales = [
  { code: 'en', label: 'English' },
  { code: 'zh-TW', label: '繁體中文' },
  { code: 'es', label: 'Español' },
]

export default function LanguageSwitcher() {
  const pathname = usePathname() // Returns pathname without locale (e.g., '/' or '/test')
  const params = useParams()

  // Get current locale from params
  const currentLocale = (params?.locale as string) || 'en'

  return (
    <div className="flex gap-2">
      {locales.map((locale) => (
        <Link
          key={locale.code}
          href={pathname}
          locale={locale.code}
          className={cn(
            buttonVariants({
              variant: currentLocale === locale.code ? 'default' : 'outline',
              size: 'sm',
            })
          )}
          aria-label={`Switch to ${locale.label}`}
        >
          {locale.label}
        </Link>
      ))}
    </div>
  )
}

