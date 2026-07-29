/**
 * SceneLiturgy — Scene 05: Liturgy / Scripture
 *
 * Displays a religious verse or quote based on the selected religion module.
 * Uses IntersectionObserver for scroll reveal.
 *
 * /src/components/scene-liturgy.js
 */

export class SceneLiturgy {
  constructor(engine) {
    this.engine = engine;
    this.id     = 'liturgy';
    this.el     = null;
    this.observer = null;
  }

  async enter() {
    this.el = document.getElementById('scene-liturgy');
    if (!this.el) return;

    this.render();
    this.setupObserver();
    
    this.el.classList.add('active');
  }

  render() {
    // Default fallback verse if module isn't loaded
    const defaultVerse = {
      text: "Love is patient, love is kind. It does not envy, it does not boast, it is not proud.",
      reference: "1 Corinthians 13:4"
    };

    const verse = window.__religionModule?.verseBank?.[0] || defaultVerse;
    const verseIcon = window.__religionModule?.verseIcon || 'cross';

    this.el.innerHTML = `
      <style>
        #scene-liturgy {
          min-height: 80vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--color-bg);
          padding: 4rem 2rem;
        }

        .liturgy-container {
          max-width: 700px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2rem;
          opacity: 0;
          transform: translateY(40px);
          transition: opacity 1.5s ease, transform 1.5s cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        .liturgy-container.is-visible {
          opacity: 1;
          transform: translateY(0);
        }

        .liturgy-icon {
          width: 24px;
          height: 36px;
          fill: var(--color-accent-dark);
          opacity: 0.5;
        }

        .liturgy-text {
          font-family: var(--font-body);
          font-size: clamp(1.2rem, 4vw, 1.8rem);
          line-height: 1.6;
          color: var(--color-text);
          font-style: italic;
        }

        .liturgy-ref {
          font-family: var(--font-body);
          font-size: var(--text-sm);
          letter-spacing: var(--tracking-widest);
          text-transform: uppercase;
          color: var(--color-accent-gold);
        }
      </style>
      
      <div class="liturgy-container">
        <svg class="liturgy-icon" viewBox="0 0 40 64"><use href="#${verseIcon}"></use></svg>
        <div class="liturgy-text">"${verse.text}"</div>
        <div class="liturgy-ref">${verse.reference}</div>
      </div>
    `;
  }

  setupObserver() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const container = this.el.querySelector('.liturgy-container');
          if (container) container.classList.add('is-visible');
          this.observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    this.observer.observe(this.el);
  }

  async exit() {
    if (this.observer && this.el) {
      this.observer.disconnect();
    }
  }
}
