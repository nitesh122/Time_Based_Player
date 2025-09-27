const { db } = require('../db');

class SongModel {
  // Get song by ID
  static getSongById(songId) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT s.*, p.name as playlist_name
        FROM songs s
        LEFT JOIN playlists p ON s.playlist_id = p.playlist_id
        WHERE s.song_id = ?
      `;
      
      db.get(query, [songId], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  // Get songs by playlist ID
  static getSongsByPlaylistId(playlistId) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM songs WHERE playlist_id = ? ORDER BY song_id';
      
      db.all(query, [playlistId], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }
}

module.exports = SongModel;
