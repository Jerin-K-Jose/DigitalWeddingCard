# 🎬 Experience Design — Scene-by-Scene Blueprint

> This document is the **creative director's brief** for every scene.
> It defines purpose, emotion, content, animations, and transitions.

---

## Interaction Model

| Interaction | Behavior |
|---|---|
| Vertical Scroll | Primary navigation — drives all scene transitions |
| Touch / Click | Advances scenes on mobile (tap zones) |
| Gyroscope (mobile) | Subtle parallax depth on decorative elements (±15px) |
| Hover (desktop) | Reveals depth layers, micro-details |
| Idle (>10 seconds) | Invitation enters ambient breathing mode |
| First Tap | Unlocks Web Audio API (Safari/iOS compliance) |

---

## Scene 0 — THE ARRIVAL

| | |
|---|---|
| **Purpose** | Create intrigue. Silence before the storm. |
| **Emotion** | Anticipation, reverence |
| **Duration** | Holds until user taps — no auto-advance |
| **Background** | Pure near-black (`#0d0b08`) |
| **Content** | "Tap to begin" text, centered |
| **Typography** | Lato Light 300, 13px, letter-spacing 0.3em, muted cream |
| **Animation** | Text fades in after 1.5s delay. Subtle breathing pulse (scale 1.0 → 1.005, loop 3s) |
| **Audio** | Silent. Audio context pre-initialized but not playing. |
| **Transition Out** | Click/tap → smooth fade to Scene 1 (600ms) |

**Design note**: This scene is intentionally minimal. The emptiness creates weight.
The longer a guest waits before tapping, the more meaningful the reveal feels.

---

## Scene 1 — THE PRELUDE

| | |
|---|---|
| **Purpose** | Set the world. Establish the visual language. |
| **Emotion** | Wonder, warmth |
| **Scroll Range** | 0% – 15% |
| **Background** | Deep warm dark gradient: `#0d0b08` → `#1a1410` |
| **Content** | Ambient particles, soft cross symbol (SVG, very low opacity ~0.06) |
| **Typography** | None — this scene breathes |
| **Animation** | Fade in from black (800ms). Particles begin: 50 gold dust motes drifting upward. Cross SVG fades in slowly (2s). |
| **Audio** | Piano track begins: fade in from 0 → 40% volume over 3s |
| **Transition Out** | Scroll drives gradual opacity shift as Scene 2 emerges |

**Design note**: The cross at near-invisible opacity is subliminal — not explicitly religious yet.
This respects non-Christian guests while honoring the faith context.

---

## Scene 2 — THE ANNOUNCEMENT

| | |
|---|---|
| **Purpose** | The emotional peak. The reveal of the couple. |
| **Emotion** | Joy, awe, celebration |
| **Scroll Range** | 15% – 30% |
| **Background** | Same dark base + intensified ambient glow (radial, gold, centered) |
| **Content** | Couple's names + tagline |
| **Typography** | Cormorant Garamond Light 300, fluid 5–8vw |
| **Layout** | Centered, vertically stacked: `[Groom Name]` / `&` / `[Bride Name]` / tagline |
| **Animation** | Entry: **light-burst** transition (white flash 200ms → dissolve). Names: per-character reveal, 80ms stagger per letter. Ampersand: gold, 1.2x scale, reveals after both names. Tagline: fades in 400ms after ampersand. |
| **Audio** | Music swells to 70% volume on entry |
| **Haptics** | 12ms vibration pulse as names fully reveal |
| **Transition Out** | Names gently fade as user scrolls into Scene 3 |

**Typography detail**:
```
JAMES
  &
MARY
────────────────
Two souls, one covenant
```

---

## Scene 3 — THE STORY

| | |
|---|---|
| **Purpose** | Humanize the couple. Add poetic depth. |
| **Emotion** | Tenderness, intimacy |
| **Scroll Range** | 30% – 42% |
| **Background** | Subtle texture shift — vignette deepens at edges |
| **Content** | 2–3 line poetic paragraph from config |
| **Typography** | Cormorant Garamond Italic, 1.4–2vw fluid, centered, cream |
| **Animation** | Line-by-line reveal: each line fades in + translates up 20px as it enters scroll range |
| **Audio** | Music at 60% — steady, intimate |
| **Transition Out** | Story lines fade, Scene 4 cards begin rising from below |

**Content example**:
> "Two hearts shaped by grace, drawn together by love.  
> On this day, they choose each other — before God,  
> before family, before the world."

---

## Scene 4 — THE CEREMONY DETAILS

| | |
|---|---|
| **Purpose** | Practical information, delivered with grace |
| **Emotion** | Anticipation, excitement |
| **Scroll Range** | 42% – 58% |
| **Background** | Same base — cards create focal point |
| **Content** | Ceremony card + Reception card (if enabled) |
| **Animation** | Cards spring in from below: `translateY(60px)` → `0` with `cubic-bezier(0.16, 1, 0.3, 1)`, staggered 200ms |
| **Audio** | Music steady at 60% |

### Card Design Spec

```
╔═══════════════════════════════════════╗
║  🕊️  HOLY MATRIMONY                   ║  ← Label (small caps, muted)
║                                       ║
║  October 18, 2026                     ║  ← Date (Cormorant, gold)
║  10:00 AM                             ║  ← Time (Lato Light)
║                                       ║
║  St. Thomas Cathedral                 ║  ← Venue name (bold)
║  Cathedral Road, Chennai              ║  ← Address (muted, small)
║                                       ║
║  Dress Code: Formal                   ║  ← (muted label)
║                          [ Directions →]  ← CTA
╚═══════════════════════════════════════╝

Card style:
  background: rgba(26, 23, 16, 0.7)
  border: 1px solid rgba(201, 168, 76, 0.2)
  border-radius: 16px
  backdrop-filter: blur(12px)
  box-shadow: 0 0 40px rgba(201, 168, 76, 0.08)
  padding: 32px
```

---

## Scene 5 — THE LITURGY

| | |
|---|---|
| **Purpose** | Spiritual grounding. Faith expressed through beauty. |
| **Emotion** | Reverence, peace, holiness |
| **Scroll Range** | 58% – 70% |
| **Background** | Faint warm light from above (CSS gradient, top → transparent) |
| **Content** | Bible verse reference + text |
| **Typography** | Verse ref: Lato Regular, 12px, letter-spacing 0.25em, muted. Verse text: Cormorant Garamond Italic, 1.4–1.8vw, cream |
| **Animation** | Cross SVG fades in top-center (more visible than Scene 1). Verse reference appears. Then word-by-word reveal of verse (100ms per word, ease-out fade + tiny translateY) |
| **Audio** | Music fades to 40% — creates meditative space |
| **Decorative** | Thin ornamental line dividers (CSS, gold, `opacity: 0.3`) |
| **Transition Out** | Scene fades, darkness deepens before RSVP |

**Content example**:
```
                      ✝
              ───────────────

              Ruth 1:16

  "Where you go, I will go;
   where you stay, I will stay."

              ───────────────
```

---

## Scene 6 — THE RSVP

| | |
|---|---|
| **Purpose** | Convert the emotion into action |
| **Emotion** | Warmth, inclusiveness, celebration |
| **Scroll Range** | 70% – 88% |
| **Background** | Slightly warmer — gold glow intensifies (celebratory) |
| **Content** | RSVP headline + multi-step form |

### RSVP Interaction Flow

```
Step 1 — Decision
  "Will you celebrate with us?"
  [Yes, we'll be there 🎉]     [Sadly, we can't make it]
   Gold glow on hover          Subtle, muted style

Step 2 — Details (if Yes selected)
  Your name: [                    ]
  Guests:    [1]  [2]  [3]  [4]  [5+]   ← Toggle chips
  Phone:     [                    ]  (optional)

Step 3 — Personal touch
  "A message for James & Mary (optional)"
  [                                    ]
  [Send with love  →]   ← Gold CTA button

Confirmation State:
  Confetti / petal burst animation (Canvas)
  "We can't wait to see you, [Name]! ✨"
  + "Add to Calendar" button appears here
```

**Audio**: Music rises back to 70% — celebratory energy returns on Yes selection

---

## Scene 7 — THE CLOSING

| | |
|---|---|
| **Purpose** | Leave a feeling, not just a page |
| **Emotion** | Gratitude, warmth, love |
| **Scroll Range** | 88% – 100% |
| **Background** | Soft ambient bokeh (CSS radial gradients, animated) |
| **Content** | Final line + share button |
| **Typography** | Cormorant Garamond Light, centered, cream |
| **Animation** | Fade in slow (1400ms). Soft breathing animation on text. Bokeh orbs drift slowly. |
| **Audio** | Music fades to 30%, sustains indefinitely |

**Content**:
```
We can't wait to celebrate with you.

           James & Mary

        [Share this invitation]
```

---

## Scene ∞ — AMBIENT IDLE STATE

Triggered when: guest has been on Scene 7 for >10 seconds without interaction.

- Particles continue slow drift
- Music sustains at 20% (almost subliminal)
- Page title cycles: `"James & Mary · Oct 18 · 🕊️"` → `"James & Mary · We're getting married!"` → loop
- If guest scrolls again, ambient mode exits gracefully
