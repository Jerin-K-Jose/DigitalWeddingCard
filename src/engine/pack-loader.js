/**
 * PackLoader — Dynamic asset fetching for the pack system.
 * Loads theme CSS, typography, layout, and animation packs
 * on demand without blocking the main thread.
 *
 * /src/engine/pack-loader.js
 */

export class PackLoader {
  constructor(config) {
    this.config   = config;
    this._loaded  = new Set();
  }

  /**
   * Load all critical packs in parallel.
   * Blocks only until CSS is ready (fonts swap in after).
   */
  async loadCriticalPacks() {
    const { client } = this.config;
    await Promise.all([
      this._loadCSS(
        `/public/packs/themes/${client.theme}/tokens.css`,
        'theme'
      ),
      this._loadCSS(
        `/public/packs/typography/${client.typographyPack}/fonts.css`,
        'typography'
      ),
      this._loadCSS(
        `/public/packs/layouts/${client.layout}/layout.css`,
        'layout'
      ),
    ]);
  }

  /**
   * Lazy-load the animation pack (deferred — not needed until Scene 02).
   * Returns the animation pack default export.
   */
  async loadAnimationPack() {
    if (this._loaded.has('animation')) return window.__animPack;

    const { animationPack } = this.config.client;
    try {
      const mod = await import(
        `/public/packs/animations/${animationPack}/index.js`
      );
      window.__animPack = mod.default;
      this._loaded.add('animation');
      return mod.default;
    } catch (err) {
      console.warn('[PackLoader] Animation pack failed, using minimal fallback:', err);
      window.__animPack = MINIMAL_ANIM_PACK;
      return MINIMAL_ANIM_PACK;
    }
  }

  /**
   * Lazy-load the religion module.
   * Returns the module meta JSON.
   */
  async loadReligionModule() {
    const { religion } = this.config.client;
    if (this._loaded.has('religion')) return window.__religionModule;

    try {
      const [meta] = await Promise.all([
        fetch(`/public/modules/religions/${religion}/meta.json`).then(r => r.json()),
        this._injectSVGSymbols(
          `/public/modules/religions/${religion}/symbols.svg`
        ),
      ]);
      window.__religionModule = meta;
      this._loaded.add('religion');
      return meta;
    } catch (err) {
      console.warn('[PackLoader] Religion module failed:', err);
      return null;
    }
  }

  /**
   * Inject SVG symbol definitions into the document body.
   * Allows using <use href="#symbol-id"> anywhere.
   */
  async _injectSVGSymbols(url) {
    if (document.querySelector(`[data-svg-src="${url}"]`)) return;
    try {
      const res  = await fetch(url);
      const text = await res.text();
      const div  = document.createElement('div');
      div.innerHTML       = text;
      div.dataset.svgSrc  = url;
      div.style.display   = 'none';
      div.setAttribute('aria-hidden', 'true');
      document.body.prepend(div);
    } catch (err) {
      console.warn('[PackLoader] SVG symbols failed:', url, err);
    }
  }

  /**
   * Inject a CSS <link> into the document <head>.
   * Resolves when the stylesheet is loaded.
   */
  _loadCSS(href, id) {
    return new Promise((resolve) => {
      if (document.querySelector(`link[data-pack="${id}"]`)) {
        resolve(); return;
      }
      const link        = document.createElement('link');
      link.rel          = 'stylesheet';
      link.href         = href;
      link.dataset.pack = id;
      link.onload       = resolve;
      link.onerror      = () => {
        console.warn(`[PackLoader] CSS pack load failed: ${href}`);
        resolve(); // Non-blocking — continue with defaults
      };
      document.head.appendChild(link);
    });
  }
}

/**
 * Minimal animation pack — used as fallback if celestial pack
 * fails to load. Provides instant reveals with no animation.
 */
const MINIMAL_ANIM_PACK = {
  onSceneEnter() {},
  onSceneExit()  {},
  ambientLoop()  { return () => {}; },
  textReveal(chars) {
    chars.forEach(c => { c.style.opacity = '1'; c.style.transform = 'none'; });
    return Promise.resolve();
  },
  wordReveal(words) {
    words.forEach(w => { w.style.opacity = '1'; });
    return Promise.resolve();
  },
  lineReveal(lines) {
    lines.forEach(l => { l.style.opacity = '1'; l.style.transform = 'none'; });
    return Promise.resolve();
  },
  lightBurst()          { return Promise.resolve(); },
  cardsSpring(cards)    { cards.forEach(c => { c.style.opacity = '1'; c.style.transform = 'none'; }); },
  celebrationBurst()    {},
};
