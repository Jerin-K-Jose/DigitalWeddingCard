/**
 * SceneHero — Scene 03: Hero Announcement
 *
 * The first scrollable scene. Fades in gracefully over the expanded black card.
 * Displays "Together with their families" and the couple's names.
 *
 * /src/components/scene-hero.js
 */

export class SceneHero {
  constructor(engine) {
    this.engine = engine;
    this.id     = 'hero';
    this.el     = null;
  }

  async enter() {
    this.el = document.getElementById('scene-hero');
    if (!this.el) return;

    this.render();
    
    // Listen to scroll progress to drive parallax
    this._onScroll = this.handleScroll.bind(this);
    this.engine.on('scrollprogress', this._onScroll);
    
    this.el.classList.add('active');
  }

  render() {
    const config = window.__config;
    
    this.el.innerHTML = `
      <style>
        #scene-hero {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          background: #0d0b08; /* Matches expanded card */
          color: var(--color-text);
          padding: 2rem;
          text-align: center;
          z-index: 10;
        }

        .hero-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 1.5s ease, transform 1.5s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        
        .hero-content.is-visible {
          opacity: 1;
          transform: translateY(0);
        }

        .hero-invitation {
          font-family: var(--font-body);
          font-size: var(--text-sm);
          letter-spacing: var(--tracking-widest);
          text-transform: uppercase;
          color: var(--color-accent-gold);
          margin-bottom: 2rem;
        }

        .hero-names {
          font-family: var(--font-heading);
          font-size: clamp(3rem, 12vw, 6rem);
          line-height: 1.1;
          color: #f5e6c8;
          margin-bottom: 3rem;
          text-shadow: 0 4px 32px rgba(201,168,76,0.15);
        }

        .hero-date {
          font-family: var(--font-body);
          font-size: var(--text-base);
          letter-spacing: var(--tracking-wider);
          color: var(--color-muted-light);
        }

        .scroll-indicator {
          position: absolute;
          bottom: 4rem;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          opacity: 0;
          transition: opacity 2s ease 1.5s;
        }
        
        .hero-content.is-visible ~ .scroll-indicator {
          opacity: 0.6;
        }

        .scroll-line {
          width: 1px;
          height: 60px;
          background: linear-gradient(to bottom, var(--color-accent-gold), transparent);
          animation: scroll-pulse 2.5s infinite ease-in-out;
        }

        @keyframes scroll-pulse {
          0% { transform: scaleY(0); transform-origin: top; }
          40% { transform: scaleY(1); transform-origin: top; }
          40.1% { transform: scaleY(1); transform-origin: bottom; }
          100% { transform: scaleY(0); transform-origin: bottom; }
        }
      </style>
      
      <div class="hero-content">
        <div class="hero-invitation" data-i18n="invitation_to">Together with their families</div>
        <h1 class="hero-names">
          ${config.client.bride.firstName} <br/>&<br/> ${config.client.groom.firstName}
        </h1>
        <div class="hero-date">
          ${new Date(config.client.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </div>
      </div>
      
      <div class="scroll-indicator">
        <div style="font-size: 0.65rem; letter-spacing: 0.3em; text-transform: uppercase; color: var(--color-accent-gold);">Scroll</div>
        <div class="scroll-line"></div>
      </div>
    `;

    setTimeout(() => {
      const content = this.el.querySelector('.hero-content');
      if (content) content.classList.add('is-visible');
    }, 150);
  }

  handleScroll() {
    if (!this.el) return;
    const scrollY = window.scrollY;
    const content = this.el.querySelector('.hero-content');
    
    if (content && scrollY < window.innerHeight) {
      const yPos = scrollY * 0.4;
      const opacity = Math.max(0, 1 - (scrollY / (window.innerHeight * 0.7)));
      content.style.transform = `translateY(${yPos}px)`;
      content.style.opacity = opacity;
    }
  }

  async exit() {
    this.engine.off('scrollprogress', this._onScroll);
  }
}
