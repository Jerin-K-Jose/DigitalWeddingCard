# 📦 Pack System Design

> The Pack System is the core extensibility mechanism of the platform.
> Every visual and auditory dimension is swappable without touching logic code.

---

## Philosophy

A **Pack** is a self-contained, versioned bundle that overrides one specific
dimension of the experience. Packs are:

- **Declarative**: They describe what they provide, not what they change
- **Isolated**: A Theme Pack cannot break an Animation Pack
- **Lazy-loaded**: Only fetched when needed for a specific client config
- **Validated**: `meta.json` is schema-checked before pack loads
- **Fallback-safe**: If a pack fails to load, defaults prevent broken experience

---

## Pack Types

| Pack Type | Controls | Key File | Loaded Via |
|---|---|---|---|
| Theme | Colors, shadows, gradients | `tokens.css` | `<link>` injection |
| Animation | Motion behaviors per scene | `index.js` | dynamic `import()` |
| Typography | Fonts, scale overrides | `fonts.css` | `<link>` injection |
| Music | Ambient audio track | `track.ogg` + `track.mp3` | `fetch()` → Web Audio |
| Layout | Page scroll structure | `layout.css` | `<link>` injection |

---

## Pack Directory Structure

```
/public/packs/
│
├── themes/
│   ├── ivory-gold/
│   │   ├── meta.json       ← Pack manifest
│   │   └── tokens.css      ← CSS custom properties
│   ├── blush-rose/
│   ├── midnight-navy/
│   ├── emerald-sage/
│   └── (future)
│
├── animations/
│   ├── celestial/
│   │   ├── meta.json
│   │   └── index.js        ← Exports AnimationPack interface
│   ├── botanical/
│   ├── geometric/
│   ├── cinematic/
│   └── minimal/            ← Accessibility/no-animation fallback
│
├── typography/
│   ├── serif-classic/
│   │   ├── meta.json
│   │   └── fonts.css       ← @font-face declarations
│   ├── modern-editorial/
│   ├── handwritten/
│   ├── devanagari/         ← Hindi/Sanskrit support
│   └── arabic/             ← Arabic/Urdu support
│
├── music/
│   ├── piano-soft/
│   │   ├── meta.json
│   │   ├── track.ogg       ← Primary format (smaller)
│   │   └── track.mp3       ← Fallback format
│   ├── strings-cinematic/
│   ├── acoustic-guitar/
│   ├── carnatic-soft/      ← Indian classical (future)
│   └── nasheed-ambient/    ← Islamic ambient (future)
│
└── layouts/
    ├── cinematic-scroll/
    │   ├── meta.json
    │   └── layout.css
    ├── card-reveal/        ← Envelope → card unfold
    ├── timeline/           ← Horizontal scroll
    └── minimal-clean/      ← No animations
```

---

## meta.json Schema

All packs must have a valid `meta.json`.

```json
{
  "id": "ivory-gold",
  "type": "theme",
  "name": "Ivory & Gold",
  "version": "1.0.0",
  "description": "Classic Christian wedding — deep warm black with antique gold accents",
  "author": "Platform Team",
  "compatibility": {
    "religions": ["christian", "civil"],
    "layouts": ["cinematic-scroll", "card-reveal"]
  },
  "requires": [],
  "files": {
    "primary": "tokens.css"
  },
  "preview": {
    "palette": ["#0d0b08", "#c9a84c", "#f5e6c8"],
    "thumbnail": "preview.jpg"
  }
}
```

---

## Animation Pack API Contract

Every animation pack **must** export this interface:

```javascript
// /public/packs/animations/{pack-name}/index.js

export default {
  // Called when a scene enters the viewport (at 80% threshold)
  // sceneId: string (e.g., 'announcement')
  // el: HTMLElement — the scene's root element
  onSceneEnter(sceneId, el) { },

  // Called when a scene exits the viewport
  onSceneExit(sceneId, el) { },

  // Called once on init — starts the ambient background animation
  // canvas: HTMLCanvasElement — the Layer 1 particle canvas
  // Returns: cleanup function (called on destroy)
  ambientLoop(canvas) {
    // ... particle animation setup
    return () => { /* cleanup: cancel animation frame */ };
  },

  // Reusable text reveal utility
  // chars: NodeList of character <span> elements
  // options: { stagger, duration, ease }
  // Returns: Promise resolving when animation completes
  textReveal(chars, options = {}) { },

  // Word-by-word reveal (for scripture)
  // words: NodeList of word <span> elements
  wordReveal(words, options = {}) { },

  // Line-by-line reveal (for story paragraph)
  lineReveal(lines, options = {}) { },

  // Light burst effect — used for Scene 2 entry
  // Returns: Promise resolving when burst effect completes
  lightBurst() { },

  // Spring card entry — used for ceremony detail cards
  // cards: array of HTMLElements
  // stagger: number (ms between each card)
  cardsSpring(cards, stagger = 200) { },

  // Celebration burst — used for RSVP confirmation
  // origin: { x, y } — in viewport coordinates
  celebrationBurst(origin) { },
}
```

---

## Theme Pack — tokens.css Structure

```css
/* /public/packs/themes/{pack-name}/tokens.css */

/* ─── COLORS ─────────────────────────────────────── */
:root {
  --color-bg: ...;
  --color-bg-raised: ...;
  --color-surface: ...;
  --color-primary: ...;
  --color-secondary: ...;
  --color-muted: ...;
  --color-accent: ...;
  --color-accent-light: ...;
  --color-accent-dark: ...;
  --color-glow: ...;
  --color-glow-strong: ...;
  --color-border: ...;
  --color-border-strong: ...;
  --color-particle: ...;

  /* ─── GRADIENTS ──────────────────────────────────── */
  --gradient-bg: ...;
  --gradient-hero: ...;
  --gradient-card: ...;
  --gradient-light-burst: ...;
  --gradient-top-light: ...;
  --gradient-vignette: ...;

  /* ─── SHADOWS ────────────────────────────────────── */
  --shadow-card: ...;
  --shadow-card-hover: ...;
  --glow-ambient: ...;
  --glow-button: ...;
  --glow-text: ...;
}
```

> A theme pack MUST define every token listed above.
> Missing tokens fall back to platform defaults (base.css).

---

## Pack Loader — Loading Sequence

```javascript
// src/engine/pack-loader.js

async function loadPacks(config) {
  // 1. Validate all pack IDs in config
  await validatePackManifests(config);

  // 2. Critical packs — block render
  await Promise.all([
    loadCSS(`/packs/themes/${config.client.theme}/tokens.css`),
    loadCSS(`/packs/typography/${config.client.typographyPack}/fonts.css`),
    loadCSS(`/packs/layouts/${config.client.layout}/layout.css`),
  ]);

  // 3. Animation pack — load after critical CSS
  const animPack = await import(
    `/packs/animations/${config.client.animationPack}/index.js`
  );

  // 4. Music — ONLY loaded on first user gesture
  // (registered as a lazy callback, not loaded here)

  return { animPack };
}
```

---

## Available Packs — Current & Planned

### Themes

| ID | Name | Aesthetic | Religion fit | Status |
|---|---|---|---|---|
| `ivory-gold` | Ivory & Gold | Classic, regal, warm | Christian, Civil | ✅ v1 |
| `blush-rose` | Blush Rose | Romantic, feminine | Christian, Civil | 🔲 v2 |
| `midnight-navy` | Midnight Navy | Modern luxury, dark | Civil | 🔲 v2 |
| `emerald-sage` | Emerald Sage | Nature, garden | Christian, Civil | 🔲 v3 |
| `saffron-red` | Saffron & Red | Vibrant, festive | Hindu | 🔲 v3 |
| `green-gold` | Emerald & Gold | Elegant, traditional | Muslim | 🔲 v4 |

### Animation Packs

| ID | Name | Style | Status |
|---|---|---|---|
| `celestial` | Celestial | Light rays, divine glow, gold particles | ✅ v1 |
| `botanical` | Botanical | Petals, leaves, soft nature | 🔲 v2 |
| `geometric` | Geometric | Clean lines, modern luxury | 🔲 v2 |
| `cinematic` | Cinematic | Film grain, letterbox | 🔲 v3 |
| `minimal` | Minimal | No animation — accessibility | ✅ v1 (fallback) |

### Music Packs

| ID | Name | Genre | Duration | Status |
|---|---|---|---|---|
| `piano-soft` | Soft Piano | Classical piano | 60s loop | ✅ v1 |
| `strings-cinematic` | Cinematic Strings | Orchestral | 60s loop | 🔲 v2 |
| `acoustic-guitar` | Acoustic Guitar | Intimate | 60s loop | 🔲 v2 |
| `carnatic-soft` | Carnatic Ambient | Indian classical | 60s loop | 🔲 v3 |
