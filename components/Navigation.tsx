'use client'

import { Link } from '@/lib/routing'
import { useTranslations } from 'next-intl'
import { usePathname } from '@/lib/routing'
import { Button } from './ui/button'

export default function Navigation({ locale }: { locale: string }) {
  const t = useTranslations('nav')
  const pathname = usePathname()

  return (
    <nav className="border-b border-gray-200 bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors cursor-pointer">
            MBTI Quick Test
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors cursor-pointer ${
                pathname === '/' ? 'text-blue-600 font-semibold' : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              {t('home')}
            </Link>
            <Link
              href="/about"
              className={`text-sm font-medium transition-colors cursor-pointer ${
                pathname === '/about' ? 'text-blue-600 font-semibold' : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              {t('about')}
            </Link>
            <Link href="/test">
              <Button size="sm">{t('test')}</Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

