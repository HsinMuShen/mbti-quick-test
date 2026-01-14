'use client'

import { useTranslations } from 'next-intl'

import { Button } from './ui/button'

import { Link, usePathname } from '@/lib/routing'

export default function Navigation() {
  const t = useTranslations('nav')
  const pathname = usePathname()

  return (
    <nav className="border-b border-gray-200 bg-white shadow-sm sticky top-0 z-50 w-full">
      <div className="container mx-auto px-4 max-w-full">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="text-lg sm:text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors cursor-pointer truncate"
          >
            MBTI Quick Test
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              href="/"
              className={`text-xs sm:text-sm font-medium transition-colors cursor-pointer hidden sm:block ${
                pathname === '/' ? 'text-blue-600 font-semibold' : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              {t('home')}
            </Link>
            <Link
              href="/about"
              className={`text-xs sm:text-sm font-medium transition-colors cursor-pointer hidden sm:block ${
                pathname === '/about' ? 'text-blue-600 font-semibold' : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              {t('about')}
            </Link>
            <Link
              href="/faq"
              className={`text-xs sm:text-sm font-medium transition-colors cursor-pointer hidden sm:block ${
                pathname === '/faq' ? 'text-blue-600 font-semibold' : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              FAQ
            </Link>
            <Link href="/test">
              <Button size="sm" className="text-xs sm:text-sm">
                {t('test')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

