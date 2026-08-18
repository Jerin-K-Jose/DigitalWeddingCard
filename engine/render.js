// ==========================================================
// RENDER — maps WEDDING_CONFIG -> DOM. No content hardcoded here.
// ==========================================================
(function () {
  const cfg = window.WEDDING_CONFIG;
  const $ = (id) => document.getElementById(id);
  const text = (id, val) => { const el = $(id); if (el) el.textContent = val; };

  document.title = cfg.meta.pageTitle;

  text('cfg-monogram-seal', cfg.couple.monogram);
  text('cfg-hero-eyebrow', cfg.hero.eyebrow);
  text('cfg-bride', cfg.couple.bride);
  text('cfg-groom', cfg.couple.groom);
  text('cfg-date', cfg.date.display);

  text('cfg-story-eyebrow', cfg.story.eyebrow);
  text('cfg-story-heading', cfg.story.heading);
  text('cfg-story-text', cfg.story.text);

  text('cfg-scripture-text', '"' + cfg.scripture.text + '"');
  text('cfg-scripture-ref', cfg.scripture.reference);

  text('cfg-invite-eyebrow', cfg.invitation.eyebrow);
  text('cfg-invite-text', cfg.invitation.text);

  const timelineEl = $('cfg-timeline');
  cfg.timeline.forEach(row => {
    timelineEl.insertAdjacentHTML('beforeend', `
      <div class="t-row">
        <div class="t-time">${row.time}</div>
        <div><div class="t-label">${row.label}</div><div class="t-sub">${row.sub}</div></div>
      </div>`);
  });

  const venuesEl = $('cfg-venues');
  cfg.venues.forEach(v => {
    venuesEl.insertAdjacentHTML('beforeend', `
      <div class="venue-card">
        <h3>${v.name}</h3><p>${v.address}</p>
        <a href="${v.mapUrl}">View on Map</a>
      </div>`);
  });

  const galleryEl = $('cfg-gallery');
  for (let i = 0; i < cfg.gallery.count; i++) {
    galleryEl.insertAdjacentHTML('beforeend', '<div class="g-card"></div>');
  }

  text('cfg-thanks-heading', cfg.thankYou.heading);
  text('cfg-thanks-text', cfg.thankYou.text);

  window.WEDDING_TARGET_DATE = new Date(cfg.date.iso);
})();
