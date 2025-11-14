// backend/src/routes/upload.js
const express = require('express');
const multer = require('multer');
const supabase = require('../config/supabase');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Upload a song or background file to Supabase Storage
router.post('/:bucket', upload.single('file'), async (req, res) => {
  try {
    const { bucket } = req.params;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Example: morning/track1.mp3
    const filePath = `${Date.now()}-${file.originalname}`;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file.buffer, { contentType: file.mimetype });

    if (error) throw error;

    return res.json({ path: data.path });
  } catch (err) {
    console.error('Upload error:', err.message);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

module.exports = router;
