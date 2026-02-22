import { getTranslations } from 'next-intl/server'
import { Link } from '@/lib/routing'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'terms' })
  return {
    title: t('title'),
    description: t('description'),
  }
}

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  await params
  const t = await getTranslations('terms')

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-900">{t('title')}</h1>

      <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-gray-100 space-y-8">
        <p className="text-sm text-gray-500">{t('lastUpdated')}</p>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-gray-900">{t('purpose.heading')}</h2>
          <p className="text-gray-700 leading-relaxed">{t('purpose.content')}</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-gray-900">{t('disclaimer.heading')}</h2>
          <p className="text-gray-700 leading-relaxed">{t('disclaimer.content')}</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-gray-900">{t('useOfSite.heading')}</h2>
          <p className="text-gray-700 leading-relaxed">{t('useOfSite.content')}</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-gray-900">{t('changes.heading')}</h2>
          <p className="text-gray-700 leading-relaxed">{t('changes.content')}</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-gray-900">{t('contact.heading')}</h2>
          <p className="text-gray-700 leading-relaxed">{t('contact.content')}</p>
          <Link href="/contact" className="text-blue-600 hover:text-blue-700 font-semibold">
            {t('contactLink')} →
          </Link>
        </section>
      </div>
    </div>
  )
}
