const SongModel = require('../models/songModel');

class SongController {
  // Get song by ID
  static async getSongById(req, res) {
    try {
      const { id } = req.params;
      const song = await SongModel.getSongById(id);
      
      if (!song) {
        return res.status(404).json({ error: 'Song not found' });
      }

      res.json({
        song_id: song.song_id,
        title: song.title,
        url: song.url,
        artist: song.artist,
        playlist_id: song.playlist_id,
        playlist_name: song.playlist_name
      });
    } catch (error) {
      console.error('Error getting song:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = SongController;
