const { supabase } = require('../db');
const { publicSongUrl } = require('../storage');

// Get all songs
async function getSongs(req, res) {
  try {
    const { data, error } = await supabase
      .from('songs')
      .select('*')
      .order('song_id');
    if (error) throw error;
    const songs = (data || []).map((s) => ({
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
    const { data, error } = await supabase
      .from('songs')
      .select('*')
      .eq('playlist_id', playlistId)
      .order('song_id');
    if (error) throw error;
    const songs = (data || []).map((s) => ({
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