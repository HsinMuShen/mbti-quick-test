import { getTranslations } from 'next-intl/server'
import DecisionRunner from '@/components/DecisionRunner'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'test' })

  return {
    title: t('title'),
  }
}

export default async function TestPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params

  return (
    <div>
      <DecisionRunner locale={locale} />
    </div>
  )
}

