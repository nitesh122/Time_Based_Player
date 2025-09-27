const { db } = require('../db');

class TimeBlockModel {
  // Get current time block based on current time
  static getCurrentTimeBlock() {
    return new Promise((resolve, reject) => {
      const now = new Date();
      const currentTime = now.toTimeString().slice(0, 5); // HH:MM format
      
      // For time comparison, we need to handle the case where end_time is 23:59
      // and we need to check if current time is between start_time and end_time
      const query = `
        SELECT tb.*, p.name as playlist_name
        FROM time_blocks tb
        LEFT JOIN playlists p ON tb.playlist_id = p.playlist_id
        WHERE (
          (tb.start_time <= tb.end_time AND tb.start_time <= ? AND tb.end_time >= ?) OR
          (tb.start_time > tb.end_time AND (tb.start_time <= ? OR tb.end_time >= ?))
        )
        ORDER BY tb.block_id
        LIMIT 1
      `;
      
      db.get(query, [currentTime, currentTime, currentTime, currentTime], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  // Get all time blocks
  static getAllTimeBlocks() {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT tb.*, p.name as playlist_name
        FROM time_blocks tb
        LEFT JOIN playlists p ON tb.playlist_id = p.playlist_id
        ORDER BY tb.block_id
      `;
      
      db.all(query, [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  // Get time block by ID
  static getTimeBlockById(blockId) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT tb.*, p.name as playlist_name
        FROM time_blocks tb
        LEFT JOIN playlists p ON tb.playlist_id = p.playlist_id
        WHERE tb.block_id = ?
      `;
      
      db.get(query, [blockId], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }
}

module.exports = TimeBlockModel;
