# Time-Based Music Player

A web-based music player that changes playlists automatically based on the current time of day.

---

## Features
- 24 hours divided into **6 time blocks** (4 hours each).  
- Each block has its own playlist.  
- Auto-detects current time and plays the matching playlist.  
- If playlist ends before block changes → loops until the block ends.  
- Central clock UI with highlighted quadrant for active block.  
- Play/Pause button inside the clock.  
- Background dynamically changes with time block (morning, afternoon, night).  

---

## Time Blocks
| Block | Time Range     | Example Mood |
|-------|---------------|--------------|
| 1     | 00:00–03:59   | Chill / Sleep |
| 2     | 04:00–07:59   | Sunrise / Calm |
| 3     | 08:00–11:59   | Energetic / Focus |
| 4     | 12:00–15:59   | Active / Midday |
| 5     | 16:00–19:59   | Evening Relax |
| 6     | 20:00–23:59   | Night Vibes |

---

## Database Schema
### Tables
- **time_blocks**
  - block_id  
  - start_time  
  - end_time  
  - background_image  
  - playlist_id  

- **playlists**
  - playlist_id  
  - name  
  - list_of_songs  

- **songs**
  - song_id  
  - title  
  - url  
  - artist  
  - playlist_id  

---

## Tech Stack
- **Frontend**: React.js  
- **Backend**: Node.js/Express  
- **Database**: Supabase/PostgreSQL  
- **Audio Player**: HTML5 `<audio>` or Howler.js  

---

## How It Works
1. User opens the web portal.  
2. The system checks current time → finds the active time block.  
3. Loads the corresponding playlist.  
4. Songs play continuously.  
5. When a time block changes → background + playlist updates automatically.  

---
