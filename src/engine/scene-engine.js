/**
 * SceneEngine — Core scene state machine and scroll controller.
 * Manages transitions between scenes, scroll-driven progress,
 * and idle detection for ambient mode.
 *
 * /src/engine/scene-engine.js
 */

export class SceneEngine {
  constructor() {
    this._scenes          = new Map();   // id → scene component
    this._current         = null;        // active scene component
    this._scrollProgress  = 0;           // raw scroll (0–1)
    this._displayProgress = 0;           // lerped scroll (0–1)
    this._rafId           = null;
    this._idleTimer       = null;
    this._isScrollPhase   = false;
    this._scrollAttached  = false;
    this._listeners       = {};
  }

  /* ── Scene Registration ─────────────────────────────────── */

  /**
   * Register a scene component with the engine.
   * @param {string} id - Unique scene identifier (e.g., 'loading', 'envelope')
   * @param {object} component - Scene component with enter()/exit() methods
   */
  registerScene(id, component) {
    component.id = id;
    this._scenes.set(id, component);
  }

  /* ── Scene Transitions ──────────────────────────────────── */

  /**
   * Transition to a new scene.
   * Calls exit() on current scene, then enter() on next.
   * @param {string} sceneId
   * @param {object} options - Passed to both exit() and enter()
   */
  async transitionTo(sceneId, options = {}) {
    const next = this._scenes.get(sceneId);
    if (!next) {
      console.warn(`[SceneEngine] Scene not registered: "${sceneId}"`);
      return;
    }

    // Exit current scene
    if (this._current && this._current !== next) {
      try {
        await this._current.exit?.(options);
      } catch (e) {
        console.warn(`[SceneEngine] Exit error in "${this._current.id}":`, e);
      }
    }

    this._current = next;

    // Enter next scene
    try {
      await next.enter?.(options);
    } catch (e) {
      console.warn(`[SceneEngine] Enter error in "${sceneId}":`, e);
    }

    this._emit('scenechange', { sceneId, scene: next });
  }

  /* ── Scroll Mode (Scenes 03–10) ─────────────────────────── */

  /**
   * Switch from fixed pre-scroll mode (Scenes 01–02) to
   * the scrollable experience (Scenes 03–10).
   * Called by SceneEnvelope when the envelope has opened.
   */
  enableScrollMode() {
    if (this._scrollAttached) return;
    this._isScrollPhase  = true;
    this._scrollAttached = true;

    // Make scroll experience visible and scrollable
    const scrollEl = document.getElementById('scroll-experience');
    if (scrollEl) {
      scrollEl.hidden = false;
      scrollEl.removeAttribute('aria-hidden');
    }

    // Hide the pre-scroll layer
    const preScrollEl = document.getElementById('pre-scroll-layer');
    if (preScrollEl) {
      preScrollEl.style.transition = 'opacity 600ms ease-out';
      preScrollEl.style.opacity    = '0';
      preScrollEl.style.pointerEvents = 'none';
    }

    // Re-enable body scroll
    document.body.style.overflow = '';

    // Show progress bar
    const bar = document.getElementById('progress-bar');
    if (bar) bar.style.opacity = '1';

    // Attach passive scroll listener
    window.addEventListener('scroll', this._handleScroll.bind(this), { passive: true });

    // Start rAF lerp loop
    this._startLerpLoop();

    this._emit('scrollmode', {});
  }

  /* ── Scroll Handler ─────────────────────────────────────── */

  _handleScroll() {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    this._scrollProgress = maxScroll > 0
      ? Math.min(window.scrollY / maxScroll, 1)
      : 0;
    this._resetIdleTimer();
    this._emit('scroll', { raw: this._scrollProgress });
  }

  /* ── Lerp Loop (rAF-based smooth progress) ──────────────── */

  _startLerpLoop() {
    const tick = () => {
      // Lerp: smooth but responsive
      const delta = (this._scrollProgress - this._displayProgress) * 0.08;
      if (Math.abs(delta) > 0.0001) {
        this._displayProgress += delta;

        // Update progress bar
        const bar = document.getElementById('progress-bar');
        if (bar) bar.style.width = `${this._displayProgress * 100}%`;

        // Notify scroll listeners
        this._emit('scrollprogress', { progress: this._displayProgress });
      }
      this._rafId = requestAnimationFrame(tick);
    };
    this._rafId = requestAnimationFrame(tick);
  }

  /* ── Idle Detection ─────────────────────────────────────── */

  _resetIdleTimer() {
    clearTimeout(this._idleTimer);
    this._idleTimer = setTimeout(() => {
      this._emit('idle', { sceneId: this._current?.id });
    }, 10_000);
  }

  /* ── Event System ────────────────────────────────────────── */

  /**
   * Subscribe to engine events.
   * Events: 'scenechange' | 'scroll' | 'scrollprogress' | 'idle' | 'scrollmode'
   */
  on(event, handler) {
    if (!this._listeners[event]) this._listeners[event] = [];
    this._listeners[event].push(handler);
    return () => this.off(event, handler); // returns unsubscribe fn
  }

  off(event, handler) {
    this._listeners[event] = (this._listeners[event] || [])
      .filter(fn => fn !== handler);
  }

  _emit(event, data) {
    (this._listeners[event] || []).forEach(fn => {
      try { fn(data); } catch (e) { console.warn(`[SceneEngine] Listener error:`, e); }
    });
  }

  /* ── Getters ─────────────────────────────────────────────── */

  get scrollProgress()  { return this._displayProgress; }
  get currentScene()    { return this._current; }
  get isScrollPhase()   { return this._isScrollPhase; }

  /* ── Cleanup ─────────────────────────────────────────────── */

  destroy() {
    cancelAnimationFrame(this._rafId);
    clearTimeout(this._idleTimer);
    if (this._scrollAttached) {
      window.removeEventListener('scroll', this._handleScroll);
    }
    this._listeners = {};
  }
}
