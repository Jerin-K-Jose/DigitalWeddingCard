# 🎨 Design System — Ivory & Gold Theme

> Theme: `ivory-gold` | Pack path: `/public/packs/themes/ivory-gold/`

---

## Color Palette

| Token | Value | Usage |
|---|---|---|
| `--color-bg` | `#0d0b08` | Page background — deep cinematic black |
| `--color-bg-raised` | `#1a1710` | Slightly lighter surface (scene variation) |
| `--color-surface` | `rgba(26, 23, 16, 0.70)` | Glassmorphism card background |
| `--color-primary` | `#f5e6c8` | Primary text — warm cream |
| `--color-secondary` | `#c4b08a` | Secondary text — aged parchment |
| `--color-muted` | `#7a6a4a` | Labels, captions, placeholders |
| `--color-accent` | `#c9a84c` | Antique gold — highlights, borders, CTAs |
| `--color-accent-light` | `#f0d080` | Light gold — hover states, glows |
| `--color-accent-dark` | `#8a6e2a` | Dark gold — pressed states |
| `--color-glow` | `rgba(201, 168, 76, 0.25)` | Gold ambient glow |
| `--color-glow-strong` | `rgba(201, 168, 76, 0.50)` | Hover / focus glow |
| `--color-white` | `rgba(255, 255, 255, 0.04)` | Subtle highlight on dark surfaces |
| `--color-border` | `rgba(201, 168, 76, 0.18)` | Card / divider borders |
| `--color-border-strong` | `rgba(201, 168, 76, 0.40)` | Focus / active borders |
| `--color-particle` | `rgba(201, 168, 76, 0.30)` | Particle dots |
| `--color-overlay-black` | `rgba(13, 11, 8, 0.80)` | Overlay / scrim |

---

## Gradient Tokens

```css
--gradient-bg: linear-gradient(180deg, #0d0b08 0%, #1a1410 50%, #0d0b08 100%);
--gradient-hero: radial-gradient(ellipse 80% 60% at 50% 40%, rgba(201,168,76,0.12) 0%, transparent 70%);
--gradient-card: linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(201,168,76,0.03) 100%);
--gradient-light-burst: radial-gradient(ellipse at center, rgba(255,255,255,0.95) 0%, rgba(245,230,200,0.6) 30%, transparent 70%);
--gradient-top-light: linear-gradient(180deg, rgba(201,168,76,0.08) 0%, transparent 40%);
--gradient-vignette: radial-gradient(ellipse at center, transparent 50%, rgba(13,11,8,0.8) 100%);
```

---

## Typography System

### Font Families

```css
--font-display: 'Cormorant Garamond', 'Georgia', serif;
--font-body: 'Lato', 'Helvetica Neue', sans-serif;
```

### Type Scale (Fluid — clamp-based)

```css
/* Display — Couple's Names */
--text-display:    clamp(2.5rem, 7vw, 6.5rem);

/* Heading 1 — Scene titles */
--text-h1:         clamp(2rem, 4.5vw, 4rem);

/* Heading 2 — Card titles, verse reference */
--text-h2:         clamp(1.4rem, 2.5vw, 2.2rem);

/* Body Large — Story paragraph, verse text */
--text-body-lg:    clamp(1.1rem, 1.6vw, 1.5rem);

/* Body — Details, descriptions */
--text-body:       clamp(0.95rem, 1.2vw, 1.1rem);

/* Small — Labels, captions, tags */
--text-small:      0.8rem;

/* Micro — Letter-spaced tags */
--text-micro:      0.7rem;
```

### Font Weight Tokens

```css
--weight-thin:    300;
--weight-regular: 400;
--weight-medium:  500;
```

### Letter Spacing Tokens

```css
--tracking-tight:  -0.02em;
--tracking-normal:  0em;
--tracking-wide:    0.08em;
--tracking-wider:   0.16em;
--tracking-widest:  0.28em;
```

### Line Height Tokens

```css
--leading-tight:  1.15;
--leading-normal: 1.5;
--leading-relaxed: 1.75;
--leading-loose:  2.0;
```

---

## Spacing Scale

```css
--space-1:   4px;
--space-2:   8px;
--space-3:   12px;
--space-4:   16px;
--space-5:   20px;
--space-6:   24px;
--space-8:   32px;
--space-10:  40px;
--space-12:  48px;
--space-16:  64px;
--space-20:  80px;
--space-24:  96px;
--space-32:  128px;
```

---

## Border Radius

```css
--radius-sm:   8px;
--radius-md:   12px;
--radius-lg:   16px;
--radius-xl:   24px;
--radius-full: 9999px;
```

---

## Shadow & Glow System

```css
/* Card shadow */
--shadow-card: 0 8px 40px rgba(0, 0, 0, 0.4),
               0 0 0 1px rgba(201, 168, 76, 0.12);

/* Card hover */
--shadow-card-hover: 0 12px 60px rgba(0, 0, 0, 0.5),
                     0 0 0 1px rgba(201, 168, 76, 0.25),
                     0 0 30px rgba(201, 168, 76, 0.12);

/* Gold glow — ambient */
--glow-ambient: 0 0 60px rgba(201, 168, 76, 0.15);

/* Gold glow — button hover */
--glow-button: 0 0 20px rgba(201, 168, 76, 0.40),
               0 4px 16px rgba(0, 0, 0, 0.30);

/* Text glow — couple's names */
--glow-text: 0 0 40px rgba(201, 168, 76, 0.30);

/* Inner light — light burst effect */
--glow-burst: 0 0 120px rgba(255, 248, 220, 0.60);
```

---

## Motion System

### Easing Curves

```css
/* Primary — smooth spring (most transitions) */
--ease-spring:   cubic-bezier(0.16, 1, 0.3, 1);

/* Entry — elements arriving on screen */
--ease-entry:    cubic-bezier(0.0, 0.0, 0.2, 1);

/* Exit — elements leaving screen */
--ease-exit:     cubic-bezier(0.4, 0.0, 1, 1);

/* Gentle — ambient / breathing animations */
--ease-gentle:   cubic-bezier(0.45, 0.05, 0.55, 0.95);

/* Bounce — RSVP confirmation celebration */
--ease-bounce:   cubic-bezier(0.34, 1.56, 0.64, 1);
```

### Duration Tokens

```css
--duration-instant:  100ms;   /* Micro feedback (hover bg) */
--duration-fast:     200ms;   /* Button states, icon swaps */
--duration-normal:   400ms;   /* Element reveals, fades */
--duration-slow:     800ms;   /* Scene transitions */
--duration-cinematic:1400ms;  /* Full scene fades, name reveals */
--duration-ambient:  3000ms;  /* Breathing, idle animations */
```

### Stagger Intervals

```css
--stagger-char:  80ms;   /* Per-character name reveal */
--stagger-word:  100ms;  /* Per-word verse reveal */
--stagger-line:  200ms;  /* Per-line story reveal */
--stagger-card:  200ms;  /* Card sequence */
```

---

## Z-Index System

```css
--z-background:   0;
--z-particles:    1;
--z-scene:        10;
--z-decorative:   20;
--z-content:      30;
--z-ui-chrome:    100;
--z-modal:        200;
--z-overlay:      300;
--z-burst:        400;   /* Light burst effect on top of everything */
```

---

## Glassmorphism Card Recipe

```css
.card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  backdrop-filter: blur(12px) saturate(1.2);
  -webkit-backdrop-filter: blur(12px) saturate(1.2);
  box-shadow: var(--shadow-card);
  transition: box-shadow var(--duration-normal) var(--ease-spring),
              border-color var(--duration-normal) var(--ease-spring);
}

.card:hover {
  box-shadow: var(--shadow-card-hover);
  border-color: var(--color-border-strong);
}
```

---

## Button System

### Primary CTA (Gold)
```css
.btn-primary {
  background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-light) 100%);
  color: #0d0b08;
  font-family: var(--font-body);
  font-size: var(--text-small);
  font-weight: var(--weight-medium);
  letter-spacing: var(--tracking-wider);
  text-transform: uppercase;
  padding: var(--space-4) var(--space-8);
  border-radius: var(--radius-full);
  border: none;
  box-shadow: var(--glow-button);
  transition: all var(--duration-fast) var(--ease-spring);
}
.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 30px rgba(201,168,76,0.6), 0 8px 24px rgba(0,0,0,0.4);
}
.btn-primary:active {
  transform: translateY(0);
}
```

### Ghost / Secondary
```css
.btn-ghost {
  background: transparent;
  color: var(--color-accent);
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-full);
  padding: var(--space-4) var(--space-8);
  letter-spacing: var(--tracking-wider);
  font-size: var(--text-small);
  text-transform: uppercase;
  transition: all var(--duration-fast) var(--ease-spring);
}
.btn-ghost:hover {
  background: rgba(201,168,76,0.08);
  border-color: var(--color-accent);
}
```

---

## Ornamental Divider

```css
.divider {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  color: var(--color-muted);
  font-size: var(--text-micro);
  letter-spacing: var(--tracking-widest);
  text-transform: uppercase;
}
.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--color-accent), transparent);
  opacity: 0.4;
}
```

---

## Accessibility Overrides

```css
/* Respect OS reduced motion setting — full animation fallback */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  /* Particles canvas: hidden entirely */
  .particle-canvas { display: none; }
}

/* High contrast mode support */
@media (forced-colors: active) {
  .card { border: 1px solid ButtonText; }
  .btn-primary { background: ButtonText; color: ButtonFace; }
}
```
