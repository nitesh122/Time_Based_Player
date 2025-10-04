const express = require('express');
const router = express.Router();
const { getSongs, getSongsByPlaylist } = require('../controllers/songController');

// GET all songs
router.get('/', getSongs);

// GET songs by playlist
router.get('/playlist/:id', getSongsByPlaylist);

module.exports = router;
