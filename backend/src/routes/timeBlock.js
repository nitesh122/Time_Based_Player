const express = require('express');
const TimeBlockController = require('../controllers/timeBlockController');

const router = express.Router();

// GET /api/time-blocks - Get all time blocks
router.get('/', TimeBlockController.getAllTimeBlocks);

// GET /api/time-blocks/current - Get current time block
router.get('/current', TimeBlockController.getCurrentTimeBlock);

// GET /api/time-blocks/:id - Get time block by ID
router.get('/:id', TimeBlockController.getTimeBlockById);

module.exports = router;
