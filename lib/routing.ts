import { defineRouting } from 'next-intl/routing'
import { createNavigation } from 'next-intl/navigation'

export const routing = defineRouting({
  locales: ['en', 'zh-TW', 'es'],
  defaultLocale: 'en',
})

export const { Link, redirect, usePathname, useRouter } = createNavigation(routing)

