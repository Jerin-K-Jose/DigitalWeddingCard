# 🎬 Experience Design v2 — Unified 10-Scene Blueprint

> **Version 2** — Merged from Antigravity architecture + ChatGPT PDF reference.
> This supersedes `03_EXPERIENCE_DESIGN.md` for the final build.
> Source of truth for scene order, content, and animation intent.

---

## Unified Scene Flow

```
╭──────────────────────────────╮
│ 01. LOADING                  │
│ Logo · Particles · Preload   │
╰──────────────┬───────────────╯
               │
               ▼
╭──────────────────────────────╮
│ 02. ENVELOPE                 │  ← Signature moment
│ Wax seal · Tap to open       │
╰──────────────┬───────────────╯
               │
               ▼
╭──────────────────────────────╮
│ 03. HERO / ANNOUNCEMENT      │
│ Names · Date · Family line   │
╰──────────────┬───────────────╯
               │
               ▼
╭──────────────────────────────╮
│ 04. STORY                    │
│ Couple's journey · Poetry    │
╰──────────────┬───────────────╯
               │
               ▼
╭──────────────────────────────╮
│ 05. BIBLE VERSE / LITURGY    │
│ Cross · Scripture animation  │
╰──────────────┬───────────────╯
               │
               ▼
╭──────────────────────────────╮
│ 06. TIMELINE                 │
│ Ceremony → Reception → Dinner│
╰──────────────┬───────────────╯
               │
               ▼
╭──────────────────────────────╮
│ 07. VENUE                    │
│ Church · Map · Directions    │
╰──────────────┬───────────────╯
               │
               ▼ (only if config.media.photoGallery.length > 0)
╭──────────────────────────────╮
│ 07b. GALLERY (conditional)   │
│ Cinematic · Polaroid layout  │
╰──────────────┬───────────────╯
               │
               ▼
╭──────────────────────────────╮
│ 08. COUNTDOWN                │
│ Days · Hours · Minutes · Sec │
╰──────────────┬───────────────╯
               │
               ▼
╭──────────────────────────────╮
│ 09. RSVP                     │
│ 3-step form · Supabase       │
╰──────────────┬───────────────╯
               │
               ▼
╭──────────────────────────────╮
│ 10. CLOSING / BLESSING       │
│ Thank you · Share · Idle     │
╰──────────────────────────────╯
```

---

## Scene 01 — LOADING

| | |
|---|---|
| **Purpose** | Preload assets silently, create first impression |
| **Emotion** | Calm, anticipation |
| **Duration** | 1.5–2.5 seconds (asset-dependent) |
| **Background** | Pure `#0d0b08` — cinematic black |
| **Content** | Tiny cross/logo centered, soft golden particles |
| **Logo treatment** | 40px cross SVG, `rgba(201,168,76,0.6)`, slow breathing pulse |
| **Particles** | 40 gold dust motes, slow upward drift, Canvas 2D |
| **Loading bar** | None visible. Progress tracked silently. |
| **Audio** | Silent. AudioContext pre-initialized. |
| **Transition out** | When assets ≥ 80% loaded: fade particles up, cross scales down → Scene 02 blooms |
| **Perf note** | Canvas on GPU layer. Zero DOM writes during load. |

---

## Scene 02 — ENVELOPE

| | |
|---|---|
| **Purpose** | The signature moment. Create delight and anticipation. |
| **Emotion** | Wonder, excitement, surprise |
| **Duration** | Holds until user taps. No auto-advance. |
| **Background** | Deep warm black, subtle vignette |

### Visual Design
- **Envelope**: Centered, ~60vw wide (max 400px). Cream/ivory color (`#f0e8d5`).
  Paper texture via CSS (subtle noise or gradient).
- **Wax Seal**: Circular, deep crimson-gold (`#8b2020` to `#c9a84c` gradient).
  Embossed cross monogram. Soft outer glow.
- **Label**: Small text below envelope — `"Tap to open"` in Lato Light, letter-spaced, muted

### Animation Sequence on Tap

```
1. Wax seal cracks (subtle CSS transform + opacity flash)  — 200ms
2. Envelope flap lifts (rotateX from bottom — 3D CSS)     — 600ms, ease-out
3. Card rises from inside envelope (translateY upward)     — 800ms, spring ease
4. Card expands to fill viewport                           — 600ms, scale + opacity
5. Scene 03 content fades in over expanded card            — 400ms
```

### CSS 3D Notes
```
.envelope { transform-style: preserve-3d; perspective: 800px; }
.envelope-flap { transform-origin: top center; /* rotateX(0) → rotateX(-180deg) */ }
.invitation-card { position: absolute; bottom: 10%; z-index: 10; }
```

| | |
|---|---|
| **Interaction** | Single tap/click anywhere on envelope or seal |
| **Haptic** | 15ms vibration on tap (mobile) |
| **Transition out** | Card expands → becomes Scene 03 background |
| **Accessibility** | Keyboard: Enter/Space triggers open. Focus ring on envelope. |

---

## Scene 03 — HERO / ANNOUNCEMENT

| | |
|---|---|
| **Purpose** | The emotional peak — couple's names revealed |
| **Emotion** | Joy, awe, celebration |
| **Scroll range** | 15% – 30% |
| **Entry** | Light-burst flash (200ms) → scene blooms |

### Layout (mobile-first, centered)
```
─────────────────────────────────
  Together with their families,

  Mr. & Mrs. Robert Johnson
  and Mr. & Mrs. Thomas George
  request the honour of your
  presence at the marriage of

          JAMES
            &
          MARY

     October 18, 2026
─────────────────────────────────
```

### Typography Spec
- Family invitation wording: Lato Light 300, 13px, `letter-spacing: 0.15em`, muted cream, centered
- "Together with their families" line: same, slightly italic if desired
- **JAMES / MARY**: Cormorant Garamond Light 300, fluid 5–8vw, gold glow text shadow
- **&**: Cormorant Garamond, 1.3x size, `--color-accent` gold, reveals after both names
- **Date**: Lato Light, 15px, `letter-spacing: 0.2em`, cream, appears 600ms after names

### Animation
1. Family wording fades in first (opacity 0→1, 600ms) — sets formal tone
2. Names: per-character stagger reveal (80ms per letter, translateY 20px→0, opacity 0→1)
3. Ampersand: scale 0.8→1 + opacity, after both names complete
4. Date slides in from below (translateY 30px→0, 400ms after ampersand)
5. Radial gold glow builds behind names during reveal

### Haptics
- 12ms vibration pulse as names fully appear (mobile only)

---

## Scene 04 — STORY

| | |
|---|---|
| **Purpose** | Humanize the couple. Add poetic depth. |
| **Emotion** | Tenderness, intimacy |
| **Scroll range** | 30% – 42% |
| **Content** | 2–3 line poetic paragraph from `config.couple.story` |
| **Typography** | Cormorant Garamond Italic, fluid 1.4–2vw, centered, cream |
| **Animation** | Line-by-line reveal: each line fades in + rises 20px as it enters range |
| **Vignette** | Edges darken slightly — intimacy effect |

**Example content:**
> "Two hearts shaped by grace, drawn together by love.
> On this day, they choose each other — before God,
> before family, before the world."

---

## Scene 05 — BIBLE VERSE / LITURGY

| | |
|---|---|
| **Purpose** | Spiritual grounding. Faith through beauty. |
| **Emotion** | Reverence, peace, holiness |
| **Scroll range** | 42% – 55% |
| **Background** | Faint warm light from top (CSS gradient) |

### Layout
```
              ✝

    ───────────────────

         Ruth 1:16

  "Where you go, I will go;
   where you stay, I will stay."

    ───────────────────
    A verse for the journey
```

### Animation
1. Cross SVG fades in top-center (1.5s, low opacity → 0.4)
2. Verse reference appears (fade, 600ms)
3. Word-by-word reveal of verse text (100ms per word, ease-out fade + tiny rise)
4. Divider lines draw in from center outward (CSS width 0→100%)
5. "A verse for the journey" label fades last

---

## Scene 06 — TIMELINE

| | |
|---|---|
| **Purpose** | Show the wedding day flow — practical + beautiful |
| **Emotion** | Anticipation, excitement |
| **Scroll range** | 55% – 68% |

### Visual Design
```
MOBILE (vertical timeline):

  ●── 10:00 AM ──────────────────
  │   Holy Matrimony
  │   St. Thomas Cathedral
  │
  ●── 6:00 PM ───────────────────
  │   Reception
  │   Grand Ballroom, Taj Hotel
  │
  ●── 8:00 PM ───────────────────
      Dinner
      Grand Ballroom, Taj Hotel

DESKTOP (horizontal timeline):
  ●──────────●──────────●
  10AM       6PM        8PM
  Ceremony   Reception  Dinner
```

- Timeline line: `--color-accent` gold, 1px
- Dots: `--color-accent` gold circles, 8px, soft glow
- Event cards: glassmorphism, slide in with spring animation
- Stagger: 200ms between each event entry
- Icons: dove (ceremony), glass (reception), plate (dinner) — inline SVG

---

## Scene 07 — VENUE

| | |
|---|---|
| **Purpose** | Where — delivered with visual elegance |
| **Emotion** | Anticipation, clarity |
| **Scroll range** | 68% – 78% |

### Layout
```
╔══════════════════════════════╗
║  🕊️  CHURCH                  ║
║  St. Thomas Cathedral        ║
║  Cathedral Road, Chennai     ║
║                              ║
║  [════ Map Preview ════]     ║  ← Static map image or embed
║                              ║
║      [ Get Directions → ]   ║
╚══════════════════════════════╝

(if reception venue differs:)
╔══════════════════════════════╗
║  🥂  RECEPTION VENUE         ║
║  Grand Ballroom, Taj Hotel   ║
║  Mount Road, Chennai         ║
║      [ Get Directions → ]   ║
╚══════════════════════════════╝
```

**Map**: Google Static Maps API image (free tier, no JS required) or
fallback to a styled placeholder image with "Open in Maps" link.

---

## Scene 07b — GALLERY (Conditional)

**Renders only if `config.media.photoGallery.length > 0`**

| | |
|---|---|
| **Purpose** | Share beautiful memories / engagement photos |
| **Emotion** | Joy, warmth |
| **Layout** | Polaroid-style cards, slight rotation, scattered feel |
| **Animation** | Cards fan in from center with spring physics, staggered 150ms |
| **Images** | Lazy-loaded. Aspect ratio preserved. |
| **Performance** | Max 6 photos recommended. WebP format. |

---

## Scene 08 — COUNTDOWN

| | |
|---|---|
| **Purpose** | Build urgency and excitement. Make the date feel real. |
| **Emotion** | Anticipation, excitement, joy |
| **Scroll range** | 78% – 86% |
| **Content** | Live countdown to `config.ceremony.dateISO` |

### Visual Design
```
  The celebration begins in

   23    :    14    :    06    :    47
  DAYS       HRS       MIN       SEC

       October 18, 2026
```

- Digits: Cormorant Garamond, large (fluid 4–6vw), gold
- Labels: Lato Light, micro size, `letter-spacing: 0.3em`, muted
- Separator colons: pulse animation (opacity 1→0.3, 1s loop)
- Update: `requestAnimationFrame` (not `setInterval`) for 60fps tick
- On wedding day: replace with celebratory message ("Today is the day! 🎊")
- After wedding: replace with "Thank you for celebrating with us! 🤍"

---

## Scene 09 — RSVP

| | |
|---|---|
| **Purpose** | Convert emotion into action |
| **Emotion** | Warmth, inclusiveness, belonging |
| **Scroll range** | 86% – 96% |

**[See `07_RSVP_AND_BACKEND.md` for full RSVP UX flow and Supabase schema]**

Key beats:
- Music rises to 70% on "Yes" selection
- Step 1: Yes/No animated buttons
- Step 2: Name + guest count chips + phone
- Step 3: Personal message
- Confirmation: petal/confetti Canvas burst + "We can't wait to see you, [Name]!"
- Decline: compassionate "You'll be missed" message

---

## Scene 10 — CLOSING / BLESSING

| | |
|---|---|
| **Purpose** | Leave a feeling, not just a page |
| **Emotion** | Gratitude, warmth, love |
| **Scroll range** | 96% – 100% |

### Content
```
          ✝

  We can't wait to celebrate with you.

       James & Mary

    [ Share this invitation ]
```

- Bokeh: 5–8 soft glowing orbs (CSS `radial-gradient`, slow drift animation)
- Text: slow fade-in (1400ms), breathing scale animation
- Share button: Web Share API → fallback: copy URL to clipboard
- After 10s idle: ambient mode (particles slow, music fades to 20%, title cycles)

---

## Interaction Model Summary

| Interaction | Behavior |
|---|---|
| Scroll (vertical) | Primary — drives all scene transitions |
| Touch / tap | Scene 01 (hold to start), Scene 02 (open envelope) |
| Gyroscope (mobile) | ±15px parallax on decorative layers |
| Hover (desktop) | Depth reveal on cards, micro-glow on names |
| Idle > 10s (Scene 10) | Ambient breathing mode |
| First tap anywhere | Unlocks Web Audio (Safari/iOS compliance) |
| Back to top | Experience restarts from Scene 01 |
