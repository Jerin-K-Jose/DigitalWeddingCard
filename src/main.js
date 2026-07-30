/**
 * main.js — Bootstrap entry point
 *
 * Execution order:
 *   1. Parse client ID from URL
 *   2. Activate Scene 01 (loading) immediately
 *   3. Start particle canvas
 *   4. Fetch client config
 *   5. Load critical packs (theme + typography + layout CSS)
 *   6. Load religion module (SVG symbols injected into DOM)
 *   7. Apply document metadata (title, OG tags)
 *   8. Signal Scene 01 that assets are ready → transition begins
 *
 * /src/main.js
 */

import { SceneEngine }  from './engine/scene-engine.js';
import { PackLoader }   from './engine/pack-loader.js';
import { SceneLoading } from './components/scene-loading.js';
import { SceneEnvelope } from './components/scene-envelope.js';
import { SceneHero } from './components/scene-hero.js';
import { SceneStory } from './components/scene-story.js';
import { SceneLiturgy } from './components/scene-liturgy.js';
import { SceneTimeline } from './components/scene-timeline.js';
import { SceneVenue } from './components/scene-venue.js';
import { SceneRSVP } from './components/scene-rsvp.js';
import { SceneClosing } from './components/scene-closing.js';

/* ── Globals ──────────────────────────────────────────────── */
const PAGE_LOAD_TIME = Date.now();

/* ── Bootstrap ────────────────────────────────────────────── */
async function bootstrap() {
  // ── 1. Resolve client ID from URL ──────────────────────────
  const clientId = resolveClientId();

  // ── 2. Get DOM references ───────────────────────────────────
  const canvas = document.getElementById('particle-canvas');

  // ── 3. Initialize the scene engine ─────────────────────────
  const engine = new SceneEngine();
  window.__engine = engine; // Dev access in console

  // ── 4. Activate Scene 01 immediately ───────────────────────
  const sceneLoading = new SceneLoading(engine, canvas);
  engine.registerScene('loading', sceneLoading);
  
  const sceneEnvelope = new SceneEnvelope(engine);
  engine.registerScene('envelope', sceneEnvelope);

  const sceneHero = new SceneHero(engine);
  engine.registerScene('hero', sceneHero);
  
  const sceneStory = new SceneStory(engine);
  engine.registerScene('story', sceneStory);
  
  const sceneLiturgy = new SceneLiturgy(engine);
  engine.registerScene('liturgy', sceneLiturgy);

  const sceneTimeline = new SceneTimeline(engine);
  engine.registerScene('timeline', sceneTimeline);
  
  const sceneVenue = new SceneVenue(engine);
  engine.registerScene('venue', sceneVenue);
  
  const sceneRSVP = new SceneRSVP(engine);
  engine.registerScene('rsvp', sceneRSVP);
  
  const sceneClosing = new SceneClosing(engine);
  engine.registerScene('closing', sceneClosing);

  await engine.transitionTo('loading'); // Shows particles + cross right away

  // ── 5. Fetch client config ──────────────────────────────────
  let config;
  try {
    const res = await fetch(`/clients/${clientId}/config.json`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    config = await res.json();
  } catch (err) {
    console.error(`[DWP] Config load failed for "${clientId}":`, err);
    // Graceful fallback: try default client
    try {
      const res = await fetch('/clients/james-mary-2026/config.json');
      config    = await res.json();
    } catch (fallbackErr) {
      console.error('[DWP] Fallback config also failed:', fallbackErr);
      sceneLoading.onAssetsReady(); // Proceed anyway — blank state
      return;
    }
  }

  // Store globally so all scenes can access config
  window.__config = config;

  // ── 6. Load critical CSS packs ──────────────────────────────
  const loader = new PackLoader(config);
  await loader.loadCriticalPacks();

  // ── 7. Load religion module ───────────────────────────────────
  try {
    await loader.loadReligionModule();
  } catch (err) {
    console.warn('[DWP] Religion module failed:', err);
  }

  // ── 8. Initialize Scroll Scenes ───────────────────────────────
  // Construct the DOM for all scenes in the scroll experience now.
  // They remain hidden until scene-envelope unlocks scroll mode.
  await Promise.all([
    sceneHero.enter(),
    sceneStory.enter(),
    sceneLiturgy.enter(),
    sceneTimeline.enter(),
    sceneVenue.enter(),
    sceneRSVP.enter(),
    sceneClosing.enter()
  ]);

  // ── 9. Apply document metadata from config ──────────────────
  applyMetadata(config);

  // ── 9. Signal Scene 01: assets ready → transition out ──────
  sceneLoading.onAssetsReady();

  // ── 10. Dev timing log ─────────────────────────────────────
  if (import.meta.env?.DEV || location.hostname === 'localhost') {
    console.info(
      `[DWP] Bootstrap complete in ${Date.now() - PAGE_LOAD_TIME}ms`,
      { clientId, config }
    );
  }
}

/* ── URL Parsing ──────────────────────────────────────────── */

/**
 * Resolve client ID from:
 *   1. URL pathname:      invite.domain.com/james-mary-2026
 *   2. Query parameter:   ?c=james-mary-2026  (local dev)
 *   3. Default fallback:  james-mary-2026
 */
function resolveClientId() {
  // Pathname (production Cloudflare Pages)
  const path = location.pathname.replace(/^\/+|\/+$/g, '');
  if (path && path !== 'index.html' && !path.includes('.')) {
    return path;
  }

  // Query param (local development)
  const param = new URLSearchParams(location.search).get('c');
  if (param) return param;

  // Default
  return 'james-mary-2026';
}

/* ── Metadata ─────────────────────────────────────────────── */

function applyMetadata(config) {
  const { couple, ceremony, media } = config;

  const title       = `${couple.groomName} & ${couple.brideName}'s Wedding`;
  const description = `${ceremony.date} · ${ceremony.time} · ${ceremony.venue}`;
  const ogImage     = media?.ogCoverImage || '';
  const canonical   = location.href;

  document.title = title;

  setMeta('description',               description);
  setMeta('og:title',                  title,       true);
  setMeta('og:description',            description, true);
  setMeta('og:image',                  ogImage,     true);
  setMeta('og:url',                    canonical,   true);
  setMeta('twitter:title',             title);
  setMeta('twitter:description',       description);
  setMeta('twitter:image',             ogImage);

  // Set lang attribute
  const lang = config.language?.default || 'en';
  document.documentElement.lang = lang;
}

function setMeta(name, content, isProperty = false) {
  const selector = isProperty
    ? `meta[property="${name}"]`
    : `meta[name="${name}"]`;
  const el = document.querySelector(selector);
  if (el) el.setAttribute('content', content);
}

/* ── Run ──────────────────────────────────────────────────── */
bootstrap().catch(err => {
  console.error('[DWP] Fatal bootstrap error:', err);
});
