import { getTranslations } from 'next-intl/server'
import { Link } from '@/lib/routing'
import decisionTree from '@/data/decision_tree.json'

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

interface DecisionTree {
  nodes: Record<
    string,
    {
      result?: {
        mbti: string
        title: Record<string, string>
        summary: Record<string, string>
      }
    }
  >
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'personalityTypes' })

  return {
    title: t('title'),
    description: t('description'),
  }
}

export default async function PersonalityTypesPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations('personalityTypes')
  const tree = decisionTree as DecisionTree

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-4 text-center text-gray-900">{t('title')}</h1>
      <p className="text-xl text-gray-700 mb-4 text-center">{t('intro')}</p>
      <p className="text-gray-700 mb-12 text-center max-w-2xl mx-auto">{t('intro2')}</p>

      <div className="grid md:grid-cols-2 gap-6">
        {mbtiTypes.map((type) => {
          const leafKey = `leaf_${type}`
          const leaf = tree.nodes[leafKey]
          if (!leaf?.result) return null

          const title = leaf.result.title[locale] || leaf.result.title.en
          const summary = leaf.result.summary[locale] || leaf.result.summary.en
          const upper = type.toUpperCase()

          return (
            <Link
              key={type}
              href={`/result/${type}`}
              className="block bg-white rounded-lg shadow-lg p-6 border-2 border-gray-100 hover:border-blue-200 transition-all duration-200 hover:shadow-xl"
            >
              <div className="text-2xl font-bold text-blue-600 mb-2">{upper}</div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">{title}</h2>
              <p className="text-gray-700 leading-relaxed">{summary}</p>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
