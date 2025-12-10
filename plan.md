# MBTI 16-Type Quick Test — Engineering Spec (for AI developer)

This doc gives everything you need to implement and ship the full website without further clarification. It includes product scope, IA, UX guidelines, tech stack, lint/format rules, SEO requirements, ads placement, i18n, analytics, deployment notes, and the complete decision_tree.json (with Traditional Chinese, English, and Spanish text).

## 0) Product Summary

**Goal:** A delightful, fast MBTI quick test driven by a yes/no style decision tree that ends in one of the 16 MBTI types. Users finish in ~1–2 minutes and share the result.

### KPIs

- Test completion rate ≥ 80%
- Result page share rate ≥ 10%
- Lighthouse (Mobile): SEO ≥ 95, Performance ≥ 90, Accessibility ≥ 95
- LCP < 2.5s on 4G mid-range devices
- Locales: zh-TW (Traditional Chinese), en (English), es (Spanish)

## 1) Information Architecture & Routes (Next.js App Router)

| Route | Purpose | Notes |
|-------|---------|-------|
| `/` | Landing | Product value, CTA "Start Test". Optional non-intrusive banner ad. |
| `/test` | Test runner | One question per step, back button, progress bar, keyboard accessible. No ads here (protect completion rate). |
| `/result/[mbti]` | Result view | Type, title, summary, share actions, related types. Primary ad slots live here. |
| `/about` | About/FAQ | MBTI explanation, privacy & disclaimer. |
| `/sitemap.xml`, `/robots.txt` | SEO | Generated at build/runtime. |

**Optional:** `/privacy`, `/terms` if running ads.

## 2) UX / UI Requirements

- **Tone:** Pretty, lively, friendly; high contrast (WCAG AA).
- **UI kit:** shadcn/ui + Radix Primitives (accessible).
- **Typography:** System fonts + Noto Sans TC fallback; proper language fonts per locale.

### Interaction

- Big, tappable buttons; Enter/Arrow keys work.
- Progress bar, Back action, Restart.
- Skeletons during hydrating and route transitions.

### Accessibility

- Landmark elements (`main`, `nav`), focus visible, aria-live for state changes.

### Responsive

- Mobile-first; 1-column on phones, 2-column content on desktop result page.

## 3) Tech Stack

- **Framework:** Next.js (App Router) + TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **State/Data:** React Server Components where possible; client components only for interactivity. Zod for input validation if adding APIs.
- **Content:** Decision tree from `/data/decision_tree.json` (included below), fully localized.
- **i18n:** next-intl (or next-i18next) with locale routing (`/en`, `/es`, `/zh-TW`) and language switcher.
- **Analytics:** PostHog (or Amplitude) minimal funnel events.
- **Deployment:** Vercel (Edge/static friendly).
- **DB:** Not required for MVP. If you later need result statistics or history, add Supabase (Postgres) + Prisma.

### Suggested project layout

```
/app
  /[locale]
    /page.tsx                 # Landing
    /test/page.tsx            # Runner
    /result/[mbti]/page.tsx   # Result
    /about/page.tsx
  /api/track/route.ts         # optional anonymized event proxy
/components
  AdSlot.tsx
  DecisionRunner.tsx
  ProgressBar.tsx
  ShareButtons.tsx
/data/decision_tree.json
/lib/seo.ts
/lib/i18n.ts
/public/og/                   # OG images per MBTI
eslint.config.mjs
prettier.config.cjs
```

## 4) TypeScript, ESLint, Prettier

### Install

```bash
npm install -D typescript @types/node eslint @eslint/js typescript-eslint \
eslint-plugin-react-hooks eslint-plugin-import eslint-plugin-jsx-a11y \
eslint-plugin-tailwindcss prettier eslint-config-prettier prettier-plugin-tailwindcss
```

### eslint.config.mjs (Flat Config)

```javascript
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import importPlugin from "eslint-plugin-import";
import a11y from "eslint-plugin-jsx-a11y";
import tailwind from "eslint-plugin-tailwindcss";

export default [
  { ignores: [".next/**", "dist/**"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      "react-hooks": reactHooks,
      import: importPlugin,
      "jsx-a11y": a11y,
      tailwindcss: tailwind,
    },
    rules: {
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "@typescript-eslint/no-explicit-any": "warn",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "import/order": ["warn", { "newlines-between": "always", alphabetize: { order: "asc" } }],
      "jsx-a11y/anchor-is-valid": "warn",
      "tailwindcss/no-custom-classname": "off"
    }
  }
];
```

### prettier.config.cjs

```javascript
module.exports = {
  semi: false,
  singleQuote: true,
  trailingComma: 'es5',
  printWidth: 100,
  tabWidth: 2,
  plugins: [require('prettier-plugin-tailwindcss')],
}
```

### Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "format": "prettier --write ."
  }
}
```

## 5) SEO Implementation (high score)

- **Metadata:** via `next/metadata` per page. Each result page has a unique title/description and OG/Twitter card.
- **Sitemap/Robots:** generate and include all 16 result routes in the sitemap.
- **Structured data (JSON-LD):**
  - Landing: WebSite (+ optional SearchAction if you add search).
  - Result: Article (or FAQPage if adding FAQs).

### Performance

- Static render all pages (`generateStaticParams` for 16 results).
- Minimize client JS; use RSC where possible.
- `next/image` with fixed aspect placeholders; serve WebP/AVIF; preconnect fonts.
- **i18n SEO:** `alternates.languages` for hreflang per localized page.
- **Clean HTML:** One `<h1>` per page, semantic landmarks, accurate alt.

## 6) Ads Strategy & How-To

**Best placement:** Result page (highest attention, least disruption).

### Recommended slots

- Below the main result card (in-article/native style).
- Below "Further reading / related types" (near footer).
- Desktop only right sidebar sticky (≥ 1024px). On mobile, degrade to an in-content slot.

**Avoid ads on `/test`** to preserve completion rate.

### AdSense quick integration

In `app/[locale]/layout.tsx` add AdSense script in `<head>`:

```html
<script
  async
  src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXX"
  crossOrigin="anonymous"
/>
```

### Reusable slot

```tsx
'use client'
import { useEffect } from 'react'
declare global { interface Window { adsbygoogle: unknown[] } }

export default function AdSlot({ slot, className = '', format = 'auto' }:{
  slot: string; className?: string; format?: 'auto' | 'fluid';
}) {
  useEffect(() => {
    try { (window.adsbygoogle = window.adsbygoogle || []).push({}) } catch {}
  }, [])
  return (
    <ins
      className={`adsbygoogle block ${className}`}
      style={{ display: 'block', minHeight: 250 }}
      data-ad-client="ca-pub-XXXXXXXXXXXXXXX"
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive="true"
    />
  )
}
```

Use it on result page:

```tsx
<AdSlot slot="XXXXXXXXXX" className="my-8" format="fluid" />
```

**CLS guard:** keep a min-height on the container. Provide `/privacy` and CMP if you serve EU traffic.

## 7) Analytics (minimal)

**Events (PostHog/Amplitude):**

- `test_start` (page: `/test`)
- `test_answer` { nodeId, optionLabel }
- `test_back`
- `test_complete` { mbti, steps }
- `share_clicked` { platform }

**Optional server proxy:** `/api/track` (to keep tokens private).

## 8) Result Page Enhancements

- Related types (similar/opposite) mapping.
- "Copy to clipboard" share text per locale, dynamic OG image per MBTI.
- CTA to retake or share.

## 9) DB Consideration

**MVP:** no DB.

**If needed later (stats/history):** Supabase (Postgres) + Prisma model `results(id, mbti, path, created_at, locale)` and a write-only API route.

## 10) Complete decision_tree.json (multilingual)

Format supports Traditional Chinese (zh-TW), English (en), Spanish (es) for all questions, options, titles, and summaries.

```json
{
  "start": "q0",
  "nodes": {
    "q0": {
      "question": {
        "zh-TW": "你覺得自己有一點與眾不同（個性獨特）嗎？",
        "en": "Do you feel you’re somewhat unusual or uniquely different?",
        "es": "¿Sientes que eres algo inusual o único en tu forma de ser?"
      },
      "options": [
        { "label": { "zh-TW": "有些", "en": "Somewhat", "es": "Un poco" }, "next": "q1" },
        { "label": { "zh-TW": "不覺得", "en": "Not really", "es": "No mucho" }, "next": "q8" }
      ]
    },

    /* ───────────────────────────────── Left branch: “Somewhat unusual” ───────────────────────────────── */

    "q1": {
      "question": {
        "zh-TW": "你有社交焦慮或在社交場合容易緊張嗎？",
        "en": "Do you have social anxiety or often feel tense in social situations?",
        "es": "¿Tienes ansiedad social o sueles ponerte tenso en situaciones sociales?"
      },
      "options": [
        { "label": { "zh-TW": "有", "en": "Yes", "es": "Sí" }, "next": "q2" },
        { "label": { "zh-TW": "沒有", "en": "No", "es": "No" }, "next": "q5" }
      ]
    },

    "q2": {
      "question": {
        "zh-TW": "你做決策時更偏向理性分析，還是情感感受？",
        "en": "When deciding, do you lean more on rational analysis or feelings?",
        "es": "Al decidir, ¿te apoyas más en el análisis racional o en los sentimientos?"
      },
      "options": [
        { "label": { "zh-TW": "理性", "en": "Rational", "es": "Racional" }, "next": "q3" },
        { "label": { "zh-TW": "感性", "en": "Emotional", "es": "Emocional" }, "next": "q4" }
      ]
    },

    "q3": {
      "question": {
        "zh-TW": "你是否重視長期規劃，並在目標上相當堅定果斷？",
        "en": "Do you value long-term planning and stay firm and decisive on goals?",
        "es": "¿Valoras la planificación a largo plazo y te mantienes firme y decidido en tus metas?"
      },
      "options": [
        { "label": { "zh-TW": "是，我很堅定", "en": "Yes, very much", "es": "Sí, mucho" }, "next": "leaf_intj" },
        { "label": { "zh-TW": "不一定／常反覆思考", "en": "Not always / I re-evaluate a lot", "es": "No siempre / Reevalúo mucho" }, "next": "leaf_intp" }
      ]
    },

    "q4": {
      "question": {
        "zh-TW": "在面對人與價值時，你是否容易被情感觸動（例如同理心強、容易落淚）？",
        "en": "When facing people and values, are you easily moved (e.g., strong empathy, tearful)?",
        "es": "Ante las personas y los valores, ¿te conmueves con facilidad (p. ej., gran empatía, lágrimas fáciles)?"
      },
      "options": [
        { "label": { "zh-TW": "是，較容易", "en": "Yes, easily", "es": "Sí, con facilidad" }, "next": "leaf_infj" },
        { "label": { "zh-TW": "較不會", "en": "Not really", "es": "No mucho" }, "next": "leaf_infp" }
      ]
    },

    "q5": {
      "question": {
        "zh-TW": "你平常會被多線任務或瑣事困擾、容易分心嗎？",
        "en": "Do multitasking or minor chores often distract or bother you?",
        "es": "¿Las multitareas o asuntos menores suelen distraerte o molestarte?"
      },
      "options": [
        { "label": { "zh-TW": "會，常被牽走注意力", "en": "Yes, I get sidetracked", "es": "Sí, me desvío a menudo" }, "next": "q6" },
        { "label": { "zh-TW": "不太會", "en": "Not really", "es": "No mucho" }, "next": "q7" }
      ]
    },

    "q6": {
      "question": {
        "zh-TW": "和他人相處時，你傾向追求即時的樂趣與現場氣氛嗎？",
        "en": "With others, do you lean toward in-the-moment fun and live atmosphere?",
        "es": "Con otros, ¿te inclinas por la diversión del momento y el ambiente en vivo?"
      },
      "options": [
        { "label": { "zh-TW": "是，偏向當下的好玩", "en": "Yes, I’m in for the moment", "es": "Sí, disfruto el momento" }, "next": "leaf_esfp" },
        { "label": { "zh-TW": "比較務實行動派", "en": "I’m more action-pragmatic", "es": "Soy más práctico y de acción" }, "next": "leaf_estp" }
      ]
    },

    "q7": {
      "question": {
        "zh-TW": "在討論中，你喜歡辯證、挑戰觀點並享受思辨嗎？",
        "en": "In discussions, do you enjoy debating, challenging views, and playful argument?",
        "es": "En debates, ¿disfrutas cuestionar ideas y el intercambio intelectual?"
      },
      "options": [
        { "label": { "zh-TW": "是，喜歡推敲觀點", "en": "Yes, I love probing ideas", "es": "Sí, me gusta examinar ideas" }, "next": "leaf_entp" },
        { "label": { "zh-TW": "更重視連結與鼓勵", "en": "I value connection/encouragement more", "es": "Valoro más la conexión y el ánimo" }, "next": "leaf_enfp" }
      ]
    },

    /* ───────────────────────────────── Right branch: “Not unusual” ───────────────────────────────── */

    "q8": {
      "question": {
        "zh-TW": "你傾向遵守社會規範與既有流程嗎？",
        "en": "Do you tend to adhere to social rules and established processes?",
        "es": "¿Tiendes a seguir las normas sociales y los procesos establecidos?"
      },
      "options": [
        { "label": { "zh-TW": "是，這很重要", "en": "Yes, it’s important", "es": "Sí, es importante" }, "next": "q9" },
        { "label": { "zh-TW": "不一定，情況而定", "en": "Not necessarily / depends", "es": "No necesariamente / depende" }, "next": "q12" }
      ]
    },

    "q9": {
      "question": {
        "zh-TW": "你是否常主動照顧他人需求、維持團隊和諧？",
        "en": "Do you often care for others’ needs and keep team harmony?",
        "es": "¿Sueles cuidar las necesidades de otros y mantener la armonía del equipo?"
      },
      "options": [
        { "label": { "zh-TW": "是，我會主動協助", "en": "Yes, I actively help", "es": "Sí, ayudo activamente" }, "next": "leaf_isfj" },
        { "label": { "zh-TW": "我更重視制度執行", "en": "I prioritize structure/rules", "es": "Priorizo la estructura y reglas" }, "next": "leaf_istj" }
      ]
    },

    "q12": {
      "question": {
        "zh-TW": "面對規則，若為了更好的結果，有時打破規則也可以接受嗎？",
        "en": "When aiming for better outcomes, is breaking rules sometimes acceptable?",
        "es": "Para lograr mejores resultados, ¿aceptas a veces romper reglas?"
      },
      "options": [
        { "label": { "zh-TW": "可以，彈性看待", "en": "Yes, flexible", "es": "Sí, con flexibilidad" }, "next": "q13" },
        { "label": { "zh-TW": "不可以，仍須遵守", "en": "No, still follow them", "es": "No, hay que seguirlas" }, "next": "q14" }
      ]
    },

    "q13": {
      "question": {
        "zh-TW": "和人相處時，你更傾向感受導向，還是思辨創新導向？",
        "en": "Interpersonally, do you lean more feeling-oriented or exploratory/innovative?",
        "es": "En lo interpersonal, ¿te inclinas más por lo emocional o por lo exploratorio/innovador?"
      },
      "options": [
        { "label": { "zh-TW": "感受導向", "en": "Feeling-oriented", "es": "Orientado a sentimientos" }, "next": "leaf_enfp" },
        { "label": { "zh-TW": "思辨／創新導向", "en": "Debating/innovating", "es": "Debatir/innovar" }, "next": "leaf_entp" }
      ]
    },

    "q14": {
      "question": {
        "zh-TW": "你偏好團隊合作、在群體中分工協作嗎？",
        "en": "Do you prefer group collaboration and coordinated teamwork?",
        "es": "¿Prefieres la colaboración en grupo y el trabajo coordinado?"
      },
      "options": [
        { "label": { "zh-TW": "是，偏好團隊", "en": "Yes, I do", "es": "Sí" }, "next": "q15" },
        { "label": { "zh-TW": "否，較喜單點主導", "en": "No, prefer individual/lead focus", "es": "No, prefiero foco individual/liderazgo" }, "next": "q16" }
      ]
    },

    "q15": {
      "question": {
        "zh-TW": "在團隊中，你更喜歡對外表達與帶動氣氛，還是照顧流程與人際？",
        "en": "In teams, do you prefer public leading/energizing or caretaking/process?",
        "es": "En equipos, ¿prefieres liderar/energizar en público o cuidar procesos y relaciones?"
      },
      "options": [
        { "label": { "zh-TW": "帶動氣氛與呈現", "en": "Lead/energize publicly", "es": "Liderar/energizar públicamente" }, "next": "leaf_enfj" },
        { "label": { "zh-TW": "照顧流程與人際", "en": "Care for people/process", "es": "Cuidar personas/procesos" }, "next": "leaf_esfj" }
      ]
    },

    "q16": {
      "question": {
        "zh-TW": "在原則與效率上，你更重視規範落地，還是策略規劃與目標推進？",
        "en": "Do you focus more on enforcing standards/efficiency or strategic planning/goals?",
        "es": "¿Te enfocas más en hacer cumplir normas/eficiencia o en la planificación estratégica/metas?"
      },
      "options": [
        { "label": { "zh-TW": "規範與效率", "en": "Standards & efficiency", "es": "Normas y eficiencia" }, "next": "leaf_estj" },
        { "label": { "zh-TW": "策略與推進", "en": "Strategy & drive", "es": "Estrategia e impulso" }, "next": "leaf_entj" }
      ]
    },

    /* ───────────────────────────────── Additional balancing to mirror image density ─────────────────────────────────
       (These interstitials formalize a few nuanced forks seen in the chart while preserving final outcomes.)
    */

    "q17": {
      "question": {
        "zh-TW": "你做事時會先規劃結構再行動嗎？",
        "en": "Do you prefer planning a structure before acting?",
        "es": "¿Prefieres planificar una estructura antes de actuar?"
      },
      "options": [
        { "label": { "zh-TW": "會", "en": "Yes", "es": "Sí" }, "next": "leaf_istj" },
        { "label": { "zh-TW": "看情況／實作中摸索", "en": "Depends / learn by doing", "es": "Depende / aprendo haciendo" }, "next": "leaf_istp" }
      ]
    },

    "q18": {
      "question": {
        "zh-TW": "對於價值觀與關係，你更重視真誠交流還是實際成果？",
        "en": "In values/relationships, do you value authentic connection or tangible outcomes more?",
        "es": "En valores/relaciones, ¿valoras más la conexión auténtica o los resultados tangibles?"
      },
      "options": [
        { "label": { "zh-TW": "真誠交流", "en": "Authentic connection", "es": "Conexión auténtica" }, "next": "leaf_infp" },
        { "label": { "zh-TW": "實際成果", "en": "Tangible outcomes", "es": "Resultados tangibles" }, "next": "leaf_entj" }
      ]
    },

    "q19": {
      "question": {
        "zh-TW": "臨場時，你偏好快速行動還是再三求證？",
        "en": "On the spot, do you prefer quick action or thorough verification?",
        "es": "En el momento, ¿prefieres actuar rápido o verificar a fondo?"
      },
      "options": [
        { "label": { "zh-TW": "快速行動", "en": "Quick action", "es": "Acción rápida" }, "next": "leaf_estp" },
        { "label": { "zh-TW": "再三求證", "en": "Thorough verification", "es": "Verificación exhaustiva" }, "next": "leaf_intp" }
      ]
    },

    /* ─────────────────────────────────────────────── Leaves ─────────────────────────────────────────────── */

    "leaf_intj": {
      "result": {
        "mbti": "INTJ",
        "title": { "zh-TW": "建築師型人格", "en": "Architect", "es": "Arquitecto" },
        "summary": {
          "zh-TW": "深思熟慮、策略長遠，重視邏輯與目標實現。",
          "en": "Strategic, long-range thinkers who value logic and goal attainment.",
          "es": "Pensadores estratégicos a largo plazo que valoran la lógica y el logro de metas."
        }
      }
    },
    "leaf_intp": {
      "result": {
        "mbti": "INTP",
        "title": { "zh-TW": "邏輯學家型人格", "en": "Logician", "es": "Lógico" },
        "summary": {
          "zh-TW": "好奇探索概念，擅長分析與解構複雜問題。",
          "en": "Curious concept explorers who analyze and deconstruct complex problems.",
          "es": "Exploradores curiosos de conceptos que analizan y descomponen problemas complejos."
        }
      }
    },
    "leaf_infj": {
      "result": {
        "mbti": "INFJ",
        "title": { "zh-TW": "提倡者型人格", "en": "Advocate", "es": "Defensor" },
        "summary": {
          "zh-TW": "理想主義且具同理心，追求意義與價值。",
          "en": "Idealistic and empathetic, pursuing meaning and values.",
          "es": "Idealistas y empáticos, en busca de significado y valores."
        }
      }
    },
    "leaf_infp": {
      "result": {
        "mbti": "INFP",
        "title": { "zh-TW": "調停者型人格", "en": "Mediator", "es": "Mediador" },
        "summary": {
          "zh-TW": "溫柔富想像力，忠於內在信念與真誠連結。",
          "en": "Gentle and imaginative, loyal to inner values and authentic connections.",
          "es": "Amables e imaginativos, fieles a sus valores internos y conexiones auténticas."
        }
      }
    },
    "leaf_istj": {
      "result": {
        "mbti": "ISTJ",
        "title": { "zh-TW": "物流師型人格", "en": "Logistician", "es": "Logista" },
        "summary": {
          "zh-TW": "有條理且負責，重視制度與精確執行。",
          "en": "Orderly and responsible; value structure and precise execution.",
          "es": "Ordenados y responsables; valoran la estructura y la ejecución precisa."
        }
      }
    },
    "leaf_isfj": {
      "result": {
        "mbti": "ISFJ",
        "title": { "zh-TW": "守護者型人格", "en": "Defender", "es": "Defensor" },
        "summary": {
          "zh-TW": "體貼可靠，重視責任與傳統，維護和諧。",
          "en": "Reliable and considerate; value duty and tradition, maintain harmony.",
          "es": "Confiables y considerados; valoran el deber y la tradición, mantienen la armonía."
        }
      }
    },
    "leaf_istp": {
      "result": {
        "mbti": "ISTP",
        "title": { "zh-TW": "工匠型人格", "en": "Virtuoso", "es": "Virtuoso" },
        "summary": {
          "zh-TW": "務實動手、臨機應變，喜歡以實作解題。",
          "en": "Hands-on pragmatists who improvise and solve by making.",
          "es": "Pragmáticos y manuales, improvisan y resuelven mediante la práctica."
        }
      }
    },
    "leaf_isfp": {
      "result": {
        "mbti": "ISFP",
        "title": { "zh-TW": "探險家型人格", "en": "Adventurer", "es": "Aventurero" },
        "summary": {
          "zh-TW": "審美敏銳，重視感受與自由，以行動表達自我。",
          "en": "Aesthetically sensitive; value feelings and freedom; express through action.",
          "es": "Sensibles a la estética; valoran los sentimientos y la libertad; se expresan con acciones."
        }
      }
    },
    "leaf_entp": {
      "result": {
        "mbti": "ENTP",
        "title": { "zh-TW": "辯論家型人格", "en": "Debater", "es": "Debatiente" },
        "summary": {
          "zh-TW": "機智靈活，喜歡挑戰觀點與創新解法。",
          "en": "Quick-witted and flexible; challenge ideas and craft innovations.",
          "es": "Ingeniosos y flexibles; desafían ideas y crean innovaciones."
        }
      }
    },
    "leaf_enfp": {
      "result": {
        "mbti": "ENFP",
        "title": { "zh-TW": "競選者型人格", "en": "Campaigner", "es": "Activista" },
        "summary": {
          "zh-TW": "熱情富創意，啟發他人，善於連結多元想法。",
          "en": "Enthusiastic and creative connectors who inspire others.",
          "es": "Entusiastas y creativos, conectan e inspiran a los demás."
        }
      }
    },
    "leaf_enfj": {
      "result": {
        "mbti": "ENFJ",
        "title": { "zh-TW": "主人公型人格", "en": "Protagonist", "es": "Protagonista" },
        "summary": {
          "zh-TW": "富魅力與同理心，善於帶動群體成長。",
          "en": "Charismatic and empathetic leaders who grow communities.",
          "es": "Líderes carismáticos y empáticos que hacen crecer a los grupos."
        }
      }
    },
    "leaf_esfj": {
      "result": {
        "mbti": "ESFJ",
        "title": { "zh-TW": "執政官型人格", "en": "Consul", "es": "Cónsul" },
        "summary": {
          "zh-TW": "社交與責任並重，維持秩序與人際關係。",
          "en": "Social and responsible; maintain order and relationships.",
          "es": "Sociales y responsables; mantienen el orden y las relaciones."
        }
      }
    },
    "leaf_estp": {
      "result": {
        "mbti": "ESTP",
        "title": { "zh-TW": "企業家型人格", "en": "Entrepreneur", "es": "Emprendedor" },
        "summary": {
          "zh-TW": "勇於行動與冒險，擅長即時決策與解危。",
          "en": "Action-oriented risk-takers with sharp real-time decisions.",
          "es": "Orientados a la acción y al riesgo; deciden con rapidez."
        }
      }
    },
    "leaf_esfp": {
      "result": {
        "mbti": "ESFP",
        "title": { "zh-TW": "表演者型人格", "en": "Entertainer", "es": "Animador" },
        "summary": {
          "zh-TW": "外向熱情，重視即時體驗與人際互動，帶動氣氛。",
          "en": "Outgoing and warm; value live experiences and energize groups.",
          "es": "Extrovertidos y cálidos; valoran las experiencias en vivo y animan a los grupos."
        }
      }
    },
    "leaf_estj": {
      "result": {
        "mbti": "ESTJ",
        "title": { "zh-TW": "總經理型人格", "en": "Executive", "es": "Ejecutivo" },
        "summary": {
          "zh-TW": "務實果斷，擅長組織管理與規範落地。",
          "en": "Practical and decisive organizers who enforce standards.",
          "es": "Organizadores prácticos y decisivos que hacen cumplir las normas."
        }
      }
    },
    "leaf_entj": {
      "result": {
        "mbti": "ENTJ",
        "title": { "zh-TW": "指揮官型人格", "en": "Commander", "es": "Comandante" },
        "summary": {
          "zh-TW": "具遠見與策略，帶領團隊追求卓越成果。",
          "en": "Visionary strategists who lead teams toward excellence.",
          "es": "Estrategas visionarios que guían equipos hacia la excelencia."
        }
      }
    }
  }
}

```

## 11) Development Steps

1. Bootstrap Next.js + TS + Tailwind + shadcn/ui; add ESLint/Prettier above.
2. Add next-intl and locale routing for zh-TW, en, es. Wrap UI strings with i18n; read localized text from decision_tree.json.
3. Implement DecisionRunner that:
   - Loads tree JSON
   - Maintains a stack (history) for back
   - Navigates to `/[locale]/result/[mbti]` at leaf
4. Implement result page with dynamic metadata/OG per MBTI and locale.
5. Add share buttons and copy-to-clipboard text per locale.
6. Insert AdSlot on result page (below main card). Ensure CLS safe.
7. Add analytics events.
8. Generate sitemap.xml including 16 result pages per locale; add robots.txt.
9. Lighthouse & a11y pass; deploy to Vercel.

## 12) Acceptance Checklist

- [ ] Test runner works with back/forward; restart possible.
- [ ] All 16 MBTI routes render with localized SEO metadata & OG images.
- [ ] Lighthouse (Mobile): SEO ≥ 95, Perf ≥ 90, A11y ≥ 95.
- [ ] Ads render only on result page; CLS < 0.1.
- [ ] i18n switch persists locale across routes.
- [ ] Analytics events captured in the funnel dashboard.

## 13) Commands & Env

### Commands

```bash
npm install
npm run dev
npm run typecheck && npm run lint && npm run build
```

### .env.local (examples)

```env
NEXT_PUBLIC_POSTHOG_KEY=...
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-XXXXXXXXXXXXXXX
```
