// ==========================================================
// AUDIO — plays YOUR files from /assets/audio (set paths in config).
// Starts only on envelope tap (browser autoplay rule).
// ==========================================================
window.WeddingAudio = (function () {
  const cfg = window.WEDDING_CONFIG.audio || {};
  let musicEl, chimeEl, muted = false;

  function ensure() {
    if (musicEl) return;
    if (cfg.music && cfg.musicSrc) {
      musicEl = new Audio(cfg.musicSrc);
      musicEl.loop = true;
      musicEl.volume = cfg.volume ?? 0.3;
      musicEl.preload = 'auto';
    }
    if (cfg.transitionSounds && cfg.chimeSrc) {
      chimeEl = new Audio(cfg.chimeSrc);
      chimeEl.volume = Math.min((cfg.volume ?? 0.3) + 0.15, 1);
      chimeEl.preload = 'auto';
    }
  }

  function startMusic() {
    ensure();
    if (musicEl) musicEl.play().catch(() => {}); // ignore if file missing/blocked
  }

  function chime() {
    ensure();
    if (chimeEl) { chimeEl.currentTime = 0; chimeEl.play().catch(() => {}); }
  }

  function toggleMute() {
    muted = !muted;
    if (musicEl) musicEl.muted = muted;
    if (chimeEl) chimeEl.muted = muted;
    return !muted;
  }

  return { startMusic, chime, toggleMute };
})();
