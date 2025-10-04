const db = require('../db');
const { publicSongUrl } = require('../storage');

// Get all songs
async function getSongs(req, res) {
  try {
    const { rows } = await db.query('SELECT * FROM songs ORDER BY song_id');
    const songs = rows.map((s) => ({
      ...s,
      url: publicSongUrl(s.file_path),
    }));
    res.json(songs);
  } catch (err) {
    console.error('Error fetching songs:', err);
    res.status(500).json({ error: 'Failed to fetch songs' });
  }
}

// Get songs by playlist
async function getSongsByPlaylist(req, res) {
  try {
    const playlistId = req.params.id;
    const { rows } = await db.query('SELECT * FROM songs WHERE playlist_id = $1', [playlistId]);
    const songs = rows.map((s) => ({
      ...s,
      url: publicSongUrl(s.file_path),
    }));
    res.json(songs);
  } catch (err) {
    console.error('Error fetching songs by playlist:', err);
    res.status(500).json({ error: 'Failed to fetch songs for playlist' });
  }
}

module.exports = {
  getSongs,
  getSongsByPlaylist,
};