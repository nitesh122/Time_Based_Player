const { db, initDatabase } = require('./db');
const fs = require('fs');
const path = require('path');

// Sample data
const sampleData = {
  timeBlocks: [
    { start_time: '00:00', end_time: '03:59', playlist_id: 1, background_image: 'night.jpg' },
    { start_time: '04:00', end_time: '07:59', playlist_id: 2, background_image: 'sunrise.jpg' },
    { start_time: '08:00', end_time: '11:59', playlist_id: 3, background_image: 'morning.jpg' },
    { start_time: '12:00', end_time: '15:59', playlist_id: 4, background_image: 'afternoon.jpg' },
    { start_time: '16:00', end_time: '19:59', playlist_id: 5, background_image: 'evening.jpg' },
    { start_time: '20:00', end_time: '23:59', playlist_id: 6, background_image: 'night.jpg' }
  ],
  playlists: [
    { name: 'Midnight Chill', description: 'Relaxing music for late night' },
    { name: 'Sunrise Calm', description: 'Peaceful morning vibes' },
    { name: 'Morning Energy', description: 'Upbeat music to start the day' },
    { name: 'Afternoon Focus', description: 'Productive midday music' },
    { name: 'Evening Relax', description: 'Wind down after work' },
    { name: 'Night Vibes', description: 'Late evening atmosphere' }
  ],
  songs: [
    // Midnight Chill (playlist_id: 1)
    { title: 'Moonlight Sonata', url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', artist: 'Classical Artist', playlist_id: 1 },
    { title: 'Starry Night', url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', artist: 'Ambient Artist', playlist_id: 1 },
    { title: 'Midnight Dreams', url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', artist: 'Dreamy Artist', playlist_id: 1 },
    
    // Sunrise Calm (playlist_id: 2)
    { title: 'Dawn Chorus', url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', artist: 'Nature Sounds', playlist_id: 2 },
    { title: 'Morning Dew', url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', artist: 'Calm Artist', playlist_id: 2 },
    { title: 'First Light', url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', artist: 'Sunrise Artist', playlist_id: 2 },
    
    // Morning Energy (playlist_id: 3)
    { title: 'Rise and Shine', url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', artist: 'Energy Artist', playlist_id: 3 },
    { title: 'New Day', url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', artist: 'Motivational Artist', playlist_id: 3 },
    { title: 'Morning Rush', url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', artist: 'Upbeat Artist', playlist_id: 3 },
    
    // Afternoon Focus (playlist_id: 4)
    { title: 'Productive Vibes', url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', artist: 'Focus Artist', playlist_id: 4 },
    { title: 'Midday Flow', url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', artist: 'Flow Artist', playlist_id: 4 },
    { title: 'Work Mode', url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', artist: 'Productivity Artist', playlist_id: 4 },
    
    // Evening Relax (playlist_id: 5)
    { title: 'Sunset Dreams', url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', artist: 'Dreamy Artist', playlist_id: 5 },
    { title: 'Evening Breeze', url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', artist: 'Relax Artist', playlist_id: 5 },
    { title: 'Wind Down', url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', artist: 'Chill Artist', playlist_id: 5 },
    
    // Night Vibes (playlist_id: 6)
    { title: 'City Lights', url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', artist: 'Urban Artist', playlist_id: 6 },
    { title: 'Night Drive', url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', artist: 'Drive Artist', playlist_id: 6 },
    { title: 'Late Night', url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', artist: 'Night Artist', playlist_id: 6 }
  ]
};

const insertSampleData = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Clear existing data
      db.run('DELETE FROM songs');
      db.run('DELETE FROM time_blocks');
      db.run('DELETE FROM playlists');
      
      // Insert playlists
      const insertPlaylist = db.prepare(`
        INSERT INTO playlists (name, description) VALUES (?, ?)
      `);
      
      sampleData.playlists.forEach(playlist => {
        insertPlaylist.run(playlist.name, playlist.description);
      });
      insertPlaylist.finalize();

      // Insert time blocks
      const insertTimeBlock = db.prepare(`
        INSERT INTO time_blocks (start_time, end_time, playlist_id, background_image) 
        VALUES (?, ?, ?, ?)
      `);
      
      sampleData.timeBlocks.forEach(block => {
        insertTimeBlock.run(
          block.start_time, 
          block.end_time, 
          block.playlist_id, 
          block.background_image
        );
      });
      insertTimeBlock.finalize();

      // Insert songs
      const insertSong = db.prepare(`
        INSERT INTO songs (title, url, artist, playlist_id) VALUES (?, ?, ?, ?)
      `);
      
      sampleData.songs.forEach(song => {
        insertSong.run(song.title, song.url, song.artist, song.playlist_id);
      });
      insertSong.finalize();

      // Verify data was inserted
      db.get('SELECT COUNT(*) as count FROM time_blocks', (err, row) => {
        if (err) {
          reject(err);
        } else {
          console.log(`✅ Sample data inserted successfully - ${row.count} time blocks`);
          resolve();
        }
      });
    });
  });
};

const initializeDatabase = async () => {
  try {
    // Create database directory if it doesn't exist
    const dbDir = path.join(__dirname, '../../database');
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    // Initialize database tables
    await initDatabase();
    
    // Insert sample data
    await insertSampleData();
    
    console.log('🎉 Database initialization complete!');
    console.log('📊 Database contains:');
    console.log('   - 6 time blocks');
    console.log('   - 6 playlists');
    console.log('   - 18 sample songs');
    console.log('🚀 You can now start the backend server with: npm start');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
};

initializeDatabase();
