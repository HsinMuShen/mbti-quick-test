import { getTranslations } from 'next-intl/server'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'about' })

  return {
    title: t('title'),
    description: t('description'),
  }
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  await params
  const t = await getTranslations('about')

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-900">{t('title')}</h1>

      <div className="bg-white rounded-lg shadow-lg p-8 mb-8 border-2 border-gray-100">
        <p className="text-lg text-gray-800 mb-6 leading-relaxed font-medium">{t('description')}</p>
        <p className="text-base text-gray-700 italic border-t pt-4">{t('disclaimer')}</p>
      </div>

      <section className="bg-white rounded-lg shadow-lg p-8 mb-8 border-2 border-gray-100">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">{t('history')}</h2>
        <p className="text-gray-700 leading-relaxed">{t('historyContent')}</p>
      </section>

      <section className="bg-white rounded-lg shadow-lg p-8 mb-8 border-2 border-gray-100">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">{t('fourDimensions')}</h2>
        <p className="text-gray-700 leading-relaxed">{t('dimensionsContent')}</p>
      </section>

      <section className="bg-white rounded-lg shadow-lg p-8 mb-8 border-2 border-gray-100">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">{t('useCases')}</h2>
        <p className="text-gray-700 leading-relaxed">{t('useCasesContent')}</p>
      </section>

      <div className="bg-blue-600 rounded-lg shadow-lg p-8 border-2 border-blue-700">
        <h2 className="text-2xl font-bold mb-4 text-white">{t('privacy')}</h2>
        <p className="text-blue-50">{t('privacyText')}</p>
      </div>
    </div>
  )
}

