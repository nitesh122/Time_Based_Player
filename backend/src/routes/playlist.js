const express = require('express');
const router = express.Router();
const { getPlaylists, getPlaylistById } = require('../controllers/playlistController');

// GET all playlists
router.get('/', getPlaylists);

// GET single playlist by id (with songs)
router.get('/:id', getPlaylistById);

module.exports = router;
