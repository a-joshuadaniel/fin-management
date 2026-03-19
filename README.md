# Finance Manager

Personal financial management app with a clean UI, hosted on GitHub Pages with Google Sheets as the backend.

## Architecture

```
GitHub Pages (static frontend) → Google Apps Script (serverless API) → Google Sheets (database)
```

- **Frontend**: Next.js + TypeScript + Tailwind CSS + shadcn/ui
- **Backend**: Google Apps Script (deployed as Web App)
- **Database**: Google Sheets (private to your Google account)
- **Code is public, data is private**

## Features

- Credit card billing cycle timeline and calendar (starting from 2026)
- Add unlimited credit cards with billing cycle tracking
- Visual timeline showing billing periods and due dates
- Monthly calendar view with color-coded indicators
- Dark/light mode
- Data persists in Google Sheets
- Placeholder pages for: Loans & EMIs, Savings, Income Tax

## Quick Start

### 1. Local Development

```bash
npm install
npm run dev
```

Open http://localhost:3000

### 2. Set Up Google Sheets Backend

1. Create a new Google Sheet
2. Go to **Extensions > Apps Script**
3. Copy the contents of `apps-script/Code.gs` into the script editor
4. Click **Deploy > New Deployment > Web App**
5. Set "Execute as" to **Me** and "Access" to **Anyone**
6. Copy the Web App URL
7. In the app, go to **Settings** and paste the URL

### 3. Deploy to GitHub Pages

1. Push this repo to GitHub
2. Go to **Repo Settings > Pages > Source: GitHub Actions**
3. The included workflow will auto-build and deploy on push to `main`
4. Access at `https://<username>.github.io/fin-management/`

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build (static export) |
| `npm run test` | Run tests |
| `npm run lint` | Run linter |

## Project Structure

```
src/
  app/                    # Pages (dashboard, credit-cards, loans, savings, tax, settings)
  components/
    ui/                   # shadcn/ui components
    layout/               # Sidebar, header
    credit-cards/         # Card list, form, timeline, calendar
    settings/             # Theme toggle
    shared/               # Empty state, etc.
  lib/
    api/                  # Google Apps Script API client
    db/                   # Zod schemas
    hooks/                # React hooks
    types/                # TypeScript interfaces
    utils/                # Date and currency utilities
    constants/            # Navigation, colors
  providers/              # Theme provider
apps-script/              # Google Apps Script backend code
```

## Tech Stack

- [Next.js](https://nextjs.org/) (App Router, static export)
- [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- [date-fns](https://date-fns.org/) for date calculations
- [Zod](https://zod.dev/) for validation
- [React Hook Form](https://react-hook-form.com/) for forms
- [Vitest](https://vitest.dev/) for testing
- [Google Apps Script](https://developers.google.com/apps-script) for backend
