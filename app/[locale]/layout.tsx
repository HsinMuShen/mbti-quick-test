import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/lib/routing'
import Navigation from '@/components/Navigation'
import LanguageSwitcher from '@/components/LanguageSwitcher'

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

  return (
    <NextIntlClientProvider messages={messages}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Navigation locale={locale} />
        <main className="container mx-auto px-4 py-8">
          <div className="flex justify-end mb-4">
            <LanguageSwitcher />
          </div>
          {children}
        </main>
        <footer className="border-t mt-16 py-8 text-center text-gray-600 text-sm">
          <p>© 2024 MBTI Quick Test. For entertainment purposes only.</p>
        </footer>
      </div>
    </NextIntlClientProvider>
  )
}

