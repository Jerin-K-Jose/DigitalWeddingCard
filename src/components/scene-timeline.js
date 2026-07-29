/**
 * SceneTimeline — Scene 06: Timeline / Details
 *
 * Displays the event timeline using a premium glassmorphism card layout.
 *
 * /src/components/scene-timeline.js
 */

export class SceneTimeline {
  constructor(engine) {
    this.engine = engine;
    this.id     = 'timeline';
    this.el     = null;
    this.observer = null;
  }

  async enter() {
    this.el = document.getElementById('scene-timeline');
    if (!this.el) return;

    this.render();
    this.setupObserver();
    
    this.el.classList.add('active');
  }

  render() {
    const config = window.__config;
    
    // Sample events (would normally come from config)
    const events = [
      {
        time: "3:30 PM",
        title: "Holy Matrimony",
        desc: "The covenant of marriage at the main cathedral."
      },
      {
        time: "6:00 PM",
        title: "Reception & Dinner",
        desc: "A celebration of love with family and friends."
      }
    ];

    this.el.innerHTML = `
      <style>
        #scene-timeline {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4rem 2rem;
          background: linear-gradient(135deg, var(--color-bg) 0%, #151310 100%);
          position: relative;
        }

        .timeline-glass-card {
          width: 100%;
          max-width: 600px;
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(201,168,76, 0.15);
          border-radius: 8px;
          padding: 3rem 2rem;
          box-shadow: 0 24px 64px rgba(0,0,0,0.4);
          
          opacity: 0;
          transform: translateY(60px);
          transition: opacity 1.2s ease, transform 1.2s cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        .timeline-glass-card.is-visible {
          opacity: 1;
          transform: translateY(0);
        }

        .timeline-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .timeline-title {
          font-family: var(--font-heading);
          font-size: 2.5rem;
          color: var(--color-accent-light);
          margin-bottom: 0.5rem;
        }

        .timeline-subtitle {
          font-family: var(--font-body);
          font-size: var(--text-sm);
          letter-spacing: var(--tracking-widest);
          text-transform: uppercase;
          color: var(--color-accent-gold);
        }

        .event-list {
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
          position: relative;
        }
        
        /* The golden thread */
        .event-list::before {
          content: '';
          position: absolute;
          left: 19px;
          top: 0;
          bottom: 0;
          width: 1px;
          background: linear-gradient(to bottom, transparent, var(--color-accent-gold), transparent);
          opacity: 0.3;
        }

        .event-item {
          display: flex;
          gap: 1.5rem;
          position: relative;
          opacity: 0;
          transform: translateX(-20px);
          transition: opacity 0.8s ease, transform 0.8s ease;
        }

        .timeline-glass-card.is-visible .event-item {
          opacity: 1;
          transform: translateX(0);
        }
        
        .timeline-glass-card.is-visible .event-item:nth-child(2) {
          transition-delay: 0.2s;
        }

        .event-dot {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #0d0b08;
          border: 1px solid var(--color-accent-gold);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          z-index: 2;
          box-shadow: 0 0 16px rgba(201,168,76, 0.2);
        }
        
        .event-dot::after {
          content: '';
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--color-accent-gold);
        }

        .event-content {
          padding-top: 8px;
        }

        .event-time {
          font-family: var(--font-body);
          font-size: var(--text-sm);
          letter-spacing: var(--tracking-wider);
          color: var(--color-accent-gold);
          margin-bottom: 0.25rem;
        }

        .event-title {
          font-family: var(--font-heading);
          font-size: 1.5rem;
          color: #f5e6c8;
          margin-bottom: 0.5rem;
        }

        .event-desc {
          font-family: var(--font-body);
          font-size: 0.9rem;
          line-height: 1.5;
          color: var(--color-muted-light);
        }
      </style>
      
      <div class="timeline-glass-card">
        <div class="timeline-header">
          <h2 class="timeline-title">The Celebration</h2>
          <div class="timeline-subtitle">Order of Events</div>
        </div>
        
        <div class="event-list">
          ${events.map(ev => `
            <div class="event-item">
              <div class="event-dot"></div>
              <div class="event-content">
                <div class="event-time">${ev.time}</div>
                <div class="event-title">${ev.title}</div>
                <div class="event-desc">${ev.desc}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  setupObserver() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const card = this.el.querySelector('.timeline-glass-card');
          if (card) card.classList.add('is-visible');
          this.observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    this.observer.observe(this.el);
  }

  async exit() {
    if (this.observer && this.el) {
      this.observer.disconnect();
    }
  }
}
