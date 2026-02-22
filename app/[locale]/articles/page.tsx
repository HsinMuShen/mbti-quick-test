import { getTranslations } from 'next-intl/server'
import { Link } from '@/lib/routing'
import articlesData from '@/data/articles.json'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'articles' })
  return {
    title: t('title'),
    description: t('description'),
  }
}

export default async function ArticlesIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations('articles')
  const articles = articlesData.articles as Array<{
    slug: string
    title: Record<string, string>
    description: Record<string, string>
  }>

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-4 text-center text-gray-900">{t('title')}</h1>
      <p className="text-xl text-gray-700 mb-12 text-center">{t('intro')}</p>

      <div className="space-y-8">
        {articles.map((article) => {
          const title = article.title[locale] || article.title.en
          const description = article.description[locale] || article.description.en
          return (
            <Link
              key={article.slug}
              href={`/articles/${article.slug}`}
              className="block bg-white rounded-lg shadow-lg p-8 border-2 border-gray-100 hover:border-blue-200 transition-all duration-200 hover:shadow-xl"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-3">{title}</h2>
              <p className="text-gray-700 leading-relaxed">{description}</p>
              <span className="inline-block mt-4 text-blue-600 font-semibold hover:text-blue-700">
                {t('readMore')} →
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
