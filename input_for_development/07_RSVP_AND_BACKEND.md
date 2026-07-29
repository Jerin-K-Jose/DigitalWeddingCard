# 💌 RSVP System & Backend Design

> Backend: Supabase (free tier)
> No server required. PostgreSQL + REST API + Real-time subscriptions.

---

## Why Supabase

| Need | Supabase Feature |
|---|---|
| Store RSVP responses | PostgreSQL table + Row Level Security |
| Real-time couple dashboard | Realtime subscriptions |
| Secure write-only for guests | Anon key with INSERT-only RLS policy |
| Analytics event storage | Separate table, same project |
| Team read access | Service role key (admin dashboard only) |
| Cost | Free up to 500MB DB, 50,000 monthly active users |

---

## Supabase Project Structure

```
Supabase Project: "digital-wedding-platform"
│
├── Tables
│   ├── rsvps                   ← Guest RSVP responses
│   ├── analytics_events        ← Scene engagement events
│   └── clients                 ← Client configs (future admin use)
│
├── RLS Policies
│   ├── rsvps: INSERT (anon)    ← Guests can submit but not read
│   ├── rsvps: SELECT (service) ← Only admin dashboard reads
│   └── analytics: INSERT (anon)← Events written, never read by guest
│
└── Edge Functions (future)
    └── notify-couple           ← Email/WhatsApp notification on new RSVP
```

---

## Database Schema

### Table: `rsvps`

```sql
CREATE TABLE rsvps (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id       TEXT NOT NULL,          -- "james-mary-2026"
  guest_name      TEXT NOT NULL,
  guest_phone     TEXT,                   -- Optional
  guest_email     TEXT,                   -- Optional
  attending       BOOLEAN NOT NULL,       -- true = Yes, false = No
  guest_count     INTEGER DEFAULT 1 CHECK (guest_count BETWEEN 1 AND 20),
  meal_pref       TEXT,                   -- 'veg', 'non-veg', NULL
  message         TEXT,                   -- Personal note to couple
  language_used   TEXT DEFAULT 'en',      -- Language at time of RSVP
  device_type     TEXT,                   -- 'mobile', 'desktop', 'tablet'
  submitted_at    TIMESTAMPTZ DEFAULT now(),
  ip_hash         TEXT                    -- SHA-256 hash of IP (not raw IP)
);

-- Indexes
CREATE INDEX idx_rsvps_client_id ON rsvps(client_id);
CREATE INDEX idx_rsvps_attending ON rsvps(client_id, attending);
CREATE INDEX idx_rsvps_submitted ON rsvps(submitted_at);
```

### Table: `analytics_events`

```sql
CREATE TABLE analytics_events (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id       TEXT NOT NULL,
  session_id      TEXT NOT NULL,          -- Anonymous UUID (sessionStorage)
  event_name      TEXT NOT NULL,          -- e.g., 'scene_viewed'
  properties      JSONB DEFAULT '{}',     -- { scene: 'announcement', ... }
  device_type     TEXT,
  language        TEXT,
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_analytics_client ON analytics_events(client_id);
CREATE INDEX idx_analytics_event  ON analytics_events(client_id, event_name);
CREATE INDEX idx_analytics_time   ON analytics_events(created_at);
```

---

## Row Level Security Policies

```sql
-- RSVP table: guests can insert, nobody reads via anon
ALTER TABLE rsvps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "guests_can_insert_rsvp"
  ON rsvps FOR INSERT
  TO anon
  WITH CHECK (true);

-- No SELECT policy for anon = guests cannot read any RSVPs

-- Analytics: insert-only
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "clients_can_insert_analytics"
  ON analytics_events FOR INSERT
  TO anon
  WITH CHECK (true);
```

Admin dashboard uses the **service role key** (stored in Cloudflare Pages env var),
which bypasses RLS. Never expose this to the public invitation URL.

---

## RSVP Form — UX Design

### Step 1: The Decision

```
╔═══════════════════════════════════════════════╗
║                                               ║
║    Will you celebrate with us?               ║
║                                               ║
║    [  Yes, we'll be there 🎉  ]               ║
║                                               ║
║    [  Sadly, we can't make it  ]              ║
║                                               ║
╚═══════════════════════════════════════════════╝
```

- "Yes" button: Gold gradient, glowing
- "No" button: Ghost style, muted
- Clicking either animates a height-expand revealing Step 2 or the decline flow
- Both choices tracked in analytics

### Step 2a: Details (Attending = Yes)

```
Your name *
[                              ]

Number of guests
[ 1 ]  [ 2 ]  [ 3 ]  [ 4 ]  [ 5+ ]
  (tap-toggle chips, only one active)

Phone number (optional)
[                              ]
(We'll use this for WhatsApp updates)
```

### Step 3a: Personal Message

```
A message for James & Mary (optional)
╔══════════════════════════════╗
║                              ║
║                              ║
╚══════════════════════════════╝

            [ Send with love → ]
```

### Confirmation Screen (Attending = Yes)

```
         🎊  ← Confetti/petal burst on Canvas

   We can't wait to see you,
         Sarah! ✨

   October 18, 2026 · 10:00 AM
   St. Thomas Cathedral

   [ + Add to Calendar ]  [ Get Directions ]
```

### Step 2b: Decline Flow (Attending = No)

```
We're sorry you can't make it. 💙

Your name (optional)
[                              ]

A message for the couple (optional)
[                              ]

            [ Send our love → ]
```

Decline confirmation:
```
   Thank you, Sarah.
   You'll be missed — we'll celebrate
   with you in spirit. 🤍
```

---

## Add to Calendar — ICS Generator

No server needed — `.ics` file generated client-side as a Blob.

```
ICS Events Generated:
1. Wedding Ceremony
   - DTSTART: [config.ceremony.date + time in UTC]
   - SUMMARY: James & Mary's Wedding Ceremony
   - LOCATION: St. Thomas Cathedral, Cathedral Road, Chennai
   - DESCRIPTION: You're cordially invited to witness the Holy Matrimony of James & Mary.

2. Reception (if enabled)
   - DTSTART: [config.reception.date + time in UTC]
   - SUMMARY: James & Mary's Wedding Reception
   - LOCATION: Grand Ballroom, Taj Hotel
```

Compatible with: Google Calendar, Apple Calendar, Outlook.

---

## Couple's Dashboard

> URL: `invite.yourdomain.com/admin/james-mary-2026`
> Auth: Supabase magic link (email) — simple, no password to remember

### Dashboard Layout

```
┌─────────────────────────────────────────────────┐
│  James & Mary  ·  October 18, 2026              │
│  Admin Dashboard                    [ Sign Out ] │
├─────────────────────────────────────────────────┤
│                                                 │
│  RSVP SUMMARY                                   │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐           │
│  │   89    │ │   12    │ │  101    │           │
│  │ Attending│ │Declining│ │  Total  │           │
│  └─────────┘ └─────────┘ └─────────┘           │
│                                                 │
│  Attending headcount: 234 guests                │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  ENGAGEMENT ANALYTICS                           │
│                                                 │
│  Opened:          142 ████████████████████      │
│  Started:         118 █████████████████         │
│  Saw Names:       110 ████████████████          │
│  Saw Ceremony:     98 ██████████████            │
│  Reached RSVP:     91 █████████████             │
│  Submitted RSVP:   89 ████████████              │
│                                                 │
│  Audio enabled:   68% of guests                 │
│  Tamil language:  31% of guests                 │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  GUEST LIST                     [ Export CSV ]  │
│  ─────────────────────────────────────────────  │
│  Sarah Johnson       ✅  3 guests  "Can't wait" │
│  Raj Krishnamurthy   ✅  2 guests  "Blessed!"   │
│  Priya Thomas        ❌  —         "Miss you!"  │
│  ...                                            │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Real-time Updates

Dashboard uses Supabase's Realtime websocket channel.
When a new RSVP arrives, the count updates live — no refresh needed.
The couple can watch their guest list grow in real time.

---

## Environment Variables

```
# .env (never committed — in .gitignore)
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_ANON_KEY=eyJ...           ← Used in invitation (public, insert-only)
SUPABASE_SERVICE_KEY=eyJ...        ← Used in admin dashboard ONLY (private)
```

```
# .env.example (committed — safe to share)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_KEY=your-service-key-here
```
