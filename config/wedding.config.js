// ============================================================
// WEDDING CONFIG — the only file you touch for a new client.
// Change names, date, venue, content, theme here. Nothing else.
// ============================================================
window.WEDDING_CONFIG = {

  meta: {
    pageTitle: "Elena & Julian — With Joy"
  },

  theme: "christian-classic",   // matches a file in /themes

  couple: {
    bride: "Elena",
    groom: "Julian",
    monogram: "E&J"
  },

  date: {
    display: "Saturday · The Fourteenth of March · Twenty Twenty-Seven",
    iso: "2027-03-14T16:00:00"   // drives countdown
  },

  hero: {
    eyebrow: "Together with their families"
  },

  story: {
    eyebrow: "Our Story",
    heading: "Two hearts, one grace",
    text: "What began as a quiet friendship in a college choir grew, over six years, into a love built on faith, patience, and a shared table. We can't wait to celebrate this new chapter with the people who shaped us."
  },

  scripture: {
    text: "Above all, love each other deeply, because love covers over a multitude of sins.",
    reference: "1 Peter 4:8"
  },

  invitation: {
    eyebrow: "With Joyful Hearts",
    text: "Mr. & Mrs. Thomas and Mr. & Mrs. Varghese joyfully invite you to witness the union of their children in holy matrimony, and to ask God's blessing upon their new life together."
  },

  timeline: [
    { time: "4:00", label: "Holy Matrimony", sub: "St. Thomas Cathedral" },
    { time: "6:00", label: "Reception", sub: "The Fairview Terrace" },
    { time: "7:30", label: "Dinner & Dancing", sub: "Grand Hall" }
  ],

  venues: [
    { name: "St. Thomas Cathedral", address: "142 Cathedral Road, Kochi, Kerala", mapUrl: "#" },
    { name: "The Fairview Terrace", address: "Marine Drive, Kochi, Kerala", mapUrl: "#" }
  ],

  gallery: {
    count: 4   // number of placeholder cards; swap for real image URLs when ready
  },

  thankYou: {
    heading: "Thank you for being part of our story",
    text: "May God bless you as richly as He has blessed us in bringing you into our lives."
  },

  rsvp: {
    endpoint: null   // POST url when backend ready; null = client-side only
  },

  audio: {
    music: true,             // background music on/off
    transitionSounds: true,  // chime on/off
    musicSrc: "assets/audio/ambient-music.mp3",
    chimeSrc: "assets/audio/chime.mp3",
    volume: 0.3
  }
};
