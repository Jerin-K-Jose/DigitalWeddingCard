/**
 * SceneClosing — Scene 09: Closing
 *
 * The final scene in the scroll experience. A simple farewell.
 *
 * /src/components/scene-closing.js
 */

export class SceneClosing {
  constructor(engine) {
    this.engine = engine;
    this.id     = 'closing';
    this.el     = null;
    this.observer = null;
  }

  async enter() {
    this.el = document.getElementById('scene-closing');
    if (!this.el) return;

    this.render();
    this.setupObserver();
    
    this.el.classList.add('active');
  }

  render() {
    this.el.innerHTML = `
      <style>
        #scene-closing {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #0d0b08;
          padding: 4rem 2rem;
          position: relative;
          overflow: hidden;
        }
        
        /* Subtle glow at the bottom of the page */
        #scene-closing::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 80%;
          height: 200px;
          background: radial-gradient(ellipse at bottom, rgba(201,168,76, 0.1) 0%, transparent 70%);
          pointer-events: none;
        }

        .closing-container {
          text-align: center;
          opacity: 0;
          transform: scale(0.95);
          transition: opacity 2s ease, transform 2s cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        .closing-container.is-visible {
          opacity: 1;
          transform: scale(1);
        }

        .closing-text {
          font-family: var(--font-heading);
          font-size: clamp(2rem, 6vw, 3.5rem);
          color: var(--color-accent-light);
          margin-bottom: 1.5rem;
        }
        
        .closing-icon {
          width: 24px;
          height: 24px;
          fill: var(--color-accent-gold);
          margin: 0 auto;
          opacity: 0.8;
        }
      </style>
      
      <div class="closing-container">
        <div class="closing-text" data-i18n="closing">We can't wait to celebrate with you.</div>
        <svg class="closing-icon" viewBox="0 0 24 24">
          <!-- Simple elegant diamond -->
          <path d="M12 0 L14 10 L24 12 L14 14 L12 24 L10 14 L0 12 L10 10 Z" />
        </svg>
      </div>
    `;
  }

  setupObserver() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const container = this.el.querySelector('.closing-container');
          if (container) container.classList.add('is-visible');
          this.observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    this.observer.observe(this.el);
  }

  async exit() {
    if (this.observer && this.el) {
      this.observer.disconnect();
    }
  }
}
