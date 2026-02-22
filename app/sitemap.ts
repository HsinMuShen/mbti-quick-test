import { MetadataRoute } from 'next'
import articlesData from '@/data/articles.json'

const articles = articlesData.articles as Array<{ slug: string }>
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

const locales = ['en', 'zh-TW', 'es']
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ]

  // Add localized landing pages
  locales.forEach((locale) => {
    routes.push({
      url: `${baseUrl}/${locale}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    })

    routes.push({
      url: `${baseUrl}/${locale}/test`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    })

    routes.push({
      url: `${baseUrl}/${locale}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    })

    routes.push({
      url: `${baseUrl}/${locale}/articles`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    })

    routes.push({
      url: `${baseUrl}/${locale}/understanding-results`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    })

    routes.push({
      url: `${baseUrl}/${locale}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    })

    routes.push({
      url: `${baseUrl}/${locale}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    })

    routes.push({
      url: `${baseUrl}/${locale}/faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    })

    routes.push({
      url: `${baseUrl}/${locale}/personality-types`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    })

    articles.forEach((article) => {
      routes.push({
        url: `${baseUrl}/${locale}/articles/${article.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      })
    })

    // Add all result pages
    mbtiTypes.forEach((mbti) => {
      routes.push({
        url: `${baseUrl}/${locale}/result/${mbti}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.9,
      })
    })
  })

  return routes
}

