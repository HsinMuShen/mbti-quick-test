import { getTranslations } from 'next-intl/server'
import { Link } from '@/lib/routing'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'faq' })

  return {
    title: t('title'),
    description: t('description'),
  }
}

export default async function FAQPage({ params }: { params: Promise<{ locale: string }> }) {
  await params
  const t = await getTranslations('faq')

  const faqs = [
    {
      q: 'whatIsMBTI',
      a: 'whatIsMBTIAnswer',
    },
    {
      q: 'howAccurate',
      a: 'howAccurateAnswer',
    },
    {
      q: 'howLong',
      a: 'howLongAnswer',
    },
    {
      q: 'freeToUse',
      a: 'freeToUseAnswer',
    },
    {
      q: 'saveResults',
      a: 'saveResultsAnswer',
    },
    {
      q: 'differentResults',
      a: 'differentResultsAnswer',
    },
    {
      q: 'professionalUse',
      a: 'professionalUseAnswer',
    },
  ]

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-900">{t('title')}</h1>
      <p className="text-xl text-gray-700 mb-12 text-center">{t('description')}</p>

      <div className="space-y-6">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-white rounded-lg shadow-lg p-6 border-2 border-gray-100">
            <h2 className="text-xl font-bold mb-3 text-gray-900">{t(`questions.${faq.q}`)}</h2>
            <p className="text-gray-700 leading-relaxed">{t(`answers.${faq.a}`)}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-blue-50 rounded-lg p-6 text-center">
        <p className="text-gray-700 mb-4">{t('stillHaveQuestions')}</p>
        <Link href="/about">
          <span className="text-blue-600 hover:text-blue-700 font-semibold cursor-pointer">
            {t('contactUs')}
          </span>
        </Link>
      </div>
    </div>
  )
}

