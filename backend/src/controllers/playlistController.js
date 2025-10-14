const { supabase } = require('../db');
const { publicSongUrl } = require('../storage');

// Get all playlists
async function getPlaylists(req, res) {
  try {
    const { data, error } = await supabase
      .from('playlists')
      .select('*')
      .order('playlist_id');
    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    console.error('Error fetching playlists:', err);
    res.status(500).json({ error: 'Failed to fetch playlists' });
  }
}

// Get single playlist with songs
async function getPlaylistById(req, res) {
  try {
    const playlistId = req.params.id;
    const { data: playlistRows, error: pErr } = await supabase
      .from('playlists')
      .select('*')
      .eq('playlist_id', playlistId)
      .limit(1);
    if (pErr) throw pErr;
    if (!playlistRows || !playlistRows.length) return res.status(404).json({ error: 'Playlist not found' });

    const playlist = playlistRows[0];
    const { data: songs, error: sErr } = await supabase
      .from('songs')
      .select('*')
      .eq('playlist_id', playlistId)
      .order('song_id');
    if (sErr) throw sErr;

    playlist.songs = (songs || []).map((s) => ({
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
