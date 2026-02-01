import { getTranslations } from 'next-intl/server'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'privacy' })

  return {
    title: t('title'),
    description: t('description'),
  }
}

export default async function PrivacyPolicyPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  await params
  const t = await getTranslations('privacy')

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-900">{t('title')}</h1>

      <div className="bg-white rounded-lg shadow-lg p-8 mb-6 border-2 border-gray-100">
        <p className="text-sm text-gray-500 mb-6">{t('lastUpdated')}</p>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">{t('dataCollection.title')}</h2>
          <p className="text-gray-700 mb-4 leading-relaxed">{t('dataCollection.content')}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">{t('dataUsage.title')}</h2>
          <p className="text-gray-700 mb-4 leading-relaxed">{t('dataUsage.content')}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">{t('cookies.title')}</h2>
          <p className="text-gray-700 mb-4 leading-relaxed">{t('cookies.content')}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">{t('thirdParty.title')}</h2>
          <p className="text-gray-700 mb-4 leading-relaxed">{t('thirdParty.content')}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">{t('rights.title')}</h2>
          <p className="text-gray-700 mb-4 leading-relaxed">{t('rights.content')}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">{t('contact.title')}</h2>
          <p className="text-gray-700 mb-4 leading-relaxed">{t('contact.content')}</p>
        </section>
      </div>
    </div>
  )
}

