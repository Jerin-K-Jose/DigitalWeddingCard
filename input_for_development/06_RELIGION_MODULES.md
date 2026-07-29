# ✝️ Religion Module System

> Religion modules inject faith-specific content, symbols, liturgy, and terminology
> into the scene engine. A client's `config.religion` field loads the correct module.

---

## Philosophy

Religion is not a theme — it is a content and structural layer.
The platform separates religion from aesthetics:

- A **Hindu wedding** can use the `ivory-gold` theme (if the couple prefers it)
- A **Christian wedding** can use the `saffron-red` theme (for a Tamil Nadu context)
- Religion affects: terminology, symbols, scripture/liturgy block, Scene 5 content
- Religion does NOT affect: colors, fonts, animations (those are packs)

---

## Module Directory Structure

```
/public/modules/religions/
│
├── christian/
│   ├── meta.json          ← Terminology, feature flags
│   ├── symbols.svg        ← Cross, dove, wedding rings, olive branch
│   ├── verse-bank.js      ← Curated Bible verses by theme
│   └── liturgy.js         ← Blessing text, ceremony phrases
│
├── hindu/                 ← Planned v3
│   ├── meta.json
│   ├── symbols.svg        ← Om, lotus, kalash, mangalsutra
│   ├── mantra-bank.js     ← Sanskrit shlokas by theme
│   └── liturgy.js
│
├── muslim/                ← Planned v4
│   ├── meta.json
│   ├── symbols.svg        ← Bismillah (calligraphy), crescent, star
│   ├── dua-bank.js        ← Islamic duas and blessings
│   └── liturgy.js
│
├── sikh/                  ← Planned v4
│   ├── meta.json
│   ├── symbols.svg        ← Khanda, lotus
│   └── liturgy.js
│
└── civil/                 ← Non-religious, neutral
    ├── meta.json
    └── liturgy.js         ← Secular love quotes
```

---

## meta.json Schema (Religion Module)

```json
{
  "id": "christian",
  "name": "Christian",
  "version": "1.0.0",

  "terminology": {
    "ceremonyLabel": "Holy Matrimony",
    "eventLabel": "Wedding",
    "coupleLabel": "Bride & Groom",
    "venueLabel": "Church",
    "officiantLabel": "Pastor",
    "blessingLabel": "A verse for the journey"
  },

  "scene5": {
    "enabled": true,
    "type": "scripture",
    "primarySymbol": "cross",
    "showVerseReference": true
  },

  "symbols": {
    "primary": "cross",
    "secondary": "dove",
    "tertiary": "rings",
    "file": "symbols.svg"
  },

  "compatibleThemes": ["ivory-gold", "blush-rose", "midnight-navy", "emerald-sage"],
  "preferredTheme": "ivory-gold",

  "i18n": {
    "ceremonyLabel": {
      "en": "Holy Matrimony",
      "ta": "திருமண வைபவம்",
      "ml": "വിശുദ്ധ വിവാഹ കർമ്മം"
    }
  }
}
```

---

## Christian Module — Verse Bank

Verses are categorized by emotional theme, so teams can pick the right verse for each couple's story.

```javascript
// /public/modules/religions/christian/verse-bank.js

export const VERSE_BANK = {
  love: [
    { ref: '1 Corinthians 13:4-5', text: 'Love is patient, love is kind...' },
    { ref: 'Song of Solomon 3:4', text: 'I found the one my heart loves.' },
    { ref: 'John 15:12', text: 'Love one another as I have loved you.' },
  ],
  commitment: [
    { ref: 'Ruth 1:16', text: 'Where you go, I will go; where you stay, I will stay.' },
    { ref: 'Ecclesiastes 4:12', text: 'A cord of three strands is not quickly broken.' },
    { ref: 'Proverbs 18:22', text: 'He who finds a wife finds what is good.' },
  ],
  joy: [
    { ref: 'Psalm 118:24', text: 'This is the day the Lord has made; let us rejoice and be glad.' },
    { ref: 'Zephaniah 3:17', text: 'The Lord your God is with you; He rejoices over you with singing.' },
  ],
  blessing: [
    { ref: 'Numbers 6:24-26', text: 'The Lord bless you and keep you...' },
    { ref: 'Jeremiah 29:11', text: 'For I know the plans I have for you, plans to give you hope and a future.' },
  ],
};
```

---

## Hindu Module — Planned Design

> Status: Scaffolded in v1, content in v3

### Planned Differences from Christian Module

| Feature | Christian | Hindu |
|---|---|---|
| Scene 5 type | Scripture verse | Sanskrit shloka / mantra |
| Symbol | Cross, dove | Om, lotus, kalash |
| Ceremony label | Holy Matrimony | Vivah / Muhurtam |
| Scene 1 ambient | Subtle cross SVG | Subtle Om / lotus SVG |
| Theme recommendation | Ivory & Gold | Saffron & Red |
| Language additional | Tamil, Malayalam | Hindi, Telugu, Tamil |

---

## Muslim Module — Planned Design

> Status: Planned for v4

### Key Considerations

| Feature | Approach |
|---|---|
| Script direction | RTL (right-to-left) layout for Arabic content |
| Bismillah | Opens the invitation (Scene 1) as calligraphic SVG |
| Dua | Replaces Scene 5 scripture with an Islamic blessing |
| Imagery | No figurative imagery — geometric/arabesque ornaments |
| Music | Nasheed (vocal, no instruments) or ambient nature sounds |
| Ceremony label | Nikah |

### RTL Support Architecture

When `religion === 'muslim'` and `language === 'ar'`:
- `<html dir="rtl">` is set
- Layout CSS has RTL mirror utilities pre-authored
- Font loaded: Noto Naskh Arabic

---

## How Religion Modules Load

```javascript
// In src/main.js bootstrap

async function loadReligionModule(religionId) {
  const meta = await fetch(`/modules/religions/${religionId}/meta.json`).then(r => r.json());
  const { VERSE_BANK } = await import(`/modules/religions/${religionId}/verse-bank.js`);

  // Apply terminology to i18n layer
  i18n.mergeModuleStrings(meta.i18n);

  // Return module interface
  return {
    meta,
    verseBank: VERSE_BANK,
    getSymbolUrl: (name) => `/modules/religions/${religionId}/symbols.svg#${name}`,
  };
}
```
