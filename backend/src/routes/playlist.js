const express = require('express');
const PlaylistController = require('../controllers/playlistController');

const router = express.Router();

// GET /api/playlists - Get all playlists
router.get('/', PlaylistController.getAllPlaylists);

// GET /api/playlists/:id - Get playlist by ID with songs
router.get('/:id', PlaylistController.getPlaylistById);

module.exports = router;
