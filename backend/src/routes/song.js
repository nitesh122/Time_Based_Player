const express = require('express');
const SongController = require('../controllers/songController');

const router = express.Router();

// GET /api/songs/:id - Get song by ID
router.get('/:id', SongController.getSongById);

module.exports = router;
