'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from './ui/button'
import { Share2, Copy, Check } from 'lucide-react'

interface ShareButtonsProps {
  mbti: string
  title: string
  summary: string
  locale: string
}

export default function ShareButtons({ mbti, title, summary, locale }: ShareButtonsProps) {
  const t = useTranslations('result')
  const [copied, setCopied] = useState(false)

  const shareText = {
    en: `I just discovered my MBTI type: ${mbti} - ${title}\n\n${summary}\n\nTake the test: `,
    'zh-TW': `我剛剛發現了我的 MBTI 類型：${mbti} - ${title}\n\n${summary}\n\n來做測驗：`,
    es: `Acabo de descubrir mi tipo MBTI: ${mbti} - ${title}\n\n${summary}\n\nHaz el test: `,
  }

  const currentUrl = typeof window !== 'undefined' ? window.location.origin : ''
  const shareUrl = `${currentUrl}/${locale}/result/${mbti.toLowerCase()}`
  const text = (shareText[locale as keyof typeof shareText] || shareText.en) + shareUrl

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${mbti} - ${title}`,
          text: summary,
          url: shareUrl,
        })
      } catch (err) {
        console.error('Error sharing:', err)
      }
    } else {
      handleCopy()
    }
  }

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`

  return (
    <div className="flex flex-wrap gap-3 justify-center">
      <Button onClick={handleShare} variant="default" size="lg" className="min-w-[140px]">
        <Share2 className="w-4 h-4 mr-2" />
        {t('share')}
      </Button>
      <Button onClick={handleCopy} variant="outline" size="lg" className="min-w-[140px]">
        {copied ? (
          <>
            <Check className="w-4 h-4 mr-2" />
            {t('copySuccess')}
          </>
        ) : (
          <>
            <Copy className="w-4 h-4 mr-2" />
            Copy
          </>
        )}
      </Button>
      <Button
        asChild
        variant="outline"
        size="lg"
        className="min-w-[140px]"
        onClick={() => {
          if (typeof window !== 'undefined') {
            window.open(twitterUrl, '_blank', 'width=550,height=420')
          }
        }}
      >
        <a href={twitterUrl} target="_blank" rel="noopener noreferrer" aria-label="Share on Twitter">
          Twitter
        </a>
      </Button>
      <Button
        asChild
        variant="outline"
        size="lg"
        className="min-w-[140px]"
        onClick={() => {
          if (typeof window !== 'undefined') {
            window.open(facebookUrl, '_blank', 'width=550,height=420')
          }
        }}
      >
        <a href={facebookUrl} target="_blank" rel="noopener noreferrer" aria-label="Share on Facebook">
          Facebook
        </a>
      </Button>
    </div>
  )
}

