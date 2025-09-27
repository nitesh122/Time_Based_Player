# Backend Documentation – Time-Based Music Player

The backend is built with **Node.js + Express**.  
It provides APIs for serving playlists, songs, and background images mapped to specific time blocks.

---

## 📌 Overview
The backend is the engine behind the **Time-Based Music Player**.  
It handles:
- Time detection (mapping system time → time block).
- Serving playlists and songs for each block.
- Sending background images for the UI.
- Looping logic (handled by frontend, but supported by backend data).

---

## 🛠 Tech Stack
- **Node.js + Express** – REST API framework.
- **SQLite (MVP)** – lightweight DB, file-based.
- **Supabase/Postgres (Scalable)** – alternative cloud-hosted option.
- **CORS + Axios** – for frontend-backend communication.

---

## 📂 Project Structure
backend/
├── src/
│ ├── index.js # Entry point
│ ├── routes/
│ │ ├── timeBlock.js
│ │ ├── playlist.js
│ │ └── song.js
│ ├── controllers/
│ │ ├── timeBlockController.js
│ │ ├── playlistController.js
│ │ └── songController.js
│ ├── models/
│ │ ├── timeBlockModel.js
│ │ ├── playlistModel.js
│ │ └── songModel.js
│ └── db.js # Database connection
├── package.json
└── README.md


---

## 🌐 API Endpoints

### 1. Get Current Time Block
**Endpoint**
GET /api/time-block
Response
{
  "block_id": 3,
  "start_time": "08:00",
  "end_time": "11:59",
  "playlist_id": 101,
  "background_image": "/images/morning.jpg"
}
GET /api/playlists/:id
Response 
{
  "playlist_id": 101,
  "name": "Morning Energy",
  "songs": [
    { "song_id": 1, "title": "Song A", "url": "/songs/songA.mp3", "artist": "Artist A" },
    { "song_id": 2, "title": "Song B", "url": "/songs/songB.mp3", "artist": "Artist B" }
  ]
}
GET /api/songs/:id
Response
{
  "song_id": 1,
  "title": "Song A",
  "url": "/songs/songA.mp3",
  "artist": "Artist A",
  "playlist_id": 101
}
GET /api/time-blocks
Response
[
  { "block_id": 1, "start_time": "00:00", "end_time": "03:59", "playlist_id": 101, "background_image": "night.jpg" },
  { "block_id": 2, "start_time": "04:00", "end_time": "07:59", "playlist_id": 102, "background_image": "sunrise.jpg" }
]

