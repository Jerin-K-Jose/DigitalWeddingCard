# Digital Wedding Card

A beautiful, static digital wedding invitation template. 

## Features
- **Dynamic Configuration:** Easily customize names, dates, venues, themes, and content via a single `wedding.config.js` file.
- **Theming:** Easily swappable themes (e.g., `christian-classic`).
- **Interactive:** Scroll reveals, parallax background effects, envelope opening animation.
- **Audio:** Built-in background music and UI transition sounds.
- **RSVP Form:** Client-side RSVP form ready for a backend endpoint integration.
- **Countdown Timer:** Automatically counts down to the configured wedding date.

## Structure
- `index.html`: The main page layout.
- `config/wedding.config.js`: Central configuration file containing all dynamic text and settings.
- `engine/`: Core JavaScript files handling rendering, interactions, and audio.
- `core/`: Base CSS styles that define the layout.
- `themes/`: Thematic CSS that provides specific aesthetics.
- `assets/`: Media assets including images and audio.

## How to Customize
1. Open `config/wedding.config.js`.
2. Update the couple's names, dates, venues, and other details.
3. Change the `theme` variable to select a different style from the `themes/` directory.
4. Replace placeholder images and audio in the `assets/` directory.
