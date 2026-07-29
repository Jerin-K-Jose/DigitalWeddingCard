# 🎴 Digital Wedding Invitation Platform

A premium, cinematic, scroll-driven digital wedding invitation platform.
Built for performance. Designed for emotion. Architected for extensibility.

---

## What This Is

An immersive wedding invitation experience — closer to an Apple product launch
or an Awwwards storytelling website than a traditional digital card.

- **v1**: Christian Wedding · Ivory & Gold theme · English / Tamil / Malayalam
- **Hosted URL**: `invite.yourdomain.com/{client-slug}`
- **Backend**: Supabase (RSVP + Analytics)
- **Hosting**: Cloudflare Pages

## Quick Start (Team)

```bash
# Clone the repo
git clone <repo-url>
cd DigitalWeddingCard

# No build step in Phase 1 — pure HTML/CSS/JS
# Open index.html directly or serve with:
npx serve .

# Set up environment variables
cp .env.example .env
# Fill in your Supabase URL and keys
```

## Documentation

All design decisions, architecture, and experience blueprints are in:
`/input_for_development/`

| # | Document |
|---|---|
| 00 | [Overview](./input_for_development/00_OVERVIEW.md) |
| 01 | [Architecture](./input_for_development/01_ARCHITECTURE.md) |
| 02 | [Implementation Plan](./input_for_development/02_IMPLEMENTATION_PLAN.md) |
| 03 | [Experience Design](./input_for_development/03_EXPERIENCE_DESIGN.md) |
| 04 | [Design System](./input_for_development/04_DESIGN_SYSTEM.md) |
| 05 | [Pack System](./input_for_development/05_PACK_SYSTEM.md) |
| 06 | [Religion Modules](./input_for_development/06_RELIGION_MODULES.md) |
| 07 | [RSVP & Backend](./input_for_development/07_RSVP_AND_BACKEND.md) |
| 08 | [i18n & Language](./input_for_development/08_I18N_AND_LANGUAGE.md) |
| 09 | [Analytics](./input_for_development/09_ANALYTICS.md) |
| 10 | [Performance](./input_for_development/10_PERFORMANCE.md) |

## Build Phases

| Phase | Description | Status |
|---|---|---|
| 1 | Foundation: Core Shell & Scene Engine | 🔲 |
| 2 | Emotional Heart: Scenes 2–5 | 🔲 |
| 3 | Conversion & Closing | 🔲 |
| 4 | Delight & Immersion | 🔲 |
| 5 | Language & Analytics | 🔲 |
| 6 | Pack System & Extensibility | 🔲 |

## Tech Stack

- **Core**: Vanilla HTML + CSS + JS (zero framework)
- **Animations**: GSAP (CDN, deferred)
- **Backend**: Supabase
- **Hosting**: Cloudflare Pages
- **Fonts**: Google Fonts (self-hosted WOFF2 subsets)
