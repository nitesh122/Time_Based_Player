// api/playlists.js - Playlists endpoint for Vercel
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabase;
if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
  supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    if (!supabase) {
      throw new Error('Database not configured');
    }

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
