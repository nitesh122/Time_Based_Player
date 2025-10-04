const db = require('../db');
const { publicSongUrl } = require('../storage');

// Get all playlists
async function getPlaylists(req, res) {
  try {
    const { rows } = await db.query('SELECT * FROM playlists ORDER BY playlist_id');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching playlists:', err);
    res.status(500).json({ error: 'Failed to fetch playlists' });
  }
}

// Get single playlist with songs
async function getPlaylistById(req, res) {
  try {
    const playlistId = req.params.id;
    const { rows } = await db.query('SELECT * FROM playlists WHERE playlist_id = $1', [playlistId]);

    if (!rows.length) return res.status(404).json({ error: 'Playlist not found' });

    const playlist = rows[0];
    const { rows: songRows } = await db.query('SELECT * FROM songs WHERE playlist_id = $1', [playlistId]);

    playlist.songs = songRows.map((s) => ({
      ...s,
      url: publicSongUrl(s.file_path),
    }));

    res.json(playlist);
  } catch (err) {
    console.error('Error fetching playlist:', err);
    res.status(500).json({ error: 'Failed to fetch playlist' });
  }
}

module.exports = {
  getPlaylists,
  getPlaylistById,
};
