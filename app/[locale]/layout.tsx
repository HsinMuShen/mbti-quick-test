import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/lib/routing'
import Navigation from '@/components/Navigation'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { Link } from '@/lib/routing'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!routing.locales.includes(locale as any)) {
    notFound()
  }

  const messages = await getMessages()
  const t = await getTranslations('footer')

  return (
    <NextIntlClientProvider messages={messages}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 w-full overflow-x-hidden">
        <Navigation />
        <main className="container mx-auto px-4 py-8 max-w-full">
          <div className="flex justify-end mb-4">
            <LanguageSwitcher />
          </div>
          {children}
        </main>
        <footer className="border-t mt-16 py-8 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
              <p className="text-gray-600 text-sm">{t('copyright')}</p>
              <div className="flex flex-wrap gap-4 justify-center text-sm">
                <Link href="/about" className="text-gray-600 hover:text-blue-600 transition-colors">
                  {t('about')}
                </Link>
                <Link href="/articles" className="text-gray-600 hover:text-blue-600 transition-colors">
                  {t('articles')}
                </Link>
                <Link href="/understanding-results" className="text-gray-600 hover:text-blue-600 transition-colors">
                  {t('understandingResults')}
                </Link>
                <Link href="/faq" className="text-gray-600 hover:text-blue-600 transition-colors">
                  {t('faq')}
                </Link>
                <Link href="/privacy-policy" className="text-gray-600 hover:text-blue-600 transition-colors">
                  {t('privacy')}
                </Link>
                <Link href="/terms" className="text-gray-600 hover:text-blue-600 transition-colors">
                  {t('terms')}
                </Link>
                <Link href="/contact" className="text-gray-600 hover:text-blue-600 transition-colors">
                  {t('contact')}
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </NextIntlClientProvider>
  )
}

