/**
 * SceneEnvelope — Scene 02: Envelope
 *
 * Premium cinematic envelope experience.
 * On tap:
 *   1. Envelope tilts back in 3D space to establish depth.
 *   2. Flap rotates open with realistic lighting (shadows).
 *   3. Seal physically breaks in half.
 *   4. Cinematic black-tie invitation card slides out.
 *   5. Card expands to fill the screen seamlessly transitioning to the dark theme.
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
          /* Huge perspective to make 3D extremely obvious and realistic */
          perspective: 1000px; 
          z-index: var(--z-envelope);
        }
        
        .envelope-wrapper {
          position: relative;
          width: 100%;
          height: 100%;
          cursor: pointer;
          transform-style: preserve-3d;
          /* Snappy but smooth interaction ease */
          transition: transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        
        .envelope-wrapper:hover {
          transform: translateY(-4px) rotateX(2deg) scale(1.02);
        }
        
        /* ── BACK (Inside of envelope) ── */
        .envelope-back {
          position: absolute;
          inset: 0;
          background: #dfcdab;
          border-radius: 4px;
          box-shadow: 0 24px 64px rgba(0,0,0,0.6);
          z-index: 1;
        }
        
        /* Deep ambient occlusion inside the envelope */
        .envelope-inner-shadow {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 100%);
          border-radius: 4px;
          opacity: 1;
          transition: opacity 1.2s ease;
          pointer-events: none;
        }
        
        /* ── INVITATION CARD (Cinematic Black-Tie Design) ── */
        .invitation-card {
          position: absolute;
          bottom: 12px;
          left: 12px;
          right: 12px;
          height: 256px;
          background: #0d0b08; /* Matches page background for seamless transition */
          border-radius: 4px;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          
          /* Card casts shadow onto the envelope back */
          box-shadow: 0 12px 32px rgba(0,0,0,0.8);
          
          will-change: transform, opacity;
          transform: translateZ(0px); /* Keeps it flat inside initially */
          
          transition: 
            transform 1.0s cubic-bezier(0.2, 0.8, 0.2, 1),
            opacity 0.6s ease-out;
        }

        .card-border {
          width: 100%;
          height: 100%;
          border: 1px solid rgba(201, 168, 76, 0.3);
          border-radius: 2px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        .card-glow {
          position: absolute;
          top: -50px;
          left: 50%;
          transform: translateX(-50%);
          width: 200px;
          height: 150px;
          background: radial-gradient(circle, rgba(201,168,76,0.12) 0%, transparent 70%);
          pointer-events: none;
        }
        
        .card-icon {
          width: 22px;
          height: 34px;
          fill: #c9a84c;
          opacity: 0.9;
          margin-bottom: 16px;
          filter: drop-shadow(0 0 8px rgba(201,168,76,0.4));
        }

        .card-names {
          font-family: var(--font-heading);
          color: #f5e6c8;
          font-size: 2.2rem;
          letter-spacing: 0.05em;
          margin-bottom: 6px;
          text-align: center;
        }

        .card-subtitle {
          font-family: var(--font-body);
          color: #c9a84c;
          font-size: 0.65rem;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          opacity: 0.8;
        }
        
        /* ── FRONT FOLDS (Using CSS for precise geometry + shadow) ── */
        .envelope-front {
          position: absolute;
          inset: 0;
          z-index: 3;
          pointer-events: none;
          transform: translateZ(2px); /* Slightly above card */
        }
        
        .envelope-front-svg {
          width: 100%;
          height: 100%;
          filter: drop-shadow(0 -4px 16px rgba(0,0,0,0.25));
        }
        
        /* ── FLAP (3D Wrapper) ── */
        .envelope-flap-wrapper {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 168px; /* 60% of 280 */
          transform-origin: top center;
          z-index: 5;
          transform-style: preserve-3d;
          
          will-change: transform;
          transform: translateZ(3px); /* Above front folds */
          
          transition: transform 0.9s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        
        .envelope-flap {
          position: absolute;
          inset: 0;
          backface-visibility: hidden;
          /* Adding a drop shadow to the flap gives incredible depth when closed */
          filter: drop-shadow(0 4px 12px rgba(0,0,0,0.3));
        }
        
        /* The lighting shadow on the flap that darkens as it rotates away */
        .flap-lighting {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.5), transparent);
          clip-path: polygon(0 0, 50% 100%, 100% 0);
          opacity: 0;
          transition: opacity 0.9s ease;
          pointer-events: none;
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
          background: radial-gradient(circle at 35% 30%, #a62828 0%, #701313 65%, #2a0404 100%);
          border-radius: 50%;
          box-shadow: 
            0 8px 16px rgba(0,0,0,0.5), 
            inset 0 2px 4px rgba(255,255,255,0.25), 
            inset 0 -4px 6px rgba(0,0,0,0.6),
            0 0 24px rgba(166, 40, 40, 0.3);
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
          transform: translateX(-50%) translateZ(4px);
          clip-path: polygon(0 50%, 100% 50%, 100% 100%, 0 100%);
          z-index: 6;
          transition: transform 0.6s cubic-bezier(0.4, 0, 1, 1), opacity 0.5s ease-in;
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
        
        /* ── CHOREOGRAPHED ANIMATION STATES ── */
        
        /* 1. Flap opening */
        .envelope-wrapper.is-opening-flap {
          pointer-events: none;
          /* Envelope tilts backward in 3D space, selling the physical depth */
          transform: rotateX(18deg) rotateY(0deg) scale(0.92);
        }
        
        .envelope-wrapper.is-opening-flap .envelope-flap-wrapper {
          /* Flap rotates back almost completely */
          transform: rotateX(-170deg) translateZ(3px);
        }
        
        .envelope-wrapper.is-opening-flap .flap-lighting {
          /* Flap gets darker as it rotates away from user */
          opacity: 1;
        }
        
        .envelope-wrapper.is-opening-flap .wax-seal-bottom {
          /* Bottom half of seal falls down and fades */
          transform: translateX(-50%) translateY(60px) rotate(25deg) scale(0.85);
          opacity: 0;
        }
        
        .envelope-wrapper.is-opening-flap .tap-hint {
          opacity: 0;
          animation: none;
        }
        
        /* 2. Card rising */
        .envelope-wrapper.is-rising-card .invitation-card {
          /* Card lifts dramatically out of the envelope and pushes forward slightly in Z space */
          transform: translateY(-68%) translateZ(10px);
          z-index: 10;
        }
        
        .envelope-wrapper.is-rising-card .envelope-inner-shadow {
          /* Envelope interior lightens up as card vacates it */
          opacity: 0;
        }
        
        /* 3. Card expanding to full screen */
        .envelope-wrapper.is-expanded {
          /* Envelope drops away entirely */
          transform: translateY(30vh) rotateX(30deg) scale(0.8);
          opacity: 0;
          transition: transform 0.8s ease-in, opacity 0.5s ease-in;
        }

        .envelope-wrapper.is-expanded .invitation-card {
          /* Card scales immensely to fill viewport, but counteracts the wrapper's drop */
          transform: translateY(-80vh) translateZ(50px) scale(4.5);
          opacity: 0;
        }
      </style>
      
      <div class="envelope-container">
        <div class="envelope-wrapper" role="button" aria-label="${tapToOpen}" tabindex="0">
          
          <!-- 1. BACK -->
          <div class="envelope-back"></div>
          <div class="envelope-inner-shadow"></div>
          
          <!-- 2. CARD (Premium Cinematic Black-Tie Design) -->
          <div class="invitation-card" aria-hidden="true">
            <div class="card-border">
              <div class="card-glow"></div>
              <svg class="card-icon" viewBox="0 0 40 64"><use href="#${sealIcon}"></use></svg>
              <div class="card-names">James & Mary</div>
              <div class="card-subtitle">You are invited</div>
            </div>
          </div>
          
          <!-- 3. FRONT -->
          <div class="envelope-front">
             <svg class="envelope-front-svg" viewBox="0 0 440 280" preserveAspectRatio="none">
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
                <polygon points="0,0 220,140 0,280" fill="url(#leftGrad)" />
                <polygon points="440,0 220,140 440,280" fill="url(#rightGrad)" />
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
               <svg viewBox="0 0 440 168" preserveAspectRatio="none" style="width:100%; height:100%;">
                 <defs>
                    <linearGradient id="flapGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stop-color="#ebdcb8" />
                      <stop offset="100%" stop-color="#c8b48b" />
                    </linearGradient>
                 </defs>
                 <polygon points="0,0 220,168 440,0" fill="url(#flapGrad)" />
               </svg>
               <div class="flap-lighting"></div>
               
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
    
    // Step 1: Envelope tilts back, Flap opens, seal breaks
    wrapper.classList.add('is-opening-flap');
    await this._sleep(700); // Wait for flap rotation to finish
    
    // Step 2: Cinematic card rises out
    wrapper.classList.add('is-rising-card');
    await this._sleep(900); // Let the user read the card for a moment!
    
    // Step 3: Card expands to fill screen, envelope drops away
    wrapper.classList.add('is-expanded');
    
    // Step 4: Scroll mode
    this.engine.enableScrollMode();
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
    
    // Fast fade for cleanup (already faded via is-expanded class)
    el.style.opacity = '0';
    el.classList.remove('active');
    
    await this._sleep(300);
    el.style.display = 'none';
  }

  _sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
