# 📋 PROGRESS TRACKER — Digital Wedding Invitation Platform
> **Persistent build memory.** Updated after every scene and commit.
> If context resets, start here. This file is the source of truth for current state.

---

## 🔖 Quick Resume Guide

If you're resuming after a context reset, read these in order:
1. This file (`PROGRESS.md`) — current state + what's done
2. `input_for_development/03_EXPERIENCE_DESIGN_V2.md` — unified 10-scene blueprint
3. `input_for_development/01_ARCHITECTURE.md` — tech stack and file structure
4. `input_for_development/04_DESIGN_SYSTEM.md` — all design tokens
5. The last committed file changes (run `git log --oneline -10`)

---

## 🗺️ Unified Scene Map (Final — v2)

| # | Scene | Key Feature | Status |
|---|---|---|---|
| 01 | Loading | Logo + particles, assets preload | 🔲 |
| 02 | Envelope | Animated envelope + wax seal, tap to open | 🔲 |
| 03 | Hero / Announcement | Couple names + family invitation wording | 🔲 |
| 04 | Story | Poetic paragraph, line-by-line reveal | 🔲 |
| 05 | Bible Verse / Liturgy | Cross + word-by-word scripture | 🔲 |
| 06 | Timeline | Ceremony → Reception → Dinner visual flow | 🔲 |
| 07 | Venue | Church name, address, map preview | 🔲 |
| 08 | Countdown | Live days · hours · minutes · seconds | 🔲 |
| 09 | RSVP | 3-step form, Supabase backend | 🔲 |
| 10 | Closing / Blessing | Thank you, share, ambient idle | 🔲 |

**Gallery**: Config-driven — renders between Scene 07 and 08 only if `config.media.photoGallery` has entries.

---

## 📦 Build Approach

**One scene per prompt.** Review after each scene before proceeding.

```
Each prompt builds exactly ONE scene, fully:
  - HTML structure
  - CSS (design tokens applied)
  - JS (scene engine integration, animations)
  - Connected to config.json
  - Committed with appropriate message
```

---

## 🏗️ Project Status

### Pre-Build Phase ✅ COMPLETE
- [x] Git initialized
- [x] Architecture designed (10 docs in input_for_development/)
- [x] PDF reference analyzed and merged
- [x] Unified scene map finalized (10 scenes)
- [x] Task tracker created
- [x] Initial commit: `d199aff`

### Foundation (Shell + Engine) 🔲 NOT STARTED
Must complete before Scene 01:
- [ ] `index.html` shell
- [ ] `src/main.js` bootstrap
- [ ] `src/engine/scene-engine.js`
- [ ] `src/engine/pack-loader.js`
- [ ] `public/packs/themes/ivory-gold/tokens.css`
- [ ] `public/packs/typography/serif-classic/fonts.css`
- [ ] `public/packs/layouts/cinematic-scroll/layout.css`
- [ ] `clients/james-mary-2026/config.json`
- [ ] Commit: `feat(foundation): project shell, scene engine, design tokens`

### Scene 01 — Loading 🔲 NOT STARTED
- [ ] Tiny cross/logo centered
- [ ] Gold particle system (Canvas)
- [ ] Assets preloading silently in background
- [ ] Fade to Scene 02 when ready
- [ ] Commit: `feat(scene-01): loading screen with particles and asset preload`

### Scene 02 — Envelope 🔲 NOT STARTED
- [ ] 3D envelope CSS animation
- [ ] Wax seal SVG with glow
- [ ] Tap/click → envelope opens
- [ ] Card slides upward out of envelope
- [ ] Transition to Scene 03
- [ ] Commit: `feat(scene-02): envelope with wax seal and opening animation`

### Scene 03 — Hero / Announcement 🔲 NOT STARTED
- [ ] Couple names (per-character reveal)
- [ ] Wedding date
- [ ] Family invitation wording
- [ ] Light-burst transition entry
- [ ] Haptic on name reveal
- [ ] Commit: `feat(scene-03): hero announcement with names and family wording`

### Scene 04 — Story 🔲 NOT STARTED
- [ ] Poetic paragraph
- [ ] Line-by-line reveal (scroll-driven)
- [ ] Cormorant Garamond Italic
- [ ] Commit: `feat(scene-04): story scene with scroll-driven text reveal`

### Scene 05 — Bible Verse / Liturgy 🔲 NOT STARTED
- [ ] Cross SVG
- [ ] Verse reference
- [ ] Word-by-word reveal
- [ ] Ornamental dividers
- [ ] Commit: `feat(scene-05): liturgy scene with scripture animation`

### Scene 06 — Timeline 🔲 NOT STARTED
- [ ] Ceremony → Reception → Dinner
- [ ] Visual timeline (vertical on mobile)
- [ ] Each event: time, venue name, icon
- [ ] Spring-in animation
- [ ] Commit: `feat(scene-06): wedding day timeline`

### Scene 07 — Venue 🔲 NOT STARTED
- [ ] Church card with address
- [ ] Map embed / preview
- [ ] Get Directions CTA
- [ ] Reception venue (if config enabled)
- [ ] Commit: `feat(scene-07): venue scene with map`

### Scene 07b — Gallery (Config-Driven) 🔲 CONDITIONAL
- [ ] Only renders if `config.media.photoGallery.length > 0`
- [ ] Polaroid / cinematic card layout
- [ ] Lazy-loaded images
- [ ] Commit: `feat(scene-07b): config-driven photo gallery`

### Scene 08 — Countdown 🔲 NOT STARTED
- [ ] Live countdown: Days · Hours · Minutes · Seconds
- [ ] requestAnimationFrame tick (no setInterval)
- [ ] Gold animated digits
- [ ] "The celebration begins in..." copy
- [ ] Stops / changes on wedding day
- [ ] Commit: `feat(scene-08): live countdown timer`

### Scene 09 — RSVP 🔲 NOT STARTED
- [ ] Supabase project setup
- [ ] `rsvps` table + `analytics_events` table
- [ ] RLS policies
- [ ] Step 1: Yes / No decision
- [ ] Step 2: Name + guest count + phone
- [ ] Step 3: Message
- [ ] Supabase insert
- [ ] Confirmation (confetti burst)
- [ ] Decline flow
- [ ] ICS calendar generator
- [ ] Commit: `feat(scene-09): RSVP with Supabase backend and ICS generator`

### Scene 10 — Closing / Blessing 🔲 NOT STARTED
- [ ] Closing line
- [ ] Bokeh ambient background
- [ ] Share button (Web Share API)
- [ ] Ambient idle state (10s trigger)
- [ ] Page title cycle
- [ ] Commit: `feat(scene-10): closing scene and ambient idle state`

### Polish Pass 🔲 NOT STARTED
- [ ] `src/engine/audio-controller.js` (Web Audio, scene-sync)
- [ ] `src/engine/i18n.js` (EN/TA/ML)
- [ ] `src/engine/analytics.js` (Supabase events)
- [ ] Language switcher UI
- [ ] Gyroscope parallax (mobile)
- [ ] Haptic feedback
- [ ] Progress indicator (gold line)
- [ ] Prefers-reduced-motion audit
- [ ] Lighthouse audit (target ≥ 90)
- [ ] Commit: `feat(polish): audio, i18n, analytics, mobile enhancements`

### Admin Dashboard 🔲 NOT STARTED
- [ ] `admin/index.html`
- [ ] RSVP live feed
- [ ] Analytics funnel
- [ ] CSV export
- [ ] Commit: `feat(admin): couple dashboard with RSVP and analytics`

---

## 🔧 Tech Stack (Final)

| Layer | Technology |
|---|---|
| Core | Vanilla HTML + CSS + JS (no framework) |
| Animations | GSAP (CDN, deferred load) |
| Particles | Canvas 2D API |
| Backend | Supabase (PostgreSQL + REST) |
| Hosting | Cloudflare Pages |
| Fonts | Google Fonts (self-hosted WOFF2 subsets) |
| Languages | English · Tamil · Malayalam |

---

## 📁 Config Schema Reference (james-mary-2026)

```json
{
  "client": {
    "id": "james-mary-2026",
    "religion": "christian",
    "theme": "ivory-gold",
    "animationPack": "celestial",
    "typographyPack": "serif-classic",
    "musicPack": "piano-soft",
    "layout": "cinematic-scroll"
  },
  "couple": {
    "groomName": "James",
    "brideName": "Mary",
    "groomFamilyLine": "Son of Mr. & Mrs. Robert Johnson",
    "brideFamilyLine": "Daughter of Mr. & Mrs. Thomas George",
    "tagline": "Two souls, one covenant",
    "story": "Two hearts shaped by grace, drawn together by love..."
  },
  "ceremony": {
    "date": "October 18, 2026",
    "dateISO": "2026-10-18",
    "time": "10:00 AM",
    "venue": "St. Thomas Cathedral",
    "address": "Cathedral Road, Chennai",
    "mapsUrl": "https://maps.google.com/?q=...",
    "dresscode": "Formal"
  },
  "reception": {
    "enabled": true,
    "time": "6:00 PM",
    "venue": "Grand Ballroom, Taj Hotel",
    "address": "Mount Road, Chennai"
  },
  "dinner": {
    "enabled": true,
    "time": "8:00 PM",
    "venue": "Grand Ballroom, Taj Hotel"
  },
  "liturgy": {
    "verse": "Ruth 1:16",
    "text": "Where you go, I will go; where you stay, I will stay.",
    "showCross": true
  },
  "media": {
    "photoGallery": [],
    "ogCoverImage": "/clients/james-mary-2026/og-cover.jpg"
  },
  "rsvp": {
    "enabled": true,
    "deadline": "October 1, 2026",
    "deadlineISO": "2026-10-01"
  },
  "language": {
    "default": "en",
    "available": ["en", "ta", "ml"]
  },
  "analytics": {
    "enabled": true
  }
}
```

---

## 🔗 Git Log

| Commit | Message | Phase |
|---|---|---|
| `d199aff` | `docs: initialize project foundation, architecture, and complete platform blueprint` | Pre-build |
| *(next)* | `feat(foundation): project shell, scene engine, design tokens, config` | Foundation |
| *(next)* | `feat(scene-01): loading screen with particles and asset preload` | Scene 01 |
| *(next)* | `feat(scene-02): envelope with wax seal and opening animation` | Scene 02 |

---

## ⚠️ GitHub Remote Setup

GitHub CLI (`gh`) is **not installed**. To push to GitHub:

### Option A — GitHub CLI (Recommended)
```powershell
# Install GitHub CLI
winget install --id GitHub.cli
# Then authenticate and create repo
gh auth login
gh repo create DigitalWeddingCard --private --source=. --push
```

### Option B — Manual (Do this now if you want)
1. Create repo at https://github.com/new
   - Name: `DigitalWeddingCard`
   - Visibility: Private
   - Do NOT initialize with README (we already have one)
2. Then run:
```powershell
git remote add origin https://github.com/YOUR_USERNAME/DigitalWeddingCard.git
git branch -M main
git push -u origin main
```

### Option C — I run it for you
If you create the repo on GitHub and share the URL,
I can run the `git remote add` and `git push` commands directly.

---

## 📌 Last Updated

- **Date**: 2026-07-29
- **By**: Antigravity (AI)
- **Commit**: `d199aff`
- **Next Action**: Foundation build (shell + engine) → Scene 01
