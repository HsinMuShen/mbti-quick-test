import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/lib/routing'
import articlesData from '@/data/articles.json'

const articles = articlesData.articles as Array<{
  slug: string
  title: Record<string, string>
  description: Record<string, string>
  paragraphs: Record<string, string[]>
}>

export async function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const article = articles.find((a) => a.slug === slug)
  if (!article) return { title: 'Article | MBTI Quick Test' }
  const title = article.title[locale] || article.title.en
  const description = article.description[locale] || article.description.en
  return {
    title: `${title} | MBTI Quick Test`,
    description,
  }
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const t = await getTranslations('articles')
  const article = articles.find((a) => a.slug === slug)
  if (!article) notFound()

  const title = article.title[locale] || article.title.en
  const description = article.description[locale] || article.description.en
  const paragraphs = article.paragraphs[locale] || article.paragraphs.en

  return (
    <article className="max-w-3xl mx-auto">
      <Link
        href="/articles"
        className="inline-block text-blue-600 hover:text-blue-700 font-medium mb-8"
      >
        ← {t('backToArticles')}
      </Link>
      <header className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{title}</h1>
        <p className="text-xl text-gray-700">{description}</p>
      </header>
      <div className="bg-white rounded-lg shadow-lg p-8 md:p-10 border-2 border-gray-100">
        {paragraphs.map((paragraph, i) => (
          <p key={i} className="text-gray-700 leading-relaxed mb-6 last:mb-0">
            {paragraph}
          </p>
        ))}
      </div>
      <div className="mt-10 text-center">
        <Link
          href="/articles"
          className="text-blue-600 hover:text-blue-700 font-semibold"
        >
          {t('backToArticles')}
        </Link>
      </div>
    </article>
  )
}
