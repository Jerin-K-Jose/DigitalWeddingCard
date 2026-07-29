# 🌐 Multi-Language System (i18n)

---

## Supported Languages — v1

| Code | Language | Script | Direction | Fonts |
|---|---|---|---|---|
| `en` | English | Latin | LTR | Cormorant Garamond + Lato |
| `ta` | Tamil | Tamil script | LTR | Noto Serif Tamil + Lato |
| `ml` | Malayalam | Malayalam script | LTR | Noto Serif Malayalam + Lato |

---

## Language Loading Flow

```
1. Shell HTML renders (blank — no strings yet)
2. Bootstrap JS reads config.language.default → "en"
3. Detect browser: navigator.language → "ta-IN" → prefer "ta"
4. Fetch /lang/ta.json (3KB — instant)
5. i18n.init(strings) → hydrate all [data-i18n] DOM nodes
6. Guest can tap 🌐 (globe icon) → switch to "ml" or "en"
   └── Fetch /lang/ml.json (if not cached)
   └── i18n.switch("ml") → re-hydrate DOM nodes
   └── Lazy-load Noto Serif Malayalam font
   └── Save "ml" to localStorage
7. On next visit → localStorage preference used first
```

---

## String File Structure — en.json

```json
{
  "_meta": {
    "code": "en",
    "name": "English",
    "dir": "ltr"
  },

  "scenes": {
    "arrival": {
      "tapToBegin": "Tap to begin"
    },
    "announcement": {
      "together": "Together with their families"
    },
    "ceremony": {
      "ceremonyLabel": "Holy Matrimony",
      "receptionLabel": "Reception",
      "dateLabel": "Date",
      "timeLabel": "Time",
      "venueLabel": "Venue",
      "dressCodeLabel": "Dress Code",
      "directionsBtn": "Get Directions"
    },
    "liturgy": {
      "sectionLabel": "A verse for the journey"
    },
    "rsvp": {
      "headline": "Will you celebrate with us?",
      "yesBtn": "Yes, we'll be there",
      "noBtn": "Sadly, we can't make it",
      "namePlaceholder": "Your name",
      "nameLabelRequired": "Your name *",
      "guestsLabel": "Number of guests",
      "phonePlaceholder": "Phone number (optional)",
      "phoneHelper": "We'll use this for WhatsApp updates",
      "messagePlaceholder": "A message for the couple (optional)",
      "submitBtn": "Send with love",
      "confirmYes": "We can't wait to see you, {name}! ✨",
      "confirmNo": "You'll be missed — we'll celebrate with you in spirit. 🤍",
      "addCalendar": "Add to Calendar",
      "deadline": "Please RSVP by {date}"
    },
    "closing": {
      "line": "We can't wait to celebrate with you.",
      "shareBtn": "Share this invitation"
    }
  },

  "ui": {
    "audioEnable": "Enable music",
    "audioDisable": "Mute music",
    "languageBtn": "Language",
    "scrollHint": "Scroll to explore"
  },

  "errors": {
    "rsvpFailed": "Something went wrong. Please try again.",
    "nameRequired": "Please enter your name to continue."
  }
}
```

---

## String File — ta.json (Tamil)

```json
{
  "_meta": {
    "code": "ta",
    "name": "தமிழ்",
    "dir": "ltr"
  },

  "scenes": {
    "arrival": {
      "tapToBegin": "தொடங்க தொடுக்கவும்"
    },
    "announcement": {
      "together": "இரு குடும்பங்களுடன் சேர்ந்து"
    },
    "ceremony": {
      "ceremonyLabel": "திருமண வைபவம்",
      "receptionLabel": "வரவேற்பு விழா",
      "dateLabel": "தேதி",
      "timeLabel": "நேரம்",
      "venueLabel": "இடம்",
      "dressCodeLabel": "உடை நிலை",
      "directionsBtn": "வழி காட்டு"
    },
    "liturgy": {
      "sectionLabel": "வாழ்க்கைப் பயணத்திற்கான வசனம்"
    },
    "rsvp": {
      "headline": "நம்முடன் கொண்டாட வருவீர்களா?",
      "yesBtn": "ஆம், நாங்கள் வருகிறோம் 🎉",
      "noBtn": "மன்னிக்கவும், முடியாது",
      "namePlaceholder": "உங்கள் பெயர்",
      "nameLabelRequired": "உங்கள் பெயர் *",
      "guestsLabel": "விருந்தினர் எண்ணிக்கை",
      "phonePlaceholder": "தொலைபேசி எண் (விருப்பத்தேர்வு)",
      "phoneHelper": "WhatsApp மூலம் தொடர்பு கொள்வோம்",
      "messagePlaceholder": "தம்பதியருக்கு ஒரு செய்தி (விருப்பத்தேர்வு)",
      "submitBtn": "அன்புடன் அனுப்பு",
      "confirmYes": "{name}, உங்களை சந்திக்க ஆவலாய் இருக்கிறோம்! ✨",
      "confirmNo": "நீங்கள் நிச்சயம் குறைவாக இருப்பீர்கள் 🤍",
      "addCalendar": "நாட்காட்டியில் சேர்",
      "deadline": "தயவுசெய்து {date} முன் உறுதிப்படுத்தவும்"
    },
    "closing": {
      "line": "உங்களுடன் கொண்டாட ஆவலாக காத்திருக்கிறோம்.",
      "shareBtn": "அழைப்பிதழை பகிர்"
    }
  },

  "ui": {
    "audioEnable": "இசையை இயக்கு",
    "audioDisable": "இசையை நிறுத்து",
    "languageBtn": "மொழி",
    "scrollHint": "உருட்டி காண்க"
  },

  "errors": {
    "rsvpFailed": "ஏதோ தவறு நடந்தது. மீண்டும் முயற்சிக்கவும்.",
    "nameRequired": "தொடர பெயரை உள்ளிடவும்."
  }
}
```

---

## i18n Engine Design

```javascript
// src/engine/i18n.js

const i18n = {
  _strings: {},
  _lang: 'en',

  async init(config) {
    // Priority: localStorage > browser lang > config default
    const saved    = localStorage.getItem('dwp_lang');
    const browser  = navigator.language?.split('-')[0];
    const available = config.language.available;

    this._lang = available.includes(saved)   ? saved   :
                 available.includes(browser)  ? browser :
                 config.language.default;

    await this._load(this._lang);
    this._hydrate();
  },

  async _load(lang) {
    const res = await fetch(`/lang/${lang}.json`);
    this._strings = await res.json();
    this._lang = lang;
  },

  async switch(lang) {
    await this._load(lang);
    localStorage.setItem('dwp_lang', lang);
    this._hydrate();
    this._loadFont(lang);
    // Set document direction
    document.documentElement.dir = this._strings._meta.dir;
  },

  // Resolve a string key: 'scenes.rsvp.headline'
  // Supports {name} interpolation
  t(key, vars = {}) {
    const keys = key.split('.');
    let val = this._strings;
    for (const k of keys) val = val?.[k];
    if (!val) return key; // Fallback: return key itself

    return Object.entries(vars).reduce(
      (str, [k, v]) => str.replace(`{${k}}`, v), val
    );
  },

  // Hydrate all DOM nodes with [data-i18n] attribute
  _hydrate() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      el.textContent = this.t(el.dataset.i18n);
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      el.placeholder = this.t(el.dataset.i18nPlaceholder);
    });
  },

  // Lazy-load Indic font when language changes
  _loadFont(lang) {
    const fontMap = {
      ta: { href: '/fonts/noto-serif-tamil.woff2', family: 'Noto Serif Tamil' },
      ml: { href: '/fonts/noto-serif-malayalam.woff2', family: 'Noto Serif Malayalam' },
    };
    if (!fontMap[lang]) return;
    const { href, family } = fontMap[lang];
    if (document.querySelector(`[data-font="${family}"]`)) return; // Already loaded
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'font';
    link.type = 'font/woff2';
    link.crossOrigin = 'anonymous';
    link.href = href;
    link.dataset.font = family;
    document.head.appendChild(link);
  }
};
```

---

## Language Switcher UI

```
Position: Fixed, top-right corner
Icon: Globe (🌐) — 20px, muted gold
Interaction: Click/tap → slide-down menu

┌──────────┐
│  🌐       │
├──────────┤
│ English  │ ← Active = gold dot
│ தமிழ்    │
│ മലയാളം  │
└──────────┘

Style:
  Background: var(--color-surface)
  Border: 1px solid var(--color-border)
  Border-radius: var(--radius-md)
  backdrop-filter: blur(8px)
  Font size: 14px
  Padding: 8px 16px per option
```

---

## HTML Usage Pattern

```html
<!-- Static string -->
<p data-i18n="scenes.ceremony.ceremonyLabel">Holy Matrimony</p>

<!-- Input placeholder -->
<input data-i18n-placeholder="scenes.rsvp.namePlaceholder" placeholder="Your name">

<!-- Dynamic (JS interpolation) -->
<p id="confirm-msg"></p>
<script>
  document.getElementById('confirm-msg').textContent =
    i18n.t('scenes.rsvp.confirmYes', { name: guestName });
</script>
```

The `data-i18n` attributes serve as fallback text AND the key — zero duplication.
