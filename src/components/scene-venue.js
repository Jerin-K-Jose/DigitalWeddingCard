/**
 * SceneVenue — Scene 07: Venue & Maps
 *
 * Displays the event venue details and a button to get directions.
 *
 * /src/components/scene-venue.js
 */

export class SceneVenue {
  constructor(engine) {
    this.engine = engine;
    this.id     = 'venue';
    this.el     = null;
    this.observer = null;
  }

  async enter() {
    this.el = document.getElementById('scene-venue');
    if (!this.el) return;

    this.render();
    this.setupObserver();
    
    this.el.classList.add('active');
  }

  render() {
    this.el.innerHTML = `
      <style>
        #scene-venue {
          min-height: 80vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #151310;
          padding: 4rem 2rem;
        }

        .venue-container {
          text-align: center;
          max-width: 500px;
          opacity: 0;
          transform: translateY(40px);
          transition: opacity 1.2s ease, transform 1.2s cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        .venue-container.is-visible {
          opacity: 1;
          transform: translateY(0);
        }

        .venue-title {
          font-family: var(--font-heading);
          font-size: 2.2rem;
          color: #f5e6c8;
          margin-bottom: 1rem;
        }

        .venue-address {
          font-family: var(--font-body);
          font-size: 1.1rem;
          line-height: 1.6;
          color: var(--color-muted-light);
          margin-bottom: 2.5rem;
        }

        .btn-directions {
          display: inline-block;
          padding: 1rem 2.5rem;
          background: transparent;
          border: 1px solid var(--color-accent-gold);
          color: var(--color-accent-gold);
          font-family: var(--font-body);
          font-size: 0.85rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          text-decoration: none;
          border-radius: 4px;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .btn-directions:hover {
          background: var(--color-accent-gold);
          color: #0d0b08;
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(201,168,76, 0.2);
        }
      </style>
      
      <div class="venue-container">
        <h2 class="venue-title">St. George's Cathedral</h2>
        <div class="venue-address">
          224 Cathedral Road, <br/>
          Chennai, Tamil Nadu 600086
        </div>
        <a href="https://maps.google.com" target="_blank" class="btn-directions" data-i18n="directions">Get Directions</a>
      </div>
    `;
  }

  setupObserver() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const container = this.el.querySelector('.venue-container');
          if (container) container.classList.add('is-visible');
          this.observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    this.observer.observe(this.el);
  }

  async exit() {
    if (this.observer && this.el) {
      this.observer.disconnect();
    }
  }
}
