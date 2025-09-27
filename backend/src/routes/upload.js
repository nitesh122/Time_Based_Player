const express = require('express');
const upload = require('../upload');
const { db } = require('../db');
const path = require('path');

const router = express.Router();

// Upload background image
router.post('/background', upload.single('background'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No background file uploaded' });
    }

    const { timeBlockId } = req.body;
    
    if (!timeBlockId) {
      return res.status(400).json({ error: 'Time block ID is required' });
    }

    // Update database with new background image path
    const backgroundPath = `/media/backgrounds/${req.file.filename}`;
    
    db.run(
      'UPDATE time_blocks SET background_image = ? WHERE block_id = ?',
      [backgroundPath, timeBlockId],
      function(err) {
        if (err) {
          console.error('Error updating background:', err);
          return res.status(500).json({ error: 'Failed to update background' });
        }
        
        res.json({
          message: 'Background uploaded successfully',
          backgroundPath: backgroundPath,
          timeBlockId: timeBlockId
        });
      }
    );
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// Upload music file
router.post('/music', upload.single('music'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No music file uploaded' });
    }

    const { title, artist, playlistId } = req.body;
    
    if (!title || !artist || !playlistId) {
      return res.status(400).json({ error: 'Title, artist, and playlist ID are required' });
    }

    // Insert new song into database
    const musicPath = `/media/music/${req.file.filename}`;
    
    db.run(
      'INSERT INTO songs (title, url, artist, playlist_id) VALUES (?, ?, ?, ?)',
      [title, musicPath, artist, playlistId],
      function(err) {
        if (err) {
          console.error('Error inserting song:', err);
          return res.status(500).json({ error: 'Failed to add song' });
        }
        
        res.json({
          message: 'Music uploaded successfully',
          songId: this.lastID,
          musicPath: musicPath,
          title: title,
          artist: artist,
          playlistId: playlistId
        });
      }
    );
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// Get all uploaded files
router.get('/files', (req, res) => {
  try {
    const backgrounds = [];
    const music = [];
    
    // Get background files
    const backgroundsDir = path.join(__dirname, '../../media/backgrounds');
    const musicDir = path.join(__dirname, '../../media/music');
    
    if (fs.existsSync(backgroundsDir)) {
      const files = fs.readdirSync(backgroundsDir);
      backgrounds.push(...files.map(file => ({
        filename: file,
        path: `/media/backgrounds/${file}`,
        type: 'background'
      })));
    }
    
    if (fs.existsSync(musicDir)) {
      const files = fs.readdirSync(musicDir);
      music.push(...files.map(file => ({
        filename: file,
        path: `/media/music/${file}`,
        type: 'music'
      })));
    }
    
    res.json({ backgrounds, music });
  } catch (error) {
    console.error('Error getting files:', error);
    res.status(500).json({ error: 'Failed to get files' });
  }
});

module.exports = router;
