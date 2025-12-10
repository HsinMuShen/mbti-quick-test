'use client'

import { useEffect, useState } from 'react'

declare global {
  interface Window {
    adsbygoogle: unknown[]
  }
}

interface AdSlotProps {
  slot?: string
  className?: string
  format?: 'auto' | 'fluid'
  minHeight?: number
}

export default function AdSlot({
  slot = '',
  className = '',
  format = 'auto',
  minHeight = 250,
}: AdSlotProps) {
  const [isLocalhost, setIsLocalhost] = useState(false)
  const [scriptLoaded, setScriptLoaded] = useState(false)

  useEffect(() => {
    // Check if running on localhost
    if (typeof window !== 'undefined') {
      setIsLocalhost(
        window.location.hostname === 'localhost' ||
          window.location.hostname === '127.0.0.1' ||
          window.location.hostname === ''
      )

      // Check if AdSense script is loaded
      const checkScript = setInterval(() => {
        if (window.adsbygoogle) {
          setScriptLoaded(true)
          clearInterval(checkScript)
        }
      }, 100)

      // Cleanup
      return () => clearInterval(checkScript)
    }
  }, [])

  useEffect(() => {
    if (scriptLoaded) {
      try {
        ;(window.adsbygoogle = window.adsbygoogle || []).push({})
      } catch (err) {
        console.warn('AdSense error:', err)
      }
    }
  }, [scriptLoaded])

  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || 'ca-pub-XXXXXXXXXXXXXXX'

  return (
    <div
      className={`ad-container border-2 border-dashed border-gray-300 bg-gray-50 ${className}`}
      style={{ minHeight }}
    >
      <div className="text-center text-gray-400 text-xs py-2 space-y-1">
        <div>Ad Slot: {slot || 'default'}</div>
        {isLocalhost && (
          <div className="text-orange-600 font-semibold">
            ⚠️ Localhost: Ads won't display until deployed
          </div>
        )}
        {!scriptLoaded && !isLocalhost && (
          <div className="text-blue-600">Loading AdSense script...</div>
        )}
      </div>
      <ins
        className="adsbygoogle block"
        style={{ display: 'block', minHeight }}
        data-ad-client={clientId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  )
}

