# Finance Manager

## Project Overview
Personal financial management app with GitHub Pages frontend and Google Apps Script + Google Sheets backend.

## Tech Stack
- **Frontend**: Next.js 14+ (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Google Apps Script (deployed as Web App)
- **Database**: Google Sheets
- **Testing**: Vitest + React Testing Library

## Commands
- `npm run dev` — Start development server
- `npm run build` — Build for production (static export)
- `npm run test` — Run tests
- `npm run lint` — Run ESLint

## Architecture
- Static export (`output: "export"`) for GitHub Pages deployment
- All data operations go through Google Apps Script API (`src/lib/api/`)
- API URL stored in browser localStorage
- Dark/light mode via next-themes with `class` strategy

## File Structure
- `src/app/` — Next.js pages (dashboard, credit-cards, loans, savings, tax, settings)
- `src/components/` — React components (ui/, layout/, credit-cards/, settings/, shared/)
- `src/lib/` — Business logic (api/, db/, hooks/, types/, utils/, constants/)
- `apps-script/` — Google Apps Script backend code

## Conventions
- Use `"use client"` directive for components that use React hooks or browser APIs
- Store monetary values as strings, format with `formatINR()` from `src/lib/utils/date.ts`
- Credit card billing cycle days are 1-28 (no 29-31 to avoid month-length issues)
- shadcn/ui components are in `src/components/ui/` — do not edit these directly
