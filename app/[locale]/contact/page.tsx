import { getTranslations } from 'next-intl/server'
import { Link } from '@/lib/routing'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'contact' })
  return {
    title: t('title'),
    description: t('description'),
  }
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  await params
  const t = await getTranslations('contact')

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold mb-4 text-center text-gray-900">{t('title')}</h1>
      <p className="text-xl text-gray-700 mb-8 text-center">{t('description')}</p>

      <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-gray-100 space-y-6">
        <p className="text-gray-700 leading-relaxed">{t('intro')}</p>
        <p className="text-gray-700 leading-relaxed">{t('privacyNote')}</p>
        <p className="text-gray-700 leading-relaxed">{t('responseTime')}</p>
        <div className="border-t pt-6 flex flex-wrap gap-4">
          <Link
            href="/privacy-policy"
            className="text-blue-600 hover:text-blue-700 font-semibold"
          >
            {t('privacyLink')} →
          </Link>
          <Link href="/faq" className="text-blue-600 hover:text-blue-700 font-semibold">
            {t('faqLink')} →
          </Link>
          <Link href="/about" className="text-blue-600 hover:text-blue-700 font-semibold">
            {t('aboutLink')} →
          </Link>
        </div>
      </div>
    </div>
  )
}
