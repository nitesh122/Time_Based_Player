# Database Documentation – Time-Based Music Player

The database stores playlists, songs, and time block metadata.  
This project uses **Supabase/PostgreSQL** as the single source of truth (database + storage).

---

## Key Responsibilities
- Store playlist IDs and songs.
- Map playlists to 6 time blocks.
- Store background images linked to time blocks.

---

## Schema

### Table: `time_blocks`
| Column          | Type      | Description |
|-----------------|-----------|-------------|
| block_id        | INT (PK)  | Unique ID for time block |
| start_time      | TIME      | Block start (HH:MM) |
| end_time        | TIME      | Block end (HH:MM) |
| playlist_id     | INT (FK)  | Linked playlist |
| background_path | TEXT      | Path/key in Supabase Storage bucket `backgrounds` |

### Table: `playlists`
| Column       | Type      | Description |
|--------------|-----------|-------------|
| playlist_id  | INT (PK)  | Unique ID for playlist |
| name         | TEXT      | Playlist name |
| description  | TEXT      | Optional |

### Table: `songs`
| Column       | Type      | Description |
|--------------|-----------|-------------|
| song_id      | INT (PK)  | Unique ID for song |
| title        | TEXT      | Song title |
| file_path    | TEXT      | Path/key in Supabase Storage bucket `songs` |
| artist       | TEXT      | Song artist |
| playlist_id  | INT (FK)  | Linked playlist |

---

## Example Data
### `time_blocks`
| block_id | start_time | end_time | playlist_id | background_path |
|----------|------------|----------|-------------|----------------|
| 1        | 00:00      | 03:59    | 101         | night.jpg      |
| 2        | 04:00      | 07:59    | 102         | sunrise.jpg    |

### `playlists`
| playlist_id | name            |
|-------------|-----------------|
| 101         | Midnight Chill  |
| 102         | Sunrise Calm    |

### `songs`
| song_id | title      | file_path      | artist    | playlist_id |
|---------|------------|---------------|-----------|-------------|
| 1       | Moonlight  | moonlight.mp3 | Artist A  | 101         |
| 2       | Early Bird | early-bird.mp3| Artist B  | 102         |

---
All media files (backgrounds and songs) should be uploaded to Supabase Storage buckets `backgrounds` and `songs`. The backend constructs public URLs automatically using the project `SUPABASE_URL`.