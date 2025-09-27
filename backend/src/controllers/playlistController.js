const PlaylistModel = require('../models/playlistModel');

class PlaylistController {
  // Get playlist by ID with songs
  static async getPlaylistById(req, res) {
    try {
      const { id } = req.params;
      const playlist = await PlaylistModel.getPlaylistById(id);
      
      if (!playlist) {
        return res.status(404).json({ error: 'Playlist not found' });
      }

      res.json({
        playlist_id: playlist.playlist_id,
        name: playlist.name,
        description: playlist.description,
        songs: playlist.songs || []
      });
    } catch (error) {
      console.error('Error getting playlist:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get all playlists
  static async getAllPlaylists(req, res) {
    try {
      const playlists = await PlaylistModel.getAllPlaylists();
      res.json(playlists);
    } catch (error) {
      console.error('Error getting playlists:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = PlaylistController;
