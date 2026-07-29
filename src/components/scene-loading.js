/**
 * SceneLoading — Scene 01: Loading
 *
 * Displays the brand symbol (cross) centered on a deep black background.
 * Runs the particle system. Pre-loads critical assets silently.
 * Transitions to Scene 02 (Envelope) when ready.
 *
 * /src/components/scene-loading.js
 */

export class SceneLoading {
  constructor(engine, canvas) {
    this.engine       = engine;
    this.canvas       = canvas;
    this.id           = 'loading';
    this._raf         = null;
    this._particles   = [];
    this._startTime   = Date.now();
    this._assetsReady = false;
    this._minTimeMet  = false;
    this._MIN_MS      = 1600; // Always show loading for at least this long
  }

  /* ── Lifecycle ───────────────────────────────────────────── */

  async enter() {
    const el = document.getElementById('scene-loading');
    if (!el) return;

    // Scene is already visible via critical CSS, just ensure class
    el.classList.add('active');

    // Start particle system
    this._initParticles();
    this._tick();

    // Minimum display timer
    setTimeout(() => {
      this._minTimeMet = true;
      this._checkReady();
    }, this._MIN_MS);
  }

  /**
   * Called by main.js when all critical assets are loaded.
   */
  onAssetsReady() {
    this._assetsReady = true;
    this._checkReady();
  }

  _checkReady() {
    if (this._assetsReady && this._minTimeMet) {
      this._transitionOut();
    }
  }

  async exit() {
    cancelAnimationFrame(this._raf);
    const el = document.getElementById('scene-loading');
    if (!el) return;
    el.style.opacity = '0';
    el.classList.remove('active');
    await this._sleep(500);
    el.style.display = 'none';
  }

  /* ── Transition ──────────────────────────────────────────── */

  async _transitionOut() {
    const el = document.getElementById('scene-loading');
    if (!el) return;

    // Fade out cross + loading content
    const content = el.querySelector('.loading-content');
    if (content) {
      content.style.transition = `opacity 600ms cubic-bezier(0.4, 0, 1, 1)`;
      content.style.opacity    = '0';
    }

    await this._sleep(500);

    // Hand off to Scene 02 (Envelope)
    if (this.engine._scenes.has('envelope')) {
      await this.engine.transitionTo('envelope');
    } else {
      // Scene 02 not yet built — show waiting state
      this._showWaitingState(el);
    }
  }

  /**
   * Temporary holding state shown until Scene 02 is built.
   * Replaced in the next development prompt.
   */
  _showWaitingState(el) {
    el.innerHTML = `
      <div class="loading-content" style="
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
        opacity: 0;
        animation: fadeIn 800ms ease-out 200ms forwards;
      ">
        <svg viewBox="0 0 40 64" style="width:32px;height:48px;fill:#c9a84c;opacity:0.5;" aria-hidden="true">
          <rect x="17" y="0"  width="6" height="64" rx="3"/>
          <rect x="0"  y="18" width="40" height="6"  rx="3"/>
        </svg>
        <p style="
          color:#7a6a4a;
          font-size:0.72rem;
          letter-spacing:0.28em;
          text-transform:uppercase;
          font-family:'Lato',sans-serif;
          font-weight:300;
        ">Scene 02 — Coming next</p>
      </div>
      <style>
        @keyframes fadeIn { to { opacity: 1; } }
      </style>
    `;
    el.style.opacity = '1';
    el.classList.add('active');
  }

  /* ── Particle System (Canvas 2D) ─────────────────────────── */

  _initParticles() {
    const isMobile = window.innerWidth < 768;
    const count    = isMobile ? 38 : 58;

    this._resizeCanvas();
    this._particles = Array.from({ length: count }, () =>
      this._createParticle(true /* randomY */)
    );

    // Debounced resize handler
    let resizeTimer;
    this._resizeHandler = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => this._resizeCanvas(), 200);
    };
    window.addEventListener('resize', this._resizeHandler, { passive: true });

    // Pause when tab hidden (saves battery)
    this._visibilityHandler = () => {
      if (document.hidden) {
        cancelAnimationFrame(this._raf);
      } else {
        this._tick();
      }
    };
    document.addEventListener('visibilitychange', this._visibilityHandler);
  }

  _resizeCanvas() {
    this.canvas.width  = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  _createParticle(randomY = false) {
    return {
      x:       Math.random() * this.canvas.width,
      y:       randomY
               ? Math.random() * this.canvas.height
               : this.canvas.height + 6,
      size:    0.7 + Math.random() * 1.8,
      speed:   0.12 + Math.random() * 0.28,
      opacity: 0.06 + Math.random() * 0.26,
      drift:   (Math.random() - 0.5) * 0.22,
      // Subtle opacity oscillation for a twinkling effect
      twinkle:  Math.random() * Math.PI * 2,
      twinkleSpeed: 0.008 + Math.random() * 0.012,
    };
  }

  _tick() {
    const ctx          = this.canvas.getContext('2d');
    const { width, height } = this.canvas;

    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < this._particles.length; i++) {
      const p = this._particles[i];

      // Movement
      p.y -= p.speed;
      p.x += p.drift;

      // Twinkle: subtle opacity oscillation
      p.twinkle += p.twinkleSpeed;
      const twinkleFactor = 0.85 + 0.15 * Math.sin(p.twinkle);
      const finalOpacity  = p.opacity * twinkleFactor;

      // Recycle if out of bounds
      if (p.y < -6 || p.x < -16 || p.x > width + 16) {
        this._particles[i] = this._createParticle(false);
        continue;
      }

      // Draw particle as a soft circle
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201, 168, 76, ${finalOpacity})`;
      ctx.fill();
    }

    this._raf = requestAnimationFrame(this._tick.bind(this));
  }

  /* ── Utility ─────────────────────────────────────────────── */

  _sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
