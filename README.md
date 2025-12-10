# MBTI Quick Test

A delightful, fast MBTI personality test built with Next.js, TypeScript, and Tailwind CSS. Users can discover their 16-type MBTI personality in just 1-2 minutes.

## Features

- 🌍 **Multi-language Support**: Traditional Chinese (zh-TW), English (en), and Spanish (es)
- ⚡ **Fast & Simple**: Complete the test in 1-2 minutes
- 📱 **Responsive Design**: Works beautifully on mobile, tablet, and desktop
- ♿ **Accessible**: WCAG AA compliant with keyboard navigation
- 🎯 **Decision Tree Based**: Accurate results using decision tree methodology
- 📤 **Shareable Results**: Share your MBTI type with friends and family

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **i18n**: next-intl
- **UI Components**: Radix UI Primitives
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd MBTI_quick_test
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file (optional, for ads):
```env
NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-XXXXXXXXXXXXXXX
NEXT_PUBLIC_POSTHOG_KEY=...
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
/app
  /[locale]              # Localized routes
    /page.tsx            # Landing page
    /test/page.tsx       # Test runner
    /result/[mbti]       # Result pages
    /about/page.tsx      # About page
/components
  DecisionRunner.tsx     # Main test component
  ProgressBar.tsx        # Progress indicator
  ShareButtons.tsx       # Social sharing
  AdSlot.tsx            # AdSense integration
  Navigation.tsx        # Site navigation
  LanguageSwitcher.tsx   # Language selector
/data
  decision_tree.json     # Decision tree data
/messages
  en.json               # English translations
  zh-TW.json           # Traditional Chinese translations
  es.json              # Spanish translations
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking
- `npm run format` - Format code with Prettier

## Deployment

The easiest way to deploy is using [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Import your repository in Vercel
3. Vercel will automatically detect Next.js and deploy

## License

MIT

