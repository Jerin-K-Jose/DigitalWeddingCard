/**
 * SceneRSVP — Scene 08: RSVP System
 *
 * An elegant RSVP form embedded in the flow.
 *
 * /src/components/scene-rsvp.js
 */

export class SceneRSVP {
  constructor(engine) {
    this.engine = engine;
    this.id     = 'rsvp';
    this.el     = null;
    this.observer = null;
  }

  async enter() {
    this.el = document.getElementById('scene-rsvp');
    if (!this.el) return;

    this.render();
    this.setupObserver();
    
    this.el.classList.add('active');
  }

  render() {
    this.el.innerHTML = `
      <style>
        #scene-rsvp {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--color-bg);
          padding: 4rem 2rem;
        }

        .rsvp-container {
          width: 100%;
          max-width: 500px;
          text-align: center;
          opacity: 0;
          transform: translateY(40px);
          transition: opacity 1.2s ease, transform 1.2s cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        .rsvp-container.is-visible {
          opacity: 1;
          transform: translateY(0);
        }

        .rsvp-title {
          font-family: var(--font-heading);
          font-size: 2.5rem;
          color: var(--color-accent-gold);
          margin-bottom: 2rem;
        }

        .rsvp-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          text-align: left;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-label {
          font-family: var(--font-body);
          font-size: 0.8rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--color-muted-light);
        }

        .form-input {
          background: transparent;
          border: none;
          border-bottom: 1px solid rgba(201,168,76, 0.4);
          padding: 0.75rem 0;
          color: #f5e6c8;
          font-family: var(--font-body);
          font-size: 1.1rem;
          transition: border-color 0.3s ease;
        }
        
        .form-input:focus {
          outline: none;
          border-bottom-color: var(--color-accent-gold);
        }
        
        .rsvp-actions {
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
        }
        
        .btn-rsvp {
          flex: 1;
          padding: 1rem;
          background: transparent;
          border: 1px solid var(--color-accent-gold);
          color: var(--color-accent-gold);
          font-family: var(--font-body);
          font-size: 0.85rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .btn-rsvp.primary {
          background: var(--color-accent-gold);
          color: #0d0b08;
        }
        
        .btn-rsvp:hover {
          transform: translateY(-2px);
        }
      </style>
      
      <div class="rsvp-container">
        <h2 class="rsvp-title" data-i18n="rsvp_headline">Will you celebrate with us?</h2>
        
        <form class="rsvp-form" onsubmit="event.preventDefault(); alert('RSVP logic will be wired to Supabase here.');">
          <div class="form-group">
            <label class="form-label" data-i18n="rsvp_name">Your Name</label>
            <input type="text" class="form-input" required placeholder="Enter full name" />
          </div>
          
          <div class="form-group">
            <label class="form-label" data-i18n="rsvp_guests">Number of Guests</label>
            <input type="number" class="form-input" min="1" max="10" value="1" />
          </div>
          
          <div class="rsvp-actions">
            <button type="button" class="btn-rsvp" data-i18n="rsvp_no">Can't Make It</button>
            <button type="submit" class="btn-rsvp primary" data-i18n="rsvp_yes">Joyfully Accept</button>
          </div>
        </form>
      </div>
    `;
  }

  setupObserver() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const container = this.el.querySelector('.rsvp-container');
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
