/**
 * SceneEnvelope — Scene 02: Envelope
 *
 * Displays a 3D animated envelope built with hardware-accelerated SVG panels.
 * On tap/click:
 *   1. Wax seal breaks in half (top moves with flap, bottom falls away)
 *   2. Flap lifts smoothly in 3D space with dynamic lighting
 *   3. Invitation card slides upward
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
          perspective: 1600px; /* Deep perspective for realistic 3D */
          z-index: var(--z-envelope);
        }
        
        .envelope-wrapper {
          position: relative;
          width: 100%;
          height: 100%;
          cursor: pointer;
          transform-style: preserve-3d;
          transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1);
        }
        
        .envelope-wrapper:hover {
          transform: translateY(-4px) scale(1.02);
        }
        
        /* ── BACK (Inside of envelope) ── */
        .envelope-back {
          position: absolute;
          inset: 0;
          box-shadow: 0 16px 48px rgba(0,0,0,0.5);
          border-radius: 4px;
          z-index: 1;
        }
        
        /* Realistic ambient occlusion (darkness inside the envelope) */
        .envelope-inner-shadow {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.35);
          border-radius: 4px;
          opacity: 1;
          transition: opacity 0.8s ease;
          pointer-events: none;
        }
        
        /* ── INVITATION CARD ── */
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
          
          /* Hardware acceleration */
          will-change: transform, opacity;
          transform: translateZ(0);
          
          /* Silky smooth easing */
          transition: 
            transform 0.9s cubic-bezier(0.25, 1, 0.5, 1),
            opacity 0.6s ease-out;
        }
        
        .card-hint {
          width: 24px;
          height: 36px;
          fill: var(--color-accent-dark);
          opacity: 0.2;
        }
        
        /* ── FRONT FOLDS ── */
        .envelope-front {
          position: absolute;
          inset: 0;
          z-index: 3;
          pointer-events: none;
        }
        
        /* ── FLAP (3D Wrapper) ── */
        .envelope-flap-wrapper {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 60%;
          transform-origin: top center;
          z-index: 5;
          transform-style: preserve-3d;
          
          /* Hardware acceleration */
          will-change: transform;
          transform: translateZ(1px);
          
          /* Realistic Apple-style ease-out */
          transition: transform 0.8s cubic-bezier(0.25, 1, 0.5, 1);
        }
        
        .envelope-flap {
          position: absolute;
          inset: 0;
          backface-visibility: hidden;
        }
        
        .envelope-flap-inner {
          position: absolute;
          inset: 0;
          backface-visibility: hidden;
          transform: rotateX(180deg);
        }
        
        /* ── WAX SEAL (Split into Top and Bottom) ── */
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
          clip-path: polygon(0 0, 100% 0, 100% 50%, 0 50%);
        }
        
        .wax-seal-bottom {
          position: absolute;
          top: calc(60% - 28px);
          left: 50%;
          transform: translateX(-50%);
          clip-path: polygon(0 50%, 100% 50%, 100% 100%, 0 100%);
          z-index: 6;
          transition: transform 0.7s ease-in, opacity 0.6s ease-in;
        }
        
        /* ── HINT ── */
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
          transform: rotateX(-180deg) translateZ(1px);
        }
        
        /* Bottom seal falls away realistically */
        .envelope-wrapper.is-opening-flap .wax-seal-bottom {
          transform: translateX(-50%) translateY(40px) rotate(20deg) scale(0.9);
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
        
        /* Lighten the inside of the envelope as card rises out */
        .envelope-wrapper.is-rising-card .envelope-inner-shadow {
          opacity: 0;
        }
        
        /* 3. Card expanding */
        .envelope-wrapper.is-expanded .invitation-card {
          transform: translateY(-55%) scale(4);
          opacity: 0;
        }
        
        .envelope-wrapper.is-expanded .envelope-back,
        .envelope-wrapper.is-expanded .envelope-front,
        .envelope-wrapper.is-expanded .envelope-flap-wrapper,
        .envelope-wrapper.is-expanded .wax-seal-bottom {
          opacity: 0;
          transition: opacity 0.8s ease;
        }
      </style>
      
      <div class="envelope-container">
        <div class="envelope-wrapper" role="button" aria-label="${tapToOpen}" tabindex="0">
          
          <!-- 1. BACK -->
          <div class="envelope-back">
            <svg viewBox="0 0 440 280" preserveAspectRatio="none" style="width:100%; height:100%; border-radius: 4px;">
              <defs>
                <linearGradient id="backGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#e0d0b0" />
                  <stop offset="100%" stop-color="#c4af85" />
                </linearGradient>
              </defs>
              <rect width="440" height="280" fill="url(#backGrad)" />
            </svg>
            <div class="envelope-inner-shadow"></div>
          </div>
          
          <!-- 2. CARD -->
          <div class="invitation-card" aria-hidden="true">
            <svg class="card-hint" viewBox="0 0 40 64"><use href="#${sealIcon}"></use></svg>
          </div>
          
          <!-- 3. FRONT -->
          <div class="envelope-front">
             <svg viewBox="0 0 440 280" preserveAspectRatio="none" style="width:100%; height:100%; filter: drop-shadow(0 -4px 12px rgba(0,0,0,0.1));">
                <defs>
                  <linearGradient id="leftGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stop-color="#ebdcb8" />
                    <stop offset="100%" stop-color="#d5c39f" />
                  </linearGradient>
                  <linearGradient id="rightGrad" x1="100%" y1="0%" x2="0%" y2="0%">
                    <stop offset="0%" stop-color="#ebdcb8" />
                    <stop offset="100%" stop-color="#d5c39f" />
                  </linearGradient>
                  <linearGradient id="bottomGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" stop-color="#c4af85" />
                    <stop offset="100%" stop-color="#ebdcb8" />
                  </linearGradient>
                </defs>
                <!-- Left Flap -->
                <polygon points="0,0 220,140 0,280" fill="url(#leftGrad)" />
                <!-- Right Flap -->
                <polygon points="440,0 220,140 440,280" fill="url(#rightGrad)" />
                <!-- Bottom Flap -->
                <polygon points="0,280 220,140 440,280" fill="url(#bottomGrad)" />
             </svg>
          </div>
          
          <!-- 4. TOP FLAP (3D Wrapper) -->
          <div class="envelope-flap-wrapper">
            <!-- Flap Inner (Visible when open) -->
            <div class="envelope-flap-inner">
               <svg viewBox="0 0 440 168" preserveAspectRatio="none" style="width:100%; height:100%;">
                 <defs>
                    <linearGradient id="innerFlapGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stop-color="#bdab80" />
                      <stop offset="100%" stop-color="#dfcdab" />
                    </linearGradient>
                 </defs>
                 <polygon points="0,0 220,168 440,0" fill="url(#innerFlapGrad)" />
               </svg>
            </div>
            
            <!-- Flap Outer (Visible when closed) -->
            <div class="envelope-flap">
               <svg viewBox="0 0 440 168" preserveAspectRatio="none" style="width:100%; height:100%; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.15));">
                 <defs>
                    <linearGradient id="flapGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stop-color="#ebdcb8" />
                      <stop offset="100%" stop-color="#c8b48b" />
                    </linearGradient>
                 </defs>
                 <polygon points="0,0 220,168 440,0" fill="url(#flapGrad)" />
               </svg>
               
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
    await this._sleep(600); // Wait for flap to fully clear the top path
    
    // Step 2: Card rises
    wrapper.classList.add('is-rising-card');
    await this._sleep(700); // Wait for smooth slide-up to settle
    
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
