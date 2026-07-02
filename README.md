# Aibility Lead Demo

Czech-language interactive lead-flow prototype showing how a fictional publisher placement can lead to an AI Skill Finder assessment, personalized recommendation and qualified lead concept.

## What The Demo Shows

The project demonstrates a small acquisition mechanism for an AI education campaign concept:

1. A fictional publisher article on `DragonWatch.cz`.
2. Clickable fantasy-themed ad placements.
3. A visually separate advertiser landing page for `AI Skill Finder`.
4. A deterministic 5-question assessment.
5. A personalized AI level, Growth Edge and recommended next step.
6. A lead-capture moment shown as a mock form and lead data preview.
7. A gated demo commentary section for Aibility and a final David portfolio CTA.

This is not an official Aibility product. It is not connected to Aibility, any media brand, HBO, Max, House of the Dragon or Game of Thrones. It does not use official logos, characters or show assets.

## Funnel

`publisher content site -> ad banner click -> advertiser landing page -> AI Skill Finder assessment -> personalized recommendation -> lead-capture moment -> demo commentary for Aibility -> David portfolio CTA`

The publisher route is `/`. All ad placements link to `/ai-skill-finder`.

The advertiser route is `/ai-skill-finder`. Demo commentary and candidate context are hidden until the assessment is completed and the user clicks `Zobrazit, proč jsem to navrhl takhle`.

## Tech Stack

- Vite
- React
- TypeScript
- Tailwind CSS
- Lucide React icons
- No backend
- No API keys
- No database
- No live LLM calls

## Local Setup

```bash
pnpm install
pnpm run dev
```

## Build

```bash
pnpm run build
```

## Preview

```bash
pnpm run preview
```

## Deploy On Vercel

Import this repository into Vercel with:

- Framework: `Vite`
- Build command: `pnpm run build`
- Output directory: `dist`

The included `vercel.json` rewrites direct route loads such as `/ai-skill-finder` back to the client app.

## Manual GitHub Setup

If you are creating the repository manually:

```bash
git init
git add .
git commit -m "Initial Aibility lead demo"
git branch -M main
git remote add origin https://github.com/davidkoller-stack/aibility-lead-demo.git
git push -u origin main
```

## Disclaimer

This is an unofficial scripted prototype. It is not a live AI chatbot, does not submit forms, and is not connected to any CRM, API or external service. It is an independent demo for showing interaction design, acquisition logic and lead qualification structure.
