/**
 * SceneStory — Scene 04: The Story / Tagline
 *
 * A beautiful typographic scene that reveals "Two souls, one covenant"
 * as the user scrolls down. Uses IntersectionObserver for scroll reveal.
 *
 * /src/components/scene-story.js
 */

export class SceneStory {
  constructor(engine) {
    this.engine = engine;
    this.id     = 'story';
    this.el     = null;
    this.observer = null;
  }

  async enter() {
    this.el = document.getElementById('scene-story');
    if (!this.el) return;

    this.render();
    this.setupObserver();
    
    this.el.classList.add('active');
  }

  render() {
    this.el.innerHTML = `
      <style>
        #scene-story {
          min-height: 80vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--color-bg);
          padding: 4rem 2rem;
          position: relative;
        }

        .story-container {
          max-width: 600px;
          text-align: center;
        }

        .story-text {
          font-family: var(--font-heading);
          font-size: clamp(2rem, 8vw, 4rem);
          line-height: 1.3;
          color: var(--color-accent-gold);
          opacity: 0;
          transform: translateY(40px);
          transition: opacity 1.5s ease, transform 1.5s cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        .story-text.is-visible {
          opacity: 1;
          transform: translateY(0);
        }

        .story-flourish {
          margin-top: 2rem;
          opacity: 0;
          transform: scale(0.8);
          transition: opacity 1.5s ease 0.4s, transform 1.5s cubic-bezier(0.2, 0.8, 0.2, 1) 0.4s;
        }

        .story-flourish.is-visible {
          opacity: 1;
          transform: scale(1);
        }
        
        .story-flourish svg {
          width: 40px;
          height: 40px;
          fill: var(--color-accent-dark);
        }
      </style>
      
      <div class="story-container">
        <div class="story-text" data-i18n="couple_tagline">Two souls, one covenant</div>
        <div class="story-flourish">
          <svg viewBox="0 0 40 40">
            <!-- A delicate diamond/star flourish -->
            <path d="M20 0 L22 18 L40 20 L22 22 L20 40 L18 22 L0 20 L18 18 Z" />
          </svg>
        </div>
      </div>
    `;
  }

  setupObserver() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const text = this.el.querySelector('.story-text');
          const flourish = this.el.querySelector('.story-flourish');
          if (text) text.classList.add('is-visible');
          if (flourish) flourish.classList.add('is-visible');
          // Once revealed, stop observing
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
