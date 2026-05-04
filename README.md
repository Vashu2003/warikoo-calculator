# Warikoo Finance Calculator

Honest financial advice based on Ankur Warikoo's framework. No fluff. No selling.
Just math + Warikoo's principles applied to YOUR numbers.

All calculations run client-side. Your data never leaves your browser.

## Features

- **Warikoo Health Score** — single 0-100 score across 4 pillars
- **Cash Flow** — 50/30/20 breakdown, savings rate, EMI ratio
- **Loan Prepayment Strategy** — debt avalanche, prepay vs invest math
- **Goal Tracker** — inflated goal cost, required SIP, on-track / shortfall
- **SIP Projections** — year-by-year wealth curve with step-ups
- **Red Flags** — under-insured, over-leveraged, missing emergency fund
- **PDF Export** — full report via jsPDF + html2canvas

## Tech stack

- Next.js 16 (App Router) + Turbopack
- React 19
- TypeScript 5
- Tailwind CSS v4
- shadcn/ui (Radix primitives)
- Zustand (with localStorage persistence)
- React Hook Form + Zod
- Recharts
- lucide-react
- jsPDF + html2canvas

## Setup

```bash
npm install
npm run dev
```

App runs at <http://localhost:3000>.

## Build

```bash
npm run build
npm run start
```

## Deploy

Push to GitHub, then deploy on [Vercel](https://vercel.com/new). Zero config —
Next.js projects deploy out of the box.

## Project structure

```
app/
  layout.tsx          root layout, fonts, metadata
  page.tsx            landing page (hero, features, CTA)
  calculator/         multi-section input form
  results/            results dashboard
  globals.css         Tailwind v4 + theme tokens
components/
  ui/                 shadcn primitives
  form/               per-section form components (TODO)
  results/            per-section results cards (TODO)
  shared/             reusable bits (CurrencyInput, etc.)
lib/
  types.ts            all TypeScript interfaces
  store.ts            Zustand store with localStorage persistence
  calculations.ts     core math (TODO — implemented by ai-engineer)
  utils.ts            shadcn `cn` helper
```

## Status

Scaffolded by **rapid-prototyper**. Form fields and calculation logic are
placeholders — see `components/form/README.md`, `components/results/README.md`,
and `lib/calculations.ts` for what's left to build.

---

Not affiliated with Ankur Warikoo. Educational tool, not financial advice.
