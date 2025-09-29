# Time-Based Music Player

A web-based music player that automatically changes playlists based on the current time of day. The application divides 24 hours into 6 time blocks (4 hours each) and plays appropriate music for each time period.

## Features

- 🕐 **6 Time Blocks**: Midnight Chill, Sunrise Calm, Morning Energy, Afternoon Focus, Evening Relax, Night Vibes
- 🎵 **Dynamic Playlists**: Each time block has its own curated playlist
- ⏰ **Real-time Clock**: Beautiful analog clock with quadrant highlighting
- 🎨 **Dynamic Backgrounds**: Background changes based on time of day
- 🔄 **Auto-looping**: Playlists loop until the time block changes
- 📱 **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

### Backend
- **Node.js** + **Express** - REST API server
- **SQLite** - Lightweight database
- **CORS** - Cross-origin resource sharing

### Frontend
- **React.js** - User interface library
- **CSS3** - Styling with modern features
- **Axios** - HTTP client for API calls

## Project Structure

```
Time_Based_Player/
├── backend/                 # Node.js + Express backend
│   ├── src/
│   │   ├── index.js        # Entry point
│   │   ├── routes/         # API routes
│   │   ├── controllers/    # Business logic
│   │   ├── models/         # Data models
│   │   └── db.js          # Database connection
│   ├── package.json
│   └── init-db.js         # Database initialization
├── frontend/               # React.js frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── services/       # API services
│   │   ├── utils/          # Utility functions
│   │   └── App.js
│   └── package.json
├── database/               # SQLite database files
└── docs/                   # Documentation

## API Endpoints

### Time Blocks
- `GET /api/time-blocks` - Get all time blocks
- `GET /api/time-blocks/current` - Get current time block
- `GET /api/time-blocks/:id` - Get time block by ID

### Playlists
- `GET /api/playlists` - Get all playlists
- `GET /api/playlists/:id` - Get playlist by ID with songs

### Songs
- `GET /api/songs/:id` - Get song by ID

### Health Check
- `GET /api/health` - API health status

## Time Blocks

| Block | Time Range     | Playlist Name    | Description |
|-------|---------------|------------------|-------------|
| 1     | 00:00–03:59   | Midnight Chill   | Relaxing music for late night |
| 2     | 04:00–07:59   | Sunrise Calm     | Peaceful morning vibes |
| 3     | 08:00–11:59   | Morning Energy   | Upbeat music to start the day |
| 4     | 12:00–15:59   | Afternoon Focus  | Productive midday music |
| 5     | 16:00–19:59   | Evening Relax    | Wind down after work |
| 6     | 20:00–23:59   | Night Vibes      | Late evening atmosphere |



## Environment Variables

### Backend (.env)
```
DATABASE_URL=sqlite:///./database/music_player.db
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_NAME=Time-Based Music Player
REACT_APP_VERSION=1.0.0
```

## Database Schema

### time_blocks
- `block_id` (INT, PK) - Unique ID for time block
- `start_time` (TEXT) - Block start time (HH:MM)
- `end_time` (TEXT) - Block end time (HH:MM)
- `playlist_id` (INT, FK) - Linked playlist
- `background_image` (TEXT) - Background image URL

### playlists
- `playlist_id` (INT, PK) - Unique ID for playlist
- `name` (TEXT) - Playlist name
- `description` (TEXT) - Playlist description

### songs
- `song_id` (INT, PK) - Unique ID for song
- `title` (TEXT) - Song title
- `url` (TEXT) - Song file path or URL
- `artist` (TEXT) - Song artist
- `playlist_id` (INT, FK) - Linked playlist