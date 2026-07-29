# 🎴 Digital Wedding Invitation Platform — Refined Architecture
> **Status**: All decisions locked. Ready for execution approval.

---

## ✅ Decisions Resolved

| # | Question | Decision | Architectural Impact |
|---|---|---|---|
| 1 | Hosting | **Hosted URL** | CDN asset splitting, lazy-loaded packs, service worker caching |
| 2 | RSVP | **Own system** (Supabase) | DB + dashboard + email notification |
| 3 | Photo Gallery | Not planned (v1) | Excluded from scene architecture |
| 4 | Video | Not planned (v1) | Excluded from scene architecture |
| 5 | Multi-language | **Yes, if possible** | i18n JSON layer, browser auto-detect |
| 6 | Client editing | **Team manages** | Internal config + admin panel (later) |
| 7 | Analytics | **Yes** | Lightweight scene-engagement tracker |

---

## 1. Hosting Architecture

### Why hosted URL beats single HTML

| Concern | Single HTML | Hosted URL |
|---|---|---|
| File size | Everything bundled (~3–5MB if audio/fonts) | Core shell ~40KB, assets lazy-loaded |
| Caching | No caching — re-downloads every open | CDN edge cache, 1yr cache on assets |
| Updates | Can't update after sharing | Deploy fix → all guests see it instantly |
| Analytics | Not possible | Full scene engagement tracking |
| RSVP | Requires external service | Own backend possible |
| Multi-language | Bloated | Fetch only needed language file |
| Performance | Inconsistent across devices | Controlled, predictable load order |

### URL Structure

```
https://invite.yourdomain.com/{client-slug}

Example:
  https://invite.yourdomain.com/james-mary-2026
  https://invite.yourdomain.com/arjun-priya-2026  ← future Hindu wedding
```

### File Delivery Strategy

```
Request: invite.yourdomain.com/james-mary-2026
         │
         ▼
  ┌──────────────┐     Instant (cached at CDN edge)
  │  Shell HTML  │ ←── Core HTML + Critical CSS + Tiny bootstrap JS
  │   ~15KB gz   │     Renders the first frame immediately
  └──────┬───────┘
         │ Then parallel fetches:
         ├──▶ config.json          (~2KB)   ← Client data
         ├──▶ theme/ivory-gold.css (~5KB)   ← Design tokens
         ├──▶ fonts/cormorant.woff2(~35KB)  ← Typography
         ├──▶ lang/en.json         (~3KB)   ← Language strings
         └──▶ anim/celestial.js    (~20KB)  ← Animation pack
              │
              │ User scrolls to Scene 4+:
              └──▶ music/piano-soft.ogg     ← Audio (lazy, ~100KB)
```

**First Contentful Paint target: < 1.2 seconds on 4G**
**Time to Interactive target: < 2.5 seconds on 3G**

---

## 2. RSVP System Design

### Technology: Supabase (Free tier, no server needed)

Supabase gives us a PostgreSQL database, REST API, real-time subscriptions, and a dashboard — all with a free tier that handles thousands of RSVPs. No backend server to maintain.

### RSVP Data Schema

```sql
Table: rsvps
─────────────────────────────────────────────
id              UUID (auto)
client_id       TEXT          ← "james-mary-2026"
guest_name      TEXT          ← Required
guest_phone     TEXT          ← Optional (WhatsApp follow-up)
guest_email     TEXT          ← Optional
attending       BOOLEAN       ← Yes / No / Maybe
guest_count     INTEGER       ← Number attending (1–5)
meal_pref       TEXT          ← (future: veg / non-veg)
message         TEXT          ← Personal note to couple
submitted_at    TIMESTAMP
device_type     TEXT          ← mobile / desktop
language_used   TEXT          ← en / ta / ml
```

### RSVP Experience Design

The RSVP is **Scene 6** — it must feel as premium as the rest of the invitation.

```
RSVP Flow:

Step 1 — Emotion first
  "Will you celebrate with us?"
  [Yes, we'll be there 🎉]  [Sadly, we can't make it]

Step 2 — Details (if Yes)
  Your name: ___________
  How many guests: [1] [2] [3] [4] [5+]
  Phone (optional): ___________

Step 3 — Personal touch
  "A message for the couple (optional)"
  ________________________________

Step 4 — Confirmation
  Beautiful animated confirmation:
  "We can't wait to see you, [Name]! ✨"
  + Confetti/petal burst animation
```

### Couple's RSVP Dashboard

A separate simple dashboard at `invite.yourdomain.com/admin/james-mary-2026`:
- Total RSVPs received
- Attending count / Declining count
- Guest list (exportable to CSV)
- Real-time updates (Supabase live subscription)
- One-click WhatsApp message to non-respondents (future)

---

## 3. Multi-Language Architecture (i18n)

### Supported Languages (v1)

| Code | Language | Script | Direction |
|---|---|---|---|
| `en` | English | Latin | LTR |
| `ta` | Tamil | Tamil | LTR |
| `ml` | Malayalam | Malayalam | LTR |

### How Language Loading Works

```
1. Browser opens invite URL
2. Bootstrap JS reads: navigator.language → "ta-IN" → loads "ta.json"
3. If no match → falls back to "en.json"
4. Guest can manually switch language (globe icon, top-right)
5. Switch is instant (strings already in memory, only text nodes update)
6. Language preference saved to localStorage for repeat visits
```

### Language File Structure

```json
// lang/en.json
{
  "invitation_to": "Together with their families",
  "couple_tagline": "Two souls, one covenant",
  "ceremony_label": "Holy Matrimony",
  "date_label": "Date",
  "time_label": "Time",
  "venue_label": "Venue",
  "rsvp_headline": "Will you celebrate with us?",
  "rsvp_yes": "Yes, we'll be there",
  "rsvp_no": "Sadly, we can't make it",
  "rsvp_name": "Your name",
  "rsvp_guests": "How many guests",
  "rsvp_message": "A message for the couple",
  "rsvp_submit": "Send with love",
  "rsvp_confirm": "We can't wait to see you",
  "scripture_label": "A verse for the journey",
  "directions": "Get Directions",
  "add_calendar": "Add to Calendar",
  "audio_enable": "Enable music",
  "closing": "We can't wait to celebrate with you"
}
```

### Font Strategy for Indic Scripts

- Tamil and Malayalam require **Noto Serif Tamil** and **Noto Serif Malayalam** from Google Fonts
- These are loaded **only when** the respective language is selected — not by default
- This keeps the default load weight minimal

---

## 4. Scene Analytics System

### What We Track

We track **emotional engagement** — not just page views.

| Event | Trigger | Purpose |
|---|---|---|
| `invitation_opened` | Page load | Reach |
| `experience_started` | Tap to begin (Scene 0→1) | Engagement start |
| `scene_viewed` | Scene enters 80% viewport | Attention depth |
| `audio_enabled` | Guest unmutes music | Emotional engagement |
| `language_switched` | Language icon tapped | Language preference |
| `rsvp_opened` | RSVP scene reached | Conversion intent |
| `rsvp_submitted` | Form submitted | Conversion |
| `rsvp_declined` | No-button pressed | Conversion (negative) |
| `directions_clicked` | Get Directions tapped | High-intent action |
| `calendar_added` | Add to Calendar tapped | High-intent action |
| `invitation_shared` | Share button tapped | Virality |
| `idle_ambient` | 10s of no scroll | Deep engagement |

### Analytics Storage

- Sent to **Supabase** (same project as RSVP) — no third-party analytics SDK
- Privacy-first: **No PII** collected in analytics events
- Couple can see a simple analytics card in their dashboard:
  - "142 people opened your invitation"
  - "97 reached the RSVP section"
  - "68% enabled music"
  - "89 confirmed attendance"

### Engagement Funnel Visualization (Dashboard)

```
Opened invitation     ████████████████████  142
Started experience    █████████████████     118  (83%)
Saw couple's names    ████████████████      110  (77%)
Saw ceremony details  ██████████████         98  (69%)
Reached RSVP          █████████████          91  (64%)
Submitted RSVP         ████████████          89  (62%)
```

---

## 5. Complete Technical Stack

| Layer | Technology | Reason |
|---|---|---|
| Core | Vanilla HTML/CSS/JS | Zero framework overhead, max perf |
| Animations | GSAP (CDN, tree-shakeable) | Industry standard, 60fps on mobile |
| Particle System | Canvas 2D API | No library, raw performance |
| Scroll Engine | Custom (IntersectionObserver + scroll events) | Full control, no library weight |
| Backend | Supabase (free tier) | DB + API + Dashboard, no server |
| Audio | Web Audio API | Native, no library |
| Hosting | Cloudflare Pages (free) | Global CDN, edge caching, free SSL |
| Domain | Custom subdomain | `invite.yourdomain.com` |
| i18n | JSON files + custom loader | No library, <1KB implementation |
| Analytics | Custom → Supabase | Privacy-first, no third-party |
| Fonts | Google Fonts (self-hosted subset) | Fast, GDPR compliant |

---

## 6. File & Folder Architecture

```
/project-root
│
├── /public                        ← Static assets (CDN-served)
│   ├── /fonts                     ← Self-hosted WOFF2 subsets
│   ├── /packs
│   │   ├── /themes
│   │   │   ├── /ivory-gold
│   │   │   │   ├── tokens.css
│   │   │   │   └── meta.json
│   │   │   └── ... (future themes)
│   │   ├── /animations
│   │   │   ├── /celestial
│   │   │   │   ├── celestial.js
│   │   │   │   └── meta.json
│   │   │   └── ... (future packs)
│   │   ├── /typography
│   │   │   └── /serif-classic
│   │   │       └── fonts.css
│   │   ├── /music
│   │   │   └── /piano-soft
│   │   │       ├── track.ogg
│   │   │       ├── track.mp3
│   │   │       └── meta.json
│   │   └── /layouts
│   │       └── /cinematic-scroll
│   │           └── layout.css
│   ├── /modules
│   │   └── /religions
│   │       ├── /christian
│   │       │   ├── symbols.svg
│   │       │   ├── verse-bank.js
│   │       │   └── meta.json
│   │       └── ... (future religions)
│   └── /lang
│       ├── en.json
│       ├── ta.json
│       └── ml.json
│
├── /src                           ← Core engine (compiled/bundled)
│   ├── /engine
│   │   ├── scene-engine.js        ← Scroll → scene state machine
│   │   ├── pack-loader.js         ← Dynamic pack fetcher
│   │   ├── audio-controller.js    ← Web Audio API wrapper
│   │   ├── i18n.js                ← Language loader + string resolver
│   │   └── analytics.js           ← Event tracker → Supabase
│   ├── /components
│   │   ├── scene-arrival.js
│   │   ├── scene-prelude.js
│   │   ├── scene-announcement.js
│   │   ├── scene-story.js
│   │   ├── scene-ceremony.js
│   │   ├── scene-liturgy.js
│   │   ├── scene-rsvp.js
│   │   └── scene-closing.js
│   ├── /rsvp
│   │   ├── rsvp-form.js           ← Form logic + Supabase write
│   │   └── rsvp-confirm.js        ← Post-submit animation
│   └── main.js                    ← Bootstrap: loads config → engine
│
├── /admin                         ← Couple's dashboard (separate app)
│   ├── index.html
│   ├── dashboard.js               ← Supabase real-time RSVP feed
│   └── dashboard.css
│
├── /clients                       ← Per-client config files
│   └── /james-mary-2026
│       └── config.json            ← All client customization here
│
└── index.html                     ← Shell — fetches client config by slug
```

---

## 7. Revised Performance Budget

| Asset | Target Size (gz) | Load Timing |
|---|---|---|
| Shell HTML | ≤ 12KB | Immediate |
| Critical CSS | ≤ 8KB (inlined) | Immediate |
| Bootstrap JS | ≤ 10KB | Immediate |
| Config JSON | ≤ 3KB | After shell |
| Theme CSS | ≤ 6KB | After config |
| Fonts (2 faces) | ≤ 60KB | After theme |
| i18n JSON | ≤ 4KB | After config |
| Animation Pack JS | ≤ 25KB | After fonts |
| Music (OGG) | ≤ 120KB | **On user gesture only** |
| **Total (excluding music)** | **≤ 128KB** | **< 1.5s on 3G** |

---

## 8. Build Phases (Revised)

### Phase 1 — Core Shell & Scene Engine
- Project file structure
- Config JSON schema (finalized)
- CSS design token system (Ivory & Gold theme)
- Scene Engine (scroll controller, scene state machine)
- Scene 0: Arrival (tap to begin)
- Scene 1: Prelude (ambient background, brand reveal)

### Phase 2 — The Emotional Heart
- Scene 2: Announcement (couple's names, light reveal)
- Scene 3: Story (tagline / couple description)
- Scene 4: Ceremony Details (date, time, venue — glassmorphism cards)
- Scene 5: Liturgy / Scripture (Christian module, Bible verse)

### Phase 3 — Conversion & Closing
- Scene 6: RSVP (Supabase integration, multi-step form)
- Scene 7: Closing (ambient farewell)
- Add to Calendar (ICS file generator)
- Get Directions (Maps link)

### Phase 4 — Delight & Immersion
- Canvas particle system
- Web Audio (Music pack loader, fade in/out with scene)
- Gyroscope parallax (mobile)
- Ambient idle state (breathing mode)
- Haptic feedback (Vibration API)
- Progress indicator (thin gold line)

### Phase 5 — Language & Analytics
- i18n loader + en/ta/ml JSON files
- Language switcher UI
- Indic font lazy-loading
- Scene analytics → Supabase
- Couple's dashboard (RSVP + analytics view)

### Phase 6 — Pack System & Extensibility
- Pack loader (dynamic CSS/JS fetching)
- Religion module system
- Second theme implementation
- Documentation for future pack authors

---

> **Ready to build. Awaiting your go-ahead.**
