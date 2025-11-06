// api/time-blocks.js - Time blocks endpoint for Vercel
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabase;
if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
  supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    if (!supabase) {
      throw new Error('Database not configured');
    }

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
