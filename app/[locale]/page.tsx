import { getTranslations } from 'next-intl/server'
import { Link } from '@/lib/routing'
import { Button } from '@/components/ui/button'
import { Sparkles, Zap, Share2 } from 'lucide-react'
import AdSlot from '@/components/AdSlot'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'landing' })

  return {
    title: t('title'),
    description: t('subtitle'),
  }
}

export default async function LandingPage({ params }: { params: Promise<{ locale: string }> }) {
  await params
  const t = await getTranslations('landing')

  return (
    <div className="max-w-6xl mx-auto w-full px-4">
      {/* Content first — no ads above the fold */}
      <div className="text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">{t('title')}</h1>
        <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">{t('subtitle')}</p>
        <Link href="/test">
          <Button size="lg" className="text-lg px-8 py-6 h-auto">
            {t('cta')}
          </Button>
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <div className="bg-white rounded-lg shadow-lg p-6 text-center border-2 border-gray-100 hover:border-blue-200 transition-all duration-200 hover:shadow-xl">
          <Zap className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2 text-gray-900">{t('features.fast')}</h3>
          <p className="text-gray-700">{t('features.fastDesc')}</p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6 text-center border-2 border-gray-100 hover:border-purple-200 transition-all duration-200 hover:shadow-xl">
          <Sparkles className="w-12 h-12 text-purple-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2 text-gray-900">{t('features.accurate')}</h3>
          <p className="text-gray-700">{t('features.accurateDesc')}</p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6 text-center border-2 border-gray-100 hover:border-green-200 transition-all duration-200 hover:shadow-xl">
          <Share2 className="w-12 h-12 text-green-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2 text-gray-900">{t('features.shareable')}</h3>
          <p className="text-gray-700">{t('features.shareableDesc')}</p>
        </div>
      </div>

      {/* Substantial publisher content — What is MBTI */}
      <section className="bg-white rounded-lg shadow-lg p-8 mb-8 border-2 border-gray-100">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">{t('whatIsMBTI.title')}</h2>
        <p className="text-gray-700 leading-relaxed mb-4">{t('whatIsMBTI.p1')}</p>
        <p className="text-gray-700 leading-relaxed mb-4">{t('whatIsMBTI.p2')}</p>
        <p className="text-gray-700 leading-relaxed">{t('whatIsMBTI.p3')}</p>
      </section>

      {/* The 16 types intro + link to full list */}
      <section className="bg-white rounded-lg shadow-lg p-8 mb-8 border-2 border-gray-100">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">{t('sixteenTypes.title')}</h2>
        <p className="text-gray-700 leading-relaxed mb-4">{t('sixteenTypes.intro')}</p>
        <Link href="/personality-types">
          <span className="text-blue-600 hover:text-blue-700 font-semibold cursor-pointer">
            {t('sixteenTypes.link')} →
          </span>
        </Link>
      </section>

      {/* Single ad only after substantial content */}
      <div className="my-8">
        <AdSlot slot="landing-footer" className="w-full" format="auto" />
      </div>
    </div>
  )
}

