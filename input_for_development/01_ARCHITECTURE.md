# 🏛️ Technical Architecture

---

## 1. Stack Decisions

| Layer | Technology | Reason |
|---|---|---|
| Core | Vanilla HTML + CSS + JS | Zero framework overhead, maximum performance |
| Animations | GSAP (CDN, loaded async) | Industry standard, 60fps on low-end mobile |
| Particle System | Canvas 2D API | No library — raw GPU-composited performance |
| Scroll Engine | Custom (IntersectionObserver + passive scroll) | Full control, no library weight |
| Backend | Supabase (free tier) | PostgreSQL + REST API + Dashboard, no server needed |
| Audio | Web Audio API | Native, no library dependency |
| Hosting | Cloudflare Pages | Global CDN edge caching, free SSL, instant deploy |
| Domain | Custom subdomain | `invite.yourdomain.com` |
| i18n | JSON files + custom 1KB loader | No library overhead |
| Analytics | Custom events → Supabase | Privacy-first, no third-party SDKs |
| Fonts | Google Fonts (self-hosted WOFF2 subsets) | GDPR compliant, fast, offline-capable |

---

## 2. Hosting Architecture

### URL Pattern
```
https://invite.yourdomain.com/{client-slug}

Examples:
  https://invite.yourdomain.com/james-mary-2026
  https://invite.yourdomain.com/arjun-priya-2026
  https://invite.yourdomain.com/ali-fatima-2026
```

### Progressive Asset Loading

```
Request: invite.yourdomain.com/james-mary-2026
         │
         ▼
  ┌──────────────┐     Immediate (HTML shell — cached at CDN edge)
  │  Shell HTML  │     Renders loading frame instantly
  │   ~12KB gz   │
  └──────┬───────┘
         │ Parallel fetch (after DOMContentLoaded):
         ├──▶ /clients/james-mary-2026/config.json    (~2KB)
         ├──▶ /packs/themes/ivory-gold/tokens.css     (~5KB)
         ├──▶ /fonts/cormorant-garamond.woff2          (~35KB)
         ├──▶ /lang/en.json                            (~3KB)
         └──▶ /packs/animations/celestial/index.js    (~20KB)
              │
              │ Deferred (only when user reaches Scene 3+):
              └──▶ GSAP (CDN, ~30KB gz)
              │
              │ Deferred (only on first user audio gesture):
              └──▶ /packs/music/piano-soft/track.ogg  (~120KB)
```

### Caching Strategy

| Asset Type | Cache-Control |
|---|---|
| Shell HTML | `no-cache` (always fresh — allows instant updates) |
| config.json | `no-cache` (client data may change) |
| Theme CSS, Animation JS | `max-age=31536000, immutable` (versioned filename) |
| Fonts (WOFF2) | `max-age=31536000, immutable` |
| Music (OGG/MP3) | `max-age=31536000, immutable` |
| Language JSON | `max-age=86400` (1 day) |

---

## 3. Rendering Layer Model

The invitation renders in 4 composited layers. **No layer triggers a repaint in another.**

```
Layer 0 — Background        CSS gradient or static image        CSS only, zero JS
Layer 1 — Ambient Particles Canvas 2D, RAF animation loop       GPU composited
Layer 2 — Scene Content     DOM elements, CSS transitions       Isolated repaint zones
Layer 3 — Decorative FX     Canvas overlays (bokeh, light rays) GPU composited
Layer 4 — UI Chrome         Fixed-position DOM (audio, lang)    Independent stacking context
```

CSS `contain: layout style paint` applied to each scene wrapper — ensures each
scene's internal changes do not cause reflow/repaint outside its boundary.

---

## 4. Scene Engine Architecture

```
SceneEngine {
  state: {
    currentScene: 0,
    scrollProgress: 0.0,      ← 0.0 to 1.0
    activeTransition: null,
    isIdle: false,
    audioUnlocked: false,
  }

  scenes: [
    { id: 'arrival',      range: [0.00, 0.05] },
    { id: 'prelude',      range: [0.05, 0.15] },
    { id: 'announcement', range: [0.15, 0.30] },
    { id: 'story',        range: [0.30, 0.42] },
    { id: 'ceremony',     range: [0.42, 0.58] },
    { id: 'liturgy',      range: [0.58, 0.70] },
    { id: 'rsvp',         range: [0.70, 0.88] },
    { id: 'closing',      range: [0.88, 1.00] },
  ]

  methods:
    init(config, packs)           ← Bootstrap from config + loaded packs
    onScroll(progress)            ← Scroll handler (passive listener)
    transitionTo(sceneId)         ← Trigger scene change
    onIdle()                      ← Ambient breathing mode
    getProgress()                 ← Returns 0.0–1.0 scroll progress
}
```

### Scroll Mechanics

- Page total height: **700vh** (gives scroll room for cinematic pacing)
- Scroll progress mapped to `0.0–1.0` via `scrollY / (documentHeight - viewportHeight)`
- Lerp smoothing: `displayProgress += (rawProgress - displayProgress) * 0.08` per RAF frame
- Scene enter/exit fired at 80% threshold (not 100% — feels more natural)
- Mobile touch: velocity captured for momentum-aware transitions

### Transition Types

| Type | CSS/JS Implementation | Used For |
|---|---|---|
| `fade` | `opacity` transition 800ms | Default between most scenes |
| `wipe-up` | `translateY` + `opacity` | Ceremony details entering |
| `light-burst` | White overlay flash → dissolve | Announcement scene entry |
| `breath` | Subtle `scale(1.02)` + `opacity` | Ambient/idle transitions |
| `word-reveal` | Per-word staggered `opacity + translateY` | Scripture verse |
| `char-reveal` | Per-character stagger | Couple's names |

---

## 5. File & Folder Structure

```
DigitalWeddingCard/
│
├── .gitignore
├── README.md
│
├── input_for_development/            ← 📚 All design docs (this folder)
│   ├── 00_OVERVIEW.md
│   ├── 01_ARCHITECTURE.md
│   ├── 02_IMPLEMENTATION_PLAN.md
│   ├── 03_EXPERIENCE_DESIGN.md
│   ├── 04_DESIGN_SYSTEM.md
│   ├── 05_PACK_SYSTEM.md
│   ├── 06_RELIGION_MODULES.md
│   ├── 07_RSVP_AND_BACKEND.md
│   ├── 08_I18N_AND_LANGUAGE.md
│   ├── 09_ANALYTICS.md
│   └── 10_PERFORMANCE.md
│
├── public/                           ← Static assets (CDN-served)
│   ├── fonts/                        ← Self-hosted WOFF2 subsets
│   ├── packs/
│   │   ├── themes/
│   │   │   └── ivory-gold/
│   │   │       ├── tokens.css
│   │   │       └── meta.json
│   │   ├── animations/
│   │   │   └── celestial/
│   │   │       ├── index.js
│   │   │       └── meta.json
│   │   ├── typography/
│   │   │   └── serif-classic/
│   │   │       └── fonts.css
│   │   ├── music/
│   │   │   └── piano-soft/
│   │   │       ├── track.ogg
│   │   │       ├── track.mp3
│   │   │       └── meta.json
│   │   └── layouts/
│   │       └── cinematic-scroll/
│   │           └── layout.css
│   ├── modules/
│   │   └── religions/
│   │       └── christian/
│   │           ├── symbols.svg
│   │           ├── verse-bank.js
│   │           └── meta.json
│   └── lang/
│       ├── en.json
│       ├── ta.json
│       └── ml.json
│
├── src/                              ← Core engine source
│   ├── engine/
│   │   ├── scene-engine.js           ← Scroll → scene state machine
│   │   ├── pack-loader.js            ← Dynamic pack fetcher
│   │   ├── audio-controller.js       ← Web Audio API wrapper
│   │   ├── i18n.js                   ← Language loader + resolver
│   │   └── analytics.js              ← Event tracker → Supabase
│   ├── components/
│   │   ├── scene-arrival.js
│   │   ├── scene-prelude.js
│   │   ├── scene-announcement.js
│   │   ├── scene-story.js
│   │   ├── scene-ceremony.js
│   │   ├── scene-liturgy.js
│   │   ├── scene-rsvp.js
│   │   └── scene-closing.js
│   ├── rsvp/
│   │   ├── rsvp-form.js
│   │   └── rsvp-confirm.js
│   └── main.js                       ← Bootstrap entry point
│
├── clients/                          ← Per-client config files
│   └── james-mary-2026/
│       └── config.json
│
├── admin/                            ← Couple's dashboard (separate mini-app)
│   ├── index.html
│   ├── dashboard.js
│   └── dashboard.css
│
└── index.html                        ← Shell — reads slug → fetches client config
```

---

## 6. Config JSON Schema (Client File)

Every client gets exactly one config file. This is the only file that changes per wedding.

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
    "tagline": "Two souls, one covenant"
  },
  "ceremony": {
    "date": "October 18, 2026",
    "time": "10:00 AM",
    "venue": "St. Thomas Cathedral",
    "address": "Cathedral Road, Chennai",
    "mapsUrl": "https://maps.google.com/?q=...",
    "dresscode": "Formal"
  },
  "reception": {
    "enabled": true,
    "date": "October 18, 2026",
    "time": "6:00 PM",
    "venue": "Grand Ballroom, Taj Hotel",
    "address": "Mount Road, Chennai"
  },
  "liturgy": {
    "verse": "Ruth 1:16",
    "text": "Where you go, I will go; where you stay, I will stay.",
    "showCross": true
  },
  "rsvp": {
    "enabled": true,
    "deadline": "October 1, 2026",
    "supabaseTable": "rsvps",
    "clientId": "james-mary-2026"
  },
  "language": {
    "default": "en",
    "available": ["en", "ta", "ml"]
  },
  "analytics": {
    "enabled": true,
    "clientId": "james-mary-2026"
  }
}
```
