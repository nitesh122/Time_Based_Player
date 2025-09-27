const { db } = require('../db');

class PlaylistModel {
  // Get playlist by ID with songs
  static getPlaylistById(playlistId) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT p.*, 
               json_group_array(
                 json_object(
                   'song_id', s.song_id,
                   'title', s.title,
                   'url', s.url,
                   'artist', s.artist
                 )
               ) as songs
        FROM playlists p
        LEFT JOIN songs s ON p.playlist_id = s.playlist_id
        WHERE p.playlist_id = ?
        GROUP BY p.playlist_id
      `;
      
      db.get(query, [playlistId], (err, row) => {
        if (err) {
          reject(err);
        } else {
          if (row && row.songs) {
            row.songs = JSON.parse(row.songs);
          } else if (row) {
            row.songs = [];
          }
          resolve(row);
        }
      });
    });
  }

  // Get all playlists
  static getAllPlaylists() {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM playlists ORDER BY playlist_id';
      
      db.all(query, [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }
}

module.exports = PlaylistModel;
