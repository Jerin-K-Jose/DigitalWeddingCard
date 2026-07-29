# 📋 Implementation Plan — Phased Build Roadmap

> All 8 open questions resolved. Architecture locked. Ready to build.

---

## Phase 1 — Foundation: Core Shell & Scene Engine
**Git Tag**: `phase-1-foundation`
**Commit Prefix**: `feat(p1):`

### Goals
- Establish the full project structure
- Build the scene engine (scroll controller)
- Render the first two scenes (Arrival + Prelude)
- Design token system fully working

### Tasks

#### 1.1 Project Setup
- [ ] Create `.gitignore` (node_modules, .env, .DS_Store)
- [ ] Create root `README.md`
- [ ] Create `index.html` shell structure
- [ ] Create `src/main.js` bootstrap entry
- [ ] Create sample `clients/james-mary-2026/config.json`

#### 1.2 Design Token System
- [ ] Create `public/packs/themes/ivory-gold/tokens.css`
  - Color palette (8 tokens)
  - Spacing scale
  - Typography scale
  - Motion tokens (easing, duration)
  - Shadow / glow tokens
  - Z-index system
- [ ] Create `public/packs/layouts/cinematic-scroll/layout.css`
  - 700vh scroll container
  - Scene wrapper base styles
  - Fixed UI chrome layer

#### 1.3 Typography Pack
- [ ] Create `public/packs/typography/serif-classic/fonts.css`
  - Cormorant Garamond (Light 300, Regular 400, Italic)
  - Lato (Light 300, Regular 400)
  - Self-hosted WOFF2 files in `/public/fonts/`
  - `font-display: swap`

#### 1.4 Scene Engine
- [ ] Create `src/engine/scene-engine.js`
  - Scene registry (8 scenes, scroll ranges)
  - Passive scroll listener
  - Scroll → progress mapping (0.0–1.0)
  - Lerp smoothing (rAF loop)
  - Scene enter/exit event dispatcher
  - Idle detection (10s timeout)
- [ ] Create `src/engine/pack-loader.js`
  - Dynamic `<link>` injection for CSS packs
  - Dynamic `import()` for JS packs
  - Waterfall loading (critical first, deferred later)

#### 1.5 Scene 0 — Arrival
- [ ] Create `src/components/scene-arrival.js`
  - Full-viewport black screen
  - Subtle breathing animation (scale 1.0 → 1.02, loop)
  - "Tap to begin" text (fade-in after 1.5s)
  - Touch/click → triggers Scene 1 transition
  - Locks audio context initialization

#### 1.6 Scene 1 — Prelude
- [ ] Create `src/components/scene-prelude.js`
  - Cinematic fade from black → warm dark background
  - Ambient particle system begins (Canvas)
  - Soft gradient sky (CSS, no image needed)
  - Decorative cross / symbol fades in (SVG, low opacity)
  - Platform name or tagline — subtle, centered

#### 1.7 Particle System (Canvas)
- [ ] Create ambient particle layer
  - 40–60 particles (performance-safe on Android)
  - Slow upward drift, randomized size (1–3px)
  - Color: `rgba(201, 168, 76, 0.3)` (gold dust)
  - Canvas resizes on window resize (debounced)
  - RAF loop runs only when tab is visible (Page Visibility API)

### Commit Message
```
feat(p1): initialize project structure, scene engine, and scenes 0–1

- Add project skeleton and .gitignore
- Add ivory-gold theme token system
- Add serif-classic typography pack
- Add cinematic-scroll layout
- Add scene engine with scroll controller and lerp smoothing
- Add pack loader (CSS/JS dynamic fetching)
- Add Scene 0: Arrival (tap-to-begin experience gate)
- Add Scene 1: Prelude (ambient reveal with gold particle system)
```

---

## Phase 2 — The Emotional Heart: Scenes 2–5
**Git Tag**: `phase-2-emotional-core`
**Commit Prefix**: `feat(p2):`

### Goals
- Deliver the core emotional experience
- Couple's names, story, ceremony details, scripture
- This phase alone should feel like a complete invitation

### Tasks

#### 2.1 Scene 2 — Announcement (Couple's Names)
- [ ] Create `src/components/scene-announcement.js`
  - Light-burst transition enters this scene (white flash → dissolve)
  - Couple's names: per-character staggered reveal (80ms stagger)
  - "James & Mary" — Cormorant Garamond, 6–8vw fluid
  - Ampersand (&) in accent gold, larger scale
  - Tagline fades in below names after 1.2s
  - Subtle radial glow behind names (gold, CSS box-shadow)

#### 2.2 Scene 3 — Story
- [ ] Create `src/components/scene-story.js`
  - Short poetic paragraph (from config `couple.tagline` or extended text)
  - Line-by-line reveal as user scrolls through this scene range
  - Typography: Cormorant Garamond Italic, centered
  - Max 3 lines — no overflow

#### 2.3 Scene 4 — Ceremony Details
- [ ] Create `src/components/scene-ceremony.js`
  - Glassmorphism card(s): `backdrop-filter: blur(12px)`
  - Card border: `1px solid rgba(201,168,76,0.2)`
  - Cards slide in from below with spring physics
  - Two cards if reception enabled: Ceremony | Reception
  - Each card contains: icon (SVG), label, date, time, venue
  - Icons: dove (ceremony), champagne (reception) — inline SVG
  - Dress code row at bottom of ceremony card
  - CTA row: "Get Directions" button (links to config.mapsUrl)

#### 2.4 Scene 5 — Liturgy / Scripture (Christian Module)
- [ ] Load `public/modules/religions/christian/` module
- [ ] Create `src/components/scene-liturgy.js`
  - Decorative cross SVG fades in (top center, low opacity)
  - Verse reference appears first ("Ruth 1:16")
  - Verse text appears word-by-word (typewriter-like, but elegant)
  - "A verse for the journey" label (small caps, muted)
  - Ornamental divider line (gold, CSS)

### Commit Message
```
feat(p2): implement core experience scenes 2–5

- Add Scene 2: Announcement with per-character name reveal and light-burst entry
- Add Scene 3: Story with line-by-line scroll-driven text reveal
- Add Scene 4: Ceremony details with glassmorphism cards and spring animations
- Add Scene 5: Scripture liturgy with Christian module integration and word-by-word reveal
- Add Christian religion module (verse-bank, symbols SVG)
```

---

## Phase 3 — Conversion & Closing
**Git Tag**: `phase-3-conversion`
**Commit Prefix**: `feat(p3):`

### Goals
- RSVP flow (Supabase-connected, 3-step, branded)
- Utility CTAs (Add to Calendar, Get Directions)
- Closing scene (emotional farewell)

### Tasks

#### 3.1 Scene 6 — RSVP
- [ ] Supabase client setup (supabase-js, CDN import)
- [ ] Create `.env` file for Supabase URL + anon key
- [ ] Create `src/rsvp/rsvp-form.js`
  - Step 1: Attending decision (Yes / No animated buttons)
  - Step 2: Name + guest count (if Yes)
  - Step 3: Personal message (optional textarea)
  - Form validation (name required, guest count 1–10)
  - Write to Supabase `rsvps` table
- [ ] Create `src/rsvp/rsvp-confirm.js`
  - Success state: animated petal/confetti burst
  - Personalized message: "We can't wait to see you, [Name]!"
  - Error state: graceful fallback message + retry

#### 3.2 Add to Calendar (ICS Generator)
- [ ] Generate `.ics` file dynamically from config data
- [ ] Include ceremony + reception (if enabled) as separate events
- [ ] Trigger download on button click (no server needed — client-side Blob)

#### 3.3 Scene 7 — Closing
- [ ] Create `src/components/scene-closing.js`
  - Fade-out of all heavy elements
  - Single centered line: "We can't wait to celebrate with you"
  - Soft ambient bokeh background (CSS radial gradients, animated)
  - Share button (Web Share API → fallback: copy link)
  - Transitions into ambient idle loop

#### 3.4 Idle Ambient State
- [ ] After Scene 7 fully visible, trigger ambient mode
- [ ] Particles continue, music fades to 20% volume
- [ ] Slow breathing scale animation on closing text
- [ ] Page title cycles: "James & Mary · October 18 · 🕊️"

### Commit Message
```
feat(p3): add RSVP system, utility CTAs, and closing experience

- Add Scene 6: RSVP with 3-step form and Supabase integration
- Add ICS calendar file generator (client-side, no server needed)
- Add Scene 7: Closing with ambient bokeh and share functionality
- Add idle ambient state with particle continuation and breathing mode
- Add Supabase environment config (.env.example)
```

---

## Phase 4 — Delight & Immersion
**Git Tag**: `phase-4-delight`
**Commit Prefix**: `feat(p4):`

### Goals
- Music (Web Audio, fade in/out with scenes)
- Full animation pack (Celestial)
- Mobile-specific enhancements (gyroscope, haptics)
- Progress indicator

### Tasks

#### 4.1 Audio System
- [ ] Create `src/engine/audio-controller.js`
  - Web Audio API: `AudioContext`, `GainNode`, `AudioBufferSourceNode`
  - Load `piano-soft` pack: fetch OGG, decode, buffer
  - Fade in on Scene 1, fade down on RSVP scene, fade out on closing
  - Scene-sync: GainNode automation to match emotional beats
  - Mute button (UI chrome, persists to localStorage)
- [ ] Add audio unlock on first user gesture (Safari/iOS compliance)

#### 4.2 Celestial Animation Pack
- [ ] Create `public/packs/animations/celestial/index.js`
  - Export `onSceneEnter(sceneId, el)` — scene-specific entry animations
  - Export `onSceneExit(sceneId, el)` — exit cleanup
  - Export `ambientLoop(canvas)` — continuous particle background
  - Export `textReveal(chars[], options)` — reusable stagger helper
  - Light ray effect (radial gradient rotating slowly, CSS keyframes)

#### 4.3 Mobile Enhancements
- [ ] Gyroscope parallax
  - `DeviceOrientationEvent` → translate decorative layers (±15px max)
  - Works on particles layer and SVG symbols
  - Permission request on iOS 13+ (user gesture required)
- [ ] Haptic feedback
  - `navigator.vibrate()` — short pulse on: Scene 2 name reveal, RSVP Yes button, RSVP confirmation
  - Duration: 12ms (subtle, not intrusive)

#### 4.4 Progress Indicator
- [ ] Thin horizontal line, top of viewport, fixed position
- [ ] Color: gold (`--color-accent`)
- [ ] Width: 0% → 100% tracking scroll progress (lerped, smooth)
- [ ] Disappears on Scene 7 (closing) — fades out

### Commit Message
```
feat(p4): add audio system, celestial animation pack, and mobile enhancements

- Add Web Audio controller with scene-sync gain automation
- Add piano-soft music pack integration with iOS unlock handling
- Add Celestial animation pack (scene entry/exit, ambient loop, text reveal)
- Add light ray effect and particle enhancements
- Add gyroscope parallax for mobile depth effect
- Add haptic feedback on key interaction moments
- Add gold progress indicator with lerp smoothing
```

---

## Phase 5 — Language & Analytics
**Git Tag**: `phase-5-language-analytics`
**Commit Prefix**: `feat(p5):`

### Goals
- English / Tamil / Malayalam support
- Scene engagement analytics
- Couple's RSVP + analytics dashboard

### Tasks

#### 5.1 i18n System
- [ ] Create `src/engine/i18n.js`
  - Read config `language.default` and `language.available`
  - Detect browser language (`navigator.language`)
  - Fetch appropriate `/lang/{code}.json`
  - Expose `t(key)` function for string resolution
  - Language switch: re-hydrate all `[data-i18n]` DOM attributes
- [ ] Create `public/lang/en.json` (all strings)
- [ ] Create `public/lang/ta.json` (Tamil translations)
- [ ] Create `public/lang/ml.json` (Malayalam translations)
- [ ] Language switcher UI (globe icon, top-right, fade-in selector)
- [ ] Lazy-load Indic fonts when language switched
  - Noto Serif Tamil (WOFF2)
  - Noto Serif Malayalam (WOFF2)

#### 5.2 Analytics System
- [ ] Create `src/engine/analytics.js`
  - Event queue (batches events, sends every 5s or on page unload)
  - `track(event, properties)` function
  - Write to Supabase `analytics_events` table
  - No PII — uses anonymous session ID (UUID, sessionStorage)
- [ ] Instrument all key events:
  - `invitation_opened`, `experience_started`
  - `scene_viewed` (all 8 scenes)
  - `audio_enabled`, `language_switched`
  - `rsvp_opened`, `rsvp_submitted`, `rsvp_declined`
  - `directions_clicked`, `calendar_added`
  - `invitation_shared`, `idle_ambient`

#### 5.3 Supabase Schema (Full)
- [ ] Table: `rsvps` (as defined in 07_RSVP_AND_BACKEND.md)
- [ ] Table: `analytics_events`
- [ ] RLS policies: insert-only for anon key, read via service role key

#### 5.4 Couple's Dashboard
- [ ] Create `admin/index.html`
- [ ] Create `admin/dashboard.js`
  - Auth: simple password (Supabase magic link or hardcoded for v1)
  - RSVP section: live count, guest list, CSV export
  - Analytics section: engagement funnel visualization
  - Supabase real-time subscription (live updates)
- [ ] Create `admin/dashboard.css` (simple, clean, minimal)

### Commit Message
```
feat(p5): add multi-language support and scene analytics

- Add i18n engine with browser auto-detect and manual switch
- Add English, Tamil, and Malayalam language packs
- Add language switcher UI with lazy-loaded Indic fonts
- Add scene analytics engine with Supabase event storage
- Add analytics instrumentation across all key user actions
- Add couple's admin dashboard (RSVP list + engagement funnel)
- Add Supabase RLS policies for secure data access
```

---

## Phase 6 — Pack System & Extensibility
**Git Tag**: `phase-6-extensibility`
**Commit Prefix**: `feat(p6):`

### Goals
- Formalize the pack system
- Add a second religion module (Hindu — scaffolding)
- Add a second theme (Blush Rose)
- Documentation for future pack authors

### Tasks

#### 6.1 Formalize Pack System
- [ ] Finalize `src/engine/pack-loader.js` with validation
  - Validate `meta.json` schema for each pack type
  - Error boundary: if pack fails to load, fall back to defaults
- [ ] Document pack API contract in `input_for_development/05_PACK_SYSTEM.md`

#### 6.2 Second Theme — Blush Rose
- [ ] Create `public/packs/themes/blush-rose/tokens.css`
  - Soft pink + ivory + rose gold palette
  - Romantic, garden-wedding aesthetic

#### 6.3 Hindu Religion Module (Scaffolding)
- [ ] Create `public/modules/religions/hindu/meta.json`
- [ ] Create `public/modules/religions/hindu/symbols.svg` (Om, lotus)
- [ ] Scaffold `mantra-bank.js` structure (no content yet)

#### 6.4 Pack Author Documentation
- [ ] How to create a Theme Pack
- [ ] How to create an Animation Pack
- [ ] How to create a Music Pack
- [ ] How to create a Religion Module

### Commit Message
```
feat(p6): formalize pack system and add extensibility scaffolding

- Add pack loader validation and error boundaries
- Add Blush Rose theme pack (romantic pink/ivory palette)
- Add Hindu religion module scaffolding (Om symbol, meta, structure)
- Add pack author documentation for themes, animations, music, religions
```

---

## Overall Phase Status Tracker

| Phase | Description | Status | Git Tag |
|---|---|---|---|
| 1 | Foundation: Core Shell & Scene Engine | 🔲 | `phase-1-foundation` |
| 2 | Emotional Heart: Scenes 2–5 | 🔲 | `phase-2-emotional-core` |
| 3 | Conversion & Closing | 🔲 | `phase-3-conversion` |
| 4 | Delight & Immersion | 🔲 | `phase-4-delight` |
| 5 | Language & Analytics | 🔲 | `phase-5-language-analytics` |
| 6 | Pack System & Extensibility | 🔲 | `phase-6-extensibility` |

**Legend**: 🔲 Not Started · 🔶 In Progress · ✅ Complete
