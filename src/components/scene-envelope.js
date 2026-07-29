/**
 * SceneEnvelope — Scene 02: Envelope
 *
 * Displays a 3D animated envelope with a glowing wax seal.
 * On tap/click:
 *   1. Wax seal cracks and fades
 *   2. Flap lifts in 3D space
 *   3. Invitation card slides out
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
    
    // Ensure display block if it was hidden
    el.style.display = 'flex';
    
    // Short delay to allow DOM to paint before fading in
    await this._sleep(50);
    el.classList.add('active');

    // Attach event listener for the tap interaction
    const wrapper = el.querySelector('.envelope-wrapper');
    if (wrapper) {
      wrapper.addEventListener('click', this.openEnvelope.bind(this), { once: true });
    }
  }

  render(el) {
    // Determine the correct seal icon from the religion module
    const sealIcon = window.__religionModule?.envelopeSeal || 'cross';
    
    // Basic i18n fallback for the label
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
          transition: transform var(--duration-normal) var(--ease-spring);
        }
        
        .envelope-wrapper:hover {
          transform: translateY(-4px) scale(1.02);
        }
        
        /* The back of the envelope (inside) */
        .envelope-back {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #e0d0b0 0%, #c4af85 100%);
          border-radius: 4px;
          box-shadow: 0 16px 48px rgba(0,0,0,0.5);
        }
        
        /* The invitation card inside the envelope */
        .invitation-card {
          position: absolute;
          bottom: 12px;
          left: 12px;
          right: 12px;
          height: 260px;
          background: var(--color-bg);
          border: 1px solid var(--color-border);
          border-radius: 4px;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: var(--shadow-card);
          will-change: transform, opacity;
          /* The transition handles sliding out, then expanding */
          transition: 
            transform var(--duration-slow) var(--ease-spring),
            opacity var(--duration-normal) ease-out;
        }
        
        /* A subtle hint of the cross on the card before it's fully revealed */
        .card-hint {
          width: 24px;
          height: 36px;
          fill: var(--color-accent-dark);
          opacity: 0.2;
        }
        
        /* The front folded panels of the envelope */
        .envelope-front {
          position: absolute;
          inset: 0;
          z-index: 3;
          pointer-events: none;
        }
        
        .envelope-front-left, 
        .envelope-front-right, 
        .envelope-front-bottom {
          position: absolute;
          background: #e5d6b8;
        }
        
        .envelope-front-left {
          top: 0; left: 0; bottom: 0; width: 50%;
          clip-path: polygon(0 0, 100% 50%, 0 100%);
          background: linear-gradient(to right, #ebdcb8, #d5c39f);
        }
        
        .envelope-front-right {
          top: 0; right: 0; bottom: 0; width: 50%;
          clip-path: polygon(100% 0, 0 50%, 100% 100%);
          background: linear-gradient(to left, #ebdcb8, #d5c39f);
        }
        
        .envelope-front-bottom {
          bottom: 0; left: 0; right: 0; height: 65%;
          clip-path: polygon(0 100%, 50% 0, 100% 100%);
          background: linear-gradient(to top, #c4af85, #ebdcb8);
          z-index: 4;
          filter: drop-shadow(0 -4px 12px rgba(0,0,0,0.1));
        }
        
        /* The top flap that opens */
        .envelope-flap {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 60%;
          background: linear-gradient(to bottom, #ebdcb8, #c8b48b);
          clip-path: polygon(0 0, 50% 100%, 100% 0);
          transform-origin: top center;
          z-index: 5;
          transition: transform 0.7s var(--ease-spring);
          backface-visibility: hidden;
          filter: drop-shadow(0 4px 12px rgba(0,0,0,0.15));
        }
        
        /* The inside of the top flap (visible when opened) */
        .envelope-flap-inner {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 60%;
          background: linear-gradient(to bottom, #bdab80, #dfcdab);
          clip-path: polygon(0 0, 50% 100%, 100% 0);
          transform-origin: top center;
          transform: rotateX(180deg);
          z-index: 1;
          backface-visibility: hidden;
          transition: transform 0.7s var(--ease-spring);
        }
        
        /* The glowing wax seal */
        .wax-seal {
          position: absolute;
          bottom: -22px; /* Positioned at the tip of the flap */
          left: 50%;
          transform: translateX(-50%);
          width: 56px;
          height: 56px;
          background: radial-gradient(circle at 35% 30%, #a62828 0%, #701313 65%, #3d0707 100%);
          border-radius: 50%;
          z-index: 6;
          box-shadow: 
            0 8px 16px rgba(0,0,0,0.5), 
            inset 0 2px 4px rgba(255,255,255,0.25), 
            inset 0 -4px 6px rgba(0,0,0,0.5),
            0 0 24px rgba(166, 40, 40, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #d1b45c;
          transition: 
            opacity var(--duration-fast) ease-out, 
            transform var(--duration-fast) ease-out,
            filter var(--duration-fast) ease;
        }
        
        /* Emboss ring inside the seal */
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
        
        /* Tap to open label */
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
        
        /* State 1: Flap is opening */
        .envelope-wrapper.is-opening {
          pointer-events: none;
        }
        
        .envelope-wrapper.is-opening .envelope-flap,
        .envelope-wrapper.is-opening .envelope-flap-inner {
          transform: rotateX(-180deg);
        }
        
        /* Seal cracks and disappears */
        .envelope-wrapper.is-opening .wax-seal {
          opacity: 0;
          transform: translateX(-50%) scale(1.3);
          filter: blur(4px);
        }
        
        .envelope-wrapper.is-opening .tap-hint {
          opacity: 0;
          animation: none;
        }
        
        /* Card slides up out of the envelope */
        .envelope-wrapper.is-opening .invitation-card {
          transform: translateY(-65%);
          z-index: 10;
        }
        
        /* State 2: Card expands to fill screen */
        .envelope-wrapper.is-expanded .invitation-card {
          /* Scale aggressively to fill viewport and fade out as next scene fades in */
          transform: translateY(-65%) scale(4);
          opacity: 0;
        }
        
        .envelope-wrapper.is-expanded .envelope-back,
        .envelope-wrapper.is-expanded .envelope-front-left,
        .envelope-wrapper.is-expanded .envelope-front-right,
        .envelope-wrapper.is-expanded .envelope-front-bottom {
          opacity: 0;
          transition: opacity var(--duration-slow) ease;
        }
      </style>
      
      <div class="envelope-container">
        <div class="envelope-wrapper" role="button" aria-label="${tapToOpen}" tabindex="0">
          <div class="envelope-back"></div>
          
          <div class="invitation-card" aria-hidden="true">
            <svg class="card-hint" viewBox="0 0 40 64">
              <use href="#${sealIcon}"></use>
            </svg>
          </div>
          
          <div class="envelope-front">
            <div class="envelope-front-left"></div>
            <div class="envelope-front-right"></div>
            <div class="envelope-front-bottom"></div>
          </div>
          
          <div class="envelope-flap-inner"></div>
          <div class="envelope-flap">
            <div class="wax-seal">
              <svg><use href="#${sealIcon}"></use></svg>
            </div>
          </div>
          
          <div class="tap-hint">${tapToOpen}</div>
        </div>
      </div>
    `;

    // Accessibility: Allow keyboard to trigger open
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
   * Runs the 3D CSS animations and coordinates the handoff to the scroll engine.
   */
  async openEnvelope() {
    const el = document.getElementById('scene-envelope');
    const wrapper = el.querySelector('.envelope-wrapper');
    
    // Prevent double triggers
    if (wrapper.classList.contains('is-opening')) return;
    
    // Haptic feedback for mobile
    if (navigator.vibrate) navigator.vibrate(15);
    
    // Step 1: Flap opens, seal cracks, card rises
    wrapper.classList.add('is-opening');
    
    // Wait for the slide-up animation to peak
    await this._sleep(750);
    
    // Step 2: Card scales up to fullscreen and fades
    wrapper.classList.add('is-expanded');
    
    // Step 3: Enable the scroll experience 
    // This removes the pre-scroll layer and activates the main timeline
    this.engine.enableScrollMode();
    
    // Step 4: Trigger transition to Scene 03 (Hero)
    await this._sleep(400); // Slight overlap with the expansion
    
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
