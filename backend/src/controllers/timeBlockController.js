const TimeBlockModel = require('../models/timeBlockModel');

class TimeBlockController {
  // Get current time block
  static async getCurrentTimeBlock(req, res) {
    try {
      const timeBlock = await TimeBlockModel.getCurrentTimeBlock();
      
      if (!timeBlock) {
        return res.status(404).json({ 
          error: 'No time block found for current time' 
        });
      }

      res.json({
        block_id: timeBlock.block_id,
        start_time: timeBlock.start_time,
        end_time: timeBlock.end_time,
        playlist_id: timeBlock.playlist_id,
        playlist_name: timeBlock.playlist_name,
        background_image: timeBlock.background_image
      });
    } catch (error) {
      console.error('Error getting current time block:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get all time blocks
  static async getAllTimeBlocks(req, res) {
    try {
      const timeBlocks = await TimeBlockModel.getAllTimeBlocks();
      res.json(timeBlocks);
    } catch (error) {
      console.error('Error getting time blocks:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get time block by ID
  static async getTimeBlockById(req, res) {
    try {
      const { id } = req.params;
      
      // Input validation
      if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({ error: 'Invalid time block ID' });
      }
      
      const timeBlock = await TimeBlockModel.getTimeBlockById(id);
      
      if (!timeBlock) {
        return res.status(404).json({ error: 'Time block not found' });
      }

      res.json(timeBlock);
    } catch (error) {
      console.error('Error getting time block:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = TimeBlockController;
