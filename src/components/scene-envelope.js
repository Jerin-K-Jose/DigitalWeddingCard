/**
 * SceneEnvelope — Scene 02: Envelope
 *
 * Displays a 3D animated envelope with a glowing wax seal.
 * On tap/click:
 *   1. Wax seal breaks in half (top moves with flap, bottom falls away)
 *   2. Flap lifts in 3D space
 *   3. Invitation card slides upward (after flap clears)
 *   4. Card expands to fill screen
 *   5. Transitions to Scene 03 (Hero) and enables scroll mode
 *
 * /src/components/scene-envelope.js
 */

export class SceneEnvelope {
  constructor(engine) {
    this.engine = engine;
    this.id     = 'envelope';
  }

  /* ── Lifecycle ───────────────────────────────────────────── */

  async enter() {
    const el = document.getElementById('scene-envelope');
    if (!el) return;

    this.render(el);
    
    el.style.display = 'flex';
    await this._sleep(50);
    el.classList.add('active');

    const wrapper = el.querySelector('.envelope-wrapper');
    if (wrapper) {
      wrapper.addEventListener('click', this.openEnvelope.bind(this), { once: true });
    }
  }

  render(el) {
    const sealIcon = window.__religionModule?.envelopeSeal || 'cross';
    const tapToOpen = window.__config?.scenes?.envelope?.tapToOpen || 'Tap to open';

    el.innerHTML = `
      <style>
        .envelope-container {
          position: relative;
          width: 88vw;
          max-width: 440px;
          height: 280px;
          display: flex;
          align-items: center;
          justify-content: center;
          perspective: 1400px;
          z-index: var(--z-envelope);
        }
        
        .envelope-wrapper {
          position: relative;
          width: 100%;
          height: 100%;
          cursor: pointer;
          transform-style: preserve-3d;
          transition: transform 0.5s var(--ease-spring);
        }
        
        .envelope-wrapper:hover {
          transform: translateY(-4px) scale(1.02);
        }
        
        /* BACK (Inside of envelope) */
        .envelope-back {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #e0d0b0 0%, #c4af85 100%);
          border-radius: 4px;
          box-shadow: 0 16px 48px rgba(0,0,0,0.5);
          z-index: 1;
        }
        
        /* CARD */
        .invitation-card {
          position: absolute;
          bottom: 12px;
          left: 12px;
          right: 12px;
          height: 256px;
          background: var(--color-bg);
          border: 1px solid var(--color-border);
          border-radius: 4px;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: var(--shadow-card);
          will-change: transform, opacity;
          transition: 
            transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1),
            opacity 0.6s ease-out;
        }
        
        .card-hint {
          width: 24px;
          height: 36px;
          fill: var(--color-accent-dark);
          opacity: 0.2;
        }
        
        /* FRONT FOLDS */
        .envelope-front {
          position: absolute;
          inset: 0;
          z-index: 3;
          pointer-events: none;
        }
        
        .envelope-front-left {
          position: absolute;
          top: 0; left: 0; bottom: 0; width: 50%;
          clip-path: polygon(0 0, 100% 50%, 0 100%);
          background: linear-gradient(to right, #ebdcb8, #d5c39f);
        }
        
        .envelope-front-right {
          position: absolute;
          top: 0; right: 0; bottom: 0; width: 50%;
          clip-path: polygon(100% 0, 0 50%, 100% 100%);
          background: linear-gradient(to left, #ebdcb8, #d5c39f);
        }
        
        .envelope-front-bottom {
          position: absolute;
          bottom: 0; left: 0; right: 0; height: 65%;
          clip-path: polygon(0 100%, 50% 0, 100% 100%);
          background: linear-gradient(to top, #c4af85, #ebdcb8);
          z-index: 4;
          filter: drop-shadow(0 -4px 12px rgba(0,0,0,0.1));
        }
        
        /* FLAP (3D Wrapper) */
        .envelope-flap-wrapper {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 60%;
          transform-origin: top center;
          z-index: 5;
          transform-style: preserve-3d;
          transition: transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        .envelope-flap {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, #ebdcb8, #c8b48b);
          clip-path: polygon(0 0, 50% 100%, 100% 0);
          backface-visibility: hidden;
        }
        
        .envelope-flap-inner {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, #bdab80, #dfcdab);
          clip-path: polygon(0 0, 50% 100%, 100% 0);
          backface-visibility: hidden;
          transform: rotateX(180deg);
        }
        
        /* WAX SEAL (Split into Top and Bottom for breaking effect) */
        .wax-seal {
          width: 56px;
          height: 56px;
          background: radial-gradient(circle at 35% 30%, #a62828 0%, #701313 65%, #3d0707 100%);
          border-radius: 50%;
          box-shadow: 
            0 8px 16px rgba(0,0,0,0.5), 
            inset 0 2px 4px rgba(255,255,255,0.25), 
            inset 0 -4px 6px rgba(0,0,0,0.5),
            0 0 24px rgba(166, 40, 40, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #d1b45c;
        }
        
        .wax-seal::after {
          content: '';
          position: absolute;
          inset: 3px;
          border-radius: 50%;
          border: 1px solid rgba(201,168,76,0.35);
        }
        
        .wax-seal svg {
          width: 20px;
          height: 20px;
          filter: drop-shadow(0 -1px 1px rgba(0,0,0,0.8));
          z-index: 2;
        }
        
        .wax-seal-top {
          position: absolute;
          bottom: -28px;
          left: 50%;
          transform: translateX(-50%);
          clip-path: polygon(0 0, 100% 0, 100% 50%, 0 50%); /* Top half */
        }
        
        .wax-seal-bottom {
          position: absolute;
          top: calc(60% - 28px);
          left: 50%;
          transform: translateX(-50%);
          clip-path: polygon(0 50%, 100% 50%, 100% 100%, 0 100%); /* Bottom half */
          z-index: 6;
          transition: transform 0.6s ease-in, opacity 0.5s ease-in;
        }
        
        /* HINT */
        .tap-hint {
          position: absolute;
          bottom: -50px;
          left: 50%;
          transform: translateX(-50%);
          color: var(--color-muted-light);
          font-family: var(--font-body);
          font-size: var(--text-micro);
          letter-spacing: var(--tracking-wider);
          text-transform: uppercase;
          opacity: 0.7;
          animation: pulse-hint 2.4s ease-in-out infinite;
          white-space: nowrap;
        }
        
        @keyframes pulse-hint {
          0%, 100% { opacity: 0.4; transform: translateX(-50%) translateY(0); }
          50%      { opacity: 0.9; transform: translateX(-50%) translateY(-2px); }
        }
        
        /* ── ANIMATION STATES ── */
        
        /* 1. Flap opening */
        .envelope-wrapper.is-opening-flap {
          pointer-events: none;
        }
        .envelope-wrapper.is-opening-flap .envelope-flap-wrapper {
          transform: rotateX(-180deg);
        }
        /* Bottom seal falls away */
        .envelope-wrapper.is-opening-flap .wax-seal-bottom {
          transform: translateX(-50%) translateY(30px) rotate(15deg);
          opacity: 0;
        }
        .envelope-wrapper.is-opening-flap .tap-hint {
          opacity: 0;
          animation: none;
        }
        
        /* 2. Card rising */
        .envelope-wrapper.is-rising-card .invitation-card {
          transform: translateY(-55%);
          z-index: 10;
        }
        
        /* 3. Card expanding */
        .envelope-wrapper.is-expanded .invitation-card {
          transform: translateY(-55%) scale(4);
          opacity: 0;
        }
        .envelope-wrapper.is-expanded .envelope-back,
        .envelope-wrapper.is-expanded .envelope-front-left,
        .envelope-wrapper.is-expanded .envelope-front-right,
        .envelope-wrapper.is-expanded .envelope-front-bottom,
        .envelope-wrapper.is-expanded .envelope-flap-wrapper,
        .envelope-wrapper.is-expanded .wax-seal-bottom {
          opacity: 0;
          transition: opacity 0.8s ease;
        }
      </style>
      
      <div class="envelope-container">
        <div class="envelope-wrapper" role="button" aria-label="${tapToOpen}" tabindex="0">
          <div class="envelope-back"></div>
          
          <div class="invitation-card" aria-hidden="true">
            <svg class="card-hint" viewBox="0 0 40 64"><use href="#${sealIcon}"></use></svg>
          </div>
          
          <div class="envelope-front">
            <div class="envelope-front-left"></div>
            <div class="envelope-front-right"></div>
            <div class="envelope-front-bottom"></div>
          </div>
          
          <div class="envelope-flap-wrapper">
            <div class="envelope-flap-inner"></div>
            <div class="envelope-flap">
              <!-- Top half of seal (moves with flap) -->
              <div class="wax-seal wax-seal-top">
                <svg><use href="#${sealIcon}"></use></svg>
              </div>
            </div>
          </div>
          
          <!-- Bottom half of seal (stays on envelope, falls off) -->
          <div class="wax-seal wax-seal-bottom">
            <svg><use href="#${sealIcon}"></use></svg>
          </div>
          
          <div class="tap-hint">${tapToOpen}</div>
        </div>
      </div>
    `;

    const wrapper = el.querySelector('.envelope-wrapper');
    wrapper.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.openEnvelope();
      }
    });
  }

  /**
   * The main interaction sequence.
   */
  async openEnvelope() {
    const el = document.getElementById('scene-envelope');
    const wrapper = el.querySelector('.envelope-wrapper');
    
    if (wrapper.classList.contains('is-opening-flap')) return;
    
    if (navigator.vibrate) navigator.vibrate(15);
    
    // Step 1: Flap opens, seal breaks
    wrapper.classList.add('is-opening-flap');
    await this._sleep(450); // Wait for flap to clear the top path
    
    // Step 2: Card rises
    wrapper.classList.add('is-rising-card');
    await this._sleep(600); // Wait for spring animation to settle
    
    // Step 3: Card expands
    wrapper.classList.add('is-expanded');
    
    // Step 4: Scroll mode & next scene
    this.engine.enableScrollMode();
    await this._sleep(300);
    
    if (this.engine._scenes.has('hero')) {
      await this.engine.transitionTo('hero');
    } else {
      this._showWaitingState(el);
    }
  }
  
  _showWaitingState(el) {
    el.innerHTML = `
      <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;width:100vw;z-index:999;position:fixed;top:0;left:0;">
        <p style="color:var(--color-muted);font-family:var(--font-body);font-size:0.8rem;letter-spacing:0.2em;text-transform:uppercase;">Scene 03 — Coming Next</p>
      </div>
    `;
  }

  async exit() {
    const el = document.getElementById('scene-envelope');
    if (!el) return;
    
    el.style.transition = 'opacity 800ms ease';
    el.style.opacity = '0';
    el.classList.remove('active');
    
    await this._sleep(800);
    el.style.display = 'none';
  }

  _sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
