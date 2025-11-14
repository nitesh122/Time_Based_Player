// api/playlists.js - Playlists endpoint for Vercel
const supabase = require('../backend/src/config/supabase');
const { setCorsHeaders, handleOptions } = require('../backend/src/config/cors');

module.exports = async (req, res) => {
  // Set CORS headers
  setCorsHeaders(res, 'GET,OPTIONS');

  // Handle OPTIONS preflight
  if (handleOptions(req, res)) return;

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {

    // Extract playlist ID from URL if present
    const urlParts = req.url.split('/');
    const playlistId = urlParts[urlParts.length - 1];

    if (playlistId && playlistId !== 'playlists' && !isNaN(playlistId)) {
      // Get specific playlist with songs
      const { data: playlist, error: playlistError } = await supabase
        .from('playlists')
        .select('*')
        .eq('playlist_id', playlistId)
        .single();

      if (playlistError) throw playlistError;

      const { data: songs, error: songsError } = await supabase
        .from('songs')
        .select('*')
        .eq('playlist_id', playlistId)
        .order('song_order');

      if (songsError) throw songsError;

      res.json({
        ...playlist,
        songs: songs || []
      });
    } else {
      // Get all playlists
      const { data, error } = await supabase
        .from('playlists')
        .select('*')
        .order('playlist_id');

      if (error) throw error;
      res.json(data);
    }

  } catch (error) {
    console.error('Playlists API error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
};
