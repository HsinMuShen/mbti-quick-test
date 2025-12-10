import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/lib/routing'
import decisionTree from '@/data/decision_tree.json'
import ShareButtons from '@/components/ShareButtons'
import AdSlot from '@/components/AdSlot'
import { Button } from '@/components/ui/button'

const mbtiTypes = [
  'intj',
  'intp',
  'infj',
  'infp',
  'istj',
  'isfj',
  'istp',
  'isfp',
  'entp',
  'enfp',
  'enfj',
  'esfj',
  'estp',
  'esfp',
  'estj',
  'entj',
]

export async function generateStaticParams() {
  return mbtiTypes.map((mbti) => ({
    mbti,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; mbti: string }>
}) {
  const { locale, mbti } = await params
  const upperMbti = mbti.toUpperCase()

  const tree = decisionTree as any
  const leafKey = `leaf_${mbti.toLowerCase()}`
  const leaf = tree.nodes[leafKey]

  if (!leaf || !leaf.result) {
    return {
      title: 'MBTI Result',
    }
  }

  const title = leaf.result.title[locale] || leaf.result.title.en
  const summary = leaf.result.summary[locale] || leaf.result.summary.en

  return {
    title: `${upperMbti} - ${title} | MBTI Quick Test`,
    description: summary,
    openGraph: {
      title: `${upperMbti} - ${title}`,
      description: summary,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${upperMbti} - ${title}`,
      description: summary,
    },
  }
}

export default async function ResultPage({
  params,
}: {
  params: Promise<{ locale: string; mbti: string }>
}) {
  const { locale, mbti } = await params
  const upperMbti = mbti.toUpperCase()

  const tree = decisionTree as any
  const leafKey = `leaf_${mbti.toLowerCase()}`
  const leaf = tree.nodes[leafKey]

  if (!leaf || !leaf.result) {
    notFound()
  }

  const title = leaf.result.title[locale] || leaf.result.title.en
  const summary = leaf.result.summary[locale] || leaf.result.summary.en
  const t = await getTranslations('result')

  return (
    <div className="max-w-7xl mx-auto px-4 w-full">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main content */}
        <div className="flex-1 max-w-4xl">
          <div className="bg-white rounded-lg shadow-xl p-8 md:p-12 mb-8">
            <div className="text-center mb-8">
              <div className="text-6xl font-bold text-blue-600 mb-4">{upperMbti}</div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{title}</h1>
              <p className="text-xl text-gray-700">{summary}</p>
            </div>

            <div className="border-t pt-8">
              <ShareButtons mbti={upperMbti} title={title} summary={summary} locale={locale} />
            </div>
          </div>

          {/* Ad below main result card */}
          <AdSlot slot="result-main" className="my-8" format="fluid" />

          <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border-2 border-gray-100">
            <h2 className="text-2xl font-bold mb-4 text-center text-gray-900">Related Types</h2>
            <p className="text-gray-700 text-center mb-4">
              Explore other MBTI types to learn more about different personalities.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {mbtiTypes.slice(0, 8).map((type) => (
                <Link
                  key={type}
                  href={`/result/${type}`}
                  className="text-center p-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer hover:scale-105 active:scale-95"
                >
                  {type.toUpperCase()}
                </Link>
              ))}
            </div>
          </div>

          {/* Ad below related types */}
          <AdSlot slot="result-related" className="my-8" format="fluid" />

          <div className="text-center mb-8">
            <Link href="/test">
              <Button size="lg" variant="default">
                {t('retake')}
              </Button>
            </Link>
          </div>

          {/* Footer ad */}
          <AdSlot slot="result-footer" className="my-8" format="fluid" />
        </div>

        {/* Desktop sidebar ad (≥ 1024px) */}
        <aside className="hidden lg:block w-80 flex-shrink-0">
          <div className="sticky top-24">
            <AdSlot slot="result-sidebar" className="w-full" format="auto" />
          </div>
        </aside>
      </div>
    </div>
  )
}

