// api/time-blocks.js - Time blocks endpoint for Vercel
const supabase = require('../backend/src/config/supabase');
const { setCorsHeaders, handleOptions } = require('../backend/src/config/cors');

module.exports = async (req, res) => {
  // Set CORS headers
  setCorsHeaders(res, 'GET,OPTIONS');

  // Handle OPTIONS preflight
  if (handleOptions(req, res)) return;

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {

    // Get current time block if requested
    if (req.url.includes('/current')) {
      const now = new Date();
      const currentTime = now.toTimeString().slice(0, 8); // HH:MM:SS format
      
      const { data, error } = await supabase
        .from('time_blocks')
        .select('*')
        .lte('start_time', currentTime)
        .gte('end_time', currentTime)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (!data) {
        // If no exact match, find the appropriate block based on time logic
        const hour = now.getHours();
        let blockId;
        if (hour >= 0 && hour < 4) blockId = 1;      // Midnight Chill
        else if (hour >= 4 && hour < 8) blockId = 2; // Sunrise Calm  
        else if (hour >= 8 && hour < 12) blockId = 3; // Morning Energy
        else if (hour >= 12 && hour < 16) blockId = 4; // Afternoon Focus
        else if (hour >= 16 && hour < 20) blockId = 5; // Evening Relax
        else blockId = 6; // Night Vibes

        const { data: fallbackData, error: fallbackError } = await supabase
          .from('time_blocks')
          .select('*')
          .eq('block_id', blockId)
          .single();

        if (fallbackError) throw fallbackError;
        res.json(fallbackData);
      } else {
        res.json(data);
      }
      return;
    }

    // Get all time blocks
    const { data, error } = await supabase
      .from('time_blocks')
      .select('*')
      .order('block_id');

    if (error) throw error;
    res.json(data);

  } catch (error) {
    console.error('Time blocks API error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
};
