# ⚡ Performance Architecture

> Performance is the highest priority.
> The experience must feel smooth on basic Android smartphones.
> Target: 60fps. No jank. Ever.

---

## Performance Budget

| Asset | Target (gzipped) | Load Timing |
|---|---|---|
| Shell HTML | ≤ 12KB | Immediate |
| Critical CSS (inlined) | ≤ 8KB | Immediate (no render block) |
| Bootstrap JS | ≤ 10KB | Immediate (defer) |
| Config JSON | ≤ 3KB | After shell |
| Theme tokens CSS | ≤ 6KB | After config |
| Fonts — 2 faces (WOFF2) | ≤ 60KB | After theme |
| Language JSON | ≤ 4KB | After config |
| Animation Pack JS | ≤ 25KB | After fonts |
| GSAP (CDN) | ≤ 30KB | Deferred (Scene 2+) |
| Music (OGG) | ≤ 120KB | **On first user gesture only** |
| **Total excl. music** | **≤ 128KB** | **< 1.5s on 3G** |
| **Total incl. music** | **≤ 248KB** | Music deferred |

---

## Target Performance Metrics

| Metric | Target | Tool |
|---|---|---|
| First Contentful Paint (FCP) | < 1.2s (4G) | Lighthouse |
| Largest Contentful Paint (LCP) | < 2.0s (4G) | Lighthouse |
| Time to Interactive (TTI) | < 2.5s (3G) | Lighthouse |
| Cumulative Layout Shift (CLS) | < 0.05 | Lighthouse |
| Total Blocking Time (TBT) | < 150ms | Lighthouse |
| Animation frame rate | 60fps sustained | Chrome DevTools |
| Frame budget per animation | < 16.6ms | Performance tab |
| Memory (mobile) | < 60MB peak | Chrome DevTools |

---

## Strategy 1: Progressive Loading Waterfall

```
T=0ms    HTML shell received, parsing begins
T=~50ms  Critical CSS (inlined) applied — first paint is already correct
T=~100ms Bootstrap JS executes: reads URL slug → fetches config.json
T=~200ms Config loaded: initiates parallel fetch of theme + lang + fonts
T=~500ms Theme tokens applied: correct colors visible
T=~600ms Fonts loaded (WOFF2, 2 subsets): typography snaps in
T=~800ms Animation pack loaded: Scene 0 activates (Arrival)
T=?      User taps → Scene 1 begins → GSAP loaded on demand
T=gesture Music loaded only after user enables audio
```

No asset blocks another unnecessarily. Every fetch is fire-and-forget
with graceful fallbacks until it resolves.

---

## Strategy 2: CSS-First Animation

Wherever possible, use CSS transitions/animations instead of JS.

| Animation | Method | Why |
|---|---|---|
| Scene fade in/out | `opacity` CSS transition | GPU composite only |
| Card slide in | `transform: translateY` CSS | GPU composite only |
| Progress bar | `width` CSS transition + lerped JS value | Single DOM write/frame |
| Particle system | Canvas 2D (RAF) | Off-DOM, GPU composited |
| Name character reveal | CSS `animation` with staggered `animation-delay` | No JS per frame |
| Breathing pulse | `@keyframes` | Zero JS runtime cost |
| Button hover | CSS `:hover` pseudo | No JS at all |

**Rule**: Only use JS animation (GSAP / rAF) for sequences that require:
- Scroll-linked progress (can't do in CSS)
- Physics/spring dynamics
- Canvas-based effects
- Multi-element coordinated timing

---

## Strategy 3: Rendering Isolation

```css
/* Each scene is an isolated paint zone */
.scene {
  contain: layout style paint;
  /* Changes inside this scene do NOT cause repaint outside it */
}

/* Composited layers — GPU-handled, no repaint */
.particle-canvas,
.decorative-overlay {
  will-change: transform;
  transform: translateZ(0); /* Force GPU layer */
}

/* Remove will-change after animation completes */
/* (will-change on too many elements wastes GPU memory) */
element.addEventListener('transitionend', () => {
  element.style.willChange = 'auto';
});
```

---

## Strategy 4: Scroll Performance

```javascript
// Passive event listener — scroll NEVER blocks paint
window.addEventListener('scroll', onScroll, { passive: true });

// RAF-batched DOM writes — reads and writes never interleave
let scrollProgress = 0;
let displayProgress = 0;

function onScroll() {
  scrollProgress = window.scrollY / maxScroll; // Read only
}

function animationLoop() {
  // Lerp: smooth but responsive
  displayProgress += (scrollProgress - displayProgress) * 0.08;

  // All DOM writes happen here — never in scroll handler
  updateProgressBar(displayProgress);
  updateSceneStates(displayProgress);

  requestAnimationFrame(animationLoop);
}
```

This pattern eliminates all forced synchronous layouts (layout thrashing).

---

## Strategy 5: Canvas Particle System

```javascript
// Performance-safe particle configuration
const PARTICLE_CONFIG = {
  count: {
    mobile: 35,   // ≤ 768px screen width
    tablet: 50,
    desktop: 65,
  },
  maxSize: 2.5,   // px
  minSize: 0.8,   // px
  speed: 0.3,     // px per frame at 60fps
  opacity: 0.3,
};

// Page Visibility API — stop RAF when tab is hidden
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    cancelAnimationFrame(particleRAF);
  } else {
    particleRAF = requestAnimationFrame(particleLoop);
  }
});

// Canvas resize — debounced to prevent excessive redraws
window.addEventListener('resize', debounce(resizeCanvas, 200));
```

---

## Strategy 6: Font Optimization

```css
/* Subset fonts to only used characters */
/* Latin subset for English: ~8KB per face vs. ~60KB full */
@font-face {
  font-family: 'Cormorant Garamond';
  src: url('/fonts/cormorant-garamond-light-latin.woff2') format('woff2');
  font-weight: 300;
  font-style: normal;
  font-display: swap;       /* Text visible immediately in fallback font */
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC;
}
```

**Font subsetting strategy**:
- Cormorant Garamond: Latin subset only (~12KB per variant vs. 70KB full)
- Lato: Latin subset only (~8KB per variant)
- Noto Serif Tamil: Only loaded when Tamil selected (~25KB)
- Noto Serif Malayalam: Only loaded when Malayalam selected (~28KB)

---

## Strategy 7: Connection-Aware Loading

```javascript
// Network Information API — skip heavy assets on slow connections
const connection = navigator.connection || navigator.mozConnection;

function shouldLoadHeavyAssets() {
  if (!connection) return true; // Unknown — load everything
  if (connection.saveData) return false; // Data saver mode
  if (connection.effectiveType === '2g') return false;
  if (connection.effectiveType === 'slow-2g') return false;
  return true;
}

// If on slow connection:
// - Skip particle system (show CSS gradient bg instead)
// - Reduce animation complexity
// - Don't auto-offer audio
```

---

## Strategy 8: Intersection Observer for Scene Activation

```javascript
// Scenes only animate when in viewport — zero wasted computation
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('scene--active');
        animPack.onSceneEnter(entry.target.dataset.scene, entry.target);
      } else {
        entry.target.classList.remove('scene--active');
        animPack.onSceneExit(entry.target.dataset.scene, entry.target);
      }
    });
  },
  { threshold: 0.2, rootMargin: '0px 0px -10% 0px' }
);

document.querySelectorAll('.scene').forEach(el => observer.observe(el));
```

---

## Mobile-Specific Optimizations

| Optimization | Implementation |
|---|---|
| Touch scrolling | `-webkit-overflow-scrolling: touch` on scroll container |
| Tap highlight removal | `-webkit-tap-highlight-color: transparent` |
| Reduced particles | Count halved on screens < 768px |
| Gyroscope check | Feature-detect before requesting permission |
| Haptics check | `typeof navigator.vibrate === 'function'` before calling |
| Safe areas | `env(safe-area-inset-*)` for notch/home bar on iOS |
| 300ms tap delay | `touch-action: manipulation` on interactive elements |

---

## Prefers-Reduced-Motion — Full Fallback

```css
@media (prefers-reduced-motion: reduce) {
  /* Kill all CSS animations */
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

```javascript
// Kill JS animations too
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  // Replace all scene entry animations with instant opacity toggle
  // Skip particle system entirely
  // Audio: still works, just no volume automation
}
```

---

## Lighthouse Score Targets

| Category | Target |
|---|---|
| Performance | ≥ 90 |
| Accessibility | ≥ 95 |
| Best Practices | ≥ 95 |
| SEO | ≥ 85 |

> Note: SEO score is less critical for a private invitation, but still targeted
> to ensure good link preview (Open Graph, Twitter Card) when shared on WhatsApp/social.

---

## Open Graph & Link Preview

When a guest receives the URL on WhatsApp, they should see:

```
[Thumbnail: Couple's names on dark gold background]
James & Mary's Wedding Invitation
October 18, 2026 · St. Thomas Cathedral, Chennai
invite.yourdomain.com/james-mary-2026
```

Required meta tags:
```html
<meta property="og:title"       content="James & Mary's Wedding">
<meta property="og:description" content="October 18, 2026 · St. Thomas Cathedral">
<meta property="og:image"       content="/clients/james-mary-2026/og-cover.jpg">
<meta property="og:url"         content="https://invite.yourdomain.com/james-mary-2026">
<meta property="og:type"        content="website">
<meta name="twitter:card"       content="summary_large_image">
```

The `og-cover.jpg` is a static 1200×630 generated image per client.
