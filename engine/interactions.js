// ==========================================================
// INTERACTIONS — envelope, scroll reveal, parallax, countdown, RSVP.
// Content-agnostic. Reads only WEDDING_TARGET_DATE from render.js.
// ==========================================================
(function () {
  // petals — original look
  const petalHost = document.getElementById('petals');
  for (let i = 0; i < 9; i++) {
    const p = document.createElement('div');
    p.className = 'petal';
    p.style.left = (i * 11 + Math.random() * 8) + 'vw';
    p.style.animationDuration = (7 + Math.random() * 5) + 's, ' + (2.5 + Math.random()) + 's';
    p.style.animationDelay = (i * -1.4) + 's, ' + (i * -0.4) + 's';
    p.style.transform = 'scale(' + (0.6 + Math.random() * 0.8) + ')';
    petalHost.appendChild(p);
  }

  // 3D scroll pass-through fallback for browsers without native
  // animation-timeline:view() support (Safari / iOS / macOS).
  // Chromium (Android Chrome, Windows Chrome/Edge) uses the free
  // native CSS version and skips all of this.
  const supportsViewTimeline = window.CSS && CSS.supports && CSS.supports('animation-timeline: view()');
  let cineEls = null;
  if (!supportsViewTimeline) {
    document.documentElement.classList.add('js-cine');
    cineEls = [...document.querySelectorAll('.scene > .section')].map(el => ({
      el, top: el.offsetTop, h: el.offsetHeight
    }));
    window.addEventListener('resize', () => {
      cineEls.forEach(c => { c.top = c.el.offsetTop; c.h = c.el.offsetHeight; });
    }, { passive: true });
  }
  function cine() {
    if (!cineEls) return;
    const y = window.scrollY, vh = window.innerHeight;
    cineEls.forEach(c => {
      const localTop = c.top - y;
      const d = Math.max(-1, Math.min(1, (localTop + c.h / 2 - vh / 2) / (vh / 2)));
      const amt = Math.min(1, Math.abs(d) * 1.6);
      const exiting = d < 0;
      const rotX = exiting ? 12 * amt : -14 * amt;
      const tz = exiting ? -380 * amt : -420 * amt;
      const scale = 1 - (exiting ? 0.10 : 0.14) * amt;
      c.el.style.transform = `translateZ(${tz}px) rotateX(${rotX}deg) scale(${scale})`;
      c.el.style.opacity = 1 - amt;
      c.el.style.filter = amt > 0.02 ? `blur(${(exiting ? 3 : 4) * amt}px)` : '';
    });
  }

  // parallax — cache offsetTop once (no per-frame layout reads = no reflow thrash)
  const depthEls = [...document.querySelectorAll('[data-speed]')].map(el => ({
    el, speed: parseFloat(el.dataset.speed), parentTop: el.parentElement.offsetTop
  }));
  window.addEventListener('resize', () => {
    depthEls.forEach(d => d.parentTop = d.el.parentElement.offsetTop);
  }, { passive: true });
  let ticking = false;
  function parallax() {
    const y = window.scrollY, vh = window.innerHeight;
    depthEls.forEach(d => {
      const relTop = d.parentTop - y;
      if (relTop < -vh - 200 || relTop > vh + 200) return;
      d.el.style.transform = 'translate3d(0,' + (relTop * d.speed) + 'px,0)';
    });
    ticking = false;
  }
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(() => { parallax(); cine(); }); ticking = true; }
  }, { passive: true });
  parallax(); cine();

  // envelope open
  const gate = document.getElementById('gate');
  const env = document.getElementById('envelope');
  env.addEventListener('click', () => {
    if (env.classList.contains('open')) return;
    env.classList.add('open');
    if (window.WeddingAudio) window.WeddingAudio.chime();
    if (window.WeddingAudio) window.WeddingAudio.startMusic();
    setTimeout(() => gate.classList.add('hidden'), 550);
  }, { once: true });

  // scroll reveal — will-change only during the transition, then released
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      el.classList.add('animating');
      requestAnimationFrame(() => el.classList.add('in'));
      el.addEventListener('transitionend', () => el.classList.remove('animating'), { once: true });
      io.unobserve(el);
    });
  }, { threshold: .2 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // countdown
  function tick() {
    const diff = window.WEDDING_TARGET_DATE - new Date();
    if (diff <= 0) return;
    document.getElementById('cd-d').textContent = Math.floor(diff / 86400000);
    document.getElementById('cd-h').textContent = Math.floor(diff % 86400000 / 3600000);
    document.getElementById('cd-m').textContent = Math.floor(diff % 3600000 / 60000);
  }
  tick(); setInterval(tick, 30000);

  // RSVP (client-side stub — wire cfg.rsvp.endpoint when backend ready)
  document.getElementById('rsvpForm').addEventListener('submit', e => {
    e.preventDefault();
    if (window.WeddingAudio) window.WeddingAudio.chime();
    e.target.querySelector('.btn').textContent = 'Received ✓';
  });
})();
