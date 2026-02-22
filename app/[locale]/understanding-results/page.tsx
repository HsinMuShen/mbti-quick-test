import { getTranslations } from 'next-intl/server'
import { Link } from '@/lib/routing'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'understandingResults' })
  return {
    title: t('title'),
    description: t('description'),
  }
}

export default async function UnderstandingResultsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  await params
  const t = await getTranslations('understandingResults')

  const sectionKeys = [
    'interpretation',
    'selfAwareness',
    'relationships',
    'career',
    'nextSteps',
  ] as const

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold mb-4 text-center text-gray-900">{t('title')}</h1>
      <p className="text-xl text-gray-700 mb-12 text-center">{t('intro')}</p>

      <div className="space-y-10">
        {sectionKeys.map((key) => (
          <section
            key={key}
            className="bg-white rounded-lg shadow-lg p-8 border-2 border-gray-100"
          >
            <h2 className="text-2xl font-bold mb-4 text-gray-900">
              {t(`sections.${key}.heading`)}
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              {t(`sections.${key}.p1`)}
            </p>
            <p className="text-gray-700 leading-relaxed">
              {t(`sections.${key}.p2`)}
            </p>
          </section>
        ))}
      </div>

      <div className="mt-12 flex flex-wrap gap-4 justify-center">
        <Link
          href="/articles"
          className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
        >
          {t('readArticles')}
        </Link>
        <Link
          href="/personality-types"
          className="inline-block px-6 py-3 border-2 border-gray-300 hover:border-blue-600 text-gray-700 hover:text-blue-600 font-semibold rounded-lg transition-colors"
        >
          {t('browseTypes')}
        </Link>
      </div>
    </div>
  )
}
