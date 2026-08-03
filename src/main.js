/**
 * main.js
 * Single, lightweight controller for the Digital Wedding Card.
 * Replaces the complex scene-engine architecture with simple DOM hydration.
 */

document.addEventListener('DOMContentLoaded', async () => {
  // 1. Determine client ID
  const urlParams = new URLSearchParams(window.location.search);
  const clientId = urlParams.get('c') || 'james-mary-2026';

  // 2. Fetch Configuration
  let config;
  try {
    const res = await fetch(`/clients/${clientId}/config.json`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    config = await res.json();
  } catch (err) {
    console.error(`[DWP] Config load failed for "${clientId}":`, err);
    try {
      const res = await fetch('/clients/james-mary-2026/config.json');
      config = await res.json();
    } catch (fallbackErr) {
      console.error('[DWP] Fallback config also failed. Stopping.');
      return;
    }
  }

  // 3. Hydrate DOM
  hydrateDOM(config);

  // 4. Initialize Animations and Interactions
  initPetals();
  initParallax();
  initEnvelope();
  initScrollReveal();
  initCountdown(config.ceremony.dateISO, config.ceremony.time);
});

function hydrateDOM(config) {
  // Meta
  document.getElementById('doc-title').textContent = `${config.couple.brideName} & ${config.couple.groomName} — Wedding Invitation`;
  
  // Envelope Seal
  document.getElementById('seal-initials').textContent = `${config.couple.brideName[0]}&${config.couple.groomName[0]}`;
  
  // Hero
  document.getElementById('hero-bride').textContent = config.couple.brideName;
  document.getElementById('hero-groom').textContent = config.couple.groomName;
  document.getElementById('hero-date').textContent = config.ceremony.date;

  // Story
  document.getElementById('story-tagline').textContent = config.couple.tagline || 'Two hearts, one grace';
  document.getElementById('story-text').textContent = config.couple.story || 'What began as a quiet friendship grew into a love built on faith. We can\'t wait to celebrate this new chapter with the people who shaped us.';
  
  // Liturgy
  document.getElementById('liturgy-text').textContent = config.liturgy?.text || 'Love is patient, love is kind.';
  document.getElementById('liturgy-ref').textContent = config.liturgy?.verse || '1 Corinthians 13:4';

  // Invitation Text
  const famGroom = config.couple.groomFamilyLine || 'Mr. & Mrs. Johnson';
  const famBride = config.couple.brideFamilyLine || 'Mr. & Mrs. George';
  document.getElementById('family-invitation-text').innerHTML = `${famBride} and ${famGroom} joyfully invite you to witness the union of their children in holy matrimony, and to ask God's blessing upon their new life together.`;

  // Timeline
  const timelineContainer = document.getElementById('timeline-container');
  timelineContainer.innerHTML = ''; // Clear stub
  const events = [
    { time: config.ceremony.time, label: 'Holy Matrimony', sub: config.ceremony.venue },
  ];
  if (config.reception?.enabled) {
    events.push({ time: config.reception.time, label: 'Reception', sub: config.reception.venue });
  }
  if (config.dinner?.enabled) {
    events.push({ time: config.dinner.time, label: 'Dinner & Celebration', sub: config.dinner.venue });
  }

  events.forEach(ev => {
    timelineContainer.innerHTML += `
      <div class="t-row">
        <div class="t-time">${ev.time.replace(/ AM| PM/i, '')}</div>
        <div>
          <div class="t-label">${ev.label}</div>
          <div class="t-sub">${ev.sub}</div>
        </div>
      </div>
    `;
  });

  // Venues
  const venuesContainer = document.getElementById('venues-container');
  venuesContainer.innerHTML = '';
  const venues = [
    { title: config.ceremony.venue, address: config.ceremony.address, url: config.ceremony.mapsUrl }
  ];
  if (config.reception?.enabled && config.reception.venue !== config.ceremony.venue) {
    venues.push({ title: config.reception.venue, address: config.reception.address, url: config.reception.mapsUrl });
  }
  
  venues.forEach(v => {
    venuesContainer.innerHTML += `
      <div class="venue-card">
        <h3>${v.title}</h3>
        <p>${v.address}</p>
        <a href="${v.url}" target="_blank" rel="noopener noreferrer">View on Map</a>
      </div>
    `;
  });

  // RSVP
  if (config.rsvp?.deadline) {
    document.getElementById('rsvp-deadline').textContent = `Please respond by ${config.rsvp.deadline}`;
  }

  // Footer
  document.getElementById('footer-text').textContent = `${config.couple.brideName} & ${config.couple.groomName} · ${config.ceremony.date}`;
}

// --- Animation & Interaction Logic ---

function initPetals() {
  const petalHost = document.getElementById('petals');
  if (!petalHost) return;
  for (let i = 0; i < 9; i++) {
    const p = document.createElement('div');
    p.className = 'petal';
    p.style.left = (i * 11 + Math.random() * 8) + 'vw';
    p.style.animationDuration = (7 + Math.random() * 5) + 's, ' + (2.5 + Math.random()) + 's';
    p.style.animationDelay = (i * -1.4) + 's, ' + (i * -0.4) + 's';
    p.style.transform = 'scale(' + (0.6 + Math.random() * 0.8) + ')';
    petalHost.appendChild(p);
  }
}

function initParallax() {
  const depthEls = [...document.querySelectorAll('[data-speed]')];
  let ticking = false;
  function parallax() {
    const vh = window.innerHeight;
    depthEls.forEach(el => {
      const r = el.parentElement.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) return; // skip offscreen
      const speed = parseFloat(el.dataset.speed);
      el.style.transform = 'translate3d(0,' + (r.top * speed) + 'px,0)';
    });
    ticking = false;
  }
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(parallax); ticking = true; }
  }, {passive:true});
  parallax();
}

function initEnvelope() {
  const gate = document.getElementById('gate');
  const env = document.getElementById('envelope');
  if (!env || !gate) return;
  
  env.addEventListener('click', () => {
    if (env.classList.contains('open')) return;
    env.classList.add('open');
    setTimeout(() => gate.classList.add('hidden'), 550);
  }, {once:true});
}

function initScrollReveal() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { 
      if (e.isIntersecting) { 
        e.target.classList.add('in'); 
        io.unobserve(e.target); 
      } 
    });
  }, {threshold: 0.15}); // slightly lower threshold for better mobile feel
  
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
}

function initCountdown(dateISO, timeStr) {
  if (!dateISO) return;
  // Combine date and time for target
  const timeStrClean = timeStr ? timeStr.replace(/ AM| PM/i, ':00') : '00:00:00';
  const target = new Date(`${dateISO}T${timeStrClean}`);
  
  function tick() {
    const diff = target - new Date();
    if (diff <= 0) return;
    const d = Math.floor(diff/86400000);
    const h = Math.floor(diff%86400000/3600000);
    const m = Math.floor(diff%3600000/60000);
    
    const elD = document.getElementById('cd-d');
    const elH = document.getElementById('cd-h');
    const elM = document.getElementById('cd-m');
    
    if (elD) elD.textContent = d;
    if (elH) elH.textContent = h;
    if (elM) elM.textContent = m;
  }
  
  tick(); 
  setInterval(tick, 30000);
}

// RSVP (client-side stub)
const rsvpForm = document.getElementById('rsvpForm');
if (rsvpForm) {
  rsvpForm.addEventListener('submit', e => {
    e.preventDefault();
    e.target.querySelector('.btn').textContent = 'Received ✓';
  });
}
