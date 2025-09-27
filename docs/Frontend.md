# Frontend Documentation – Time-Based Music Player

The frontend is a **React.js single-page application** responsible for the user interface, time detection, and music playback.

---

## Key Responsibilities
- Detect system time and determine the active 4-hour block.
- Render the **clock UI**:
  - Hour and minute hands (like a real clock).
  - Highlight the quadrant of the active time block.
  - Central Play/Pause button.
- Trigger **playlist fetch** from backend API for the current block.
- Manage music playback loop until block changes.
- Dynamically update the background image based on the active block (morning, afternoon, night, etc.).

---

## Core Components
1. **Clock Component**
   - Analog-style watch.
   - Quadrant highlighting for current block.
   - Embedded Play/Pause button.

2. **Player Component**
   - Uses HTML5 `<audio>` or Howler.js.
   - Handles play, pause, skip, and loop logic.

3. **Background Component**
   - Fetches background URL from backend (per time block).
   - Dynamically changes image when block updates.

---

## Tech Stack
- **React.js** (UI library)
- **CSS / Tailwind CSS** (styling)
- **Howler.js** (audio library, optional)
- **Axios** (API calls to backend)