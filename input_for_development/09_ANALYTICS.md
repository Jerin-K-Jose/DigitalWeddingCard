# 📊 Analytics System Design

---

## Philosophy

We track **emotional engagement**, not just page views.
The goal is to help the couple understand how their guests experienced the invitation —
which scenes held attention, where guests dropped off, and what drove RSVP conversions.

**Privacy-first principles**:
- No PII (Personally Identifiable Information) in analytics events
- No third-party SDKs (no Google Analytics, no Facebook Pixel)
- Anonymous session IDs (UUID in sessionStorage — not persistent)
- Data stored in couple's own Supabase project (they own it)

---

## Event Taxonomy

### Lifecycle Events

| Event | Trigger | Properties |
|---|---|---|
| `invitation_opened` | Page load complete | `{ device_type, language, referrer_type }` |
| `experience_started` | Tap/click on Scene 0 | `{ time_to_start_ms }` |
| `invitation_shared` | Share button tapped | `{ method: 'native' \| 'clipboard' }` |

### Scene Events

| Event | Trigger | Properties |
|---|---|---|
| `scene_viewed` | Scene enters 80% viewport | `{ scene_id, scene_index, scroll_progress }` |
| `scene_time_spent` | Scene exits viewport | `{ scene_id, duration_ms }` |

### Engagement Events

| Event | Trigger | Properties |
|---|---|---|
| `audio_enabled` | Guest unmutes | `{ scene_id, time_since_open_ms }` |
| `audio_disabled` | Guest mutes | `{ scene_id }` |
| `language_switched` | Language changed | `{ from, to }` |
| `idle_ambient` | 10s no interaction | `{ scene_id }` |

### Conversion Events

| Event | Trigger | Properties |
|---|---|---|
| `rsvp_opened` | RSVP scene 80% visible | `{}` |
| `rsvp_decision` | Yes or No tapped | `{ decision: 'attending' \| 'declining' }` |
| `rsvp_submitted` | Form submitted | `{ attending, guest_count, has_message }` |
| `rsvp_declined` | No form submitted | `{ has_message }` |
| `directions_clicked` | Directions button | `{ event_type: 'ceremony' \| 'reception' }` |
| `calendar_added` | Calendar download | `{ event_type: 'ceremony' \| 'reception' \| 'both' }` |

---

## Analytics Engine Design

```javascript
// src/engine/analytics.js

const analytics = {
  _queue: [],
  _sessionId: null,
  _clientId: null,
  _flushInterval: null,
  _supabase: null,

  init(config, supabaseClient) {
    if (!config.analytics?.enabled) return;
    this._clientId = config.analytics.clientId;
    this._supabase = supabaseClient;
    // Anonymous session ID — not persistent across sessions
    this._sessionId = sessionStorage.getItem('dwp_sid') || crypto.randomUUID();
    sessionStorage.setItem('dwp_sid', this._sessionId);
    // Flush queue every 5 seconds
    this._flushInterval = setInterval(() => this._flush(), 5000);
    // Flush on page unload (sendBeacon for reliability)
    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') this._flush(true);
    });
  },

  track(eventName, properties = {}) {
    this._queue.push({
      client_id:  this._clientId,
      session_id: this._sessionId,
      event_name: eventName,
      properties: {
        ...properties,
        url_path: location.pathname,
      },
      device_type: this._getDeviceType(),
      language:    document.documentElement.lang || 'en',
      created_at:  new Date().toISOString(),
    });
  },

  async _flush(useBeacon = false) {
    if (!this._queue.length || !this._supabase) return;
    const events = [...this._queue];
    this._queue = [];

    if (useBeacon && navigator.sendBeacon) {
      // Use sendBeacon for unload — guaranteed delivery
      navigator.sendBeacon(
        `${this._supabase.supabaseUrl}/rest/v1/analytics_events`,
        JSON.stringify(events)
      );
    } else {
      await this._supabase.from('analytics_events').insert(events);
    }
  },

  _getDeviceType() {
    const ua = navigator.userAgent;
    if (/tablet|ipad/i.test(ua)) return 'tablet';
    if (/mobile|android|iphone/i.test(ua)) return 'mobile';
    return 'desktop';
  }
};
```

---

## Instrumentation Points (Where to call `analytics.track`)

```javascript
// main.js — on page load
analytics.track('invitation_opened', {
  referrer_type: document.referrer ? 'link' : 'direct'
});

// scene-arrival.js — on tap
analytics.track('experience_started', {
  time_to_start_ms: Date.now() - pageLoadTime
});

// scene-engine.js — on each scene enter
analytics.track('scene_viewed', {
  scene_id: scene.id,
  scene_index: scene.index,
  scroll_progress: Math.round(scrollProgress * 100)
});

// audio-controller.js
analytics.track('audio_enabled', { scene_id: currentScene });

// i18n.js — on language switch
analytics.track('language_switched', { from: prevLang, to: newLang });

// rsvp-form.js
analytics.track('rsvp_submitted', {
  attending: true,
  guest_count: form.guestCount,
  has_message: form.message.length > 0
});

// scene-closing.js — share button
analytics.track('invitation_shared', { method: 'native' });
```

---

## Dashboard Analytics View

### Engagement Funnel

```
GUEST JOURNEY FUNNEL
──────────────────────────────────────────

Opened invitation          142 ████████████████████  100%
Started experience         118 █████████████████      83%
Saw couple's names         110 ████████████████       77%
Saw ceremony details        98 ██████████████         69%
Reached RSVP                91 █████████████         64%
Submitted RSVP              89 ████████████           63%

Drop-off analysis:
  Arrival → Prelude:   -17%  (normal — impatient users)
  Prelude → Names:      -7%  (healthy)
  Names → Ceremony:     -8%  (healthy)
  Ceremony → RSVP:      -8%  (healthy)
  RSVP → Submit:        -1%  (excellent conversion)
```

### Engagement Metrics

```
ENGAGEMENT SIGNALS

🎵 Audio enabled        68%   of guests who started
🌐 Language switched    31%   (Tamil most common)
⏱️ Avg time on invite    4m 12s
🔁 Repeat opens         23%   of unique sessions
😴 Entered ambient mode  41%   (high dwell engagement)
```

### Device Breakdown

```
DEVICE TYPE
📱 Mobile    78%  ██████████████████████████
💻 Desktop   18%  ██████
📱 Tablet     4%  █
```

---

## Privacy Disclosure

The invitation does not have a cookie banner — it collects no cookies.

Session IDs are:
- Stored in `sessionStorage` (not `localStorage`) — deleted when tab closes
- Not linked to any personal identity
- Not shared with any third party

A one-line disclosure can optionally appear in the footer:
> "This invitation uses anonymous analytics to help the couple understand engagement."
