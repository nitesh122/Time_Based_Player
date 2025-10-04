const express = require('express');
const router = express.Router();
const { getTimeBlocks, getCurrentTimeBlock } = require('../controllers/timeBlockController');

// GET all time blocks
router.get('/', getTimeBlocks);

// GET current time block (based on IST time)
router.get('/current', getCurrentTimeBlock);

module.exports = router;
